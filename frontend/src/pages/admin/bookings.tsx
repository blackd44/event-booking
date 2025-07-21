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
  Ticket,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingsAll } from "@/services/booking";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { BookingStatus, type EBookingStatus } from "@/types/enums";

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EBookingStatus | "all">(
    "all"
  );

  const debuncedQ = useDebouncedValue(searchTerm, 400);

  const { data } = useBookingsAll({
    q: debuncedQ,
    show_stats: true,
    status: statusFilter == "all" ? undefined : statusFilter,
  });

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
              {data?.total || 0}
            </div>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {data?.stats?.confirmed || 0}
            </div>
            <p className="text-sm text-gray-600">Active Bookings</p>
          </CardContent>
        </Card>
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">
              {data?.stats?.cancelled || 0}
            </div>
            <p className="text-sm text-gray-600">Cancelled</p>
          </CardContent>
        </Card>
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary-600">
              ${(data?.stats?.revenue || 0).toLocaleString()}
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
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as EBookingStatus)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"all"}>All Status</SelectItem>
                {Object.values(BookingStatus).map((status) => (
                  <SelectItem value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Bookings ({data?.total})</span>
          </CardTitle>
          <CardDescription>Complete list of all event bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.total === 0 ? (
            <Card className="shadow-elegant border-0">
              <CardContent className="text-center py-12">
                <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm || statusFilter !== "all"
                    ? "No bookings found"
                    : "No bookings yet"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start managing bookings and events as an administrator!"}
                </p>
              </CardContent>
            </Card>
          ) : (
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
                  {data?.results?.map((booking) => (
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
                              {booking?.user?.firstName}{" "}
                              {booking?.user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {booking?.user?.email}
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
                              {new Date(
                                booking.event.date
                              ).toLocaleDateString()}
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
                            booking.status === "active"
                              ? "default"
                              : "secondary"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
