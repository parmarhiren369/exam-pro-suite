import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  Users,
  Play,
  Search,
  Filter,
  Plus,
  Calendar,
  BookOpen,
  Target,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Test {
  id: number;
  name: string;
  course: string;
  type: string;
  duration: string;
  questions: number;
  totalMarks: number;
  date: string;
  time: string;
  status: "upcoming" | "ongoing" | "completed";
  students?: number;
  avgScore?: number;
}

const testsData: Test[] = [
  { id: 1, name: "JEE Main Mock Test 16", course: "JEE Main", type: "Full Syllabus", duration: "3 hours", questions: 90, totalMarks: 300, date: "Jan 25, 2025", time: "9:00 AM", status: "upcoming", students: 450 },
  { id: 2, name: "NEET Biology Module", course: "NEET", type: "Chapter", duration: "1.5 hours", questions: 45, totalMarks: 180, date: "Jan 24, 2025", time: "2:00 PM", status: "ongoing", students: 320 },
  { id: 3, name: "JEE Advanced Practice", course: "JEE Advanced", type: "Part Test", duration: "3 hours", questions: 54, totalMarks: 180, date: "Jan 22, 2025", time: "10:00 AM", status: "completed", students: 280, avgScore: 72 },
  { id: 4, name: "Chemistry Full Test", course: "JEE Main", type: "Subject", duration: "1 hour", questions: 30, totalMarks: 100, date: "Jan 20, 2025", time: "3:00 PM", status: "completed", students: 410, avgScore: 68 },
  { id: 5, name: "Physics Mechanics Test", course: "JEE Main", type: "Chapter", duration: "1.5 hours", questions: 35, totalMarks: 105, date: "Jan 18, 2025", time: "11:00 AM", status: "completed", students: 380, avgScore: 75 },
  { id: 6, name: "NEET Full Mock", course: "NEET", type: "Full Syllabus", duration: "3 hours", questions: 180, totalMarks: 720, date: "Jan 28, 2025", time: "9:00 AM", status: "upcoming", students: 520 },
];

export default function Tests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "upcoming":
        return { color: "bg-info/10 text-info border-info/20", icon: Clock, label: "Upcoming" };
      case "ongoing":
        return { color: "bg-success/10 text-success border-success/20", icon: Play, label: "Live" };
      case "completed":
        return { color: "bg-muted text-muted-foreground border-muted", icon: CheckCircle2, label: "Completed" };
      default:
        return { color: "", icon: AlertCircle, label: "" };
    }
  };

  const filteredTests = testsData.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "all" || test.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const upcomingTests = filteredTests.filter((t) => t.status === "upcoming");
  const ongoingTests = filteredTests.filter((t) => t.status === "ongoing");
  const completedTests = filteredTests.filter((t) => t.status === "completed");

  const TestCard = ({ test }: { test: Test }) => {
    const statusConfig = getStatusConfig(test.status);
    const StatusIcon = statusConfig.icon;

    return (
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{test.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{test.course}</Badge>
                  <Badge variant="outline">{test.type}</Badge>
                </div>
              </div>
            </div>
            <Badge className={`${statusConfig.color} flex items-center gap-1`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{test.questions}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{test.totalMarks}</p>
              <p className="text-xs text-muted-foreground">Total Marks</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{test.duration}</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{test.students}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{test.date}</span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{test.time}</span>
            </div>
            {test.status === "upcoming" && (
              <Button variant="accent" size="sm">
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            {test.status === "ongoing" && (
              <Button variant="success" size="sm">
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
            )}
            {test.status === "completed" && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Avg: {test.avgScore}%
                </span>
                <Button variant="outline" size="sm">
                  View Results
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tests</h1>
          <p className="text-muted-foreground mt-1">Manage and track all examinations</p>
        </div>
        <Button variant="accent">
          <Plus className="h-4 w-4 mr-2" />
          Create New Test
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="JEE Main">JEE Main</SelectItem>
                <SelectItem value="JEE Advanced">JEE Advanced</SelectItem>
                <SelectItem value="NEET">NEET</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tests Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="all">All Tests ({filteredTests.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingTests.length})</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing ({ongoingTests.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingTests.length > 0 ? (
            upcomingTests.map((test) => <TestCard key={test.id} test={test} />)
          ) : (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming tests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ongoing" className="space-y-4">
          {ongoingTests.length > 0 ? (
            ongoingTests.map((test) => <TestCard key={test.id} test={test} />)
          ) : (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No ongoing tests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTests.length > 0 ? (
            completedTests.map((test) => <TestCard key={test.id} test={test} />)
          ) : (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed tests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
