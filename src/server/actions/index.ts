"use server";

import { ratelimitChats } from "../ratelimit";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { type InferSelectModel, count } from "drizzle-orm";
import { db } from "~/server/db";
import { chats, users, usersToChats, voices } from "~/server/db/schema";
import { isPromiseFulfilledResult } from "~/utils";

export type Voice = InferSelectModel<typeof voices>;

export const getVoicesAndUserImages = async (
  chatId: number,
  cursor?: number,
) => {
  const voices = await db.query.voices.findMany({
    where: (voices, { and, eq, lt }) =>
      and(
        eq(voices.chatId, chatId),
        typeof cursor !== "undefined" ? lt(voices.id, cursor) : undefined,
      ),
    limit: 15,
    orderBy: (voices, { desc }) => [desc(voices.createdAt), desc(voices.id)],
  });

  return await getUserImagesForVoices(voices);
};

export type VoicesAndUserImages = Awaited<
  ReturnType<typeof getVoicesAndUserImages>
>;

export const getUserImagesForVoices = async (voices: Voice[]) =>
  (
    await Promise.allSettled(
      voices.map(async (voice) => ({
        ...voice,
        imageUrl: (await clerkClient.users.getUser(voice.userId)).imageUrl,
      })),
    )
  )
    .filter(isPromiseFulfilledResult)
    .map((result) => result.value);

export const getChats = async (page = 1, limit = 40) =>
  await db.query.chats.findMany({
    offset: (page - 1) * limit,
    limit,
    orderBy: (chats, { desc }) => [desc(chats.createdAt), desc(voices.id)],
  });

export const getMyChats = async (userId: string) =>
  (
    await db.query.usersToChats.findMany({
      where: (usersToChats, { eq }) => eq(usersToChats.userId, userId),
      with: {
        chat: true,
      },
      orderBy: (usersToChats, { desc }) => [desc(usersToChats.joinedAt)],
    })
  ).map((usersToChats) => usersToChats.chat);

export const getChatName = async (chatId: number) =>
  (
    await db.query.chats.findFirst({
      where: (chat, { eq }) => eq(chat.id, chatId),
    })
  )?.name;

export const createChat = async (name: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const { success } = await ratelimitChats.limit(userId);
  if (!success) throw new Error("Too many requests");

  await db.insert(chats).values({ name });
};

export const createVoice = async (
  url: string,
  duration: number,
  chatId: number,
  userId: string,
) =>
  await db
    .insert(voices)
    .values({
      url,
      duration,
      chatId,
      userId,
    })
    .returning();

export const subscribeUserToChat = async (userId: string, chatId: number) => {
  await db.insert(users).values({ id: userId }).onConflictDoNothing();
  await db
    .insert(usersToChats)
    .values({ userId, chatId })
    .onConflictDoNothing();
};

export const getChatsCount = async () =>
  (await db.select({ count: count() }).from(chats))[0]?.count ?? 0;
