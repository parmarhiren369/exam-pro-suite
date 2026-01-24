/**
 * Local Question Parser - Works offline without API
 * Uses regex patterns to extract questions from text
 * Improved version with strict question detection
 */

import { ExtractionResult, ExtractedQuestion, ExtractionMetadata } from './openai';

interface ParsedQuestion {
  questionNumber: number;
  text: string;
  rawText: string;
}

/**
 * Extract questions from text using pattern matching
 */
export function parseDocumentLocal(documentText: string): ExtractionResult {
  console.log('=== Starting Local Parsing (Improved) ===');
  console.log('Document length:', documentText.length);
  
  try {
    // Step 1: Clean and normalize text
    const cleanText = normalizeText(documentText);
    console.log('Normalized text length:', cleanText.length);
    console.log('Sample (first 500 chars):', cleanText.substring(0, 500));
    
    // Step 2: Split into question blocks
    const questionBlocks = splitIntoQuestionBlocks(cleanText);
    console.log('Found', questionBlocks.length, 'potential question blocks');
    
    // Step 3: Parse each block into structured questions
    const parsedQuestions = questionBlocks
      .map((block, index) => parseQuestionBlock(block, index))
      .filter(q => q !== null) as ExtractedQuestion[];
    
    console.log('Successfully parsed', parsedQuestions.length, 'questions');
    
    if (parsedQuestions.length === 0) {
      return {
        success: false,
        questions: [],
        metadata: createEmptyMetadata(),
        error: 'No valid questions found. The document format may not match expected patterns.'
      };
    }
    
    // Step 4: Try to find answer key
    const answerKey = extractAnswerKey(cleanText);
    if (Object.keys(answerKey).length > 0) {
      console.log('Found answer key with', Object.keys(answerKey).length, 'answers');
      parsedQuestions.forEach(q => {
        if (!q.correctAnswer && answerKey[q.questionNumber]) {
          q.correctAnswer = answerKey[q.questionNumber];
        }
      });
    }
    
    // Calculate metadata
    const totalMarks = parsedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);
    
    return {
      success: true,
      questions: parsedQuestions,
      metadata: {
        totalMarks,
        totalQuestions: parsedQuestions.length,
        detectedMarksPerQuestion: parsedQuestions[0]?.marks || 4,
        negativeMarkingDetected: parsedQuestions.some(q => q.negativeMarks && q.negativeMarks > 0),
        negativeMarksPerQuestion: parsedQuestions[0]?.negativeMarks || 1,
        examName: extractExamName(cleanText),
        subject: extractSubject(cleanText),
        duration: extractDuration(cleanText)
      }
    };
    
  } catch (error: any) {
    console.error('Local parsing error:', error);
    return {
      success: false,
      questions: [],
      metadata: createEmptyMetadata(),
      error: error.message || 'Failed to parse document locally'
    };
  }
}

/**
 * Normalize text - fix spacing, line breaks, etc.
 */
function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Normalize multiple spaces but preserve newlines
    .replace(/[^\S\n]+/g, ' ')
    // Ensure questions start on new lines
    .replace(/([.?!])\s*(?=Q\.?\s*\d|Question\s*\d|\d+\s*[.)]\s*[A-Z])/gi, '$1\n')
    // Add line breaks before option patterns
    .replace(/\s+(\([A-Da-d]\))/g, '\n$1')
    .replace(/\s+([A-Da-d]\))/g, '\n$1')
    .trim();
}

/**
 * Split text into individual question blocks
 */
function splitIntoQuestionBlocks(text: string): string[] {
  const blocks: string[] = [];
  
  // Pattern to match question starts - must be at start of line or after whitespace
  // Q1, Q.1, Q 1, Question 1, 1., 1), (1)
  const questionStartPattern = /(?:^|\n)\s*(?:Q(?:uestion)?\.?\s*(\d+)|(\d+)\s*[.)]\s*)(?![A-Da-d]\s*\)|[A-Da-d]\s*\.)/gm;
  
  const matches: { index: number; number: number }[] = [];
  let match;
  
  while ((match = questionStartPattern.exec(text)) !== null) {
    const qNum = parseInt(match[1] || match[2], 10);
    
    // Skip if this looks like an option (e.g., "1. Option text" where 1 is part of answer)
    const contextBefore = text.substring(Math.max(0, match.index - 50), match.index);
    const isLikelyOption = /\([A-Da-d]\)\s*$|\b[A-Da-d]\)\s*$/i.test(contextBefore);
    
    if (!isLikelyOption && qNum > 0 && qNum <= 200) {
      matches.push({ index: match.index, number: qNum });
    }
  }
  
  // Sort by position and filter sequential question numbers
  matches.sort((a, b) => a.index - b.index);
  
  // Filter to keep only sequential or near-sequential questions
  const filteredMatches: typeof matches = [];
  let expectedNum = 1;
  
  for (const m of matches) {
    // Accept if it's the expected number, or within 2 of expected, or first question
    if (filteredMatches.length === 0 || 
        m.number === expectedNum || 
        (m.number >= expectedNum - 1 && m.number <= expectedNum + 2)) {
      filteredMatches.push(m);
      expectedNum = m.number + 1;
    }
  }
  
  console.log('Filtered from', matches.length, 'to', filteredMatches.length, 'question matches');
  
  // Extract blocks between question starts
  for (let i = 0; i < filteredMatches.length; i++) {
    const start = filteredMatches[i].index;
    const end = i < filteredMatches.length - 1 
      ? filteredMatches[i + 1].index 
      : text.length;
    
    const block = text.substring(start, end).trim();
    
    // Validate block - must have some content and ideally options
    if (block.length > 30) {
      blocks.push(block);
    }
  }
  
  return blocks;
}

