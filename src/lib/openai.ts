import OpenAI from 'openai';

// Initialize OpenAI client (only if API key is available)
const apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'dummy-key-for-build';
const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // For client-side usage
});

// Rate limiting helper - wait between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry with exponential backoff for rate limits
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 5000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Rate limit');
      
      if (isRateLimit && attempt < maxRetries - 1) {
        const waitTime = baseDelay * Math.pow(2, attempt);
        console.log(`Rate limited. Waiting ${waitTime / 1000}s before retry ${attempt + 2}/${maxRetries}...`);
        await delay(waitTime);
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

export interface ExtractedQuestion {
  questionNumber: number;
  text: string;
  type: 'MCQ' | 'Multiple Correct' | 'Numerical' | 'Integer' | 'Subjective';
  options: string[];
  correctAnswer: string;
  marks: number | null;
  negativeMarks: number | null;
  solution?: string;
  subject?: string;
  topic?: string;
  hasImage?: boolean;
  imageBase64?: string; // Base64 encoded image data
  imageDescription?: string;
}

export interface ExtractionMetadata {
  totalMarks: number | null;
  totalQuestions: number;
  detectedMarksPerQuestion: number | null;
  negativeMarkingDetected: boolean;
  negativeMarksPerQuestion: number | null;
  examName?: string;
  subject?: string;
  duration?: number;
}

export interface ExtractionResult {
  success: boolean;
  questions: ExtractedQuestion[];
  metadata: ExtractionMetadata;
  rawResponse?: string;
  error?: string;
}

const EXTRACTION_PROMPT = `Extract questions from this exam paper. Return JSON with:
{
  "questions": [{"questionNumber": 1, "text": "question", "type": "MCQ", "options": ["A","B","C","D"], "correctAnswer": "A", "marks": 4, "negativeMarks": 1}],
  "metadata": {"totalMarks": null, "examName": "", "subject": "", "duration": null}
}
Types: MCQ, Multiple Correct, Numerical, Integer, Subjective. Use empty options [] for non-MCQ.
Find answers from answer keys or inline markers. Set marks to null if not found.

Text:
`;

// Prompt for scanning images - only identifies which questions have diagrams/figures
const IMAGE_SCAN_PROMPT = `Look at this exam paper page and identify which questions have diagrams, figures, graphs, or images.

Return JSON with ONLY the question numbers that have associated images/diagrams:
{
  "questionsWithImages": [1, 5, 12]
}

Rules:
- List ONLY question numbers that have a diagram, figure, graph, chart, or image
- Look for visual elements like graphs, circuits, geometric figures, biology diagrams, etc.
- If no questions have images, return {"questionsWithImages": []}
- Just return the question NUMBERS, nothing else`;

const VISION_PAGE_PROMPT = `You are analyzing an exam paper page. Extract ALL questions visible in this image.

Return JSON in this exact format:
{
  "questions": [
    {
      "questionNumber": 1,
      "text": "The question text here",
      "type": "MCQ",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "A",
      "marks": 4,
      "negativeMarks": 1,
      "hasImage": false
    }
  ]
}

IMPORTANT RULES:
1. Extract EVERY question you can see on this page
2. For MCQ: include all 4 options in the options array
3. For Numerical/Integer/Subjective: use empty options []
4. If you see an answer key or marked answers, use them for correctAnswer
5. Set hasImage: true if the question has a diagram, graph, figure, or image
6. Types allowed: MCQ, Multiple Correct, Numerical, Integer, Subjective
7. If no questions visible, return {"questions": []}

Look carefully at the image and extract all questions!`;

export async function extractQuestionsWithAI(documentText: string): Promise<ExtractionResult> {
  try {
    // Check if API key is configured
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return {
        success: false,
        questions: [],
        metadata: {
          totalMarks: null,
          totalQuestions: 0,
          detectedMarksPerQuestion: null,
          negativeMarkingDetected: false,
          negativeMarksPerQuestion: null
        },
        error: 'OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.'
      };
    }

    // Limit text to prevent timeout - 20000 chars is enough for ~50-100 questions
    const MAX_TEXT_LENGTH = 20000;
    const truncatedText = documentText.length > MAX_TEXT_LENGTH 
      ? documentText.substring(0, MAX_TEXT_LENGTH) + '\n\n[Document truncated for processing...]'
      : documentText;
    
    console.log(`Sending ${truncatedText.length} characters to OpenAI...`);
    const startTime = Date.now();

    const response = await retryWithBackoff(async () => {
      return openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at extracting structured data from exam papers. Always respond with valid JSON only, no markdown formatting. Be concise.'
          },
          {
            role: 'user',
            content: EXTRACTION_PROMPT + truncatedText
          }
        ],
        temperature: 0.1,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });
    }, 3, 25000); // 25s wait for free tier (3 RPM = 20s between calls)
    
    console.log(`OpenAI responded in ${Date.now() - startTime}ms`);

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return {
        success: false,
        questions: [],
        metadata: {
          totalMarks: null,
          totalQuestions: 0,
          detectedMarksPerQuestion: null,
          negativeMarkingDetected: false,
          negativeMarksPerQuestion: null
        },
        error: 'No response from OpenAI'
      };
    }

    const parsed = JSON.parse(content);
    
    // Post-process: Calculate marks if not detected
    let questions: ExtractedQuestion[] = parsed.questions || [];
    const metadata = parsed.metadata || {};
    
    // If marks per question not detected but total marks given, calculate
    if (questions.length > 0) {
      const hasMarksPerQuestion = questions.some((q: ExtractedQuestion) => q.marks !== null);
      
      if (!hasMarksPerQuestion && metadata.totalMarks) {
        const calculatedMarks = Math.round(metadata.totalMarks / questions.length);
        questions = questions.map((q: ExtractedQuestion) => ({
          ...q,
          marks: calculatedMarks
        }));
        metadata.detectedMarksPerQuestion = calculatedMarks;
      }
      
      // Default marks if nothing detected
      if (!hasMarksPerQuestion && !metadata.totalMarks) {
        questions = questions.map((q: ExtractedQuestion) => ({
          ...q,
          marks: q.marks || 4,
          negativeMarks: q.negativeMarks || 1
        }));
      }
    }

    return {
      success: true,
      questions,
      metadata: {
        totalMarks: metadata.totalMarks || null,
        totalQuestions: questions.length,
        detectedMarksPerQuestion: metadata.detectedMarksPerQuestion || null,
        negativeMarkingDetected: metadata.negativeMarkingDetected || false,
        negativeMarksPerQuestion: metadata.negativeMarksPerQuestion || null,
        examName: metadata.examName,
        subject: metadata.subject,
        duration: metadata.duration
      },
      rawResponse: content
    };

  } catch (error: any) {
    console.error('OpenAI extraction error:', error);
    return {
      success: false,
      questions: [],
      metadata: {
        totalMarks: null,
        totalQuestions: 0,
        detectedMarksPerQuestion: null,
        negativeMarkingDetected: false,
        negativeMarksPerQuestion: null
      },
      error: error.message || 'Failed to extract questions'
    };
  }
}

