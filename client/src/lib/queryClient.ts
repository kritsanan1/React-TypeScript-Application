import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408, 429
        if (error instanceof Error) {
          const status = error.message.match(/^(\d{3}):/)?.[1];
          if (status && ['400', '401', '403', '404'].includes(status)) {
            return false;
          }
        }
        return failureCount < 3;
      },
      queryFn: async ({ queryKey }) => {
        const [url, ...params] = queryKey as [string, ...any[]];
        
        let fullUrl = url;
        if (params.length > 0) {
          const searchParams = new URLSearchParams();
          params.forEach((param, index) => {
            if (param !== undefined && param !== null) {
              searchParams.append(`param${index}`, String(param));
            }
          });
          if (searchParams.toString()) {
            fullUrl += `?${searchParams.toString()}`;
          }
        }

        const response = await fetch(fullUrl, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        return response.json();
      },
    },
  },
});

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: any
) {
  const config: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response;
}