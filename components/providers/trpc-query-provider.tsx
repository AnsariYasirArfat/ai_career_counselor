"use client";
import { TRPCProvider } from "@/app/_trpc/client";
import { handleUnauthorizedError } from "@/lib/error-handling";

import { AppRouter } from "@/server";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  httpSubscriptionLink,
  splitLink,
} from "@trpc/client";
import { useState } from "react";

function getQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        handleUnauthorizedError(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        handleUnauthorizedError(error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

export default function TRPCQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition: (op) => op.type === "subscription",
          true: httpSubscriptionLink({ url: "/api/trpc" }),
          false: httpBatchLink({ url: "/api/trpc" }),
        }),
      ],
    })
  );

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPCProvider>
  );
}
