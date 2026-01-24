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
  Sparkles,
  Zap,
  Star,
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
    { id: 1, name: "JEE Main Mock Test 16", date: "Tomorrow", time: "9:00 AM", duration: "3 hours", type: "Full Syllabus", difficulty: "Hard" },
    { id: 2, name: "Physics Chapter Test", date: "Jan 26", time: "2:00 PM", duration: "1.5 hours", type: "Chapter", difficulty: "Medium" },
  ];

  const recentResults = [
    { id: 1, name: "JEE Main Mock 15", score: 245, total: 300, rank: 12, percentile: 96.8, date: "Jan 20", improvement: "+15" },
    { id: 2, name: "Chemistry Full Test", score: 162, total: 180, rank: 8, percentile: 97.5, date: "Jan 18", improvement: "+8" },
    { id: 3, name: "Mathematics Mock", score: 88, total: 100, rank: 15, percentile: 95.2, date: "Jan 15", improvement: "+12" },
    { id: 4, name: "Physics Module Test", score: 72, total: 90, rank: 22, percentile: 93.1, date: "Jan 12", improvement: "+5" },
  ];

  const subjectProgress = [
    { subject: "Physics", progress: 78, chapters: "18/23", color: "from-primary to-primary/70", icon: "⚡" },
    { subject: "Chemistry", progress: 85, chapters: "22/26", color: "from-success to-success/70", icon: "🧪" },
    { subject: "Mathematics", progress: 72, chapters: "28/38", color: "from-accent to-orange-400", icon: "📐" },
  ];

  const streakData = {
    current: 12,
    best: 24,
    testsThisWeek: 4,
    studyHours: 28,
  };

  return (
    <div className="space-y-8">
      {/* Header with Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold flex items-center gap-2 shadow-glow-accent/30">
              <Flame className="h-4 w-4" />
              {streakData.current} Day Streak!
            </div>
            <div className="px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              On Fire!
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Champion!</h1>
          <p className="text-muted-foreground mt-1">Keep pushing towards your goals. You're doing great!</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="default" className="rounded-xl border-2">
            <BarChart3 className="h-4 w-4 mr-2" />
            My Progress
          </Button>
          <Button variant="accent" size="default" className="rounded-xl shadow-glow-accent/30">
            <Play className="h-4 w-4 mr-2" />
            Start Practice
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tests Attempted"
          value="47"
          description="This semester"
          icon={FileText}
          trend={{ value: 8, isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Average Score"
          value="82%"
          description="Across all tests"
          icon={Target}
          trend={{ value: 5, isPositive: true }}
          variant="accent"
          delay={100}
        />
        <StatCard
          title="Best Percentile"
          value="98.2"
          description="JEE Main Mock 12"
          icon={Trophy}
          variant="success"
          delay={200}
        />
        <StatCard
          title="All India Rank"
          value="#156"
          description="Latest mock test"
          icon={Award}
          trend={{ value: 12, isPositive: true }}
          delay={300}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tests */}
        <Card className="lg:col-span-2 shadow-premium hover-lift border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Upcoming Tests</CardTitle>
              <CardDescription>Your scheduled examinations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 font-medium">
              View Calendar <Calendar className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTests.map((test, index) => (
              <div
                key={test.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border-2 border-border/50 bg-muted/30 hover:border-accent/30 hover:shadow-premium transition-all group"
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-glow-primary/30">
                    <FileText className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg group-hover:text-accent transition-colors">{test.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {test.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {test.time}
                      </span>
                      <Badge variant="secondary" className="font-medium">{test.type}</Badge>
                      <Badge className={`font-medium ${test.difficulty === "Hard" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                        {test.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="accent" className="rounded-xl shadow-glow-accent/20 w-full sm:w-auto">
                  <Play className="h-4 w-4 mr-2" />
                  Start Test
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card className="shadow-premium hover-lift border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: "450ms", animationFillMode: "forwards" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Subject Progress</CardTitle>
              <CardDescription>Chapter completion</CardDescription>
            </div>
            <div className="w-10 h-10 rounded-xl icon-container-accent flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {subjectProgress.map((subject, index) => (
              <div key={subject.subject} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{subject.icon}</span>
                    <span className="font-semibold text-foreground">{subject.subject}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{subject.chapters}</span>
                </div>
                <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 rounded-full ${subject.color.replace('from-', 'bg-').replace(/to-.*/, '')} transition-all duration-1000 ease-out`}
                    style={{ width: `${subject.progress}%` }}
                  />
                  <div className="absolute inset-0 bg-white/10 animate-shimmer" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-bold text-foreground">{subject.progress}%</span>
                </div>
              </div>
            ))}
            
            {/* Weekly Stats */}
            <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">{streakData.testsThisWeek}</p>
                <p className="text-xs text-muted-foreground">Tests This Week</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 text-center">
                <p className="text-2xl font-bold text-foreground">{streakData.studyHours}h</p>
                <p className="text-xs text-muted-foreground">Study Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card className="shadow-premium hover-lift border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Recent Results</CardTitle>
            <CardDescription>Your latest test performances</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl border-2">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentResults.map((result, index) => (
              <div
                key={result.id}
                className="group p-5 rounded-2xl border-2 border-border/50 hover:border-accent/30 hover:shadow-premium transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-foreground group-hover:text-accent transition-colors">{result.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-success text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {result.improvement}
                    </span>
                    <Badge variant="outline" className="text-muted-foreground font-medium">
                      {result.date}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">{result.score}<span className="text-sm text-muted-foreground">/{result.total}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Score</p>
                  </div>
                  <div className="p-3 rounded-xl bg-accent/10">
                    <p className="text-2xl font-bold text-accent">#{result.rank}</p>
                    <p className="text-xs text-muted-foreground mt-1">Rank</p>
                  </div>
                  <div className="p-3 rounded-xl bg-success/10">
                    <p className="text-2xl font-bold text-success">{result.percentile}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Percentile</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning" />
                    Great performance!
                  </span>
                  <span className="text-accent text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    Review Solutions
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
