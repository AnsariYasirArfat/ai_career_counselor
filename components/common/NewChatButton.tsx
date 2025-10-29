"use client"
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useCreateChatSession } from "@/hooks/useCreateChatSession";
import { type VariantProps } from "class-variance-authority";

interface NewChatButtonProps 
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  onSuccess?: (session: any) => void;
  onError?: (error: any) => void;
  loadingText?: string;
}

export default function 
NewChatButton({
  onSuccess,
  onError,
  loadingText = "Creating...",
  children,
  ...props
}: NewChatButtonProps) {
  const { data: session } = useSession();
  const { createChatSession, isCreating } = useCreateChatSession({
    onSuccess,
    onError,
  });

  const handleClick = () => {
    if (!session) return;
    createChatSession();
  };

  const isDisabled = !session || isCreating || props.disabled;

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {isCreating ? loadingText : children}
    </Button>
  );
}
