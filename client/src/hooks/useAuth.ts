import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface AuthResponse {
  user: User;
  authenticated: boolean;
}

export function useAuth() {
  // Check if we're in guest mode first to skip API calls entirely
  const urlParams = new URLSearchParams(window.location.search);
  const isGuestMode = urlParams.get('guest') === 'true';
  
  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/me"],
    retry: false,
    enabled: !isGuestMode, // Skip API call entirely for guest users
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes 
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on component mount if we have data
  });

  // For guest mode, return immediately without API call
  if (isGuestMode) {
    return {
      user: { role: 'guest' } as any,
      isLoading: false,
      isAuthenticated: true, // Treat guest as authenticated for routing
      error: null,
    };
  }

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.authenticated,
    error,
  };
}