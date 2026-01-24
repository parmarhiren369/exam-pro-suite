import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFContent {
  text: string;
  images: string[]; // Base64 encoded images
  numPages: number;
}

/**
 * Extract text and images from a PDF file
 */
export async function extractPDFContent(file: File): Promise<PDFContent> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  const images: string[] = [];

  // Process each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    
    // Extract text
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';

    // Extract images from the page
    const operatorList = await page.getOperatorList();
    
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      // Look for image rendering operations
      if (operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject ||
          operatorList.fnArray[i] === pdfjsLib.OPS.paintInlineImageXObject) {
        
        try {
          // Render page to canvas to capture images
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (context) {
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({
              canvasContext: context,
              viewport: viewport,
              canvas: canvas,
            }).promise;
            
            // Convert canvas to base64 image
            const imageData = canvas.toDataURL('image/png');
            images.push(imageData);
          }
        } catch (error) {
          console.error('Error extracting image:', error);
        }
        
        break; // Only get one image per page for now
      }
    }
  }

  return {
    text: fullText,
    images,
    numPages: pdf.numPages,
  };
}

/**
 * Validate PDF file
 */
export function validatePDFFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Please upload a PDF file' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'PDF file size must be less than 10MB' };
  }

  return { valid: true };
}
