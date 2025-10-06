"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useTRPCClient } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signupSchema, type SignupInput } from "@/lib/validations";

export default function SignupPage() {
  const router = useRouter();
  const trpcClient = useTRPCClient();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: Omit<SignupInput, "confirmPassword">) =>
      trpcClient.auth.register.mutate(data),
    onSuccess: () => {
      form.reset();
      router.push("/auth/signin");
    },
  });

  const onSubmit = (data: SignupInput) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const isLoading = registerMutation.isPending;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create your account
        </CardTitle>
        <CardDescription className="text-center">
          Sign up to start using AI Career Counselor
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Message */}
        {registerMutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {registerMutation.error?.message ||
                "Registration failed. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                {...form.register("name")}
                className="pl-10"
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className="pl-10"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                className="pl-10"
                placeholder="Create a password"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
                className="pl-10"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-oration-orange hover:bg-oration-orange/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
          </span>
          <Link
            href="/auth/signin"
            className="font-medium text-oration-orange hover:text-oration-orange/80"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
