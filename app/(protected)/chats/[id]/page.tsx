"use client";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import MessageList from "@/components/ChatRoom/MessageList";
import ChatInput from "@/components/ChatRoom/ChatInput";
import Link from "next/link";
import TypingIndicator from "@/components/ChatRoom/TypingIndicator";
import ChatRoomSkeleton from "@/components/ChatRoom/ChatRoomSkeleton";
import { MessageCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useTRPC, useTRPCClient } from "@/app/_trpc/client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function ChatRoomPage() {
  const { id } = useParams() as { id: string };
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const [failedUserText, setFailedUserText] = useState<string | null>(null);
  const lastTempUserIdRef = useRef<string | null>(null);

  const messagesListOpts = trpc.chat.getMessages.infiniteQueryOptions(
    { sessionId: id, limit: PAGE_SIZE, cursor: undefined },
    { getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined }
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
    mutationFn: ({ content }: { content: string; isRetry: boolean }) =>
      trpcClient.chat.sendMessage.mutate({ sessionId: id, content }),

    onMutate: async ({ content, isRetry }) => {
      await queryClient.cancelQueries({ queryKey: messagesListKey });

      if (!isRetry) {
        setFailedUserText(null);
        const previous = queryClient.getQueryData(messagesListKey);

        const tmpUserId = `temp-user-${Date.now()}`;
        lastTempUserIdRef.current = tmpUserId;

        const tempUserMessage = {
          id: tmpUserId,
          sessionId: id,
          role: "USER" as const,
          content,
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
      }
      return { previous: null, tempUserMessage: null };
    },

    onSuccess: async ({ userMessage, aiMessage }, { isRetry }, context) => {
      setFailedUserText(null);

      const tmpMsgId = !isRetry
        ? context?.tempUserMessage?.id
        : lastTempUserIdRef.current;

      queryClient.setQueryData(messagesListKey, (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any, idx: number) => {
          if (idx !== 0) return p;
          const withoutTemp = (p.messages ?? []).filter(
            (m: any) => m.id !== tmpMsgId
          );
          const next = [aiMessage, userMessage, ...withoutTemp];

          return { ...p, messages: next };
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

    onError: (_err, { isRetry }, context) => {
      !isRetry && setFailedUserText(context?.tempUserMessage?.content || null);
    },
  });

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sendMutation.isPending) return;
      sendMutation.mutate({ content: trimmed, isRetry: false });
    },
    [sendMutation]
  );

  const handleRetry = useCallback(() => {
    if (!failedUserText || sendMutation.isPending) return;
    sendMutation.mutate({ content: failedUserText, isRetry: true });
  }, [failedUserText, sendMutation]);

  if (isLoading) {
    return <ChatRoomSkeleton />;
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 w-full">
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
  const isProcessing = sendMutation.isPending;

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full">
      <div className="flex-1 min-h-0 flex flex-col px-4 ">
        {hasAny ? (
          <MessageList
            messages={messages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
            }))}
            loadMore={fetchNextPage}
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 h-full  min-h-0 py-12 text-center text-zinc-500">
            <MessageCircle className="w-12 h-12 mb-4 text-zinc-400" />
            <div className="text-xl font-semibold mb-2">No messages yet</div>
            <div className="text-sm">
              Start the conversation by sending a message below!
            </div>
          </div>
        )}

        {failedUserText && !isProcessing && (
          <div className="pb-1 max-w-[760px] w-full mx-auto">
            <div className="flex items-center gap-3 px-5 py-3  max-w-[80%] border border-red-500  rounded-3xl rounded-tl-md">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-red-500">
                  Failed to get AI response
                </div>
                <span className="text-xs text-gray-400">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>

              <Button
                variant="destructive"
                onClick={handleRetry}
                disabled={isProcessing}
                className="flex items-center gap-2 px-3 py-1.5 text-sm  rounded-md transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="pb-1 max-w-[760px] w-full mx-auto">
            <TypingIndicator text="thinking" />
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        loading={!!failedUserText || isProcessing}
      />
    </div>
  );
}
