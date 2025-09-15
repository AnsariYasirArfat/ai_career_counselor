import { useState, useMemo } from "react";

interface UseInfiniteScrollOptions<T> {
  items: T[];
  itemsPerPage?: number;
  direction?: "down" | "up";
}

export function useInfiniteScroll<T>({
  items,
  itemsPerPage = 10,
  direction = "down",
}: UseInfiniteScrollOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const displayedItems = useMemo(() => {
    if (direction === "down") {
      return items.slice(0, currentPage * itemsPerPage);
    } else {
      const start = Math.max(items.length - currentPage * itemsPerPage, 0);
      return items.slice(start).reverse();
    }
  }, [items, currentPage, itemsPerPage, direction]);

  const loadMore = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCurrentPage((prev) => prev + 1);
    setIsLoading(false);
  };

  const hasMore = displayedItems.length < items.length;

  const resetItems = () => {
    setCurrentPage(1);
    setIsLoading(false);
  };

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore,
    resetItems,
  };
}
