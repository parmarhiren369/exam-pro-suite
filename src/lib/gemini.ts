import { GoogleGenerativeAI } from "@google/generative-ai";
import { Question } from "./types";

// Initialize Gemini AI (free tier)
const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!apiKey) {
    console.warn("Gemini API key not configured");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export interface ExtractedQuestion {
  text: string;
  type: "MCQ" | "Numerical" | "MSQ";
  options: string[];
  correctAnswer: string;
  solution?: string;
  marks: number;
  negativeMarks: number;
  imageData?: string; // Base64 image data
}

export interface ExtractionResult {
  questions: ExtractedQuestion[];
  metadata: {
    examName?: string;
    subject?: string;
    totalMarks?: number;
    duration?: number;
  };
  success: boolean;
  error?: string;
}

/**
 * Extract questions from PDF content using Google Gemini Vision API
 */
export async function extractQuestionsWithGemini(
  pdfText: string,
  images: string[]
): Promise<ExtractionResult> {
  const genAI = getGeminiClient();
  
  if (!genAI) {
    return {
      questions: [],
      metadata: {},
      success: false,
      error: "Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.",
    };
  }

  try {
    // Use Gemini Pro Vision model (free tier)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare prompt for question extraction
    const prompt = `You are an expert at extracting questions from JEE/NEET exam papers. 
    
Analyze the following exam paper content and extract ALL questions with their complete details.

PDF Text Content:
${pdfText.substring(0, 50000)} // Limit to avoid token limits

Instructions:
1. Extract each question completely including question text, all options (A, B, C, D), and any numerical values
2. Identify the question type (MCQ, Numerical, or True/False)
3. Try to identify the correct answer if marked in the PDF
4. Extract any mathematical formulas, chemical equations, or diagrams descriptions
5. Detect exam metadata like name, subject, total marks, duration
6. For questions with diagrams, note which image belongs to which question

Return the response in this EXACT JSON format:
{
  "metadata": {
    "examName": "string or null",
    "subject": "string or null",
    "totalMarks": number or null,
    "duration": number or null
  },
  "questions": [
    {
      "text": "Complete question text",
      "type": "MCQ" | "Numerical" | "True/False",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correctAnswer": "A) option1 or the numerical answer",
      "solution": "Explanation if available",
      "marks": 4,
      "negativeMarks": 1,
      "hasImage": true/false,
      "imageIndex": 0 (index of associated image)
    }
  ]
}

Important: Return ONLY valid JSON, no markdown, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      return {
        questions: [],
        metadata: {},
        success: false,
        error: "Failed to parse AI response. Please try again.",
      };
    }

    // Map extracted questions to our format
    const questions: ExtractedQuestion[] = parsedData.questions.map((q: any, index: number) => {
      let imageData: string | undefined;
      
      // Attach image if referenced
      if (q.hasImage && typeof q.imageIndex === 'number' && images[q.imageIndex]) {
        imageData = images[q.imageIndex];
      }

      return {
        text: q.text || "",
        type: q.type || "MCQ",
        options: q.options || [],
        correctAnswer: q.correctAnswer || "",
        solution: q.solution || "",
        marks: q.marks || 4,
        negativeMarks: q.negativeMarks || 1,
        imageData,
      };
    });

    return {
      questions,
      metadata: parsedData.metadata || {},
      success: true,
    };
  } catch (error: any) {
    console.error("Gemini extraction error:", error);
    
    // Check for rate limiting
    if (error?.message?.includes("429") || error?.message?.includes("quota")) {
      return {
        questions: [],
        metadata: {},
        success: false,
        error: "API rate limit reached. Please wait a moment and try again.",
      };
    }

    return {
      questions: [],
      metadata: {},
      success: false,
      error: error?.message || "Failed to extract questions. Please try again.",
    };
  }
}

/**
 * Convert extracted questions to our Question format
 */
export function convertToQuestions(
  extractedQuestions: ExtractedQuestion[]
): Partial<Question>[] {
  return extractedQuestions.map((eq) => ({
    text: eq.text,
    type: eq.type as Question['type'],
    marks: eq.marks,
    negativeMarks: eq.negativeMarks,
    options: eq.options,
    correctAnswer: eq.correctAnswer,
    solution: eq.solution,
    imageUrl: eq.imageData, // Will be uploaded to Firebase Storage later
  }));
}
