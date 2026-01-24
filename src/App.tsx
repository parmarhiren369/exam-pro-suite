import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Tests from "./pages/Tests";
import Analytics from "./pages/Analytics";
import StudentsManagement from "./pages/StudentsManagement";
import TestsManagement from "./pages/TestsManagement";
import CoursesManagement from "./pages/CoursesManagement";
import BatchesManagement from "./pages/BatchesManagement";
import TeachersManagement from "./pages/TeachersManagement";
import ScheduleManagement from "./pages/ScheduleManagement";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import TakeTest from "./pages/TakeTest";
import TestSubmissions from "./pages/TestSubmissions";
import NotFound from "./pages/NotFound";

type UserRole = "admin" | "teacher" | "student";

interface User {
  role: UserRole;
  name: string;
  email: string;
}

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: UserRole, name: string) => {
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    setUser({ role, name, email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const getDashboardComponent = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Login Route */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <SignUp onSignUp={handleLogin} />
                )
              }
            />

            {/* Protected Routes */}
            {user ? (
              <>
                <Route
                  path="/dashboard"
                  element={
                    <DashboardLayout
                      role={user.role}
                      userName={user.name}
                      onLogout={handleLogout}
                    >
                      {getDashboardComponent()}
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/tests"
                  element={
                      <DashboardLayout
                        role={user.role}
                        userName={user.name}
                        onLogout={handleLogout}
                      >
                        <Tests userRole={user.role} />
                      </DashboardLayout>

                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <DashboardLayout
                      role={user.role}
                      userName={user.name}
                      onLogout={handleLogout}
                    >
                      <Analytics />
                    </DashboardLayout>
                  }
                />
                {/* Management Routes - role-based */}
                {user.role === "admin" && (
                  <>
                    <Route
                      path="/students"
                      element={
                        <DashboardLayout
                          role={user.role}
                          userName={user.name}
                          onLogout={handleLogout}
                        >
                          <StudentsManagement />
                        </DashboardLayout>
                      }
                    />
                    <Route
                      path="/courses"
                      element={
                        <DashboardLayout
                          role={user.role}
                          userName={user.name}
                          onLogout={handleLogout}
                        >
                          <CoursesManagement />
                        </DashboardLayout>
                      }
                    />
                    <Route
                      path="/tests-management"
                      element={
                        <DashboardLayout
                          role={user.role}
                          userName={user.name}
                          onLogout={handleLogout}
                        >
                          <TestsManagement />
                        </DashboardLayout>
                      }
                    />
                  </>
                )}
                {(user.role === "admin" || user.role === "teacher") && (
                  <Route
                    path="/tests-management"
                    element={
                      <DashboardLayout
                        role={user.role}
                        userName={user.name}
                        onLogout={handleLogout}
                      >
                        <TestsManagement />
                      </DashboardLayout>
                    }
                  />
                )}
                {/* Admin-only routes */}
                {user.role === "admin" && (
                  <>
                    <Route
                      path="/batches"
                      element={
                        <DashboardLayout
                          role={user.role}
                          userName={user.name}
                          onLogout={handleLogout}
                        >
                          <BatchesManagement />
                        </DashboardLayout>
                      }
                    />
                    <Route
                      path="/teachers"
                      element={
                        <DashboardLayout
                          role={user.role}
                          userName={user.name}
                          onLogout={handleLogout}
                        >
                          <TeachersManagement />
                        </DashboardLayout>
                      }
                    />
                  </>
                )}
                {/* Schedule route - available for admin and teacher */}
                {(user.role === "admin" || user.role === "teacher") && (
                  <Route
                    path="/schedule"
                    element={
                      <DashboardLayout
                        role={user.role}
                        userName={user.name}
                        onLogout={handleLogout}
                      >
                        <ScheduleManagement />
                      </DashboardLayout>
                    }
                  />
                )}
                {/* Test Submissions - available for admin and teacher */}
                {(user.role === "admin" || user.role === "teacher") && (
                  <Route
                    path="/test-submissions/:testId"
                    element={
                      <DashboardLayout
                        role={user.role}
                        userName={user.name}
                        onLogout={handleLogout}
                      >
                        <TestSubmissions />
                      </DashboardLayout>
                    }
                  />
                )}
                {/* Take Test - available for students */}
                {user.role === "student" && (
                  <Route
                    path="/take-test/:testId"
                    element={
                      <DashboardLayout
                        role={user.role}
                        userName={user.name}
                        onLogout={handleLogout}
                      >
                        <TakeTest />
                      </DashboardLayout>
                    }
                  />
                )}
                {/* Notifications and Settings - available for all roles */}
                <Route
                  path="/notifications"
                  element={
                    <DashboardLayout
                      role={user.role}
                      userName={user.name}
                      onLogout={handleLogout}
                    >
                      <Notifications userRole={user.role} />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <DashboardLayout
                      role={user.role}
                      userName={user.name}
                      onLogout={handleLogout}
                    >
                      <Settings userRole={user.role} userName={user.name} userEmail={user.email} />
                    </DashboardLayout>
                  }
                />
                {/* Placeholder routes - redirect to dashboard */}
                <Route path="/questions" element={<Navigate to="/dashboard" replace />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
