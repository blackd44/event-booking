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
import {
  Search,
  Calendar,
  MapPin,
  User,
  Mail,
  Download,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: string;
  user: {
    name: string;
    email: string;
  };
  event: {
    title: string;
    date: string;
    location: string;
    price: number;
  };
  status: "active" | "cancelled";
  bookedAt: string;
}

export default function AdminBookingsPage() {
  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      user: { name: "John Doe", email: "john@example.com" },
      event: {
        title: "Tech Conference 2024",
        date: "2024-06-15T09:00:00Z",
        location: "San Francisco Convention Center",
        price: 299,
      },
      status: "active",
      bookedAt: "2024-05-01T10:30:00Z",
    },
    {
      id: "2",
      user: { name: "Jane Smith", email: "jane@example.com" },
      event: {
        title: "Music Festival Summer 2024",
        date: "2024-07-20T18:00:00Z",
        location: "Central Park, New York",
        price: 89,
      },
      status: "active",
      bookedAt: "2024-05-02T14:15:00Z",
    },
    {
      id: "3",
      user: { name: "Mike Johnson", email: "mike@example.com" },
      event: {
        title: "Startup Pitch Competition",
        date: "2024-05-30T14:00:00Z",
        location: "Silicon Valley Innovation Hub",
        price: 50,
      },
      status: "cancelled",
      bookedAt: "2024-04-28T16:45:00Z",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.event.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings
    .filter((b) => b.status === "active")
    .reduce((sum, b) => sum + b.event.price, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Bookings Management
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage all event bookings
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-lg">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">
              {bookings.length}
            </div>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "active").length}
            </div>
            <p className="text-sm text-gray-600">Active Bookings</p>
          </CardContent>
        </Card>
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter((b) => b.status === "cancelled").length}
            </div>
            <p className="text-sm text-gray-600">Cancelled</p>
          </CardContent>
        </Card>
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary-600">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-elegant border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by user name, email, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Bookings ({filteredBookings.length})</span>
          </CardTitle>
          <CardDescription>Complete list of all event bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Event
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Booking Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.user.name}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {booking.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.event.title}
                        </p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(booking.event.date).toLocaleDateString()}
                          </p>
                          <p className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.event.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">
                        {new Date(booking.bookedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        ${booking.event.price}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          booking.status === "active" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {booking.status}
                      </Badge>
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
