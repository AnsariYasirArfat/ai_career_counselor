import { Skeleton } from "@/components/ui/skeleton";

export default function ChatRoomSkeleton() {
  return (
    <div className="flex flex-col flex-1 h-full min-h-0 px-4 w-full">
      <div className="flex-1 min-h-0 flex flex-col gap-4 max-w-[760px] mx-auto w-full py-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-5 py-3 rounded-3xl shadow-md ${
                i % 2 === 0
                  ? "bg-[#f0f4f9] dark:bg-gradient-to-br from-[#333537] to-[#424548] rounded-tr-md"
                  : "bg-transparent border rounded-tl-md"
              }`}
            >
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full px-4 py-3">
        <div className="max-w-[760px] mx-auto">
          <div className="border border-zinc-400/50 rounded-3xl p-4">
            <Skeleton className="h-10 w-full mb-3" />
            <div className="flex items-center justify-between pt-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
