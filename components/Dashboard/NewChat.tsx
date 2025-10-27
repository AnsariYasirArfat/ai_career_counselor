import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC, useTRPCClient } from "@/app/_trpc/client";
import { toast } from "sonner";

interface NewChatProps {
  closeDrawer?: () => void;
  collapsed: boolean;
}

export default function NewChat({ closeDrawer, collapsed }: NewChatProps) {
  const { data: userSession, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();

  const LIST_INPUT = { cursor: null as null, limit: 10 };
  const listOpts = trpc.chat.getChatSessions.infiniteQueryOptions(LIST_INPUT);
  const listKey = listOpts.queryKey;

  const createChatSession = useMutation({
    mutationFn: () =>
      trpcClient.chat.createChatSession.mutate({ title: "New Session" }),
    onSuccess: async (session) => {
      queryClient.setQueryData(listKey, (old) => {
        if (!old) return old;
        const pages = old.pages.map((p: any, idx: number) =>
          idx === 0 ? { ...p, sessions: [session, ...(p.sessions ?? [])] } : p
        );
        return { ...old, pages };
      });
      toast.success("New chat session created!");
      if (closeDrawer) closeDrawer();
      router.push(`/chats/${session.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create chat session");
    },
  });

  const handleNewChat = () => {
    if (!userSession) return;
    createChatSession.mutate();
  };

  return (
    <div
      className={cn(
        "flex items-center px-2",
        collapsed ? "justify-center " : "justify-between"
      )}
    >
      <Button
        className={cn(
          "w-full  hover:!bg-zinc-400/20 cursor-pointer",
          collapsed ? "justify-center " : "justify-start"
        )}
        variant="ghost"
        onClick={handleNewChat}
        disabled={!userSession || createChatSession.isPending}
        title="New Chat"
      >
        <SquarePen />
        <span className={cn("", collapsed && "hidden")}>
          {createChatSession.isPending ? "Creating..." : "New Chat"}
        </span>
      </Button>
    </div>
  );
}
