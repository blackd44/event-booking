import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Mail, Calendar, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import type { ERole } from "@/types/enums";

interface User {
  id: string;
  name: string;
  email: string;
  role: ERole;
  joinDate: string;
  totalBookings: number;
  status: "active" | "inactive";
}

export default function AdminUsersPage() {
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      joinDate: "2024-01-15",
      totalBookings: 0,
      status: "active",
    },
    {
      id: "2",
      name: "Customer User",
      email: "customer@example.com",
      role: "customer",
      joinDate: "2024-02-20",
      totalBookings: 5,
      status: "active",
    },
    {
      id: "3",
      name: "John Doe",
      email: "john@example.com",
      role: "customer",
      joinDate: "2024-03-10",
      totalBookings: 12,
      status: "active",
    },
    {
      id: "4",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "customer",
      joinDate: "2024-03-15",
      totalBookings: 8,
      status: "inactive",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Users Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all users and their permissions
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-lg">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-elegant border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Users ({filteredUsers.length})</span>
          </CardTitle>
          <CardDescription>
            Complete list of all registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Join Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Bookings
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="text-sm text-primary-600 hover:text-primary-700 hover:underline flex items-center transition-colors"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {user.totalBookings}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            {user.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
