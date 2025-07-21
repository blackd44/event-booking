import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Ticket,
  MapPin,
  Edit,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "react-router-dom";

interface UserBooking {
  id: string;
  event: {
    title: string;
    date: string;
    location: string;
    price: number;
  };
  status: "active" | "cancelled";
  bookedAt: string;
}

export default function AdminUserProfilePage() {
  const navigate = useNavigate();
  const [bookings] = useState<UserBooking[]>([]);

  const { user } = useAuth()

  // const toggleUserStatus = async () => {
  //   if (!user) return;

  //   try {
  //     // Mock API call
  //     const newStatus = user.status === "active" ? "inactive" : "active";
  //     setUser({ ...user, status: newStatus });

  //     toast({
  //       title: "Success",
  //       description: `User ${
  //         newStatus === "active" ? "activated" : "deactivated"
  //       } successfully`,
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update user status",
  //       variant: "destructive",
  //     });
  //   }
  // };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          User not found
        </h3>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              User Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Manage user information and activity
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
          <Button
            variant={user.status === "active" ? "destructive" : "default"}
            // onClick={toggleUserStatus}
          >
            {user.status === "active" ? (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <Card className="shadow-elegant border-0">
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <User className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-600 mb-4 flex items-center justify-center">
              <Mail className="h-4 w-4 mr-2" />
              {user.email}
            </p>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-primary-50 to-cyan-50 rounded-lg p-4 border border-primary-100">
                <p className="text-sm font-medium text-primary-800 mb-1">
                  Account Type
                </p>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {user.role}
                </Badge>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-800 mb-1">Status</p>
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Details */}
        <Card className="lg:col-span-2 shadow-elegant border-0">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Detailed user account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Last Login</p>
                <div className="flex items-center text-gray-900">
                  <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                  {new Date(user.lastLogin).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div> */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <div className="text-2xl font-bold text-primary-600">
                  0
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <div className="text-2xl font-bold text-green-600">
                  $0
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Bookings */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Ticket className="h-5 w-5 mr-2 text-primary-600" />
                User Bookings ({bookings.length})
              </CardTitle>
              <CardDescription>All bookings made by this user</CardDescription>
            </div>
            {bookings.length > 0 && (
              <Button variant="outline" asChild>
                <Link to={`/admin/users/${user.id}/bookings`}>
                  View All Bookings
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bookings found for this user</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {booking.event.title}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(booking.event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.event.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        booking.status === "active" ? "default" : "secondary"
                      }
                      className="mb-2"
                    >
                      {booking.status}
                    </Badge>
                    <p className="text-sm font-medium text-primary-600">
                      ${booking.event.price}
                    </p>
                  </div>
                </div>
              ))}
              {bookings.length > 3 && (
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link to={`/admin/users/${user.id}/bookings`}>
                      View All {bookings.length} Bookings
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
