import { useQuery } from "@tanstack/react-query";
import { baseInstance } from "../axios";

export interface IEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
  price: number;
  bookedCount: number;
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () =>
      baseInstance.get<IEvent[]>("/events").then((res) => res.data),
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
