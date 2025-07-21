import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useEvent } from "@/services/events";
import { useCreateBooking } from "@/services/booking";
import { useEffect, useMemo } from "react";

export default function EventDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const eventId = params?.id as string;

  // Queries and mutations
  const { data: event, isLoading, isError } = useEvent(eventId);
  const createBookingMutation = useCreateBooking();

  useEffect(() => {
    // Handle error state
    if (isError) {
      toast({
        title: "Error",
        description: "Event not found",
        variant: "destructive",
      });
      navigate("/events");
    }
  }, [isError, navigate, toast]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!event) return;

    createBookingMutation.mutate({ eventId: event.id });
  };

  const bookedCount = useMemo(
    () => (Number(event?.capacity) || 0) - (Number(event?.availableSpots) || 0),
    [event?.availableSpots, event?.capacity]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isEventFull = bookedCount >= event.capacity;
  const isEventPast = new Date(event.date) < new Date();
  const isBookingDisabled =
    createBookingMutation.isPending ||
    isEventFull ||
    isEventPast ||
    user?.role === "admin";

  const getButtonText = () => {
    if (createBookingMutation.isPending) return "Booking...";
    if (isEventPast) return "Event Ended";
    if (isEventFull) return "Sold Out";
    if (user?.role === "admin") return "Admin Account";
    if (!user) return "Login to Book";
    return "Book Ticket";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl">{event.title}</CardTitle>
                {isEventFull && <Badge variant="destructive">Sold Out</Badge>}
                {isEventPast && <Badge variant="secondary">Past Event</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About this event</h3>
                <p className="text-gray-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book Your Ticket</CardTitle>
              <CardDescription>
                Secure your spot at this amazing event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-2xl font-bold">
                <span>Price:</span>
                <span>${event.price}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>
                  {bookedCount} / {event.capacity} tickets booked
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${(bookedCount / event.capacity) * 100}%`,
                  }}
                ></div>
              </div>

              <Button
                className="w-full"
                onClick={handleBooking}
                disabled={isBookingDisabled}
              >
                {getButtonText()}
              </Button>

              {!user && (
                <p className="text-sm text-gray-500 text-center">
                  You need to login to book tickets
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
