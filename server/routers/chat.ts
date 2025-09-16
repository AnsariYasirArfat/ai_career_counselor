import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { generateCareerReply } from "@/lib/ai/gemini";

export const chatRouter = router({
  getChatSessions: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullable(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const { cursor, limit } = input;

        const sessions = await ctx.prisma.chatSession.findMany({
          take: limit + 1,
          ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
          }),
          where: {
            deletedAt: null,
          },
          orderBy: { updatedAt: "desc" },
          include: {
            message: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        const hasNextPage = sessions.length > limit;
        if (hasNextPage) {
          sessions.pop();
        }

        return {
          sessions,
          nextCursor: hasNextPage ? sessions[sessions.length - 1]?.id : null,
          hasNextPage,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch chat sessions",
        });
      }
    }),

  searchChatSessions: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        cursor: z.string().nullable(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const { query, cursor, limit } = input;

        const sessions = await ctx.prisma.chatSession.findMany({
          take: limit + 1,
          ...(cursor && { cursor: { id: cursor }, skip: 1 }),
          where: {
            deletedAt: null,
            ...(query &&
              query.trim() && {
                title: { contains: query.trim(), mode: "insensitive" },
              }),
          },
          orderBy: { updatedAt: "desc" },
          include: {
            message: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        const hasNextPage = sessions.length > limit;
        if (hasNextPage) sessions.pop();

        return {
          sessions,
          nextCursor: hasNextPage ? sessions[sessions.length - 1]?.id : null,
          hasNextPage,
        };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search chat sessions",
        });
      }
    }),

  getMessages: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const { sessionId, cursor, limit } = input;

        const session = await ctx.prisma.chatSession.findFirst({
          where: {
            id: sessionId,
            deletedAt: null,
          },
        });

        if (!session) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chat session not found or deleted",
          });
        }

        const messages = await ctx.prisma.message.findMany({
          where: { sessionId },
          take: limit + 1,
          ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
          }),
          orderBy: { createdAt: "desc" },
        });

        const hasNextPage = messages.length > limit;

        const orderedMessages = hasNextPage ? messages.slice(0, -1) : messages;
        return {
          messages: orderedMessages,
          nextCursor: hasNextPage
            ? orderedMessages[orderedMessages.length - 1]?.id
            : null,
          hasNextPage,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch messages",
        });
      }
    }),

  createChatSession: publicProcedure
    .input(z.object({ title: z.string().min(1, "Title is required") }))
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await ctx.prisma.chatSession.create({
          data: {
            title: input.title,
          },
        });
        return session;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create chat session",
        });
      }
    }),

  sendMessage: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        content: z.string().min(1, "Message cannot be empty"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await ctx.prisma.chatSession.findFirst({
          where: {
            id: input.sessionId,
            deletedAt: null,
          },
        });

        if (!session) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chat session not found or deleted",
          });
        }

        const userMessage = await ctx.prisma.message.create({
          data: {
            sessionId: input.sessionId,
            role: "USER",
            content: input.content,
          },
        });

        await ctx.prisma.chatSession.update({
          where: { id: input.sessionId },
          data: { updatedAt: new Date() },
        });

        const LAST_N = 20;
        const recent = await ctx.prisma.message.findMany({
          where: { sessionId: input.sessionId },
          orderBy: { createdAt: "asc" },
          take: LAST_N,
        });

        let aiText: string;
        try {
          aiText = await generateCareerReply(
            recent.map((m) => ({
              role: m.role as "USER" | "ASSISTANT",
              content: m.content,
            }))
          );
        } catch (e) {
          aiText =
            "I ran into an issue generating a response. Please try again.";
        }

        const aiMessage = await ctx.prisma.message.create({
          data: {
            sessionId: input.sessionId,
            role: "ASSISTANT",
            content: aiText,
          },
        });

        return {
          userMessage,
          aiMessage,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message",
        });
      }
    }),

  deleteChatSession: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await ctx.prisma.chatSession.findFirst({
          where: {
            id: input.id,
            deletedAt: null,
          },
        });

        if (!session) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chat session not found or already deleted",
          });
        }

        const result = await ctx.prisma.chatSession.update({
          where: { id: input.id },
          data: { deletedAt: new Date() },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete chat session",
        });
      }
    }),
});
