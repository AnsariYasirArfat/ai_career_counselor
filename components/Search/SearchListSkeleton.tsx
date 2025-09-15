import { Skeleton } from "@/components/ui/skeleton";

export default function SearchListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul>
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="flex items-center justify-between border-b border-zinc-800 p-4 "
        >
          <div className="flex-1">
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-3 w-12 ml-4" />
        </li>
      ))}
    </ul>
  );
}