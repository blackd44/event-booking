import { useAuth } from "@/hooks/use-auth";
import type React from "react";

import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ("admin" | "customer")[];
}

export function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isValid = useMemo(
    () =>
      user?.role &&
      requiredRoles?.length &&
      !requiredRoles?.includes(user?.role),
    [user?.role, requiredRoles]
  );

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }

      if (isValid) {
        navigate("/unauthorized");
        return;
      }
    }
  }, [isValid, loading, navigate, user]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );

  if (!user || isValid) return null;

  return <>{children}</>;
}
