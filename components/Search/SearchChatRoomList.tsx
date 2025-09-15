import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";

interface ChatRoomListProps {
  rooms: any[];
  hasMore: boolean;
  loadMore: () => void;
  loader: React.ReactNode;
  scrollableTarget: string;
}

export default function SearchChatRoomList({
  rooms,
  hasMore,
  loadMore,
  loader,
  scrollableTarget,
}: ChatRoomListProps) {
  return (
    <div
      id={scrollableTarget}
      className="overflow-y-auto scrollbar-none flex-1 min-h-0"
    >
      <InfiniteScroll
        dataLength={rooms.length}
        next={loadMore}
        hasMore={hasMore}
        loader={loader}
        scrollThreshold="0.9"
        style={{ overflow: "visible" }}
        scrollableTarget={scrollableTarget}
      >
        {rooms.map((room) => (
          <Link
            href={`/chats/${room.id}`}
            key={room.id}
            className="flex items-center justify-between border-b border-zinc-800 p-4 hover:bg-zinc-200/20 flex-1 font-medium hover:underline truncate"
          >
            {room.title}
            <span className="text-xs text-zinc-400 ml-4 whitespace-nowrap">
              {new Date(room.lastUpdated || room.createdAt).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                }
              )}
            </span>
          </Link>
        ))}
      </InfiniteScroll>
    </div>
  );
}
