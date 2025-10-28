"use client";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import SearchBar from "@/components/Search/SearchBar";
import SearchListSkeleton from "@/components/Search/SearchListSkeleton";
import SearchChatRoomList from "@/components/Search/SearchChatRoomList";
import { useTRPC } from "@/app/_trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import NewChatButton from "@/components/common/NewChatButton";
import { Plus } from "lucide-react";
import { SEARCH_SESSIONS_PER_PAGE } from "@/constant/pageLimits";

export default function SearchPage() {
  const trpc = useTRPC();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const effectiveQ = debouncedQuery?.trim() || undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    trpc.chat.searchChatSessions.infiniteQueryOptions(
      { query: effectiveQ, limit: SEARCH_SESSIONS_PER_PAGE, cursor: null },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      }
    )
  );

  const rooms = (data?.pages ?? []).flatMap((p) => p.sessions);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col max-w-[920px]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
          Search
        </h1>

        <NewChatButton
          variant="outline"
          size="sm"
          className="hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </NewChatButton>
      </div>

      <SearchBar
        value={query}
        loading={isFetching && !data}
        onChange={setQuery}
        onClear={() => setQuery("")}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <div className="text-sm sm:text-base lg:text-lg font-semibold mb-2">
          Recent
        </div>

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
  );
}
