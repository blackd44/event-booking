import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useEvents } from "@/services/events";
import { useEffect } from "react";

export default function EventsPage() {
  const { toast } = useToast();
  const { data, isLoading, error } = useEvents();

  useEffect(() => {
    if (error)
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
  }, [error, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-gray-600">
          Discover and book tickets for amazing events
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full size-32 border-b-2 border-primary" />
        </div>
      ) : data?.results?.length == 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No events available
          </h3>
          <p className="text-gray-500">Check back later for new events!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.results?.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  {event.bookedCount >= event.capacity && (
                    <Badge variant="destructive">Sold Out</Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.bookedCount} / {event.capacity} booked
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />${event.price}
                </div>
                <Button asChild className="w-full">
                  <Link to={`/events/${event.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
