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
  Building2,
  Users,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { mockBatches, mockCourses, mockTeachers } from "@/lib/mockData";
import { Batch } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function BatchesManagement() {
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBatches = batches.filter(
    (batch) =>
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteBatch = (batchId: string) => {
    setBatches(batches.filter((b) => b.id !== batchId));
    toast({
      title: "Batch Deleted",
      description: "The batch has been successfully deleted.",
    });
  };

  const getCourseInfo = (courseName: string) => {
    return mockCourses.find((c) => c.name === courseName);
  };

  const getTeacherInfo = (teacherId: string) => {
    return mockTeachers.find((t) => t.id === teacherId);
  };

  // Mock centers data
  const centers = [
    { id: "CTR001", name: "Main Campus", location: "Downtown", batches: 8, students: 450 },
    { id: "CTR002", name: "North Branch", location: "North District", batches: 6, students: 320 },
    { id: "CTR003", name: "East Center", location: "East Zone", batches: 5, students: 280 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Batches & Centers</h1>
          <p className="text-muted-foreground mt-1">Manage batches, schedules, and training centers</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Building2 className="h-4 w-4 mr-2" />
            Add Center
          </Button>
          <Button variant="accent">
            <Plus className="h-4 w-4 mr-2" />
            Create Batch
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
                <p className="text-3xl font-bold text-foreground mt-1">{batches.length}</p>
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
                <p className="text-sm text-muted-foreground">Training Centers</p>
                <p className="text-3xl font-bold text-foreground mt-1">{centers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Building2 className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-3xl font-bold text-foreground mt-1">1,050</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-success-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Students/Batch</p>
                <p className="text-3xl font-bold text-foreground mt-1">52</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Centers Section */}
      <Card className="shadow-premium">
        <CardHeader>
          <CardTitle>Training Centers</CardTitle>
          <CardDescription>Manage your physical training locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {centers.map((center) => (
              <div
                key={center.id}
                className="p-5 rounded-xl border-2 border-border hover:border-accent/30 bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-2">{center.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  {center.location}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {center.batches} Batches
                  </span>
                  <span className="font-medium text-foreground">
                    {center.students} Students
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card className="shadow-premium">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Batches</CardTitle>
              <CardDescription>View and manage all batches</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search batches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No batches found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBatches.map((batch) => {
                    const teacher = getTeacherInfo(batch.teacher);
                    return (
                      <TableRow key={batch.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{batch.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{batch.course}</Badge>
                        </TableCell>
                        <TableCell>{teacher?.name || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {batch.students.length}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {batch.schedule}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(batch.startDate).toLocaleDateString()}
                          </div>
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
                              onClick={() => handleDeleteBatch(batch.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