// Process a single page with vision
async function extractQuestionsFromPage(
  pageImage: { pageNumber: number; imageBase64: string }
): Promise<ExtractedQuestion[]> {
  try {
    console.log(`Processing page ${pageImage.pageNumber}...`);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: VISION_PAGE_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: pageImage.imageBase64,
                detail: 'auto' // Let model decide detail level
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    console.log(`Page ${pageImage.pageNumber} response:`, content?.substring(0, 200) + '...');
    
    if (!content) {
      console.log(`Page ${pageImage.pageNumber}: No content returned`);
      return [];
    }

    const parsed = JSON.parse(content);
    const rawQuestions = parsed.questions || [];
    
    console.log(`Page ${pageImage.pageNumber}: Found ${rawQuestions.length} questions`);
    
    // Convert to full format
    return rawQuestions.map((q: any) => ({
      questionNumber: q.questionNumber || q.n || 0,
      text: q.text || q.t || '',
      type: q.type || 'MCQ',
      options: q.options || q.opts || [],
      correctAnswer: q.correctAnswer || q.ans || '',
      marks: q.marks || 4,
      negativeMarks: q.negativeMarks || q.neg || 1,
      hasImage: q.hasImage || q.img || false,
      imageBase64: (q.hasImage || q.img) ? pageImage.imageBase64 : undefined,
      pageNumber: pageImage.pageNumber
    }));
  } catch (error: any) {
    console.error(`Error processing page ${pageImage.pageNumber}:`, error.message);
    return [];
  }
}

// Vision-based extraction for PDFs with images - processes pages individually
export async function extractQuestionsWithVision(
  pageImages: { pageNumber: number; imageBase64: string }[]
): Promise<ExtractionResult> {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return {
        success: false,
        questions: [],
        metadata: {
          totalMarks: null,
          totalQuestions: 0,
          detectedMarksPerQuestion: null,
          negativeMarkingDetected: false,
          negativeMarksPerQuestion: null
        },
        error: 'OpenAI API key is not configured.'
      };
    }

    // Limit to first 5 pages
    const limitedImages = pageImages.slice(0, 5);
    console.log(`Processing ${limitedImages.length} pages with Vision API...`);
    const startTime = Date.now();

    // Process pages in parallel (max 3 at a time to avoid rate limits)
    const allQuestions: ExtractedQuestion[] = [];
    
    for (let i = 0; i < limitedImages.length; i += 3) {
      const batch = limitedImages.slice(i, i + 3);
      console.log(`Processing pages ${i + 1} to ${Math.min(i + 3, limitedImages.length)}...`);
      
      const batchResults = await Promise.all(
        batch.map(page => extractQuestionsFromPage(page))
      );
      
      batchResults.forEach(questions => {
        allQuestions.push(...questions);
      });
    }

    console.log(`Vision extraction completed in ${Date.now() - startTime}ms, found ${allQuestions.length} questions`);

    if (allQuestions.length === 0) {
      console.log('Vision API returned 0 questions from all pages - will try text fallback');
      // Return success with empty questions - let the caller try text-based fallback
      return {
        success: true,
        questions: [],
        metadata: {
          totalMarks: null,
          totalQuestions: 0,
          detectedMarksPerQuestion: null,
          negativeMarkingDetected: false,
          negativeMarksPerQuestion: null
        }
      };
    }

    // Renumber questions sequentially
    const questions = allQuestions.map((q, index) => ({
      ...q,
      questionNumber: index + 1,
      marks: q.marks || 4,
      negativeMarks: q.negativeMarks || 1
    }));

    // Calculate total marks
    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

    return {
      success: true,
      questions,
      metadata: {
        totalMarks,
        totalQuestions: questions.length,
        detectedMarksPerQuestion: questions[0]?.marks || 4,
        negativeMarkingDetected: questions.some(q => q.negativeMarks && q.negativeMarks > 0),
        negativeMarksPerQuestion: questions[0]?.negativeMarks || 1,
        examName: undefined,
        subject: undefined,
        duration: undefined
      }
    };

  } catch (error: any) {
    console.error('OpenAI Vision extraction error:', error);
    return {
      success: false,
      questions: [],
      metadata: {
        totalMarks: null,
        totalQuestions: 0,
        detectedMarksPerQuestion: null,
        negativeMarkingDetected: false,
        negativeMarksPerQuestion: null
      },
      error: error.message || 'Failed to extract questions with vision'
    };
  }
}

