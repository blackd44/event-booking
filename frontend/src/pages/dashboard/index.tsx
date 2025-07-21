import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Ticket, TrendingUp } from "lucide-react";
import { useBookingsAll } from "@/services/booking";
import { Link } from "react-router-dom";

export default function CustomerDashboardPage() {
  const { data: bookings, isLoading: loading } = useBookingsAll({
    show_stats: true,
  });

  // Computed values using useMemo for performance optimization
  const { activeBookings, upComming, totalSpent } = useMemo(() => {
    const active = bookings?.stats?.confirmed || 0;
    const spent = bookings?.stats?.revenue || 0;
    const upComming = bookings?.stats?.upComming || 0;

    return { activeBookings: active, totalSpent: spent, upComming };
  }, [bookings]);

  // Error handling
  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="text-center">
  //         <p className="text-red-600 mb-4">
  //           Failed to load your dashboard data
  //         </p>
  //         <Button onClick={() => window.location.reload()}>Try Again</Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          My Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's your event activity overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bookings
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg">
              <Ticket className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : bookings?.total}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Comfirmed Bookings
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : activeBookings}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Current events
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Upcoming Events
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : upComming}
            </div>
            <p className="text-xs text-blue-600 mt-1">Events to attend</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Spent
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : `$${totalSpent}`}
            </div>
            <p className="text-xs text-gray-500 mt-1">On event tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Bookings</span>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/bookings">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>Your latest event bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : bookings?.total === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No bookings yet</p>
                <Button asChild>
                  <Link to="/events">Browse Events</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings?.results?.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {booking.event.title}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(booking.event.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          booking.status === "active" ? "default" : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-medium text-primary-600 mt-1">
                        ${booking.event.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Events</span>
              <Button variant="outline" size="sm" asChild>
                <Link to="/events">Browse More</Link>
              </Button>
            </CardTitle>
            <CardDescription>Events you're attending soon</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            )  : (
              <div className="space-y-4">
                {upcomingEvents.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 bg-gradient-to-r from-primary-50 to-cyan-50 rounded-lg border border-primary-100"
                  >
                    <p className="font-medium text-gray-900">
                      {booking.event.title}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
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
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {booking.event.location}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