/**
 * Parse a single question block into structured format
 */
function parseQuestionBlock(block: string, index: number): ExtractedQuestion | null {
  // Extract question number
  const numMatch = block.match(/^[\s\n]*(?:Q(?:uestion)?\.?\s*(\d+)|(\d+)\s*[.)])/i);
  const questionNumber = numMatch ? parseInt(numMatch[1] || numMatch[2], 10) : index + 1;
  
  // Extract options
  const options = extractOptions(block);
  
  // Extract answer
  const correctAnswer = extractAnswer(block);
  
  // Extract question text (everything before options)
  const questionText = extractQuestionText(block, options);
  
  // Validate - question should have meaningful text
  if (questionText.length < 10) {
    console.log('Skipping block', index, '- question text too short:', questionText);
    return null;
  }
  
  // Determine question type
  const type = determineQuestionType(options, questionText);
  
  // Extract marks
  const marks = extractMarks(block);
  
  return {
    questionNumber,
    text: questionText,
    type,
    options: options.length >= 2 ? options : [],
    correctAnswer,
    marks: marks.positive || 4,
    negativeMarks: marks.negative || 1,
    hasImage: false,
    solution: '',
    subject: '',
    topic: ''
  };
}

/**
 * Extract options from question block
 */
function extractOptions(block: string): string[] {
  const options: string[] = ['', '', '', ''];
  
  // Try different option formats
  const patterns = [
    // (A) option text
    /\(([A-Da-d])\)\s*([^(\n]+?)(?=\s*\([A-Da-d]\)|\s*$|\n\s*\([A-Da-d]\))/gs,
    // A) option text  
    /(?:^|\n)\s*([A-Da-d])\)\s*([^\n]+)/gm,
    // A. option text
    /(?:^|\n)\s*([A-Da-d])\.\s*([^\n]+)/gm,
  ];
  
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    let foundCount = 0;
    
    while ((match = pattern.exec(block)) !== null) {
      const letter = match[1].toUpperCase();
      const optionText = match[2].trim();
      const idx = letter.charCodeAt(0) - 65;
      
      if (idx >= 0 && idx < 4 && optionText.length > 0) {
        // Clean option text - remove trailing answer markers
        const cleanedOption = optionText
          .replace(/\s*(?:Ans(?:wer)?|Correct)\s*[:=]\s*[A-Da-d].*$/i, '')
          .trim();
        
        if (cleanedOption.length > 0) {
          options[idx] = cleanedOption;
          foundCount++;
        }
      }
    }
    
    if (foundCount >= 2) break; // Found enough options with this pattern
  }
  
  return options;
}

/**
 * Extract the question text (stem) from block
 */
function extractQuestionText(block: string, options: string[]): string {
  let text = block;
  
  // Remove question number prefix
  text = text.replace(/^[\s\n]*(?:Q(?:uestion)?\.?\s*\d+\s*[.):]*|\d+\s*[.)]\s*)/i, '');
  
  // Find where options start and cut there
  const optionStart = text.search(/(?:\n\s*)?(?:\([A-Da-d]\)|\b[A-Da-d]\)\s|\b[A-Da-d]\.\s)/i);
  if (optionStart > 10) {
    text = text.substring(0, optionStart);
  }
  
  // Remove any remaining option text that might be inline
  options.forEach((opt, i) => {
    if (opt) {
      const letter = String.fromCharCode(65 + i);
      text = text.replace(new RegExp(`\\(?${letter}\\)?[.):]?\\s*${escapeRegex(opt)}`, 'gi'), '');
    }
  });
  
  // Remove answer markers
  text = text.replace(/(?:Ans(?:wer)?|Correct)\s*[:=]\s*\(?[A-Da-d]\)?/gi, '');
  
  // Remove marks info
  text = text.replace(/\[\s*\+?\d+\s*[,/]\s*-?\d+\s*\]/g, '');
  text = text.replace(/\+?\d+\s*(?:marks?|M\b)/gi, '');
  
  // Clean up
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * Extract answer from block
 */
