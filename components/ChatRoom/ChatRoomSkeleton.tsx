import { Skeleton } from "@/components/ui/skeleton";

export default function ChatRoomSkeleton() {
  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full">
      <div className="flex-1 min-h-0 flex flex-col max-w-[920px] mx-auto w-full">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex justify-center mx-1 mb-3 sm:mb-4 ${
              i % 2 === 0 ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative min-w-64 max-w-[80%] px-3 sm:px-5 py-1.5 sm:py-3 rounded-2xl sm:rounded-3xl shadow-md text-sm sm:text-base ${
                i % 2 === 0
                  ? "bg-[#f0f4f9] dark:bg-gradient-to-br from-[#333537] to-[#424548] !rounded-tr-xs sm:!rounded-tr-sm"
                  : "bg-transparent border !rounded-tl-xs sm:!rounded-tl-sm"
              }`}
            >
              <Skeleton className="h-4 w-40 mb-2" />
              {i % 2 !== 0 && (
                <>
                  {" "}
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-4 w-40 mb-2" />
                </>
              )}
              <div className="flex items-center justify-between mt-1 gap-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full py-2">
        <div className="max-w-[920px] mx-auto">
          <div className="border border-zinc-400/50 rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 md:p-4 flex">
            <Skeleton className="flex-1 h-5 w-full mr-2" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
