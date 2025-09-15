import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { prisma } from "@/lib/prisma";

export interface Context {
  prisma: typeof prisma;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const createTRPCContext = async (opts: FetchCreateContextFnOptions): Promise<Context> => {
  return { prisma };
};
