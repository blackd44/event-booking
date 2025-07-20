import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { DEMO_CREDENTIALS } from "@/constants/demo-credentials";
import { Link } from "react-router-dom";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginMutation } = useAuth();

  // Form setup
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async ({ email, password }: LoginFormData) => {
    await login?.(email, password);
  };

  const fillDemoCredentials = (type: keyof typeof DEMO_CREDENTIALS) => {
    const credentials = DEMO_CREDENTIALS[type];
    form.setValue("email", credentials.email);
    form.setValue("password", credentials.password);
    // Clear any existing errors
    form.clearErrors();
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-elegant-lg border-0 animate-fade-in">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          {/* Demo Credentials */}
          <div className="bg-gradient-to-r from-primary-50 to-cyan-50 rounded-xl p-5 border border-primary-100">
            <h3 className="text-sm font-semibold text-primary-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
              Demo Accounts
            </h3>
            <div className="space-y-3">
              <DemoCredentialItem
                type="admin"
                title="Admin Account"
                email="admin@example.com"
                onUse={() => fillDemoCredentials("admin")}
              />
              <DemoCredentialItem
                type="customer"
                title="Customer Account"
                email="customer@example.com"
                onUse={() => fillDemoCredentials("customer")}
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Demo credential component for reusability
interface DemoCredentialItemProps {
  type: string;
  title: string;
  email: string;
  onUse: () => void;
}

function DemoCredentialItem({
  // type,
  title,
  email,
  onUse,
}: DemoCredentialItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-xs text-primary-700">
        <div className="font-medium">{title}</div>
        <div className="text-primary-600">{email}</div>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onUse}
        className="text-xs border-primary-200 text-primary-700 hover:bg-primary-100 transition-colors"
        type="button"
      >
        Use
      </Button>
    </div>
  );
}
