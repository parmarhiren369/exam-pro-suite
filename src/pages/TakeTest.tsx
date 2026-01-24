import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTest, getQuestion, createSubmission } from "@/lib/firestore";
import { Test, Question } from "@/lib/types";

export default function TakeTest() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [test, setTest] = useState<Test | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    loadTestData();
  }, [testId]);

  const loadTestData = async () => {
    if (!testId) return;
    
    try {
      const testData = await getTest(testId) as Test;
      if (!testData) {
        toast({
          title: "Test Not Found",
          description: "The test you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate("/tests");
        return;
      }

      setTest(testData);
      setTimeRemaining(testData.duration * 60);

      // Load all questions
      const questions: Question[] = [];
      for (const questionId of testData.questions) {
        const questionData = await getQuestion(questionId) as Question;
        if (questionData) {
          questions.push(questionData);
        }
      }
      setTestQuestions(questions);
    } catch (error) {
      console.error('Error loading test:', error);
      toast({
        title: "Error",
        description: "Failed to load test data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!testStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestion)) {
      newMarked.delete(currentQuestion);
    } else {
      newMarked.add(currentQuestion);
    }
    setMarkedForReview(newMarked);
  };

  const handleSubmit = async () => {
    if (!test || !testId) return;

    // Calculate score
    let correctCount = 0;
    let wrongCount = 0;
    let unattempted = 0;
    let totalScore = 0;

    testQuestions.forEach((question, index) => {
      const studentAnswer = answers[index];
      if (!studentAnswer) {
        unattempted++;
      } else if (studentAnswer === question.correctAnswer) {
        correctCount++;
        totalScore += question.marks;
      } else {
        wrongCount++;
        if (question.negativeMarks) {
          totalScore -= question.negativeMarks;
        }
      }
    });

    try {
      // Save submission to Firebase
      const submissionId = await createSubmission({
        testId,
        studentId: "current-student-id", // TODO: Get from auth context
        studentName: "Current Student", // TODO: Get from auth context
        answers: JSON.stringify(answers),
        score: totalScore,
        totalMarks: test.totalMarks,
        correctCount,
        wrongCount,
        unattempted,
        timeTaken: test.duration * 60 - timeRemaining,
        status: "submitted",
        feedback: "",
      });

      toast({
        title: "Test Submitted Successfully!",
        description: `You scored ${totalScore} out of ${test.totalMarks} marks.`,
      });

      navigate("/tests");
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index]) return "answered";
    if (markedForReview.has(index)) return "marked";
    return "not-visited";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-success text-success-foreground";
      case "marked":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p>Test not found</p>
            <Button onClick={() => navigate("/tests")} className="mt-4">
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle className="text-2xl">{test.name}</CardTitle>
            <CardDescription>{test.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{testQuestions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{test.duration}</p>
                <p className="text-sm text-muted-foreground">Minutes</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{test.totalMarks}</p>
                <p className="text-sm text-muted-foreground">Total Marks</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{test.passMarks}</p>
                <p className="text-sm text-muted-foreground">Pass Marks</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Instructions:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Each question carries {testQuestions[0]?.marks || 4} marks</li>
                <li>
                  Negative marking: {testQuestions[0]?.negativeMarks || 1} mark for wrong answers
                </li>
                <li>You can mark questions for review and come back later</li>
                <li>Test will auto-submit when time runs out</li>
                <li>Make sure you have stable internet connection</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => navigate("/tests")} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => setTestStarted(true)} className="flex-1">
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = testQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 mb-4 rounded-lg shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{test.name}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {testQuestions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-lg font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
            <Button onClick={handleSubmit} variant="default">
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Question Panel */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Question {currentQuestion + 1}
                  <Badge className="ml-3" variant="outline">
                    {question.marks} marks
                  </Badge>
                </CardTitle>
                <Button
                  variant={markedForReview.has(currentQuestion) ? "default" : "outline"}
                  size="sm"
                  onClick={handleMarkForReview}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  {markedForReview.has(currentQuestion) ? "Marked" : "Mark for Review"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg">{question.text}</div>

              {question.type === "MCQ" && (
                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
                >
                  <div className="space-y-3">
                    {question.options?.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                          answers[currentQuestion] === option
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {question.type === "Numerical" && (
                <div>
                  <Label htmlFor="numerical-answer">Enter your answer:</Label>
                  <Input
                    id="numerical-answer"
                    type="number"
                    placeholder="Enter numerical value"
                    value={answers[currentQuestion] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <Button
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(testQuestions.length - 1, prev + 1)
                    )
                  }
                  disabled={currentQuestion === testQuestions.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Palette */}
        <div className="space-y-4">
          <Card className="shadow-card sticky top-4">
            <CardHeader>
              <CardTitle className="text-sm">Question Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {testQuestions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`${getStatusColor(status)} ${
                        currentQuestion === index ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>

              <div className="space-y-2 text-xs pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span>Answered ({Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span>Marked ({markedForReview.size})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <span>Not Visited ({testQuestions.length - Object.keys(answers).length})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
