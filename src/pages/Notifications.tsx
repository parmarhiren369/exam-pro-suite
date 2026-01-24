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
  Bell,
  Check,
  Trash2,
  Eye,
  Calendar,
  FileText,
  Award,
  AlertCircle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import { Notification } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface NotificationsProps {
  userRole: "admin" | "teacher" | "student";
  userId?: string;
}

export default function Notifications({ userRole, userId = "S001" }: NotificationsProps) {
  const { toast } = useToast();
  
  // Generate role-specific notifications
  const getRoleNotifications = (): Notification[] => {
    const baseNotifications: Notification[] = [];
    
    if (userRole === "admin") {
      return [
        {
          id: "AN001",
          title: "New Student Enrollment",
          message: "25 new students have been enrolled in JEE Main 2025 batch",
          type: "success",
          timestamp: "2026-01-24T09:15:00",
          read: false,
          userId: "admin",
          actionUrl: "/students",
        },
        {
          id: "AN002",
          title: "Low Batch Capacity",
          message: "JEE Advanced Batch B is running at 95% capacity. Consider creating a new batch.",
          type: "warning",
          timestamp: "2026-01-24T08:30:00",
          read: false,
          userId: "admin",
          actionUrl: "/batches",
        },
        {
          id: "AN003",
          title: "Teacher Leave Request",
          message: "Dr. Rajesh Verma has requested leave for next week",
          type: "info",
          timestamp: "2026-01-23T16:45:00",
          read: false,
          userId: "admin",
          actionUrl: "/teachers",
        },
        {
          id: "AN004",
          title: "System Update Available",
          message: "A new system update is available. Please schedule maintenance.",
          type: "info",
          timestamp: "2026-01-23T14:00:00",
          read: true,
          userId: "admin",
        },
        {
          id: "AN005",
          title: "Monthly Report Generated",
          message: "December 2025 performance report is ready for review",
          type: "success",
          timestamp: "2026-01-22T10:00:00",
          read: true,
          userId: "admin",
          actionUrl: "/analytics",
        },
      ];
    } else if (userRole === "teacher") {
      return [
        {
          id: "TN001",
          title: "Test Results Pending",
          message: "15 test submissions are pending evaluation for Chemistry Chapter Test",
          type: "warning",
          timestamp: "2026-01-24T11:00:00",
          read: false,
          userId: "teacher",
          actionUrl: "/tests-management",
        },
        {
          id: "TN002",
          title: "Question Bank Updated",
          message: "10 new questions have been added to Physics - Mechanics section",
          type: "success",
          timestamp: "2026-01-24T09:30:00",
          read: false,
          userId: "teacher",
          actionUrl: "/questions",
        },
        {
          id: "TN003",
          title: "Class Schedule Changed",
          message: "Your Physics class on Monday has been rescheduled to 2:00 PM",
          type: "info",
          timestamp: "2026-01-23T17:00:00",
          read: false,
          userId: "teacher",
          actionUrl: "/schedule",
        },
        {
          id: "TN004",
          title: "Student Query",
          message: "Rahul Sharma has posted a doubt in Thermodynamics topic",
          type: "info",
          timestamp: "2026-01-23T15:30:00",
          read: true,
          userId: "teacher",
        },
      ];
    } else {
      return [
        {
          id: "N001",
          title: "New Test Scheduled",
          message: "JEE Main Mock Test 16 has been scheduled for tomorrow at 9:00 AM",
          type: "info",
          timestamp: "2026-01-24T10:30:00",
          read: false,
          userId: "S001",
          actionUrl: "/tests",
        },
        {
          id: "N002",
          title: "Result Published",
          message: "Your result for NEET Full Syllabus Test is now available",
          type: "success",
          timestamp: "2026-01-23T15:00:00",
          read: false,
          userId: "S001",
          actionUrl: "/analytics",
        },
        {
          id: "N003",
          title: "Study Material Updated",
          message: "New practice questions added for Organic Chemistry",
          type: "info",
          timestamp: "2026-01-23T12:00:00",
          read: false,
          userId: "S001",
        },
        {
          id: "N004",
          title: "Achievement Unlocked!",
          message: "Congratulations! You've maintained a 7-day study streak",
          type: "success",
          timestamp: "2026-01-22T18:00:00",
          read: true,
          userId: "S001",
        },
        {
          id: "N005",
          title: "Assignment Due Soon",
          message: "Physics assignment is due in 2 days",
          type: "warning",
          timestamp: "2026-01-22T10:00:00",
          read: true,
          userId: "S001",
        },
      ];
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>(getRoleNotifications());
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications marked as read.`,
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    toast({
      title: "Notification deleted",
      description: "Notification has been removed.",
    });
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      description: "All notifications have been removed.",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "error":
        return <X className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with important alerts and messages
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteAll}
            disabled={notifications.length === 0}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {notifications.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Bell className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-3xl font-bold text-foreground mt-1">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Eye className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {
                    notifications.filter(
                      (n) =>
                        new Date(n.timestamp).toDateString() === new Date().toDateString()
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                <Calendar className="h-6 w-6 text-success-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <Card className="shadow-premium">
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>Recent updates and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">No notifications to display</p>
              <p className="text-sm text-muted-foreground mt-2">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "You'll see notifications here as they arrive"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    notification.read
                      ? "border-border bg-muted/30"
                      : "border-accent/30 bg-accent/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Badge variant="default" className="ml-2 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {getTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        {notification.actionUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={notification.actionUrl}>
                              View Details
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          className="text-destructive hover:text-destructive ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
