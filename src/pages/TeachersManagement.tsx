import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react";
import { mockTeachers } from "@/lib/mockData";
import { Teacher } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function TeachersManagement() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const subjects = ["all", "Physics", "Chemistry", "Mathematics", "Biology"];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      subjectFilter === "all" || teacher.subject === subjectFilter;

    return matchesSearch && matchesSubject;
  });

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers(teachers.filter((t) => t.id !== teacherId));
    toast({
      title: "Teacher Removed",
      description: "The teacher has been successfully removed from the system.",
    });
  };

  const totalExperience = teachers.reduce((sum, t) => sum + t.experience, 0);
  const avgExperience = Math.round(totalExperience / teachers.length);
  const totalTests = teachers.reduce((sum, t) => sum + t.testsCreated, 0);
  const totalQuestions = teachers.reduce((sum, t) => sum + t.questionsCreated, 0);

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      Physics: "bg-primary text-primary-foreground",
      Chemistry: "bg-success text-success-foreground",
      Mathematics: "bg-accent text-accent-foreground",
      Biology: "bg-info text-white",
    };
    return colors[subject] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers Management</h1>
          <p className="text-muted-foreground mt-1">Manage faculty members and their assignments</p>
        </div>
        <Button variant="accent">
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Teachers</p>
                <p className="text-3xl font-bold text-foreground mt-1">{teachers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Experience</p>
                <p className="text-3xl font-bold text-foreground mt-1">{avgExperience} yrs</p>
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
                <p className="text-sm text-muted-foreground">Tests Created</p>
                <p className="text-3xl font-bold text-foreground mt-1">{totalTests}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                <FileText className="h-6 w-6 text-success-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-3xl font-bold text-foreground mt-1">{totalQuestions.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-foreground">
                      {teacher.avatar}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <Badge className={`mt-2 ${getSubjectColor(teacher.subject)}`}>
                      {teacher.subject}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {teacher.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {teacher.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4" />
                  {teacher.experience} years experience
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-foreground">{teacher.testsCreated}</p>
                  <p className="text-xs text-muted-foreground">Tests Created</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{teacher.questionsCreated}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteTeacher(teacher.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Table View */}
      <Card className="shadow-premium">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Teachers</CardTitle>
              <CardDescription>Detailed list of faculty members</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject === "all" ? "All Subjects" : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No teachers found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-foreground">
                              {teacher.avatar}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-muted-foreground">{teacher.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSubjectColor(teacher.subject)}>
                          {teacher.subject}
                        </Badge>
                      </TableCell>
                      <TableCell>{teacher.experience} years</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {teacher.testsCreated}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          {teacher.questionsCreated}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {teacher.email}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
