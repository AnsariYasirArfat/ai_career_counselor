"use client";

import Image from "next/image";
import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GoogleButtonProps {
  text?: string;
  callbackUrl?: string;
  disabled?: boolean;
  className?: string;
}

export default function GoogleButton({
  text = "Continue with Google",
  callbackUrl = "/",
  disabled,
  className,
}: GoogleButtonProps) {
  const [pending, start] = useTransition();

  const onClick = () => {
    if (disabled || pending) return;
    start(async () => {
      try {
        await signIn("google", { callbackUrl });
      } catch (error) {
        console.error(error)
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full h-11 gap-2", className)}
      onClick={onClick}
      disabled={disabled || pending}
      aria-label={text}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Connecting…
        </span>
      ) : (
        <>
          <Image
            src="/google.svg"
            alt="Google"
            width={18}
            height={18}
            priority
            aria-hidden="true"
          />
          {text}
        </>
      )}
    </Button>
  );
}
