import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  Award,
  Users,
  FileText,
  Download,
  Calendar,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const performanceTrend = [
  { month: "Aug", score: 62 },
  { month: "Sep", score: 68 },
  { month: "Oct", score: 71 },
  { month: "Nov", score: 75 },
  { month: "Dec", score: 78 },
  { month: "Jan", score: 82 },
];

const subjectData = [
  { subject: "Physics", score: 78, target: 85, tests: 15 },
  { subject: "Chemistry", score: 82, target: 85, tests: 14 },
  { subject: "Mathematics", score: 75, target: 85, tests: 16 },
  { subject: "Biology", score: 85, target: 85, tests: 12 },
];

const chapterPerformance = [
  { chapter: "Mechanics", score: 85, trend: "up" },
  { chapter: "Thermodynamics", score: 72, trend: "down" },
  { chapter: "Optics", score: 88, trend: "up" },
  { chapter: "Electromagnetism", score: 78, trend: "stable" },
  { chapter: "Modern Physics", score: 80, trend: "up" },
  { chapter: "Organic Chemistry", score: 76, trend: "up" },
  { chapter: "Inorganic Chemistry", score: 70, trend: "down" },
  { chapter: "Physical Chemistry", score: 82, trend: "stable" },
];

const timeDistribution = [
  { name: "Physics", value: 35, color: "hsl(222, 59%, 25%)" },
  { name: "Chemistry", value: 30, color: "hsl(142, 76%, 36%)" },
  { name: "Mathematics", value: 25, color: "hsl(25, 95%, 53%)" },
  { name: "Biology", value: 10, color: "hsl(199, 89%, 48%)" },
];

const weeklyTests = [
  { day: "Mon", tests: 2 },
  { day: "Tue", tests: 1 },
  { day: "Wed", tests: 3 },
  { day: "Thu", tests: 2 },
  { day: "Fri", tests: 1 },
  { day: "Sat", tests: 4 },
  { day: "Sun", tests: 2 },
];

export default function Analytics() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ChevronUp className="h-4 w-4 text-success" />;
      case "down":
        return <ChevronDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track performance and identify improvement areas</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 6 Months
          </Button>
          <Button variant="accent">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-3xl font-bold text-foreground mt-1">82%</p>
                <div className="flex items-center gap-1 mt-2 text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+5% from last month</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                <Target className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tests Attempted</p>
                <p className="text-3xl font-bold text-foreground mt-1">47</p>
                <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">This semester</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center">
                <FileText className="h-7 w-7 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Percentile</p>
                <p className="text-3xl font-bold text-foreground mt-1">98.2</p>
                <div className="flex items-center gap-1 mt-2 text-success">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">JEE Main Mock 12</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl gradient-success flex items-center justify-center">
                <Award className="h-7 w-7 text-success-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Hours</p>
                <p className="text-3xl font-bold text-foreground mt-1">156</p>
                <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">This month</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-info flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-info-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Performance Trend</CardTitle>
            <CardDescription>Your score progression over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Test Activity</CardTitle>
            <CardDescription>Tests attempted this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTests}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="tests" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance & Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Subject-wise Performance</CardTitle>
            <CardDescription>Compare your scores with target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectData.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{subject.subject}</span>
                      <Badge variant="secondary">{subject.tests} tests</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${subject.score >= subject.target ? "text-success" : "text-foreground"}`}>
                        {subject.score}%
                      </span>
                      <span className="text-sm text-muted-foreground">/ {subject.target}%</span>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={subject.score} className="h-3" />
                    <div
                      className="absolute top-0 h-3 w-0.5 bg-foreground"
                      style={{ left: `${subject.target}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Study Time Distribution</CardTitle>
            <CardDescription>Time spent per subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {timeDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium text-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chapter-wise Performance */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Chapter-wise Performance</CardTitle>
          <CardDescription>Detailed breakdown by topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {chapterPerformance.map((chapter) => (
              <div
                key={chapter.chapter}
                className="p-4 rounded-xl border border-border hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">{chapter.chapter}</span>
                  {getTrendIcon(chapter.trend)}
                </div>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-bold ${chapter.score >= 80 ? "text-success" : chapter.score >= 70 ? "text-warning" : "text-destructive"}`}>
                    {chapter.score}%
                  </span>
                  <Progress value={chapter.score} className="flex-1 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
