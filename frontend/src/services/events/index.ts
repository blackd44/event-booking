import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseInstance } from "../axios";
import type { TPaginateRes } from "@/types/pagination";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/lib/error";
import type { CreateEventFormData } from "@/pages/admin/events/new";
import { useNavigate } from "react-router-dom";
import type { EditEventFormData } from "@/pages/admin/events/edit";

export interface IEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  availableSpots: number;
}

export function useEvents({ q }: { q?: string } = {}) {
  return useQuery({
    queryKey: ["events", q],
    queryFn: () =>
      baseInstance
        .get<TPaginateRes<IEvent>>("/events", { params: { q } })
        .then((res) => res?.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Custom hooks
export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await baseInstance.get<IEvent>(`/events/${id}`);
      return response.data;

      // return {
      //   id: "1",
      //   title: "Dummy Event",
      //   description: "This is a dummy event",
      //   location: "Nowhere",
      //   date: "2026-01-01T12:00:00.000Z",
      //   capacity: 100,
      //   price: 10,
      //   bookedCount: 98,
      // } as IEvent;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventId: string) => {
      await baseInstance.delete(`/events/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast({ title: "Success", description: "Event deleted successfully" });
    },
    onError: (err: unknown) => {
      const message = handleError(err, "Failed to delete event", true);
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });
};

interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
  price: number;
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: CreateEventFormData): Promise<void> => {
      const payload: CreateEventPayload = data;

      await baseInstance.post("/events", payload, {
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      navigate("/admin/events");
    },
    onError: (error: unknown) => {
      const errorMessage = handleError(error, "Failed to create event", true);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

interface UpdateEventPayload {
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
  price: number;
}

export const useUpdateEvent = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: EditEventFormData) => {
      const payload: UpdateEventPayload = data;
      const response = await baseInstance.patch<IEvent>(
        `/events/${id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({ title: "Success", description: "Event updated successfully!" });
      navigate("/admin/events");
    },
    onError: (error: unknown) => {
      const errorMessage = handleError(error, "Failed to update event", true);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
