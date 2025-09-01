import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    try {
      const parsed = JSON.parse(text);
      throw new Error(parsed.message || res.statusText);
    } catch {
      throw new Error(`${res.status}: ${text || res.statusText}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Use configured API base for requests
  const requestUrl = url.startsWith("/api") 
    ? url.replace("/api", API_BASE)
    : `${API_BASE}${url}`;
    
  const res = await fetch(requestUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// API Base URL Configuration
const REPLIT_BACKEND = "https://59761060-6a63-47ba-85e7-dd2141b3f025-00-3mbfshygvt1gn.spock.replit.dev/api";
const DEFAULT_API_BASE = "/api";

// Use Replit backend for Vercel deployment, local API for development
const API_BASE = import.meta.env.VITE_API_BASE || 
  (window.location.hostname === "gomessage-app.vercel.app" ? REPLIT_BACKEND : DEFAULT_API_BASE);

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Use configured API base instead of direct path
    const url = queryKey.join("/").startsWith("/api") 
      ? queryKey.join("/").replace("/api", API_BASE)
      : `${API_BASE}${queryKey.join("/")}`;
      
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
