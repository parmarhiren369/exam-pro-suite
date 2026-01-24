import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  PenTool,
  Calendar,
  Building2,
  Trophy,
  Bell,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type UserRole = "admin" | "teacher" | "student";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ["admin", "teacher", "student"] },
  { icon: BookOpen, label: "Courses", path: "/courses", roles: ["admin", "teacher"] },
  { icon: Building2, label: "Batches & Centers", path: "/batches", roles: ["admin"] },
  { icon: Users, label: "Teachers", path: "/teachers", roles: ["admin"] },
  { icon: GraduationCap, label: "Students", path: "/students", roles: ["admin", "teacher"] },
  { icon: PenTool, label: "Questions", path: "/questions", roles: ["teacher"] },
  { icon: FileText, label: "Tests", path: "/tests", roles: ["admin", "teacher", "student"] },
  { icon: Calendar, label: "Schedule", path: "/schedule", roles: ["admin", "teacher", "student"] },
  { icon: ClipboardList, label: "Results", path: "/results", roles: ["teacher", "student"] },
  { icon: Trophy, label: "Leaderboard", path: "/leaderboard", roles: ["student"] },
  { icon: BarChart3, label: "Analytics", path: "/analytics", roles: ["admin", "teacher", "student"] },
];

const bottomNavItems: NavItem[] = [
  { icon: Bell, label: "Notifications", path: "/notifications", roles: ["admin", "teacher", "student"] },
  { icon: Settings, label: "Settings", path: "/settings", roles: ["admin", "teacher", "student"] },
];

interface DashboardSidebarProps {
  role: UserRole;
  userName: string;
  onLogout: () => void;
}

export function DashboardSidebar({ role, userName, onLogout }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));
  const filteredBottomItems = bottomNavItems.filter((item) => item.roles.includes(role));

  const roleLabels: Record<UserRole, string> = {
    admin: "Administrator",
    teacher: "Faculty",
    student: "Student",
  };

  const roleColors: Record<UserRole, string> = {
    admin: "from-primary to-primary/70",
    teacher: "from-success to-success/70",
    student: "from-accent to-orange-400",
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 sticky top-0 border-r border-sidebar-border/50",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border/50">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent/50 shrink-0 transition-transform group-hover:scale-105">
            <span className="text-xl font-bold text-accent-foreground">H</span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold text-sidebar-foreground">Hiren's</h1>
              <p className="text-xs text-sidebar-foreground/50 font-medium">Evaluator Pro</p>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground h-9 w-9"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-sidebar-border/50 animate-fade-in">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/50 backdrop-blur-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center shadow-lg`}>
              <span className="text-sm font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-sidebar-foreground">{userName}</p>
              <p className="text-xs text-sidebar-foreground/50 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" />
                {roleLabels[role]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredNavItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "sidebar-item-active text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              )}
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-200",
                isActive && "scale-110",
                !isActive && "group-hover:scale-105"
              )} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 border-t border-sidebar-border/50">
        {filteredBottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "sidebar-item-active text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive w-full group"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
