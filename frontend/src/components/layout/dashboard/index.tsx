import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import type { ERole } from "@/types/enums";

interface DashboardLayoutProps {
  requiredRoles?: ERole[];
}

export default function DashboardLayout({
  requiredRoles = ["customer"],
}: DashboardLayoutProps) {
  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <DashboardSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
