import { QueryClient } from "@tanstack/react-query";

export function getServerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity, // never becomes stale
        gcTime: Infinity, // never garbage collected
        refetchOnWindowFocus: false, // no refetch on tab focus
        refetchOnMount: false, // no refetch on remount
        refetchOnReconnect: false, // no refetch on reconnect
      },
    },
  });
}
