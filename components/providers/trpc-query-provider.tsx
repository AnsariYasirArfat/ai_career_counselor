"use client";
import { TRPCProvider } from "@/app/_trpc/client";

import { AppRouter } from "@/server";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, TRPCClientError } from "@trpc/client";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

function isUnauthorized(error: unknown) {
  if (error instanceof TRPCClientError) {
    const code = error?.data?.code ?? error?.shape?.data?.code;
    if (code === "UNAUTHORIZED") return true;
  }
  return false;
}

let handlingAuthError = false;
async function handleUnauthorizedUser() {
  if (handlingAuthError) return;
  handlingAuthError = true;
  try {
    toast.error("Your session has expired!");
    await signOut({ callbackUrl: "/auth/signin" });
  } finally {
    handlingAuthError = false;
  }
}

function getQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (isUnauthorized(error)) {
          handleUnauthorizedUser();
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isUnauthorized(error)) {
          handleUnauthorizedUser();
        }
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
