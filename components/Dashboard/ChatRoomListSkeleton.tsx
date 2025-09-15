import { Skeleton } from "@/components/ui/skeleton";

export default function ChatRoomListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center group p-2 rounded-full"
        >
          <Skeleton className="flex-1 h-6" />
          <Skeleton className="h-5 w-5 ml-2 rounded-full" />
        </div>
      ))}
    </div>
  );
}
