import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Plus,
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  MoreHorizontal,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDeleteEvent, useEvents, type IEvent } from "@/services/events";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedQ = useDebouncedValue(searchTerm, 400);
  const { toast } = useToast();

  const { data: events, isLoading, error } = useEvents({ q: debouncedQ });
  const deleteEventMutation = useDeleteEvent();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<IEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (event: IEvent) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    setDeleting(true);
    try {
      await deleteEventMutation?.mutateAsync(eventToDelete?.id);
      setDeleteDialogOpen(false);
    } catch {
      //  error
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Events Management
          </h1>
          <p className="text-gray-600 mt-2">Create and manage your events</p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-lg"
        >
          <Link to="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-elegant border-0">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      ) : events?.total === 0 ? (
        <Card className="shadow-elegant border-0">
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create your first event to get started!"}
            </p>
            {!searchTerm && (
              <Button
                asChild
                className="bg-gradient-to-r from-primary-500 to-primary-700"
              >
                <Link to="/admin/events/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.results?.map((event) => {
            const bookedCount =
              (Number(event?.capacity) || 0) -
              (Number(event?.availableSpots) || 0);

            return (
              <Card
                key={event?.id}
                className="shadow-elegant border-0 hover:shadow-elegant-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/bookings?eventId=${event.id}`}>
                            <Users className="h-4 w-4 mr-2" />
                            View Bookings
                          </Link>
                        </DropdownMenuItem>
                        {moment(event.date).isAfter(moment()) && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/events/${event.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(event)}
                              className="text-red-600 focus:text-red-600"
                              disabled={deleting}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {deleting ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
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
                    {bookedCount} / {event.capacity} booked
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-primary-600">
                      ${event.price}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {moment(event.date).isBefore(moment()) && (
                        <Badge variant="secondary">Past Event</Badge>
                      )}
                      {(bookedCount >= event.capacity ||
                        moment(event.date).isAfter(moment())) && (
                        <Badge
                          variant={
                            bookedCount >= event.capacity
                              ? "destructive"
                              : "default"
                          }
                        >
                          {bookedCount >= event.capacity
                            ? "Sold Out"
                            : "Available"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (bookedCount / event.capacity) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Delete Event
            </DialogTitle>
            <DialogDescription className="text-left">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-gray-900">
                {eventToDelete?.title}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          {eventToDelete && (
            <div className="bg-gray-50 rounded-lg p-4 my-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                  <span>
                    {new Date(eventToDelete.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                  <span>{eventToDelete.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-primary-500" />
                  <span>
                    {eventToDelete.capacity - eventToDelete.availableSpots} /{" "}
                    {eventToDelete.capacity} attendees
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 text-primary-500" />
                  <span className="font-semibold text-primary-600">
                    ${eventToDelete.price}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. All
              bookings for this event will be cancelled and attendees will be
              notified.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setEventToDelete(null);
              }}
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteEvent}
              disabled={deleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Yes, Delete Event
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
