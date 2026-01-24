import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";

type UserRole = "admin" | "teacher" | "student";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  userName: string;
  onLogout: () => void;
}

export function DashboardLayout({ children, role, userName, onLogout }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar role={role} userName={userName} onLogout={onLogout} />
      <main className="flex-1 overflow-auto">
        <div className="container py-6 max-w-7xl mx-auto px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
