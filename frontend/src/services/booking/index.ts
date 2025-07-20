import { handleError } from "@/lib/error";
import { baseInstance } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
