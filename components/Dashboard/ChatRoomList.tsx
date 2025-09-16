"use client";
import { useState, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2, Trash2 } from "lucide-react";
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

const ITEMS_PER_PAGE = 10;

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

  const listOpts = trpc.chat.getChatSessions.infiniteQueryOptions(
    { limit: ITEMS_PER_PAGE, cursor: null },
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
  const handleCancel = () => {
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
        <div className="space-y-2">
          {sessions.map((room) => {
            const isActive = activeId === room.id;
            return (
              <div
                key={room.id}
                className={`flex items-center group p-2 rounded-lg hover:bg-zinc-400/20 ${
                  isActive ? "bg-zinc-400/30 dark:bg-zinc-700/40" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Link
                  href={`/chats/${room.id}`}
                  onNavigate={() => onRoomClick && onRoomClick()}
                  passHref
                  className={`flex-1 block p-1 cursor-pointer transition truncate whitespace-nowrap ${
                    isActive ? "font-semibold" : ""
                  }`}
                  title={room.title}
                >
                  {room.title}
                </Link>
                <button
                  onClick={() => openDeleteModal(room.id)}
                  className={`ml-2 p-2 rounded-lg transition-colors text-zinc-400 lg:opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                    isActive
                      ? "hover:bg-zinc-500 hover:text-red-300"
                      : "hover:bg-zinc-500 hover:text-red-300"
                  }`}
                  title="Delete chat room"
                  tabIndex={0}
                >
                  <Trash2 size={16} />
                </button>
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
        onCancel={handleCancel}
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
