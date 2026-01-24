import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { extractQuestionsWithAI, extractQuestionsHybrid, ExtractionResult } from './openai';
import { parseDocumentLocal } from './localParser';

// Set up PDF.js worker from public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Custom error class for API errors that need user action
export class APILimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APILimitError';
  }
}

// Extract text from PDF
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }
  
  return fullText;
}

// Render PDF pages to images for vision-based extraction
async function renderPDFPagesToImages(
  file: File, 
  maxPages: number = 5,
  onProgress?: (current: number, total: number) => void
): Promise<{ pageNumber: number; imageBase64: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images: { pageNumber: number; imageBase64: string }[] = [];
  
  const pagesToRender = Math.min(pdf.numPages, maxPages);
  
  for (let i = 1; i <= pagesToRender; i++) {
    onProgress?.(i, pagesToRender);
    
    const page = await pdf.getPage(i);
    const scale = 1.5; // Higher scale for better text recognition
    const viewport = page.getViewport({ scale });
    
    // Create canvas for rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Convert to base64 JPEG with good quality for text recognition
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
    images.push({ pageNumber: i, imageBase64 });
    
    // Clean up
    canvas.remove();
  }
  
  return images;
}

// Extract text from DOCX
async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// Main function to extract text from any supported file
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return extractTextFromDOCX(file);
  } else if (fileName.endsWith('.txt')) {
    return await file.text();
  }
  
  throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT files.');
}

// Main function to parse document and extract questions using AI (text-only)
export async function parseDocumentWithAI(file: File): Promise<ExtractionResult> {
  try {
    // Step 1: Extract text from document
    const text = await extractTextFromFile(file);
    
    if (!text || text.trim().length < 50) {
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
        error: 'Could not extract text from document. The file may be image-based (scanned) or empty. Please ensure the PDF contains selectable text.'
      };
    }
    
    // Step 2: Send to OpenAI for intelligent extraction
    const result = await extractQuestionsWithAI(text);
    
    return result;
    
  } catch (error: any) {
    console.error('Document parsing error:', error);
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
      error: error.message || 'Failed to parse document with AI'
    };
  }
}

// Parse document with Hybrid approach (Text for content + Vision for images)
export async function parseDocumentWithVision(
  file: File,
  onProgress?: (status: string, current?: number, total?: number) => void
): Promise<ExtractionResult> {
  try {
    const fileName = file.name.toLowerCase();
    
    if (!fileName.endsWith('.pdf')) {
      // For non-PDF files, fall back to text-based extraction
      onProgress?.('Extracting text...');
      return parseDocumentWithAI(file);
    }
    
    // Step 1: Extract text from PDF
    onProgress?.('Extracting text from PDF...');
    const text = await extractTextFromFile(file);
    
    if (!text || text.trim().length < 50) {
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
        error: 'Could not extract text from PDF. The file may be image-based (scanned) or empty.'
      };
    }
    
    // Step 2: Render PDF pages to images (limit to 3 for rate limit reasons)
    onProgress?.('Rendering PDF pages for image detection...', 0, 3);
    const pageImages = await renderPDFPagesToImages(file, 3, (current, total) => {
      onProgress?.(`Rendering page ${current} of ${total}...`, current, total);
    });
    
    if (pageImages.length === 0) {
      // If no images, just do text extraction
      onProgress?.('Extracting questions from text...');
      return extractQuestionsWithAI(text);
    }
    
    // Step 3: Use hybrid approach - text for content, vision for images
    onProgress?.('Scanning pages for diagrams (may take 1-2 min due to API limits)...');
    const result = await extractQuestionsHybrid(text, pageImages);
    
    if (result.success && result.questions.length > 0) {
      const withImages = result.questions.filter(q => q.hasImage).length;
      console.log(`Hybrid extraction complete: ${result.questions.length} questions, ${withImages} with images`);
      return result;
    }
    
    // Fallback to pure text extraction
    console.log('Hybrid extraction found no questions, trying pure text...');
    onProgress?.('Trying text-only extraction...');
    return extractQuestionsWithAI(text);
    
  } catch (error: any) {
    console.error('Hybrid parsing error:', error);
    
    // Try pure text-based extraction as fallback
    try {
      console.log('Hybrid failed, trying text extraction as fallback...');
      const textResult = await parseDocumentWithAI(file);
      if (textResult.success && textResult.questions.length > 0) {
        return textResult;
      }
    } catch (textError) {
      console.error('Text fallback also failed:', textError);
    }
    
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
      error: error.message || 'Failed to parse document with vision'
    };
  }
}

// Parse document locally without API (fallback mode)
export async function parseDocumentLocally(
  file: File,
  onProgress?: (status: string) => void
): Promise<ExtractionResult> {
  try {
    onProgress?.('Extracting text from document...');
    const text = await extractTextFromFile(file);
    
    console.log('=== Text Extraction Debug ===');
    console.log('Extracted text length:', text?.length || 0);
    console.log('First 1000 chars:', text?.substring(0, 1000));
    
    if (!text || text.trim().length < 50) {
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
        error: 'Could not extract text from document. The file may be image-based (scanned) or empty. Extracted length: ' + (text?.length || 0)
      };
    }
    
    onProgress?.('Parsing questions with pattern matching...');
    const result = parseDocumentLocal(text);
    
    console.log('=== Local Parse Result ===');
    console.log('Success:', result.success);
    console.log('Questions found:', result.questions.length);
    if (!result.success) {
      console.log('Error:', result.error);
    }
    
    return result;
    
  } catch (error: any) {
    console.error('Local parsing error:', error);
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
      error: error.message || 'Failed to parse document locally'
    };
  }
}

// Check if error is API limit related
export function isAPILimitError(error: string | undefined): boolean {
  if (!error) return false;
  return error.includes('429') || 
         error.includes('Rate limit') || 
         error.includes('rate_limit') ||
         error.includes('TPM') ||
         error.includes('RPM') ||
         error.includes('quota') ||
         error.includes('billing');
}
