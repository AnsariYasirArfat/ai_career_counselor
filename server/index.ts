import { router } from "./trpc";
import { chatRouter } from "./routers/chat";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  auth: authRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
