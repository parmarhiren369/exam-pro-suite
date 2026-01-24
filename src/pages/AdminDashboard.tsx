import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Building2, 
  TrendingUp,
  Plus,
  Calendar,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Award,
  Sparkles,
  Play,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const recentTests = [
    { id: 1, name: "JEE Main Mock Test 15", date: "Today", students: 450, status: "ongoing" },
    { id: 2, name: "NEET Full Syllabus Test", date: "Yesterday", students: 380, status: "completed" },
    { id: 3, name: "JEE Advanced Practice", date: "2 days ago", students: 220, status: "completed" },
    { id: 4, name: "Chemistry Module Test", date: "3 days ago", students: 310, status: "completed" },
  ];

  const topPerformers = [
    { name: "Rahul Sharma", score: 298, rank: 1, avatar: "RS", percentile: 99.2 },
    { name: "Priya Patel", score: 295, rank: 2, avatar: "PP", percentile: 98.8 },
    { name: "Amit Kumar", score: 291, rank: 3, avatar: "AK", percentile: 98.1 },
    { name: "Sneha Gupta", score: 288, rank: 4, avatar: "SG", percentile: 97.5 },
    { name: "Vikram Singh", score: 285, rank: 5, avatar: "VS", percentile: 97.0 },
  ];

  const courses = [
    { name: "JEE Main 2025", students: 1250, batches: 12, trend: "+8%", gradient: "from-primary to-primary/70" },
    { name: "JEE Advanced 2025", students: 680, batches: 8, trend: "+12%", gradient: "from-success to-success/70" },
    { name: "NEET 2025", students: 920, batches: 10, trend: "+15%", gradient: "from-accent to-orange-400" },
    { name: "Foundation (Class 11)", students: 540, batches: 6, trend: "+5%", gradient: "from-info to-info/70" },
  ];

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "gradient-accent text-accent-foreground shadow-glow-accent/30";
    if (rank === 2) return "bg-muted-foreground/20 text-foreground";
    if (rank === 3) return "bg-warning/20 text-warning";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Institute Overview
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Admin!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening at your institute today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="default" className="rounded-xl border-2">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Test
          </Button>
          <Button variant="accent" size="default" className="rounded-xl shadow-glow-accent/30">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value="3,247"
          description="Across all batches"
          icon={GraduationCap}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Active Teachers"
          value="48"
          description="Faculty members"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          delay={100}
        />
        <StatCard
          title="Active Courses"
          value="4"
          description="JEE, NEET & More"
          icon={BookOpen}
          delay={200}
        />
        <StatCard
          title="Tests This Month"
          value="127"
          description="Scheduled & completed"
          icon={FileText}
          trend={{ value: 23, isPositive: true }}
          variant="accent"
          delay={300}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tests */}
        <Card className="lg:col-span-2 shadow-premium hover-lift border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Recent Tests</CardTitle>
              <CardDescription>Latest examination activities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 font-medium">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTests.map((test, index) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 group cursor-pointer"
                style={{ animationDelay: `${500 + index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl icon-container-primary flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-accent transition-colors">{test.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {test.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {test.students} students
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {test.status === "ongoing" ? (
                    <Badge className="bg-success/10 text-success border border-success/20 flex items-center gap-1.5 animate-pulse-soft">
                      <Play className="h-3 w-3" />
                      Live
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Completed</Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="shadow-premium hover-lift border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: "450ms", animationFillMode: "forwards" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Top Performers</CardTitle>
              <CardDescription>This month's leaders</CardDescription>
            </div>
            <div className="w-10 h-10 rounded-xl icon-container-accent flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div
                key={performer.rank}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-110 ${getRankStyle(performer.rank)}`}
                >
                  {performer.rank}
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/10`}>
                  <span className="text-sm font-semibold text-primary">{performer.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate group-hover:text-accent transition-colors">{performer.name}</p>
                  <p className="text-sm text-muted-foreground">{performer.percentile}% percentile</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{performer.score}</p>
                  <p className="text-xs text-muted-foreground">/300</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Courses Overview */}
      <Card className="shadow-premium hover-lift border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Courses Overview</CardTitle>
            <CardDescription>Active programs and enrollment trends</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl border-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course, index) => (
              <div
                key={course.name}
                className="group p-5 rounded-2xl border-2 border-border/50 hover:border-accent/30 bg-card hover:shadow-premium-lg transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${600 + index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center shadow-lg`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-success text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    {course.trend}
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-3 group-hover:text-accent transition-colors">{course.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    {course.students.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {course.batches} batches
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">View Details</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
