import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type LoginData } from "@shared/schema";
import GasCylinderIcon from "@/components/gas-cylinder-icon";

interface LoginFormProps {
  onToggleMode: () => void;
  onBrowseAsGuest: () => void;
}

export default function LoginForm({ onToggleMode, onBrowseAsGuest }: LoginFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome back!",
        description: `Logged in successfully as ${data.user.role}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      // The app will automatically redirect based on role
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/40 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>
      
      <Card className="w-full max-w-md backdrop-blur-lg bg-white/95 shadow-2xl border-0 relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg transform rotate-3 mr-4">
                <GasCylinderIcon size="xl" className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                GoMessage
              </h1>
              <p className="text-lg text-orange-600 font-bold tracking-wide">GetGasNow</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back!</CardTitle>
            <p className="text-gray-600 font-medium">Sign in to continue your gas delivery journey</p>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-400 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🔥</span>
              <span className="text-orange-600 font-semibold text-sm">Local Service</span>
            </div>
            <p className="text-orange-700 font-medium italic text-sm leading-relaxed">
              Your gas don finish? No worry, we de bring am to your house now now!
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        disabled={loginMutation.isPending}
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-200 text-base font-medium"
                      />
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
                    <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        disabled={loginMutation.isPending}
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-200 text-base font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>🔥</span>
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-5">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-2 border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 font-semibold text-gray-700"
              onClick={onBrowseAsGuest}
            >
              <div className="flex items-center space-x-2">
                <span>👁️</span>
                <span>Browse as Guest</span>
              </div>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 font-medium">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-bold text-orange-600 hover:text-orange-700 underline-offset-4"
                onClick={onToggleMode}
              >
                Sign up here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}