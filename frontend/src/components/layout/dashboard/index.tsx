import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./sidebar";

export default function DashboardLayout() {
  return (
    // <ProtectedRoute requiredRoles=["customer"]>
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
    // </ProtectedRoute>
  );
}
