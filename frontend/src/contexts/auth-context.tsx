import {
  useLogin,
  useLogout,
  useMe,
  useRegister,
  type IAuthResponse,
  type ILoginRequest,
  type IMe,
  type IRegisterRequest,
} from "@/services/users/me";
import type { ERole } from "@/types/enums";
import type { UseMutationResult } from "@tanstack/react-query";
import type React from "react";
import { createContext } from "react";

interface AuthContextType {
  user: IMe | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: ERole
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;

  loginMutation: UseMutationResult<
    IAuthResponse,
    Error,
    ILoginRequest,
    unknown
  >;
  registerMutation: UseMutationResult<
    IAuthResponse,
    Error,
    IRegisterRequest,
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
    await loginMutation?.mutateAsync?.({ email, password });
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: ERole
  ) => {
    await registerMutation.mutateAsync({
      email,
      password,
      firstName,
      lastName,
      role,
    });
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
export type { IMe };
