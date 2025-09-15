"use client";
import { Copy } from "lucide-react";
import { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { MarkdownRenderer } from './MarkdownRenderer';

type ChatMessage = {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
};

interface MessageListProps {
  messages: ChatMessage[];
  onCopy: (text: string) => void;
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  shouldScrollToBottom?: boolean; 
}

export default function MessageList({
  messages,
  onCopy,
  loadMore,
  hasMore,
  isLoading,
  shouldScrollToBottom = false,
}: MessageListProps) {
  const SCROLLABLE_ID = "chat-message-scrollable";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldScrollToBottom && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [shouldScrollToBottom, messages]);

  return (
    <div
      id={SCROLLABLE_ID}
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto"
      style={{
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          isLoading && (
            <div className="flex justify-center py-2 text-xs text-gray-400">
              Loading older messages...
            </div>
          )
        }
        scrollThreshold="200px"
        inverse={true}
        scrollableTarget={SCROLLABLE_ID}
        className="flex flex-col-reverse max-w-[760px] mx-auto"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex justify-center  mb-4 ${
              msg.role === "USER" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative  max-w-[80%] px-5 py-3 ${
                msg.role === "USER"
                  ? " bg-[#f0f4f9] dark:bg-gradient-to-br from-[#333537] to-[#424548]  rounded-3xl rounded-tr-md"
                  : "bg-transparent  border rounded-3xl rounded-tl-md"
              } shadow-md`}
            >
              {msg.role === "ASSISTANT" ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <span className="block break-words">{msg.content}</span>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
                <button
                  className="ml-2 p-1 rounded hover:!bg-zinc-400/50 transition"
                  onClick={() => onCopy(msg.content)}
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
