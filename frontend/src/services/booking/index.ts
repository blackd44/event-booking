import { handleError } from "@/lib/error";
import { baseInstance } from "../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { EBookingStatus } from "@/types/enums";
import type { IUser } from "../users";
import type { IEvent } from "../events";
import type { TPaginateRes } from "@/types/pagination";

interface IBookingRequest {
  eventId: string;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: IBookingRequest): Promise<void> => {
      const token = localStorage.getItem("token");
      await baseInstance.post("/bookings", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: "Ticket booked successfully!",
      });

      // refetch the event data
      queryClient.invalidateQueries({ queryKey: ["event", variables.eventId] });
    },
    onError: (err) => handleError(err, "Failed to book ticket"),
  });
}

export interface IBooking {
  id: string;
  event: IEvent;
  user?: IUser;
  status: EBookingStatus;
  quantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await baseInstance.get<IBooking[]>("/bookings");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export type TBookingRes = TPaginateRes<IBooking> & {
  stats?: {
    confirmed: number;
    upComming: number;
    cancelled: number;
    revenue: number;
  };
};

export function useBookingsAll({
  show_stats,
  status,
  user_id,
  q,
}: {
  show_stats?: boolean;
  user_id?: string;
  status?: EBookingStatus;
  q?: string;
} = {}) {
  return useQuery({
    queryKey: ["bookings", show_stats, status, user_id, q],
    queryFn: async () => {
      const response = await baseInstance.get<TBookingRes>("/bookings/all", {
        params: { show_stats, status, user_id, q },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await baseInstance.put(`/bookings/${bookingId}`, {
        status: "cancelled",
      });
      return response.data;
    },
    onSuccess: () => {
      // refetch bookings data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => handleError(err, "Failed to cancel booking"),
  });
}
