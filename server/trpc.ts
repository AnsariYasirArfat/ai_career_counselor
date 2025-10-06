import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Context {
  prisma: typeof prisma;
  user: User | null;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const createTRPCContext = async (
  opts: FetchCreateContextFnOptions
): Promise<Context> => {
  const session = await auth();
  return {
    prisma,
    user: session?.user?.id
      ? {
          id: session.user.id!,
          email: session.user.email!,
          name: session.user.name || null,
        }
      : null,
  };
};
