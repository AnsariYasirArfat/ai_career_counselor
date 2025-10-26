import { TRPCClientError } from "@trpc/client";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export async function handleUnauthorizedError(
  error: unknown,
  redirectPath: string = "/auth/signin"
): Promise<boolean> {
  if (!(error instanceof TRPCClientError)) {
    return false;
  }

  const code = error?.data?.code ?? error?.shape?.data?.code;
  if (code !== "UNAUTHORIZED") {
    return false;
  }
  console.error("Unauthorized Error, You must be logged In", error);

  toast.error("Your session has expired!");
  await signOut({ callbackUrl: redirectPath });
  return true;
}
