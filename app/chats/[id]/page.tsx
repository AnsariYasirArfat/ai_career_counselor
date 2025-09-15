"use client";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import MessageList from "@/components/ChatRoom/MessageList";
import ChatInput from "@/components/ChatRoom/ChatInput";
import { toast } from "sonner";
import Link from "next/link";
import TypingIndicator from "@/components/ChatRoom/TypingIndicator";
import ChatRoomSkeleton from "@/components/ChatRoom/ChatRoomSkeleton";
import { MessageCircle } from "lucide-react";
import { useTRPC, useTRPCClient } from "@/app/_trpc/client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const PAGE_SIZE = 10;

export default function ChatRoomPage() {
  const { id } = useParams() as { id: string };
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const messagesListOpts = trpc.chat.getMessages.infiniteQueryOptions(
    { sessionId: id, limit: PAGE_SIZE, cursor: undefined },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );
  const messagesListKey = messagesListOpts.queryKey;

  const SESSIONS_PAGE_SIZE = 10;
  const sessionsListOpts = trpc.chat.getChatSessions.infiniteQueryOptions(
    { limit: SESSIONS_PAGE_SIZE, cursor: null },
    { getNextPageParam: (lastPage) => lastPage.nextCursor ?? null }
  );
  const sessionsListKey = sessionsListOpts.queryKey;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery(messagesListOpts);

  const messages = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.messages),
    [data]
  );

  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      trpcClient.chat.sendMessage.mutate({ sessionId: id, content }),

    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: messagesListKey });

      const previous = queryClient.getQueryData(messagesListKey);

      const tempUserMessage = {
        id: `temp-user-${Date.now()}`,
        sessionId: id,
        role: "USER" as const,
        content: content,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(messagesListKey, (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any, idx: number) => {
          if (idx !== 0) return p;
          const next = [tempUserMessage, ...(p.messages ?? [])];
          return { ...p, messages: next };
        });
        return { ...old, pages };
      });

      return { previous, tempUserMessage };
    },

    onSuccess: async ({ userMessage, aiMessage }, _vars, context) => {
      queryClient.setQueryData(messagesListKey, (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any, idx: number) => {
          if (idx !== 0) return p;
          
          const withoutTemp = (p.messages ?? []).filter(
            (m: any) => m.id !== context?.tempUserMessage?.id
          );
          
          const next = [aiMessage, userMessage, ...withoutTemp];
          
          const seen = new Set<string>();
          const deduped = [];
          for (const m of next) {
            if (!m?.id || seen.has(m.id)) continue;
            seen.add(m.id);
            deduped.push(m);
          }
          
          return { ...p, messages: deduped };
        });
        return { ...old, pages };
      });

      queryClient.setQueryData(sessionsListKey, (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any, idx: number) => {
          if (idx !== 0) return p;
          const list = p.sessions ?? [];
          const index = list.findIndex((s: any) => s.id === id);
          if (index === -1) return p;

          const current = list[index];
          const updated = {
            ...current,
            updatedAt: aiMessage.createdAt ?? new Date().toISOString(),
            message: [{ ...aiMessage }],
          };
          const without = list.filter((_: any, i: number) => i !== index);
          return { ...p, sessions: [updated, ...without] };
        });
        return { ...old, pages };
      });
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(messagesListKey, context.previous);
      }
      toast.error("Failed to send message");
    },
  });

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate(trimmed);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (isLoading) {
    return <ChatRoomSkeleton />;
  }
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <div className="text-2xl font-semibold text-gray-400 mb-4">
          Failed to load chatroom
        </div>
        <div className="text-gray-500 mb-6">Please try again.</div>
        <Link href="/" passHref>
          <button className="px-6 py-2 rounded bg-oration-orange hover:bg-oration-orange/80 transition">
            Go Home
          </button>
        </Link>
      </div>
    );
  }

  const hasAny = messages.length > 0;

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <div className="flex-1 min-h-0 flex flex-col px-4 ">
        {hasAny ? (
          <MessageList
            messages={messages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
            }))}
            onCopy={handleCopy}
            loadMore={fetchNextPage}
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-zinc-500">
            <MessageCircle className="w-12 h-12 mb-4 text-zinc-400" />
            <div className="text-xl font-semibold mb-2">No messages yet</div>
            <div className="text-sm">
              Start the conversation by sending a message below!
            </div>
          </div>
        )}

        {sendMutation.isPending && (
          <div className="pb-1 max-w-[760px] w-full mx-auto">
            <TypingIndicator text="thinking" />
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} loading={sendMutation.isPending} />
    </div>
  );
}
