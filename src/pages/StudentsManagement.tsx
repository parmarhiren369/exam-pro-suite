import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Filter,
  Users,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";
import { Student } from "@/lib/types";
import { StudentDialog } from "@/components/dialogs/StudentDialog";
import { useToast } from "@/hooks/use-toast";

export default function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const { toast } = useToast();

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleAddStudent = () => {
    setEditingStudent(undefined);
    setDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setDialogOpen(true);
  };

  const handleSaveStudent = (studentData: Partial<Student>) => {
    if (editingStudent) {
      // Update existing student
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id ? { ...s, ...studentData } : s
        )
      );
      toast({
        title: "Student Updated",
        description: "Student information has been updated successfully.",
      });
    } else {
      // Add new student
      const newStudent: Student = {
        id: `S${(students.length + 1).toString().padStart(3, "0")}`,
        role: "student",
        joinDate: new Date().toISOString().split("T")[0],
        totalTests: 0,
        averageScore: 0,
        percentile: 0,
        avatar: studentData.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        ...(studentData as Omit<Student, "id" | "role" | "joinDate">),
      };
      setStudents([...students, newStudent]);
      toast({
        title: "Student Added",
        description: "New student has been added successfully.",
      });
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
    toast({
      title: "Student Deleted",
      description: "Student has been removed from the system.",
      variant: "destructive",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Student data is being exported to CSV...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Students Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student enrollment, details, and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="default"
            className="rounded-xl"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="accent"
            size="default"
            className="rounded-xl"
            onClick={handleAddStudent}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Courses</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <GraduationCap className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    students.reduce((acc, s) => acc + s.averageScore, 0) /
                      students.length
                  )}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            View and manage all enrolled students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {/* Note: In production, fetch courses from API */}
                <SelectItem value="JEE Main 2025">JEE Main 2025</SelectItem>
                <SelectItem value="JEE Advanced 2025">JEE Advanced 2025</SelectItem>
                <SelectItem value="NEET 2025">NEET 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">No students found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {student.avatar}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.rollNumber}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.course}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {student.batch}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {student.averageScore}
                        </span>
                      </TableCell>
                      <TableCell>{student.totalTests}</TableCell>
                      <TableCell>
                        {student.rank && (
                          <Badge
                            variant={student.rank === 1 ? "default" : "secondary"}
                          >
                            #{student.rank}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditStudent(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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

      <StudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={editingStudent}
        onSave={handleSaveStudent}
      />
    </div>
  );
}
