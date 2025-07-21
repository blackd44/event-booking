import { useParams, useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEvent, useUpdateEvent } from "@/services/events";
import { formatDateTimeForInput } from "@/lib/format-date";

const editEventSchema = z.object({
  title: z
    .string()
    .min(1, "Event title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  date: z.string().min(1, "Date and time is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
});

export type EditEventFormData = z.infer<typeof editEventSchema>;

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: event, isLoading, error } = useEvent(id!);
  const updateEventMutation = useUpdateEvent(id!);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
  } = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema) as Resolver<EditEventFormData>,
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: "",
      capacity: 1,
      price: 0,
    },
  });

  // Populate form when event data loads
  useEffect(() => {
    if (event) {
      setValue("title", event.title);
      setValue("description", event.description);
      setValue("location", event.location);
      setValue("date", formatDateTimeForInput(event.date));
      setValue("capacity", event.capacity);
      setValue("price", event.price);
    }
  }, [event, setValue]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch event details",
        variant: "destructive",
      });
      navigate("/admin/events");
    }
  }, [error, toast, navigate]);

  const onSubmit = (data: EditEventFormData) => {
    // Check if capacity is being reduced below current bookings
    if (event && data.capacity < event.bookedCount) {
      toast({
        title: "Invalid Capacity",
        description: `Capacity cannot be less than current bookings (${event.bookedCount})`,
        variant: "destructive",
      });
      return;
    }

    updateEventMutation.mutate(data);
  };

  const handleBack = () => {
    navigate("/admin/events");
  };

  const handleReset = () => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        location: event.location,
        date: formatDateTimeForInput(event.date),
        capacity: event.capacity,
        price: event.price,
      });
    }
  };

  if (!id) {
    navigate("/admin/events");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading event details...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
          <CardDescription>
            Update the event details below
            {event && (
              <span className="block text-sm text-gray-500 mt-1">
                Current bookings: {event.bookedCount} / {event.capacity}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                {...register("title")}
                className={
                  errors.title ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={4}
                className={
                  errors.description
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                className={
                  errors.location ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                {...register("date")}
                className={
                  errors.date ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={event?.bookedCount || 1}
                  {...register("capacity")}
                  className={
                    errors.capacity ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500">
                    {errors.capacity.message}
                  </p>
                )}
                {event && event.bookedCount > 0 && (
                  <p className="text-xs text-gray-500">
                    Minimum capacity: {event.bookedCount} (current bookings)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price")}
                  className={
                    errors.price ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={updateEventMutation.isPending || !isDirty}
                className="flex-1"
              >
                Reset Changes
              </Button>
              <Button
                type="submit"
                disabled={updateEventMutation.isPending || !isValid || !isDirty}
                className="flex-1"
              >
                {updateEventMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
