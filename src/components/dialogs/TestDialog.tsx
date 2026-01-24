import { useState, useEffect } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import { Test, TestType, Question, QuestionType } from "@/lib/types";

interface TestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test?: Test;
  onSave: (test: Partial<Test>, questions: Partial<Question>[]) => void;
}

export function TestDialog({
  open,
  onOpenChange,
  test,
  onSave,
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
  });

  // Reset form when dialog opens or test changes
  useEffect(() => {
    console.log('Dialog open state changed:', open);
    if (open) {
      if (test) {
        setFormData(test);
        // Note: For editing, we would need to fetch the actual questions by IDs
        setQuestions([]);
      } else {
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
      }
      // Reset current question form
      setCurrentQuestion({
        text: "",
        type: "MCQ",
        marks: 4,
        negativeMarks: 1,
        options: ["", "", "", ""],
        correctAnswer: "",
        solution: "",
      });
    }
  }, [open, test]);

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
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {questions.map((q, index) => (
                    <Card key={index} className="relative">
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">Q{index + 1}. {q.text}</p>
                            <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="px-2 py-0.5 bg-primary/10 rounded">{q.type}</span>
                              <span>{q.marks} marks</span>
                              {q.negativeMarks && <span>-{q.negativeMarks} negative</span>}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(index)}
                            className="h-8 w-8 p-0"
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
