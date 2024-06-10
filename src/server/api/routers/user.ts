import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { users, usersToChats } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  subscribeToChat: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        chatId: z.number(),
      }),
    )
    .mutation(async ({ input: { userId, chatId } }) => {
      await db.insert(users).values({ id: userId }).onConflictDoNothing();
      await db
        .insert(usersToChats)
        .values({ userId, chatId })
        .onConflictDoNothing();
    }),
});
