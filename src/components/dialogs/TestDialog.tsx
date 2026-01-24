import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Image as ImageIcon, Upload, X } from "lucide-react";
import { Test, TestType, Question, QuestionType } from "@/lib/types";
import { ExtractionMetadata } from "@/lib/openai";

interface TestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test?: Test;
  onSave: (test: Partial<Test>, questions: Partial<Question>[]) => void;
  initialQuestions?: Partial<Question>[];
  initialMetadata?: ExtractionMetadata;
}

export function TestDialog({
  open,
  onOpenChange,
  test,
  onSave,
  initialQuestions,
  initialMetadata,
}: TestDialogProps) {
  const [formData, setFormData] = useState<Partial<Test>>({
    name: "",
    description: "",
    type: "Mock Test",
    course: "",
    duration: 180,
    totalMarks: 300,
    scheduledDate: "",
    startTime: "",
    instructions: "",
    passMarks: 100,
  });

  const [questions, setQuestions] = useState<Partial<Question>[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: "",
    type: "MCQ",
    marks: 4,
    negativeMarks: 1,
    options: ["", "", "", ""],
    correctAnswer: "",
    solution: "",
    imageUrl: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const questionImageInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens or data changes
  useEffect(() => {
    console.log('Dialog useEffect - open:', open, 'initialQuestions:', initialQuestions?.length);
    
    if (!open) return;
    
    // Reset current question form
    setCurrentQuestion({
      text: "",
      type: "MCQ",
      marks: 4,
      negativeMarks: 1,
      options: ["", "", "", ""],
      correctAnswer: "",
      solution: "",
      imageUrl: "",
    });
    
    // Priority 1: Editing existing test
    if (test) {
      setFormData(test);
      setQuestions([]);
      return;
    }
    
    // Priority 2: Imported questions from AI
    if (initialQuestions && initialQuestions.length > 0) {
      console.log('Setting imported questions:', initialQuestions.length);
      const totalMarks = initialQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);
      setFormData({
        name: initialMetadata?.examName || "",
        description: initialMetadata?.subject || "",
        type: "Mock Test",
        course: "",
        duration: initialMetadata?.duration || 180,
        totalMarks: initialMetadata?.totalMarks || totalMarks,
        scheduledDate: "",
        startTime: "",
        instructions: "",
        passMarks: Math.round((initialMetadata?.totalMarks || totalMarks) * 0.33),
      });
      setQuestions([...initialQuestions]); // Spread to create new array
      return;
    }
    
    // Priority 3: New empty test
    setFormData({
      name: "",
      description: "",
      type: "Mock Test",
      course: "",
      duration: 180,
      totalMarks: 300,
      scheduledDate: "",
      startTime: "",
      instructions: "",
      passMarks: 100,
    });
    setQuestions([]);
    
  }, [open, test, initialQuestions, initialMetadata]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    console.log('Questions:', questions);
    
    const testData = { 
      ...formData, 
      totalMarks: questions.reduce((sum, q) => sum + (q.marks || 0), 0)
    };
    
    // Pass both test data and questions to parent
    // Parent will create questions in Firebase and get their IDs
    onSave(testData, questions);
    onOpenChange(false);
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.text || !currentQuestion.correctAnswer) {
      alert("Please fill in question text and correct answer");
      return;
    }
    
    const newQuestion = {
      ...currentQuestion,
      id: `q-${Date.now()}`,
    };
    
    setQuestions([...questions, newQuestion]);
    
    // Reset form
    setCurrentQuestion({
      text: "",
      type: "MCQ",
      marks: 4,
      negativeMarks: 1,
      options: ["", "", "", ""],
      correctAnswer: "",
      solution: "",
      imageUrl: "",
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || ["", "", "", ""])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  // Handle image upload for current question being added
  const handleCurrentQuestionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, GIF, etc.)');
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCurrentQuestion({ ...currentQuestion, imageUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  // Handle image upload for existing questions in the list
  const handleQuestionImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, GIF, etc.)');
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const updatedQuestions = [...questions];
      updatedQuestions[index] = { ...updatedQuestions[index], imageUrl: base64 };
      setQuestions(updatedQuestions);
    };
    reader.readAsDataURL(file);
  };

  // Remove image from existing question
  const handleRemoveQuestionImage = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], imageUrl: undefined };
    setQuestions(updatedQuestions);
  };

  const testTypes: TestType[] = [
    "Mock Test",
    "Chapter Test",
    "Full Syllabus",
    "Practice Test",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{test ? "Edit Test" : "Create New Test"}</DialogTitle>
          <DialogDescription>
            {test
              ? "Update test information and questions below"
              : "Fill in the test details and add questions with solutions"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Test Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., JEE Main Mock Test 15"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the test"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Test Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: TestType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) =>
                    setFormData({ ...formData, course: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Note: In production, fetch courses from API */}
                    <SelectItem value="JEE Main 2025">JEE Main 2025</SelectItem>
                    <SelectItem value="JEE Advanced 2025">JEE Advanced 2025</SelectItem>
                    <SelectItem value="NEET 2025">NEET 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks *</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalMarks: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passMarks">Pass Marks</Label>
              <Input
                id="passMarks"
                type="number"
                value={formData.passMarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passMarks: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                placeholder="Instructions for students..."
                rows={3}
              />
            </div>

            {/* Questions Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
                <p className="text-sm text-muted-foreground">
                  Total Marks: {questions.reduce((sum, q) => sum + (q.marks || 0), 0)}
                </p>
              </div>

              {/* Added Questions List */}
              {questions.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {questions.map((q, index) => (
                    <Card key={index} className="relative">
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          {/* Question Image Thumbnail */}
                          {q.imageUrl ? (
                            <div className="shrink-0 w-20 h-20 rounded overflow-hidden border relative group">
                              <img 
                                src={q.imageUrl} 
                                alt={`Question ${index + 1} diagram`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveQuestionImage(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="shrink-0">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleQuestionImageUpload(index, e)}
                                className="hidden"
                                id={`image-upload-${index}`}
                              />
                              <label
                                htmlFor={`image-upload-${index}`}
                                className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
                              >
                                <ImageIcon className="h-5 w-5 text-muted-foreground mb-1" />
                                <span className="text-[10px] text-muted-foreground text-center">Add Image</span>
                              </label>
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">Q{index + 1}. {q.text}</p>
                            <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="px-2 py-0.5 bg-primary/10 rounded">{q.type}</span>
                              <span>{q.marks} marks</span>
                              {q.negativeMarks && <span>-{q.negativeMarks} negative</span>}
                              {q.correctAnswer && (
                                <span className="px-2 py-0.5 bg-success/10 text-success rounded">
                                  Ans: {typeof q.correctAnswer === 'string' ? q.correctAnswer : JSON.stringify(q.correctAnswer)}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(index)}
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Question Form */}
              <Card className="bg-muted/30">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-base">Add Question</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="questionText">Question Text *</Label>
                    <Textarea
                      id="questionText"
                      value={currentQuestion.text}
                      onChange={(e) =>
                        setCurrentQuestion({ ...currentQuestion, text: e.target.value })
                      }
                      placeholder="Enter the question..."
                      rows={2}
                    />
                  </div>

                  {/* Image Upload for New Question */}
                  <div className="space-y-2">
                    <Label>Question Image (Optional)</Label>
                    {currentQuestion.imageUrl ? (
                      <div className="flex items-start gap-3">
                        <div className="relative w-24 h-24 rounded overflow-hidden border">
                          <img 
                            src={currentQuestion.imageUrl} 
                            alt="Question diagram"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentQuestion({ ...currentQuestion, imageUrl: "" })}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCurrentQuestionImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image/Diagram
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Add diagrams, figures, or images for this question
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="questionType">Type *</Label>
                      <Select
                        value={currentQuestion.type}
                        onValueChange={(value: QuestionType) => {
                          setCurrentQuestion({ 
                            ...currentQuestion, 
                            type: value,
                            options: value === "MCQ" || value === "Multiple Correct" ? ["", "", "", ""] : undefined
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MCQ">MCQ</SelectItem>
                          <SelectItem value="Multiple Correct">Multiple Correct</SelectItem>
                          <SelectItem value="Numerical">Numerical</SelectItem>
                          <SelectItem value="Integer">Integer</SelectItem>
                          <SelectItem value="Subjective">Subjective</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="marks">Marks *</Label>
                      <Input
                        id="marks"
                        type="number"
                        value={currentQuestion.marks}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            marks: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="negativeMarks">Negative</Label>
                      <Input
                        id="negativeMarks"
                        type="number"
                        value={currentQuestion.negativeMarks}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            negativeMarks: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Options for MCQ */}
                  {(currentQuestion.type === "MCQ" || currentQuestion.type === "Multiple Correct") && (
                    <div className="space-y-2">
                      <Label>Options *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 1, 2, 3].map((i) => (
                          <Input
                            key={i}
                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                            value={currentQuestion.options?.[i] || ""}
                            onChange={(e) => handleOptionChange(i, e.target.value)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">
                      Correct Answer * 
                      {currentQuestion.type === "MCQ" && " (A, B, C, or D)"}
                      {currentQuestion.type === "Multiple Correct" && " (e.g., A,B,D)"}
                    </Label>
                    <Input
                      id="correctAnswer"
                      value={currentQuestion.correctAnswer}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: e.target.value,
                        })
                      }
                      placeholder={
                        currentQuestion.type === "MCQ" 
                          ? "Enter A, B, C, or D" 
                          : currentQuestion.type === "Multiple Correct"
                          ? "Enter multiple answers (e.g., A,B,D)"
                          : "Enter the correct answer"
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="solution">Solution (Optional)</Label>
                    <Textarea
                      id="solution"
                      value={currentQuestion.solution}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          solution: e.target.value,
                        })
                      }
                      placeholder="Explain the solution..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question to Test
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              {test ? "Update" : "Create"} Test
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
