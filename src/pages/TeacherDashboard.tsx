import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  PenTool, 
  Users, 
  BarChart3,
  Plus,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function TeacherDashboard() {
  const recentQuestions = [
    { id: 1, topic: "Thermodynamics", chapter: "Physics", type: "MCQ", difficulty: "Hard", status: "approved" },
    { id: 2, topic: "Organic Chemistry", chapter: "Chemistry", type: "MCQ", difficulty: "Medium", status: "pending" },
    { id: 3, topic: "Calculus", chapter: "Mathematics", type: "Numerical", difficulty: "Hard", status: "approved" },
    { id: 4, topic: "Genetics", chapter: "Biology", type: "MCQ", difficulty: "Easy", status: "rejected" },
  ];

  const upcomingTests = [
    { id: 1, name: "JEE Main Mock 16", date: "Tomorrow, 9:00 AM", students: 320, duration: "3 hours" },
    { id: 2, name: "Physics Chapter Test", date: "Jan 26, 2:00 PM", students: 180, duration: "1.5 hours" },
    { id: 3, name: "Chemistry Full Test", date: "Jan 28, 10:00 AM", students: 290, duration: "3 hours" },
  ];

  const topicPerformance = [
    { topic: "Mechanics", avgScore: 78, students: 320, trend: "up" },
    { topic: "Thermodynamics", avgScore: 65, students: 320, trend: "down" },
    { topic: "Optics", avgScore: 82, students: 310, trend: "up" },
    { topic: "Electromagnetism", avgScore: 71, students: 315, trend: "stable" },
    { topic: "Modern Physics", avgScore: 74, students: 290, trend: "up" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-success/10 text-success";
      case "Medium":
        return "bg-warning/10 text-warning";
      case "Hard":
        return "bg-destructive/10 text-destructive";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage questions, tests & track student performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="default">
            <Upload className="h-4 w-4 mr-2" />
            Upload Solutions
          </Button>
          <Button variant="accent" size="default">
            <Plus className="h-4 w-4 mr-2" />
            Create Test
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Questions Created"
          value="847"
          description="Total in question bank"
          icon={PenTool}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Tests Created"
          value="34"
          description="This semester"
          icon={FileText}
          trend={{ value: 8, isPositive: true }}
          variant="accent"
        />
        <StatCard
          title="Students Assigned"
          value="520"
          description="Across 6 batches"
          icon={Users}
        />
        <StatCard
          title="Avg. Performance"
          value="74%"
          description="Class average"
          icon={BarChart3}
          trend={{ value: 3, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Bank Activity */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Questions</CardTitle>
              <CardDescription>Your latest question submissions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-accent">
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuestions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{question.topic}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{question.chapter}</span>
                        <span>•</span>
                        <span>{question.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    {getStatusIcon(question.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tests */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Upcoming Tests</CardTitle>
              <CardDescription>Scheduled exams</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTests.map((test) => (
                <div
                  key={test.id}
                  className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{test.name}</h4>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {test.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {test.students} students • {test.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic-wise Performance Analysis */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Topic-wise Performance Analysis</CardTitle>
            <CardDescription>Student performance by topic</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Full Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topicPerformance.map((topic) => (
              <div key={topic.topic} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{topic.topic}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{topic.students} students</span>
                    <span className={`font-semibold ${topic.avgScore >= 75 ? "text-success" : topic.avgScore >= 60 ? "text-warning" : "text-destructive"}`}>
                      {topic.avgScore}%
                    </span>
                    {topic.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                    {topic.trend === "down" && <TrendingUp className="h-4 w-4 text-destructive rotate-180" />}
                  </div>
                </div>
                <Progress 
                  value={topic.avgScore} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
