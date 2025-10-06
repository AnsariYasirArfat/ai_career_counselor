import { z } from "zod";

export const chatroomSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type ChatroomForm = z.infer<typeof chatroomSchema>;