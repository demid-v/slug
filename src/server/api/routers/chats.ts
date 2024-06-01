import { count } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { chats, voices } from "~/server/db/schema";

export const chatsRouter = createTRPCRouter({
  getChats: protectedProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(40),
      }),
    )
    .query(
      async ({ input: { page, limit } }) =>
        await db.query.chats.findMany({
          offset: (page - 1) * limit,
          limit,
          orderBy: (chats, { desc }) => [
            desc(chats.createdAt),
            desc(voices.id),
          ],
        }),
    ),

  getMyChats: protectedProcedure
    .input(z.string())
    .query(async ({ input: userId }) =>
      (
        await db.query.usersToChats.findMany({
          where: (usersToChats, { eq }) => eq(usersToChats.userId, userId),
          with: {
            chat: true,
          },
          orderBy: (usersToChats, { desc }) => [desc(usersToChats.joinedAt)],
        })
      ).map((usersToChats) => usersToChats.chat),
    ),

  getChatName: protectedProcedure.input(z.number()).query(
    async ({ input: chatId }) =>
      (
        await db.query.chats.findFirst({
          where: (chat, { eq }) => eq(chat.id, chatId),
        })
      )?.name,
  ),

  getChatsCount: protectedProcedure.query(
    async () =>
      (await db.select({ count: count() }).from(chats))[0]?.count ?? 0,
  ),
});
