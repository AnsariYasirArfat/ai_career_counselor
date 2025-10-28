"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Check, Edit, Loader2, MoreVertical, Trash2, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useRouter, useParams } from "next/navigation";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTRPC, useTRPCClient } from "@/app/_trpc/client";
import ChatRoomListSkeleton from "./ChatRoomListSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CHAT_SESSIONS_PER_PAGE } from "@/constant/pageLimits";


export default function ChatRoomList({
  onRoomClick,
}: {
  onRoomClick?: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const params = useParams() as { id?: string };
  const activeId = params?.id;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const listOpts = trpc.chat.getChatSessions.infiniteQueryOptions(
    { limit: CHAT_SESSIONS_PER_PAGE, cursor: null },
    { getNextPageParam: (lastPage) => lastPage.nextCursor ?? null }
  );
  const listKey = listOpts.queryKey;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery(listOpts);

  const sessions = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.sessions),
    [data]
  );

  const updateTitleMutation = useMutation({
    mutationFn: ({ sessionId, title }: { sessionId: string; title: string }) =>
      trpcClient.chat.updateSessionTitle.mutate({ sessionId, title }),

    onSuccess: (updateSession) => {
      queryClient.setQueryData(listKey, (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any) => ({
          ...p,
          sessions: (p.sessions ?? []).map((s: any) =>
            s.id === updateSession.id ? updateSession : s
          ),
        }));
        return { ...old, pages };
      });

      toast.success("Session title updated!");
      setEditingId(null);
      setEditTitle("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update title");
      setEditingId(null);
      setEditTitle("");
    },
  });

  const startEditing = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveTitle = () => {
    if (!editingId || !editTitle.trim()) return;

    const trimmedTitle = editTitle.trim();
    const currentSession = sessions.find((s) => s.id === editingId);

    if (trimmedTitle === currentSession?.title) {
      setEditingId(null);
      setEditTitle("");
      return;
    }

    updateTitleMutation.mutate({
      sessionId: editingId,
      title: trimmedTitle,
    });
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEditing();
    }
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);



  // Auto-fetch until the scroll container is actually scrollable (or no more pages)
  useEffect(() => {
    const el = document.getElementById("chatroom-scrollable");
    if (!el) return;

    // If content height <= container height, there is nothing to scroll,
    // so fetch the next page (if available). This effect will re-run after data updates.
    if (hasNextPage && !isFetchingNextPage && el.scrollHeight <= el.clientHeight) {
      fetchNextPage();
    }
  }, [sessions.length, hasNextPage, isFetchingNextPage, fetchNextPage]);


  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      trpcClient.chat.deleteChatSession.mutate({ id }),

    onSuccess: async (_res, id) => {
      queryClient.setQueryData(listKey, (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any) => ({
          ...p,
          sessions: (p.sessions ?? []).filter((s: any) => s.id !== id),
        }));
        return { ...old, pages };
      });

      toast.success("Chatroom deleted!");
      router.replace("/");
      setModalOpen(false);
      setSelectedId(null);
    },

    onError: () => {
      toast.error("Failed to delete chatroom");
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    deleteMutation.mutate(selectedId);
  };
  const handleCancelDelete = () => {
    if (deleteMutation.isPending) return;
    setModalOpen(false);
    setSelectedId(null);
  };

  if (status === "pending" && !data) {
    return <ChatRoomListSkeleton count={8} />;
  }

  return (
    <>
      {sessions.length > 0 && <div className="mb-2">Recent</div>}

      <InfiniteScroll
        dataLength={sessions.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <Loader2 className="w-8 h-5 animate-spin text-neutral-500" />
            </div>
          )
        }
        scrollThreshold="0.9"
        scrollableTarget="chatroom-scrollable"
        style={{ overflow: "visible" }}
      >
        <div className="space-y-1.5">
          {sessions.map((session) => {
            const isActive = activeId === session.id;
            const isEditing = editingId === session.id;
            return (
              <div
                key={session.id}
                className={`flex items-center group p-1 rounded-lg hover:bg-zinc-400/20 ${
                  isActive ? "bg-zinc-400/30 dark:bg-zinc-700/40" : ""
                }
                ${isEditing && "bg-zinc-400/20"}`}
              >
                {isEditing ? (
                  <>
                    <Input
                      ref={inputRef}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="!p-1 flex-1 h-8 text-sm focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 border-none !bg-transparent"
                      disabled={updateTitleMutation.isPending}
                    />
                    <div className="flex items-center gap-0.5 ml-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-green-100 hover:text-green-600"
                        onClick={handleSaveTitle}
                        disabled={
                          updateTitleMutation.isPending || !editTitle.trim()
                        }
                        title="Save"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                        onClick={handleCancelEditing}
                        disabled={updateTitleMutation.isPending}
                        title="Cancel"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/chats/${session.id}`}
                      onNavigate={() => onRoomClick && onRoomClick()}
                      passHref
                      className={`flex-1 block p-1 cursor-pointer transition truncate whitespace-nowrap text-sm font-semibold ${
                        isActive ? "font-semibold" : ""
                      }`}
                      title={session.title}
                    >
                      {session.title}
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 md:opacity-0 md:group-hover:opacity-100"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          title="Rename chat session"
                          onClick={() =>
                            startEditing(session.id, session.title)
                          }
                        >
                          <Edit size={12} />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-400 hover:!text-red-400 hover:!bg-red-800/10 font-medium"
                          title="Delete chat room"
                          onClick={() => openDeleteModal(session.id)}
                        >
                          <Trash2 className="text-red-400" size={12} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </InfiniteScroll>

      <ConfirmModal
        open={modalOpen}
        title="Delete Chatroom"
        description="Are you sure you want to delete this chatroom? This action cannot be undone."
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {status === "error" && (
        <div className="text-sm text-red-400 mt-2">
          {error?.message ?? "Failed to load chat sessions"}
        </div>
      )}
    </>
  );
}
