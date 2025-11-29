/// <reference types="vite/client" />
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// -----------------------------------------------------------------------------
// CONFIG
// -----------------------------------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Normalize URL so it ALWAYS starts with EXACTLY ONE slash
function normalizeUrl(url: string) {
  return "/" + url.replace(/^\/+/, "");
}

// Throw readable errors
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// -----------------------------------------------------------------------------
// API REQUEST (POST, DELETE, PUT, PATCH, etc.)
// -----------------------------------------------------------------------------

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
  customHeaders: Record<string, string> = {}
): Promise<Response> {
  
  const normalized = normalizeUrl(url);

  const fullUrl = normalized.startsWith("http")
    ? normalized
    : `${API_BASE_URL}${normalized}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...customHeaders,
  };

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (data !== undefined && method !== "GET") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  const res = await fetch(fullUrl, options);
  await throwIfResNotOk(res);
  return res;
}

// -----------------------------------------------------------------------------
// QUERY FUNCTION (GET requests for React Query)
// -----------------------------------------------------------------------------

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    
    const raw = queryKey.join("/");
    const normalized = normalizeUrl(raw);

    const fullUrl = normalized.startsWith("http")
      ? normalized
      : `${API_BASE_URL}${normalized}`;

    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// -----------------------------------------------------------------------------
// QUERY CLIENT SETUP
// -----------------------------------------------------------------------------

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
