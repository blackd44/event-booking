import { Calendar, Users, Ticket, LogOut, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router-dom";

export function DashboardSidebar() {
  const { user, logout } = useAuth();

  const adminNavItems = [
    { href: "/admin", icon: Home, label: "Overview", end: true },
    { href: "/admin/events", icon: Calendar, label: "Events" },
    { href: "/admin/bookings", icon: Ticket, label: "Bookings" },
    { href: "/admin/users", icon: Users, label: "Users" },
  ];

  const customerNavItems = [
    { href: "/dashboard", icon: Home, label: "Overview", end: true },
    { href: "/dashboard/bookings", icon: Ticket, label: "My Bookings" },
    // { href: "/dashboard/profile", icon: User, label: "Profile" },
    // { href: "/dashboard/payments", icon: CreditCard, label: "Payments" },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : customerNavItems;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            EventBook
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.firstName}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          return (
            <NavLink
              end={item?.end}
              key={item?.href}
              to={item?.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-primary-600"
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Settings & Logout */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start px-4 py-3 h-auto text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}
