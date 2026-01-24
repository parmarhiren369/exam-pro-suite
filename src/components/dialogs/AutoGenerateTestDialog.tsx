import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Loader2,
  Sparkles,
  Info,
  Clock,
  Award,
  Hash,
  Zap,
  Image as ImageIcon,
  WifiOff,
  RefreshCw
} from "lucide-react";
import { parseDocumentWithAI, parseDocumentWithVision, parseDocumentLocally, isAPILimitError } from "@/lib/documentParser";
import { ExtractionResult, ExtractionMetadata } from "@/lib/openai";
import { Question, QuestionType } from "@/lib/types";

interface AutoGenerateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionsExtracted: (questions: Partial<Question>[], metadata: ExtractionMetadata) => void;
}

export function AutoGenerateTestDialog({
  open,
  onOpenChange,
  onQuestionsExtracted,
}: AutoGenerateTestDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [enableVision, setEnableVision] = useState(true);
  
  // Fallback mode states
  const [showFallbackPopup, setShowFallbackPopup] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [useLocalMode, setUseLocalMode] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setApiError(null);
      setShowFallbackPopup(false);
      setUseLocalMode(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = ['.pdf', '.docx', '.doc', '.txt'];
      const isValid = validTypes.some(ext => 
        droppedFile.name.toLowerCase().endsWith(ext)
      );
      
      if (isValid) {
        setFile(droppedFile);
        setResult(null);
        setApiError(null);
        setShowFallbackPopup(false);
        setUseLocalMode(false);
      } else {
        alert('Please upload a PDF, DOCX, or TXT file.');
      }
    }
  }, []);

  const handleParse = async (forceLocal: boolean = false) => {
    if (!file) return;

    setLoading(true);
    setProgress(10);
    setShowFallbackPopup(false);
    setApiError(null);

    try {
      let extractionResult: ExtractionResult;
      
      if (forceLocal || useLocalMode) {
        // Use local pattern matching (no API)
        setProgressText('Using local extraction mode...');
        extractionResult = await parseDocumentLocally(file, (status) => {
          setProgressText(status);
        });
        setProgress(90);
        setProgressText('Processing results...');
      } else if (enableVision && file.name.toLowerCase().endsWith('.pdf')) {
        // Use vision-based extraction for PDFs with images
        extractionResult = await parseDocumentWithVision(file, (status, current, total) => {
          setProgressText(status);
          if (current && total) {
            setProgress(10 + (current / total) * 40);
          }
        });
        setProgress(90);
        setProgressText('Processing results...');
      } else {
        // Use text-based extraction
        setProgress(30);
        setProgressText('Extracting text from document...');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProgress(50);
        setProgressText('Analyzing with AI (this may take a moment)...');
        
        extractionResult = await parseDocumentWithAI(file);
        
        setProgress(90);
        setProgressText('Processing results...');
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setProgress(100);
      
      // Check if the result indicates an API limit error
      if (!extractionResult.success && isAPILimitError(extractionResult.error)) {
        setApiError(extractionResult.error || 'API limit reached');
        setShowFallbackPopup(true);
        setResult(null);
      } else {
        setResult(extractionResult);
      }
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to parse document';
      
      // Check if it's an API limit error
      if (isAPILimitError(errorMessage)) {
        setApiError(errorMessage);
        setShowFallbackPopup(true);
        setResult(null);
      } else {
        setResult({
          success: false,
          questions: [],
          metadata: {
            totalMarks: null,
            totalQuestions: 0,
            detectedMarksPerQuestion: null,
            negativeMarkingDetected: false,
            negativeMarksPerQuestion: null
          },
          error: errorMessage
        });
      }
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  const handleUseFallback = () => {
    setShowFallbackPopup(false);
    setUseLocalMode(true);
    handleParse(true);
  };

  const handleProceed = () => {
    if (result?.questions && result.questions.length > 0) {
      // Convert to Question format, including image data
      const questions: Partial<Question>[] = result.questions.map((q, index) => ({
        id: `imported-${index}`,
        text: q.text,
        type: q.type as QuestionType,
        marks: q.marks || 4,
        negativeMarks: q.negativeMarks || 1,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        solution: q.solution || '',
        subject: q.subject || '',
        topic: q.topic || '',
        // Include image data if present
        ...(q.hasImage && { imageUrl: q.imageBase64 }),
      }));
      
      const questionsWithImages = result.questions.filter(q => q.hasImage).length;
      console.log('Proceeding with questions:', questions.length, `(${questionsWithImages} with images)`);
      
      // First pass questions to parent (this opens TestDialog)
      onQuestionsExtracted(questions, result.metadata);
      
      // Then close this dialog and reset state
      setFile(null);
      setResult(null);
      setProgress(0);
      setProgressText('');
      setEnableVision(true);
      setUseLocalMode(false);
      setApiError(null);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    setProgressText('');
    setShowFallbackPopup(false);
    setApiError(null);
    setUseLocalMode(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            {useLocalMode ? 'Local Pattern Extraction' : 'AI-Powered Test Generation'}
          </DialogTitle>
          <DialogDescription>
            {useLocalMode 
              ? 'Using pattern matching to extract questions. Images can be uploaded manually.'
              : 'Upload a PDF, DOCX, or TXT file. AI will automatically extract questions, options, and answers.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* API Fallback Popup */}
          {showFallbackPopup && (
            <Alert className="bg-orange-500/10 border-orange-500/30">
              <WifiOff className="h-4 w-4 text-orange-500" />
              <AlertTitle className="text-orange-500">API Limit Reached</AlertTitle>
              <AlertDescription className="space-y-3">
                <p className="text-sm">
                  The AI service is temporarily unavailable due to rate limits. 
                  You can switch to <strong>Local Mode</strong> which uses pattern matching 
                  to extract questions without needing an API.
                </p>
                <div className="bg-muted/50 p-3 rounded-lg text-xs">
                  <p className="font-medium mb-1">Local Mode Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Works offline - no API calls needed</li>
                    <li>Instant processing</li>
                    <li>Best for structured question formats</li>
                    <li>Images can be uploaded manually per question</li>
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUseFallback} 
                    className="flex-1"
                    variant="default"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Use Local Mode
                  </Button>
                  <Button 
                    onClick={() => setShowFallbackPopup(false)} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
                {apiError && (
                  <p className="text-xs text-muted-foreground mt-2 truncate" title={apiError}>
                    Error: {apiError.substring(0, 100)}...
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Mode Indicator */}
          {useLocalMode && !showFallbackPopup && (
            <Alert className="bg-blue-500/10 border-blue-500/30">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-500">Local Mode Active</AlertTitle>
              <AlertDescription className="text-sm">
                Using pattern matching for extraction. For best results, ensure questions 
                follow formats like "Q1.", "1.", or "Question 1:". Images can be added 
                manually after extraction.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Alert - Only show when not in local mode */}
          {!useLocalMode && !showFallbackPopup && (
            <Alert className="bg-accent/10 border-accent/30">
              <Zap className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">Powered by AI Vision</AlertTitle>
              <AlertDescription className="text-sm">
                Our AI analyzes your document including diagrams, figures, and images
                to extract questions with full context. Works with any format!
              </AlertDescription>
            </Alert>
          )}

          {/* Vision Toggle - Only for AI mode */}
          {!useLocalMode && file && file.name.toLowerCase().endsWith('.pdf') && !loading && !result && !showFallbackPopup && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <Label htmlFor="vision-mode" className="text-sm font-medium">
                  Extract Images & Diagrams
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {enableVision ? 'Vision Mode' : 'Text Only'}
                </span>
                <Switch
                  id="vision-mode"
                  checked={enableVision}
                  onCheckedChange={setEnableVision}
                />
              </div>
            </div>
          )}

          {/* File Upload Area */}
          {!showFallbackPopup && (
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragOver 
                  ? 'border-accent bg-accent/5' 
                  : file 
                    ? 'border-success bg-success/5' 
                    : 'border-border hover:border-accent/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-10 w-10 text-success" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setResult(null);
                      setUseLocalMode(false);
                      setApiError(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-foreground font-medium">
                    Drag & drop your question paper here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports PDF, DOCX, DOC, TXT
                  </p>
                </>
              )}
            </div>
          )}

          {/* Parse Button */}
          {file && !result && !loading && !showFallbackPopup && (
            <Button 
              onClick={() => handleParse(false)} 
              className="w-full"
              variant="default"
            >
              {useLocalMode ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Extract with Pattern Matching
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Extract Questions with AI
                </>
              )}
            </Button>
          )}

          {/* Progress */}
          {loading && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                <span className="text-sm text-muted-foreground">{progressText}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Success */}
              {result.success && result.questions.length > 0 && (
                <>
                  {/* Local mode notice */}
                  {useLocalMode && (
                    <Alert className="bg-blue-500/10 border-blue-500/30">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-sm">
                        <strong>Note:</strong> Images were not extracted in local mode. 
                        You can upload images manually for each question in the test editor.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Card className="bg-success/10 border-success/30">
                      <CardContent className="p-3 text-center">
                        <Hash className="h-5 w-5 mx-auto text-success mb-1" />
                        <p className="text-2xl font-bold text-success">{result.questions.length}</p>
                        <p className="text-xs text-muted-foreground">Questions</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-accent/10 border-accent/30">
                      <CardContent className="p-3 text-center">
                        <Award className="h-5 w-5 mx-auto text-accent mb-1" />
                        <p className="text-2xl font-bold text-accent">
                          {result.metadata.totalMarks || result.questions.reduce((sum, q) => sum + (q.marks || 0), 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Marks</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-primary/10 border-primary/30">
                      <CardContent className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 mx-auto text-primary mb-1" />
                        <p className="text-2xl font-bold text-primary">
                          {result.metadata.detectedMarksPerQuestion || result.questions[0]?.marks || 4}
                        </p>
                        <p className="text-xs text-muted-foreground">Marks/Q</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-destructive/10 border-destructive/30">
                      <CardContent className="p-3 text-center">
                        <AlertTriangle className="h-5 w-5 mx-auto text-destructive mb-1" />
                        <p className="text-2xl font-bold text-destructive">
                          -{result.metadata.negativeMarksPerQuestion || result.questions[0]?.negativeMarks || 1}
                        </p>
                        <p className="text-xs text-muted-foreground">Negative</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Metadata */}
                  {(result.metadata.examName || result.metadata.subject) && (
                    <div className="flex flex-wrap gap-2">
                      {result.metadata.examName && (
                        <Badge variant="secondary">{result.metadata.examName}</Badge>
                      )}
                      {result.metadata.subject && (
                        <Badge variant="outline">{result.metadata.subject}</Badge>
                      )}
                      {result.metadata.duration && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.metadata.duration} min
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Questions Preview */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>Extracted Questions Preview</span>
                        {result.questions.some(q => q.hasImage) && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {result.questions.filter(q => q.hasImage).length} with images
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[200px] px-4 pb-4">
                        <div className="space-y-3">
                          {result.questions.map((q, i) => (
                            <div key={i} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-0.5 rounded">
                                      Q{q.questionNumber || i + 1}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {q.type}
                                    </Badge>
                                    {q.hasImage && (
                                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                        <ImageIcon className="h-3 w-3" />
                                        Image
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {q.marks} marks
                                    </span>
                                  </div>
                                  <p className="text-sm line-clamp-2">{q.text}</p>
                                  {q.imageDescription && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">
                                      📷 {q.imageDescription}
                                    </p>
                                  )}
                                  {q.options && q.options.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {q.options.map((opt, j) => (
                                        <span 
                                          key={j} 
                                          className={`text-xs px-2 py-0.5 rounded ${
                                            q.correctAnswer === String.fromCharCode(65 + j) 
                                              ? 'bg-success/20 text-success' 
                                              : 'bg-muted'
                                          }`}
                                        >
                                          {String.fromCharCode(65 + j)}) {opt.substring(0, 30)}{opt.length > 30 ? '...' : ''}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {q.correctAnswer && (
                                  <Badge className="bg-success/20 text-success shrink-0">
                                    Ans: {q.correctAnswer}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Errors */}
              {(!result.success || result.error) && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Extraction Failed</AlertTitle>
                  <AlertDescription>{result.error || 'Could not extract questions from the document.'}</AlertDescription>
                </Alert>
              )}

              {/* No questions found */}
              {result.success && result.questions.length === 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Questions Found</AlertTitle>
                  <AlertDescription>
                    {useLocalMode 
                      ? 'Pattern matching could not identify questions. Try using formats like "Q1.", "1.", or "Question 1:" in your document.'
                      : 'The AI could not identify any questions in this document. Please ensure the document contains exam questions.'
                    }
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {result?.success && result.questions.length > 0 && (
            <Button onClick={handleProceed}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Proceed with {result.questions.length} Questions
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
