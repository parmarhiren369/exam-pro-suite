import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Trophy, 
  Target, 
  TrendingUp,
  Clock,
  ChevronRight,
  Play,
  CheckCircle2,
  BookOpen,
  Award,
  BarChart3,
  Calendar,
  Flame,
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

export default function StudentDashboard() {
  const upcomingTests = [
    { id: 1, name: "JEE Main Mock Test 16", date: "Tomorrow", time: "9:00 AM", duration: "3 hours", type: "Full Syllabus" },
    { id: 2, name: "Physics Chapter Test", date: "Jan 26", time: "2:00 PM", duration: "1.5 hours", type: "Chapter" },
  ];

  const recentResults = [
    { id: 1, name: "JEE Main Mock 15", score: 245, total: 300, rank: 12, percentile: 96.8, date: "Jan 20" },
    { id: 2, name: "Chemistry Full Test", score: 162, total: 180, rank: 8, percentile: 97.5, date: "Jan 18" },
    { id: 3, name: "Mathematics Mock", score: 88, total: 100, rank: 15, percentile: 95.2, date: "Jan 15" },
    { id: 4, name: "Physics Module Test", score: 72, total: 90, rank: 22, percentile: 93.1, date: "Jan 12" },
  ];

  const subjectProgress = [
    { subject: "Physics", progress: 78, chapters: "18/23", color: "bg-primary" },
    { subject: "Chemistry", progress: 85, chapters: "22/26", color: "bg-success" },
    { subject: "Mathematics", progress: 72, chapters: "28/38", color: "bg-accent" },
    { subject: "Biology", progress: 65, chapters: "15/22", color: "bg-info" },
  ];

  const streakData = {
    current: 12,
    best: 24,
    testsThisWeek: 4,
    studyHours: 28,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your progress and excel in your exams</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
            <Flame className="h-5 w-5 text-accent" />
            <span className="font-bold text-accent">{streakData.current} Day Streak!</span>
          </div>
          <Button variant="accent" size="default">
            <Play className="h-4 w-4 mr-2" />
            Start Practice
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tests Attempted"
          value="47"
          description="This semester"
          icon={FileText}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Average Score"
          value="82%"
          description="Across all tests"
          icon={Target}
          trend={{ value: 5, isPositive: true }}
          variant="accent"
        />
        <StatCard
          title="Best Percentile"
          value="98.2"
          description="JEE Main Mock 12"
          icon={Trophy}
          variant="success"
        />
        <StatCard
          title="All India Rank"
          value="#156"
          description="Latest mock test"
          icon={Award}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tests */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Upcoming Tests</CardTitle>
              <CardDescription>Your scheduled examinations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-accent">
              View Calendar <Calendar className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-5 rounded-xl border border-border bg-gradient-to-r from-muted/50 to-transparent hover:border-accent/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                      <FileText className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{test.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {test.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {test.time}
                        </span>
                        <Badge variant="secondary">{test.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="accent">
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Subject Progress</CardTitle>
              <CardDescription>Chapter completion</CardDescription>
            </div>
            <BookOpen className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {subjectProgress.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{subject.subject}</span>
                    <span className="text-sm text-muted-foreground">{subject.chapters}</span>
                  </div>
                  <div className="relative">
                    <Progress value={subject.progress} className="h-3" />
                    <span className="absolute right-0 -top-5 text-xs font-medium text-foreground">
                      {subject.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Results</CardTitle>
            <CardDescription>Your latest test performances</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentResults.map((result) => (
              <div
                key={result.id}
                className="group p-4 rounded-xl border border-border hover:border-accent/50 hover:shadow-card-hover transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{result.name}</h4>
                  <Badge variant="outline" className="text-muted-foreground">
                    {result.date}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{result.score}/{result.total}</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">#{result.rank}</p>
                    <p className="text-xs text-muted-foreground">Rank</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{result.percentile}%</p>
                    <p className="text-xs text-muted-foreground">Percentile</p>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-3 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Review Solutions</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
