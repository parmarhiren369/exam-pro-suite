import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Test, TestStatus } from "@/lib/types";
import { getTests } from "@/lib/firestore";

export default function Tests({ userRole }: { userRole?: string }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const fetchedTests = await getTests() as Test[];
      setTests(fetchedTests);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: TestStatus) => {
    switch (status) {
      case "scheduled":
        return { color: "bg-info/10 text-info border-info/20", icon: Clock, label: "Upcoming" };
      case "ongoing":
        return { color: "bg-success/10 text-success border-success/20", icon: Play, label: "Live" };
      case "completed":
        return { color: "bg-muted text-muted-foreground border-muted", icon: CheckCircle2, label: "Completed" };
      default:
        return { color: "", icon: AlertCircle, label: status };
    }
  };

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "all" || test.course.includes(courseFilter);
    return matchesSearch && matchesCourse;
  });

  const upcomingTests = filteredTests.filter((t) => t.status === "scheduled");
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
            <Badge className={`${statusConfig.color} flex items-center gap-1 uppercase text-[10px]`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{test.questions.length}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{test.totalMarks}</p>
              <p className="text-xs text-muted-foreground">Total Marks</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{test.duration} min</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{test.attemptedBy.length}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(test.scheduledDate).toLocaleDateString()}</span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{test.startTime}</span>
            </div>
            {test.status === "scheduled" && (
              <Button 
                variant="accent" 
                size="sm"
                onClick={() => navigate(`/take-test/${test.id}`)}
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            {test.status === "ongoing" && (
              <Button 
                variant="success" 
                size="sm"
                onClick={() => navigate(`/take-test/${test.id}`)}
              >
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
            )}
            {test.status === "completed" && (
              <div className="flex items-center gap-2">
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
        {(userRole === "admin" || userRole === "teacher") && (
          <Button variant="accent" onClick={() => navigate("/tests-management")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Test
          </Button>
        )}
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
