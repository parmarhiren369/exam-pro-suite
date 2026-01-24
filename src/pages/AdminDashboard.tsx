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
    { name: "Rahul Sharma", score: 298, rank: 1, avatar: "RS" },
    { name: "Priya Patel", score: 295, rank: 2, avatar: "PP" },
    { name: "Amit Kumar", score: 291, rank: 3, avatar: "AK" },
    { name: "Sneha Gupta", score: 288, rank: 4, avatar: "SG" },
    { name: "Vikram Singh", score: 285, rank: 5, avatar: "VS" },
  ];

  const courses = [
    { name: "JEE Main 2025", students: 1250, batches: 12, color: "bg-primary" },
    { name: "JEE Advanced 2025", students: 680, batches: 8, color: "bg-success" },
    { name: "NEET 2025", students: 920, batches: 10, color: "bg-accent" },
    { name: "Foundation (Class 11)", students: 540, batches: 6, color: "bg-info" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your institute overview.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="default">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Test
          </Button>
          <Button variant="accent" size="default">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="3,247"
          description="Across all batches"
          icon={GraduationCap}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Active Teachers"
          value="48"
          description="Faculty members"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Active Courses"
          value="4"
          description="JEE, NEET & More"
          icon={BookOpen}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Tests This Month"
          value="127"
          description="Scheduled & completed"
          icon={FileText}
          trend={{ value: 23, isPositive: true }}
          variant="accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tests */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Tests</CardTitle>
              <CardDescription>Latest exam activities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-accent">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{test.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {test.date}
                        <span>•</span>
                        <Users className="h-3 w-3" />
                        {test.students} students
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={test.status === "ongoing" ? "default" : "secondary"}
                    className={test.status === "ongoing" ? "bg-success text-success-foreground animate-pulse-soft" : ""}
                  >
                    {test.status === "ongoing" ? "Live" : "Completed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Top Performers</CardTitle>
              <CardDescription>This month's leaders</CardDescription>
            </div>
            <Award className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.rank}
                  className="flex items-center gap-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      performer.rank === 1
                        ? "bg-accent text-accent-foreground"
                        : performer.rank === 2
                        ? "bg-muted-foreground/20 text-foreground"
                        : performer.rank === 3
                        ? "bg-warning/20 text-warning"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {performer.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{performer.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">{performer.score}/300 marks</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Overview */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Courses Overview</CardTitle>
            <CardDescription>Active programs and enrollment</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <div
                key={course.name}
                className="group p-4 rounded-xl border border-border hover:border-accent/50 hover:shadow-card-hover transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${course.color} flex items-center justify-center`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{course.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {course.batches} batches
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