function extractAnswer(block: string): string {
  const patterns = [
    /(?:Ans(?:wer)?|Correct)\s*[:=.]\s*\(?([A-Da-d])\)?/i,
    /\[([A-Da-d])\]/,
    /\*\s*\(?([A-Da-d])\)?/,
    /correct\s*(?:option|answer)?\s*(?:is)?\s*[:=]?\s*\(?([A-Da-d])\)?/i,
  ];
  
  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  
  return '';
}

/**
 * Extract marks from block
 */
function extractMarks(text: string): { positive: number | null; negative: number | null } {
  // Look for [+4, -1] or [4/-1] patterns
  const bracketMatch = text.match(/\[\s*\+?(\d+)\s*[,/]\s*-?(\d+)\s*\]/);
  if (bracketMatch) {
    return {
      positive: parseInt(bracketMatch[1], 10),
      negative: parseInt(bracketMatch[2], 10)
    };
  }
  
  // Look for +4/-1 patterns
  const slashMatch = text.match(/\+?(\d+)\s*\/\s*-?(\d+)/);
  if (slashMatch) {
    return {
      positive: parseInt(slashMatch[1], 10),
      negative: parseInt(slashMatch[2], 10)
    };
  }
  
  // Individual marks
  const posMatch = text.match(/\+?\s*(\d+)\s*(?:marks?|M\b)/i);
  const negMatch = text.match(/-\s*(\d+)\s*(?:for\s*wrong|negative|marks?)/i);
  
  return {
    positive: posMatch ? parseInt(posMatch[1], 10) : null,
    negative: negMatch ? parseInt(negMatch[1], 10) : null
  };
}

/**
 * Determine question type based on content
 */
function determineQuestionType(options: string[], text: string): ExtractedQuestion['type'] {
  if (/multiple\s*correct|more\s*than\s*one|can\s*be\s*more/i.test(text)) {
    return 'Multiple Correct';
  }
  if (/numerical|integer\s*type|fill\s*in\s*the\s*blank/i.test(text)) {
    return 'Numerical';
  }
  if (/integer\s*value|integer\s*answer/i.test(text)) {
    return 'Integer';
  }
  if (/explain|describe|discuss|write\s*short|essay|subjective/i.test(text)) {
    return 'Subjective';
  }
  if (options.filter(o => o.length > 0).length >= 2) {
    return 'MCQ';
  }
  return 'MCQ';
}

/**
 * Extract answer key from end of document
 */
function extractAnswerKey(text: string): Record<number, string> {
  const answerKey: Record<number, string> = {};
  
  // Look for answer key section
  const keyPatterns = [
    /(?:Answer\s*Key|Answers?|Key|Solution)\s*:?\s*\n([\s\S]{50,500})/i,
    /(?:^|\n)\s*(?:Answers?|Key)\s*:?\s*\n?((?:\d+\s*[-–.):]\s*[A-Da-d]\s*[,\n]?\s*)+)/im,
  ];
  
  for (const pattern of keyPatterns) {
    const match = text.match(pattern);
    if (match) {
      const keyText = match[1];
      const answerMatches = keyText.matchAll(/(\d+)\s*[-–.):\s]+\s*\(?([A-Da-d])\)?/g);
      
      for (const m of answerMatches) {
        const qNum = parseInt(m[1], 10);
        const answer = m[2].toUpperCase();
        if (qNum > 0 && qNum <= 200) {
          answerKey[qNum] = answer;
        }
      }
      
      if (Object.keys(answerKey).length > 0) break;
    }
  }
  
  return answerKey;
}

function extractExamName(text: string): string | undefined {
  const patterns = [
    /(?:JEE|NEET|UPSC|CAT|GATE)\s*(?:Main|Advanced|Mains)?\s*(?:\d{4})?/i,
    /Mock\s*Test\s*\d*/i,
    /Chapter\s*Test/i,
    /Practice\s*Paper/i,
    /Full\s*(?:Course|Syllabus)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.substring(0, 500).match(pattern);
    if (match) return match[0];
  }
  return undefined;
}

function extractSubject(text: string): string | undefined {
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Maths'];
  const found: string[] = [];
  
  const header = text.substring(0, 1000);
  for (const subject of subjects) {
    if (new RegExp(`\\b${subject}\\b`, 'i').test(header)) {
      found.push(subject);
    }
  }
  
  return found.length > 0 ? found.join(', ') : undefined;
}

function extractDuration(text: string): number | undefined {
  const match = text.match(/(\d+)\s*(?:minutes?|mins?|hours?|hrs?)/i);
  if (match) {
    let duration = parseInt(match[1], 10);
    if (/hours?|hrs?/i.test(match[0])) {
      duration *= 60;
    }
    return duration;
  }
  return undefined;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createEmptyMetadata(): ExtractionMetadata {
  return {
    totalMarks: null,
    totalQuestions: 0,
    detectedMarksPerQuestion: null,
    negativeMarkingDetected: false,
    negativeMarksPerQuestion: null
  };
}
