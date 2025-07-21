import type { ERole, EUserStatus } from "@/types/enums";
import { useQuery } from "@tanstack/react-query";
import { baseInstance } from "../axios";
import type { TPaginateRes } from "@/types/pagination";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: EUserStatus;
  password: string;
  role: ERole;
  createdAt: string;
  updatedAt: string;
  bookingsCount?: number;
}

export function useUsers({ q }: { q?: string }) {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["users", q],
    queryFn: () =>
      baseInstance
        .get<TPaginateRes<IUser>>("/users", {
          params: { q, show_bookings: "true" },
        })
        .then((res) => res?.data),
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
