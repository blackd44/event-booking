import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, User, LogOut, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            EventBook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/events"
            className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
          >
            Events
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          {user && (
            <Link
              to={user.role === "admin" ? "/admin" : "/dashboard"}
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-primary-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-elegant">
                <DropdownMenuItem asChild>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-3 text-primary-600" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild className="hover:bg-primary-50">
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/events"
              className="block text-gray-600 hover:text-primary-600 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            {user && (
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="block text-gray-600 hover:text-primary-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center space-x-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="w-full justify-start text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-700"
                >
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
