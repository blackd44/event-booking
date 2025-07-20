"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  Ticket,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats] = useState({
    totalEvents: 12,
    totalUsers: 1250,
    totalBookings: 3420,
    totalRevenue: 125000,
    activeEvents: 8,
    pendingBookings: 45,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your events.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Events
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalEvents}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +180 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bookings
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg">
              <Ticket className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalBookings.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Events
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.activeEvents}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Bookings
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.pendingBookings}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Events
            </CardTitle>
            <CardDescription>Your latest created events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: "Tech Conference 2024",
                date: "Jun 15, 2024",
                bookings: 150,
              },
              { name: "Music Festival", date: "Jul 20, 2024", bookings: 1200 },
              { name: "Startup Pitch", date: "May 30, 2024", bookings: 280 },
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{event.name}</p>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary-600">
                    {event.bookings}
                  </p>
                  <p className="text-xs text-gray-500">bookings</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Bookings
            </CardTitle>
            <CardDescription>Latest ticket purchases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                user: "John Doe",
                event: "Tech Conference 2024",
                amount: "$299",
              },
              { user: "Jane Smith", event: "Music Festival", amount: "$89" },
              { user: "Mike Johnson", event: "Startup Pitch", amount: "$50" },
            ].map((booking, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{booking.user}</p>
                  <p className="text-sm text-gray-500">{booking.event}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{booking.amount}</p>
                  <p className="text-xs text-gray-500">paid</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
