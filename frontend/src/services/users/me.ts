import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseInstance } from "../axios";
import { handleError } from "@/lib/error";
import type { ERole, EUserStatus } from "@/types/enums";

// types
export interface IMe {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  role: ERole;
  status: EUserStatus;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  role: ERole;
}

export interface IAuthResponse {
  access_token: string;
  user: IMe;
}

// Get current user
export function useMe() {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () =>
      baseInstance
        .get<{ user: IMe }>("/auth/me")
        .then((res) => res?.data?.user),
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Login mutation
export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: ILoginRequest) => {
      // Check for demo credentials
      // const users = Object.entries(DEMO_CREDENTIALS);
      // const user = users.find(([, value]) => {
      //   return (
      //     value.email === credentials.email &&
      //     value.password === credentials.password
      //   );
      // });
      // if (user) {
      //   // Return dummy response for demo user
      //   return {
      //     token: "demo-token",
      //     user: {
      //       id: "demo-id",
      //       email: user?.[1].email,
      //       name: "Demo User",
      //       role: user?.[0],
      //     } as IMe,
      //   };
      // }

      // Otherwise, proceed with real API call
      const res = await baseInstance
        .post<IAuthResponse>("/auth/login", credentials)
        .then((res) => res.data);
      return res;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data?.access_token);
      queryClient.setQueryData(["auth", "me"], data.user);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    },
    onError: (err) => handleError(err, "Login failed"),
  });
}

// Register mutation
export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IRegisterRequest) =>
      baseInstance
        .post<IAuthResponse>("/auth/register", data)
        .then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem("token", data?.access_token);
      queryClient.setQueryData(["auth", "me"], data.user);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    },
    onError: (err) => handleError(err, "Registration failed"),
  });
}

// Logout function
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem("token");
    queryClient.clear();
    navigate("/");
  };
}
