import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        name: z.string().min(2, "Name must be at least 2 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password, name } = input;

      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await ctx.prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
        },
      });

      return {
        success: true,
        message: "User created successfully. Please sign in.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }),
});
