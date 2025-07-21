import { useState, useMemo } from "react";
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
  Calendar,
  MapPin,
  Ticket,
  X,
  Search,
  Filter,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useBookings, useCancelBooking } from "@/services/booking";
import { Link } from "react-router-dom";

export default function CustomerBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  // React Query hooks
  const { data: bookings = [], isLoading: loading, error } = useBookings();
  const cancelBookingMutation = useCancelBooking();

  // Memoized computed values
  const { filteredBookings, activeBookings, upcomingEvents, totalSpent } =
    useMemo(() => {
      const active = bookings.filter((b) => b.status === "active");
      const upcoming = active.filter(
        (b) => new Date(b.event.date) > new Date()
      );
      const spent = active.reduce((sum, b) => sum + b.event.price, 0);

      const filtered = bookings.filter((booking) => {
        const matchesSearch =
          booking.event.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.event.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
      });

      return {
        filteredBookings: filtered,
        activeBookings: active,
        upcomingEvents: upcoming,
        totalSpent: spent,
      };
    }, [bookings, searchTerm, statusFilter]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBookingMutation.mutateAsync(bookingId);
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          (error as { message: string })?.message || "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load bookings
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error loading your bookings data.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your event tickets and bookings
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-lg"
        >
          <Link to="/events">Browse Events</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : bookings.length}
            </div>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : activeBookings.length}
            </div>
            <p className="text-sm text-gray-600">Active Bookings</p>
          </CardContent>
        </Card>
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {loading ? "..." : upcomingEvents.length}
            </div>
            <p className="text-sm text-gray-600">Upcoming Events</p>
          </CardContent>
        </Card>
        <Card className="shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary-600">
              {loading ? "..." : `$${totalSpent}`}
            </div>
            <p className="text-sm text-gray-600">Total Spent</p>
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
                placeholder="Search by event name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              disabled={loading}
            >
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

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
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
                : "Start exploring events and book your first ticket!"}
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-primary-500 to-primary-700"
            >
              <Link to="/events">Browse Events</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {booking.event.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Booked on{" "}
                      {new Date(booking.bookedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        booking.status === "active" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {booking.status}
                    </Badge>
                    {booking.status === "active" &&
                      new Date(booking.event.date) > new Date() && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancelBookingMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          {cancelBookingMutation.isPending
                            ? "Cancelling..."
                            : "Cancel"}
                        </Button>
                      )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                    <div>
                      <p className="font-medium text-sm">Date & Time</p>
                      <p className="text-sm">
                        {new Date(booking.event.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                    <div>
                      <p className="font-medium text-sm">Location</p>
                      <p className="text-sm">{booking.event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Ticket className="h-4 w-4 mr-2 text-primary-500" />
                    <div>
                      <p className="font-medium text-sm">Ticket Price</p>
                      <p className="text-sm font-semibold text-primary-600">
                        ${booking.event.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button variant="outline" asChild>
                      <Link to={`/events/${booking.event.id}`}>
                        View Event
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
