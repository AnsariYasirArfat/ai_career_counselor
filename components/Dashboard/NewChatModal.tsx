"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC, useTRPCClient } from "@/app/_trpc/client";

const chatroomSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type ChatroomForm = z.infer<typeof chatroomSchema>;

interface NewChatModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeDrawer?: () => void;
}

export default function NewChatModal({
  open,
  setOpen,
  closeDrawer,
}: NewChatModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();

  const LIST_INPUT = { cursor: null as null, limit: 10 };
  const listOpts = trpc.chat.getChatSessions.infiniteQueryOptions(LIST_INPUT);
  const listKey = listOpts.queryKey;

  const form = useForm<ChatroomForm>({
    resolver: zodResolver(chatroomSchema),
    defaultValues: { title: "" },
  });

  const createMutation = useMutation({
    mutationFn: (title: string) =>
      trpcClient.chat.createChatSession.mutate({ title }),

    onSuccess: async (session) => {
      queryClient.setQueryData(listKey, (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any, idx: number) =>
          idx === 0 ? { ...p, sessions: [session, ...(p.sessions ?? [])] } : p
        );
        return { ...old, pages };
      });

      toast.success("Chatroom created!");
      form.reset();
      setOpen(false);
      if (closeDrawer) closeDrawer();
      router.push(`/chats/${session.id}`);

    },

    onError: () => {
      toast.error("Failed to create chatroom");
    },
  });

  const onSubmit = (data: ChatroomForm) => {
    const title = data.title.trim();
    if (!title) return;
    createMutation.mutate(title);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chat Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Enter title"
            {...form.register("title")}
            disabled={createMutation.isPending}
            autoFocus
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
          <DialogFooter className="sm:gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                disabled={createMutation.isPending}
              >
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
