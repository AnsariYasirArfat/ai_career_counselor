import { Skeleton } from "@/components/ui/skeleton";

export default function ChatRoomListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center group p-1 rounded-lg"
        >
          <Skeleton className="flex-1 h-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}