// ============== HYBRID APPROACH ==============

// Scan a single page for questions with images (with retry logic)
async function scanPageForImages(
  pageImage: { pageNumber: number; imageBase64: string }
): Promise<number[]> {
  return retryWithBackoff(async () => {
    console.log(`Scanning page ${pageImage.pageNumber} for images...`);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: IMAGE_SCAN_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: pageImage.imageBase64,
                detail: 'low' // Low detail is enough for detecting images
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    const questionNumbers = parsed.questionsWithImages || [];
    
    console.log(`Page ${pageImage.pageNumber}: Questions with images: ${questionNumbers.join(', ') || 'none'}`);
    return questionNumbers;
  }, 3, 5000).catch((error) => {
    console.error(`Error scanning page ${pageImage.pageNumber}:`, error.message);
    return [];
  });
}

// Scan all pages and build a map of questionNumber -> pageImage
export async function scanForQuestionImages(
  pageImages: { pageNumber: number; imageBase64: string }[]
): Promise<Map<number, string>> {
  // Limit to 2 pages to avoid rate limits on free tier (3 RPM)
  const limitedPages = pageImages.slice(0, 2);
  console.log(`Scanning ${limitedPages.length} pages for questions with images...`);
  const startTime = Date.now();
  
  const imageMap = new Map<number, string>();
  
  // Process pages SEQUENTIALLY to avoid rate limits
  for (let i = 0; i < limitedPages.length; i++) {
    const page = limitedPages[i];
    const questionNumbers = await scanPageForImages(page);
    
    // Map each question number to its page image
    questionNumbers.forEach((qNum: number) => {
      imageMap.set(qNum, page.imageBase64);
    });
    
    // Wait between pages to avoid rate limits (only if more pages to process)
    if (i < limitedPages.length - 1) {
      console.log('Waiting 22s between API calls (free tier rate limit)...');
      await delay(22000);
    }
  }
  
  console.log(`Image scan completed in ${Date.now() - startTime}ms, found ${imageMap.size} questions with images`);
  return imageMap;
}

// Hybrid extraction: Text for content + Vision for images
export async function extractQuestionsHybrid(
  documentText: string,
  pageImages: { pageNumber: number; imageBase64: string }[]
): Promise<ExtractionResult> {
  try {
    console.log('Starting hybrid extraction...');
    
    // Step 1: Scan pages for questions with images
    console.log('Step 1: Scanning for images...');
    const imageMap = await scanForQuestionImages(pageImages);
    
    // Step 2: Extract questions using text
    console.log('Step 2: Extracting questions from text...');
    const textResult = await extractQuestionsWithAI(documentText);
    
    if (!textResult.success || textResult.questions.length === 0) {
      console.log('Text extraction failed or found no questions');
      return textResult;
    }
    
    // Step 3: Merge - attach images to matching questions
    console.log('Step 3: Merging images with questions...');
    const questionsWithImages = textResult.questions.map((q) => {
      const imageBase64 = imageMap.get(q.questionNumber);
      if (imageBase64) {
        console.log(`Question ${q.questionNumber}: Attached image`);
        return {
          ...q,
          hasImage: true,
          imageBase64
        };
      }
      return q;
    });
    
    const imagesAttached = questionsWithImages.filter(q => q.hasImage).length;
    console.log(`Hybrid extraction complete: ${textResult.questions.length} questions, ${imagesAttached} with images`);
    
    return {
      ...textResult,
      questions: questionsWithImages
    };
    
  } catch (error: any) {
    console.error('Hybrid extraction error:', error);
    return {
      success: false,
      questions: [],
      metadata: {
        totalMarks: null,
        totalQuestions: 0,
        detectedMarksPerQuestion: null,
        negativeMarkingDetected: false,
        negativeMarksPerQuestion: null
      },
      error: error.message || 'Failed to extract questions'
    };
  }
}

