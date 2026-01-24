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
  TrendingDown,
  Upload,
  Sparkles,
  Lightbulb,
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" };
      case "pending":
        return { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" };
      case "rejected":
        return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" };
      default:
        return { icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted" };
    }
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-success/10 text-success border-success/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Hard":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Faculty Dashboard
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Teacher!</h1>
          <p className="text-muted-foreground mt-1">Manage your questions, tests, and track student performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="default" className="rounded-xl border-2">
            <Upload className="h-4 w-4 mr-2" />
            Upload Solutions
          </Button>
          <Button variant="accent" size="default" className="rounded-xl shadow-glow-accent/30">
            <Plus className="h-4 w-4 mr-2" />
            Create Test
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Questions Created"
          value="847"
          description="Total in question bank"
          icon={PenTool}
          trend={{ value: 15, isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Tests Created"
          value="34"
          description="This semester"
          icon={FileText}
          trend={{ value: 8, isPositive: true }}
          variant="accent"
          delay={100}
        />
        <StatCard
          title="Students Assigned"
          value="520"
          description="Across 6 batches"
          icon={Users}
          delay={200}
        />
        <StatCard
          title="Avg. Performance"
          value="74%"
          description="Class average"
          icon={BarChart3}
          trend={{ value: 3, isPositive: true }}
          variant="success"
          delay={300}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Bank Activity */}
        <Card className="lg:col-span-2 shadow-premium hover-lift border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Recent Questions</CardTitle>
              <CardDescription>Your latest question submissions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 font-medium">
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentQuestions.map((question, index) => {
              const statusConfig = getStatusConfig(question.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-border/50 group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl icon-container-primary flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-accent transition-colors">{question.topic}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <span>{question.chapter}</span>
                        <span>•</span>
                        <span>{question.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getDifficultyConfig(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <div className={`w-8 h-8 rounded-lg ${statusConfig.bg} flex items-center justify-center`}>
                      <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Upcoming Tests */}
        <Card className="shadow-premium hover-lift border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: "450ms", animationFillMode: "forwards" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Upcoming Tests</CardTitle>
              <CardDescription>Scheduled exams</CardDescription>
            </div>
            <div className="w-10 h-10 rounded-xl icon-container-accent flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTests.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-xl border-2 border-border/50 hover:border-accent/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">{test.name}</h4>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {test.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    {test.students} students • {test.duration}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Topic-wise Performance Analysis */}
      <Card className="shadow-premium hover-lift border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Topic-wise Performance Analysis</CardTitle>
            <CardDescription>Student performance breakdown by topic</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl border-2">
            <BarChart3 className="h-4 w-4 mr-2" />
            Full Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topicPerformance.map((topic) => (
              <div key={topic.topic} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{topic.topic}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{topic.students} students</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${topic.avgScore >= 75 ? "text-success" : topic.avgScore >= 60 ? "text-warning" : "text-destructive"}`}>
                        {topic.avgScore}%
                      </span>
                      {topic.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                      {topic.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                </div>
                <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
                      topic.avgScore >= 75 ? "bg-success" : 
                      topic.avgScore >= 60 ? "bg-warning" : 
                      "bg-destructive"
                    }`}
                    style={{ width: `${topic.avgScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
