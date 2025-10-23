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
import { useSubscription } from "@trpc/tanstack-react-query";

const PAGE_SIZE = 10;

export default function ChatRoomPage() {
  const { id } = useParams() as { id: string };
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const [failedUserText, setFailedUserText] = useState<string | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [subscriptionInput, setSubscriptionInput] = useState<string>("");

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

  const lastTempUserIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollDown = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    });
  };

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
        scrollDown();

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
      scrollDown();
    },

    onError: (_err, { isRetry }, context) => {
      !isRetry && setFailedUserText(context?.tempUserMessage?.content || null);
    },
  });

  // Helper function to update messages in cache
  const updateMessagesCache = useCallback(
    (updater: (messages: any[]) => any[]) => {
      queryClient.setQueryData(messagesListKey, (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any, idx: number) => {
          if (idx !== 0) return p;
          return { ...p, messages: updater(p.messages ?? []) };
        });
        return { ...old, pages };
      });
    },
    [queryClient, messagesListKey]
  );

  // Helper function to update sessions cache
  const updateSessionsCache = useCallback(
    (aiMessage: any) => {
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
    [queryClient, sessionsListKey, id]
  );

  const streamingSubscription = useSubscription(
    trpc.chat.sendMessageStream.subscriptionOptions(
      { sessionId: id, content: subscriptionInput },
      {
        enabled: !!subscriptionInput,
        onData: (data: string) => {
          if (typeof data === "string") {
            // Check if it's a completion signal
            if (data.startsWith('{"done":true')) {
              const parsed = JSON.parse(data);
              if (parsed.done) {
                setIsStreaming(false);
                setFailedUserText(null);
                setSubscriptionInput("");

                // Update cache with the final messages from server
                updateMessagesCache((messages) => {
                  // Remove any temporary/streaming messages
                  const cleanMessages = messages.filter(
                    (m: any) =>
                      !m.id.startsWith("temp-") &&
                      !m.id.startsWith("streaming-")
                  );

                  // Add the final messages from server
                  return [
                    parsed.aiMessage,
                    parsed.userMessage,
                    ...cleanMessages,
                  ];
                });

                updateSessionsCache(parsed.aiMessage);
                scrollDown();
              }
            } else {
              // It's a token - update the streaming message in cache
              updateMessagesCache((messages) => {
                const streamingMsgIndex = messages.findIndex((m: any) =>
                  m.id.startsWith("streaming-")
                );
                if (streamingMsgIndex === -1) {
                  // Create streaming message on first token
                  const streamingId = `streaming-${Date.now()}`;
                  const streamingMessage = {
                    id: streamingId,
                    sessionId: id,
                    role: "ASSISTANT" as const,
                    content: data,
                    createdAt: new Date().toISOString(),
                  };
                  return [streamingMessage, ...messages];
                } else {
                  const updated = [...messages];
                  updated[streamingMsgIndex] = {
                    ...updated[streamingMsgIndex],
                    content: updated[streamingMsgIndex].content + data,
                  };
                  return updated;
                }
              });
            }
          }
        },
        onError: (error) => {
          console.error("Streaming error:", error);
          setIsStreaming(false);
          setFailedUserText(subscriptionInput);
          setSubscriptionInput("");

          // Remove streaming message on error
          updateMessagesCache((messages) =>
            messages.filter((m: any) => !m.id.startsWith("streaming-"))
          );
        },
      }
    )
  );

  const startStreaming = useCallback(
    (content: string, isRetry: boolean = false) => {
      setIsStreaming(true);
      setFailedUserText(null);
      setSubscriptionInput(content);

      if (!isRetry) {
        const tempUserId = `temp-user-${Date.now()}`;
        const tempUserMessage = {
          id: tempUserId,
          sessionId: id,
          role: "USER" as const,
          content,
          createdAt: new Date().toISOString(),
        };

        // Add both messages to cache
        updateMessagesCache((messages) => [tempUserMessage, ...messages]);
      }
      scrollDown();
    },
    [id, updateMessagesCache]
  );

  const isConnecting = streamingSubscription.status === "connecting";
  const isPending = streamingSubscription.status === "pending";
  const isErrorStreaming = streamingSubscription.status === "error";

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isPending || isStreaming) return;
      startStreaming(trimmed, false);
    },
    [startStreaming, isStreaming]
  );

  const handleRetry = useCallback(() => {
    if (!failedUserText || isPending || isStreaming) return;
    startStreaming(failedUserText, true);
  }, [failedUserText, startStreaming, isStreaming]);

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
            scrollRef={scrollRef}
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

        {failedUserText && isErrorStreaming && (
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
                disabled={!isErrorStreaming}
                className="flex items-center gap-2 px-3 py-1.5 text-sm  rounded-md transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {(isConnecting || isPending) && isStreaming && (
          <div className="pb-1 max-w-[760px] w-full mx-auto">
            <TypingIndicator
              text={
                isConnecting
                  ? "Thinking"
                  : isPending
                  ? "Generating"
                  : "Streaming"
              }
            />
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        loading={!!failedUserText || isErrorStreaming || isPending}
      />
    </div>
  );
}
