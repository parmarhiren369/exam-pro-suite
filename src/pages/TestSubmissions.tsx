import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Award,
  Eye,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSubmissions, updateSubmission, getTest, getQuestion } from "@/lib/firestore";
import { where } from "firebase/firestore";
import { Test, Question } from "@/lib/types";

interface Submission {
  id?: string;
  testId: string;
  studentId: string;
  studentName: string;
  submittedAt?: string;
  answers: string; // JSON string
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unattempted: number;
  timeTaken: number;
  status: string;
  feedback?: string;
}

export default function TestSubmissions() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [test, setTest] = useState<Test | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [testId]);

  const loadData = async () => {
    if (!testId) return;

    try {
      // Load test
      const testData = await getTest(testId) as Test;
      setTest(testData);

      // Load questions
      if (testData) {
        const questions: Question[] = [];
        for (const questionId of testData.questions) {
          const questionData = await getQuestion(questionId) as Question;
          if (questionData) {
            questions.push(questionData);
          }
        }
        setTestQuestions(questions);
      }

      // Load submissions for this test
      const allSubmissions = await getSubmissions([where("testId", "==", testId)]) as Submission[];
      setSubmissions(allSubmissions);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || "");
  };

  const handleSaveFeedback = async () => {
    if (!selectedSubmission || !selectedSubmission.id) return;

    try {
      await updateSubmission(selectedSubmission.id, {
        feedback,
        status: "evaluated",
      });

      // Reload submissions
      const allSubmissions = await getSubmissions([where("testId", "==", testId)]) as Submission[];
      setSubmissions(allSubmissions);

      toast({
        title: "Feedback Saved",
        description: "Your feedback has been saved successfully.",
      });

      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast({
        title: "Error",
        description: "Failed to save feedback.",
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter((sub) =>
    sub.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 75) return "text-success";
    if (percentage >= 50) return "text-warning";
    return "text-destructive";
  };

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p>Test not found</p>
            <Button onClick={() => navigate("/tests-management")} className="mt-4">
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Test Submissions</h1>
          <p className="text-muted-foreground mt-1">{test.name}</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/tests-management")}>
          Back to Tests
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {submissions.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {submissions.length > 0
                    ? Math.round(
                        submissions.reduce((sum, sub) => sum + sub.score, 0) /
                          submissions.length
                      )
                    : 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Award className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Evaluated</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {submissions.filter((s) => s.status === "evaluated").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {submissions.length > 0
                    ? Math.round(
                        (submissions.filter(
                          (s) => s.score >= (test.passMarks || 0)
                        ).length /
                          submissions.length) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card className="shadow-premium">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Student Submissions</CardTitle>
              <CardDescription>Review and evaluate student answers</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">No submissions yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Submissions will appear here once students complete the test
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Student</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Time Taken</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{submission.studentName}</p>
                            <p className="text-sm text-muted-foreground">
                              {submission.studentId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {new Date(submission.submittedAt).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-lg font-bold ${getScoreColor(
                            submission.score,
                            submission.totalMarks
                          )}`}
                        >
                          {submission.score}/{submission.totalMarks}
                        </span>
                      </TableCell>
                      <TableCell>{formatTime(submission.timeTaken)}</TableCell>
                      <TableCell>
                        {submission.status === "evaluated" ? (
                          <Badge className="bg-success text-success-foreground">
                            Evaluated
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSubmission(submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Submission - {selectedSubmission?.studentName}</DialogTitle>
            <DialogDescription>
              Review answers and provide feedback
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-success">{selectedSubmission.correctCount}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-destructive">{selectedSubmission.wrongCount}</p>
                  <p className="text-xs text-muted-foreground">Wrong</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-muted-foreground">
                    {selectedSubmission.unattempted}
                  </p>
                  <p className="text-xs text-muted-foreground">Unattempted</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {selectedSubmission.score}/{selectedSubmission.totalMarks}
                  </p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              </div>

              {/* Answers Review */}
              <div className="space-y-4">
                <h4 className="font-semibold">Answers Review</h4>
                {testQuestions.map((question, index) => {
                  const answersObj = JSON.parse(selectedSubmission.answers || "{}");
                  const studentAnswer = answersObj[index];
                  const isCorrect = studentAnswer === question.correctAnswer;

                  return (
                    <Card key={index} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              !studentAnswer
                                ? "bg-muted"
                                : isCorrect
                                ? "bg-success"
                                : "bg-destructive"
                            }`}
                          >
                            {!studentAnswer ? (
                              <span className="text-sm font-bold text-muted-foreground">
                                {index + 1}
                              </span>
                            ) : isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-success-foreground" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive-foreground" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <p className="font-medium">{question.text}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Student Answer: </span>
                                <span className={!studentAnswer ? "text-muted-foreground italic" : ""}>
                                  {studentAnswer || "Not attempted"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Correct Answer: </span>
                                <span className="text-success font-medium">
                                  {question.correctAnswer}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Feedback Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Teacher Feedback</label>
                <Textarea
                  placeholder="Provide feedback to the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                  Close
                </Button>
                <Button onClick={handleSaveFeedback}>Save Feedback</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
