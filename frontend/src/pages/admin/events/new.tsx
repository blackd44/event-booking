import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { ArrowLeft } from "lucide-react";
import { useCreateEvent } from "@/services/events";

const createEventSchema = z.object({
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

export type CreateEventFormData = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const navigate = useNavigate();
  const createEventMutation = useCreateEvent();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema) as Resolver<CreateEventFormData>,
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

  const onSubmit = (data: CreateEventFormData) => {
    createEventMutation.mutate(data);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Fill in the details to create a new event
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
                  min="1"
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
                onClick={() => reset()}
                disabled={createEventMutation.isPending}
                className="flex-1"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                disabled={createEventMutation.isPending || !isValid}
                className="flex-1"
              >
                {createEventMutation.isPending
                  ? "Creating Event..."
                  : "Create Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
