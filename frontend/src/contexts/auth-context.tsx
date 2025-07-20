import {
  useLogin,
  useLogout,
  useMe,
  useRegister,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
} from "@/services/users/me";
import type { UseMutationResult } from "@tanstack/react-query";
import type React from "react";
import { createContext } from "react";

interface IUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: "admin" | "customer"
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;

  loginMutation: UseMutationResult<AuthResponse, Error, LoginRequest, unknown>;
  registerMutation: UseMutationResult<
    AuthResponse,
    Error,
    RegisterRequest,
    unknown
  >;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useMe();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logout = useLogout();

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "admin" | "customer"
  ) => {
    await registerMutation.mutateAsync({ email, password, name, role });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        login,
        register,
        logout,
        loading: isLoading,

        loginMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
export type { IUser };
