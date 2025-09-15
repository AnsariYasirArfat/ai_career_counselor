"use client";
import { TRPCProvider } from "@/app/_trpc/client";
import { AppRouter } from "@/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";

function getQueryClient() {
  return new QueryClient({
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
        httpBatchLink({ url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc` }),
      ],
    })
  );
  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPCProvider>
  );
}
