import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { extractPDFContent, validatePDFFile } from "@/lib/pdfParser";
import { extractQuestionsWithGemini, convertToQuestions } from "@/lib/gemini";
import { Question } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface PDFUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionsExtracted: (questions: Partial<Question>[], metadata: any) => void;
}

export function PDFUploadDialog({
  open,
  onOpenChange,
  onQuestionsExtracted,
}: PDFUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validation = validatePDFFile(selectedFile);
    if (!validation.valid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleExtract = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setStatus("Reading PDF file...");

    try {
      // Step 1: Extract PDF content
      setProgress(20);
      const pdfContent = await extractPDFContent(file);
      
      setStatus(`Extracted ${pdfContent.numPages} pages with ${pdfContent.images.length} images`);
      setProgress(40);

      // Step 2: Extract questions using Gemini AI
      setStatus("Analyzing questions with AI...");
      setProgress(60);
      
      const result = await extractQuestionsWithGemini(
        pdfContent.text,
        pdfContent.images
      );

      setProgress(80);

      if (!result.success) {
        throw new Error(result.error || "Failed to extract questions");
      }

      if (result.questions.length === 0) {
        throw new Error("No questions found in the PDF. Please check the file format.");
      }

      // Step 3: Convert to our format
      setStatus(`Found ${result.questions.length} questions!`);
      setProgress(100);
      
      const questions = convertToQuestions(result.questions);

      // Success!
      toast({
        title: "Success!",
        description: `Extracted ${questions.length} questions from PDF`,
      });

      // Pass questions back to parent
      onQuestionsExtracted(questions, result.metadata);
      
      // Close dialog after a brief delay
      setTimeout(() => {
        onOpenChange(false);
        resetState();
      }, 1000);

    } catch (error: any) {
      console.error("PDF extraction error:", error);
      toast({
        title: "Extraction Failed",
        description: error.message || "Failed to extract questions from PDF",
        variant: "destructive",
      });
      setStatus("");
      setProgress(0);
    } finally {
      setProcessing(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setProgress(0);
    setStatus("");
    setProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetState();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload PDF Question Paper</DialogTitle>
          <DialogDescription>
            Upload a JEE/NEET question paper PDF. The AI will extract questions and diagrams automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {file ? (
                  <>
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload PDF
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max size: 10MB
                    </p>
                  </>
                )}
              </div>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={processing}
              />
            </label>
          </div>

          {/* Progress */}
          {processing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {status}
              </div>
            </div>
          )}

          {/* Status Messages */}
          {progress === 100 && !processing && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Questions extracted successfully!
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Free Tier Limits:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Uses Google Gemini AI (Free)</li>
                  <li>60 requests per minute</li>
                  <li>Review extracted questions before saving</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleExtract}
              disabled={!file || processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Extract Questions
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
