import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTRPC, useTRPCClient } from "@/app/_trpc/client";

interface UseCreateChatSessionOptions {
  onSuccess?: (session: any) => void;
  onError?: (error: any) => void;
}

export function useCreateChatSession(options: UseCreateChatSessionOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();

  const LIST_INPUT = { cursor: null as null, limit: 10 };
  const listOpts = trpc.chat.getChatSessions.infiniteQueryOptions(LIST_INPUT);
  const listKey = listOpts.queryKey;

  const createChatSession = useMutation({
    mutationFn: () =>
      trpcClient.chat.createChatSession.mutate({ title: "New Session" }),
    
    onSuccess: async (session) => {
      // Update cache
      queryClient.setQueryData(listKey, (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any, idx: number) =>
          idx === 0 ? { ...p, sessions: [session, ...(p.sessions ?? [])] } : p
        );
        return { ...old, pages };
      });

      toast.success("New chat session created!");
      router.push(`/chats/${session.id}`);
      
      // Call custom success handler
      options.onSuccess?.(session);
    },
    
    onError: (error) => {
      toast.error(error.message || "Failed to create chat session");
      options.onError?.(error);
    },
  });

  return {
    createChatSession: createChatSession.mutate,
    isCreating: createChatSession.isPending,
  };
}
