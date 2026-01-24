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
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { mockTests, mockBatches } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function ScheduleManagement() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  // Mock schedule events
  const scheduleEvents = [
    {
      id: "E001",
      title: "JEE Main Mock Test 15",
      type: "test",
      batch: "JEE Main 2025 - Batch A",
      date: "2026-01-24",
      startTime: "09:00",
      endTime: "12:00",
      location: "Main Campus",
      students: 45,
      status: "scheduled",
    },
    {
      id: "E002",
      title: "Physics Lecture - Mechanics",
      type: "class",
      batch: "JEE Advanced 2025 - Batch A",
      date: "2026-01-24",
      startTime: "14:00",
      endTime: "16:00",
      location: "Room 101",
      students: 32,
      status: "ongoing",
    },
    {
      id: "E003",
      title: "Chemistry Chapter Test",
      type: "test",
      batch: "NEET 2025 - Batch A",
      date: "2026-01-25",
      startTime: "10:00",
      endTime: "11:30",
      location: "Main Campus",
      students: 38,
      status: "scheduled",
    },
    {
      id: "E004",
      title: "Mathematics Practice Session",
      type: "class",
      batch: "JEE Main 2025 - Batch B",
      date: "2026-01-25",
      startTime: "15:00",
      endTime: "17:00",
      location: "Room 203",
      students: 28,
      status: "scheduled",
    },
    {
      id: "E005",
      title: "Full Syllabus Test",
      type: "test",
      batch: "JEE Main 2025 - Batch A",
      date: "2026-01-26",
      startTime: "09:00",
      endTime: "12:00",
      location: "Main Campus",
      students: 45,
      status: "scheduled",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-primary/10 text-primary border-primary/20",
      ongoing: "bg-success/10 text-success border-success/20",
      completed: "bg-muted text-muted-foreground border-muted",
      cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      test: "bg-accent text-accent-foreground",
      class: "bg-info text-white",
      meeting: "bg-warning text-warning-foreground",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  const handleDeleteEvent = (eventId: string) => {
    toast({
      title: "Event Cancelled",
      description: "The scheduled event has been cancelled successfully.",
    });
  };

  // Get current week dates
  const getCurrentWeek = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getCurrentWeek();
  const today = new Date().toDateString();

  const getEventsForDay = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return scheduleEvents.filter((event) => event.date === dateString);
  };

  const upcomingEvents = scheduleEvents
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule Management</h1>
          <p className="text-muted-foreground mt-1">Manage tests, classes, and events calendar</p>
        </div>
        <Button variant="accent">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Events</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {getEventsForDay(new Date()).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold text-foreground mt-1">{scheduleEvents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Tests</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {scheduleEvents.filter((e) => e.type === "test").length}
                </p>
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
                <p className="text-sm text-muted-foreground">Active Batches</p>
                <p className="text-3xl font-bold text-foreground mt-1">{mockBatches.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2 shadow-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(newDate.getDate() - 7);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-4">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(newDate.getDate() + 7);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => {
                const isToday = day.toDateString() === today;
                const events = getEventsForDay(day);
                return (
                  <div key={index} className="space-y-2">
                    <div
                      className={`p-3 rounded-lg text-center ${
                        isToday
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <p className="text-xs font-medium">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-lg font-bold mt-1">{day.getDate()}</p>
                    </div>
                    <div className="space-y-1">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded text-xs ${getTypeColor(event.type)} cursor-pointer hover:opacity-80 transition-opacity`}
                          title={`${event.title} - ${event.startTime}`}
                        >
                          <p className="font-medium truncate">{event.startTime}</p>
                          <p className="truncate opacity-90">{event.title.substring(0, 15)}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next scheduled activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl border-2 border-border hover:border-accent/30 bg-card transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                  <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{event.title}</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {event.students} students
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* All Events List */}
      <Card className="shadow-premium">
        <CardHeader>
          <CardTitle>All Scheduled Events</CardTitle>
          <CardDescription>Complete list of scheduled activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduleEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl border border-border hover:border-accent/30 bg-card hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                      <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.students} students
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{event.batch}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
