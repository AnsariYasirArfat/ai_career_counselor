"use client";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import SearchBar from "@/components/Search/SearchBar";
import SearchListSkeleton from "@/components/Search/SearchListSkeleton";
import SearchChatRoomList from "@/components/Search/SearchChatRoomList";
import { useTRPC } from "@/app/_trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 10;

export default function SearchPage() {
  const trpc = useTRPC();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const effectiveQ = debouncedQuery?.trim() || undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    trpc.chat.searchChatSessions.infiniteQueryOptions(
      { query: effectiveQ, limit: ITEMS_PER_PAGE, cursor: null }, 
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      }
    )
  );

  const rooms = (data?.pages ?? []).flatMap((p) => p.sessions);

  return (
    <div className="flex flex-col items-center flex-1 w-full min-h-0 px-4">
      <div className="w-full flex-1 min-h-0 flex flex-col max-w-[760px]">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold py-8">Search</h1>

        <SearchBar
          value={query}
          loading={isFetching && !data}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <div className="text-sm sm:text-base lg:text-lg font-semibold mb-2">Recent</div>

          {isLoading ? (
            <SearchListSkeleton count={5} />
          ) : rooms.length === 0 ? (
            <div className="text-zinc-400">No chats found.</div>
          ) : (
            <SearchChatRoomList
              rooms={rooms}
              hasMore={!!hasNextPage}
              loadMore={fetchNextPage}
              loader={<SearchListSkeleton count={2} />}
              scrollableTarget="search-scrollable"
            />
          )}
        </div>
      </div>
    </div>
  );
}