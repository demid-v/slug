"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { type InferSelectModel } from "drizzle-orm";
import { db } from "~/server/db";
import { chats, users, usersToChats, voices } from "~/server/db/schema";

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
    orderBy: (voices, { desc }) => [desc(voices.createdAt)],
  });

  return await getUserImagesForVoices(voices);
};

export type VoicesAndUserImages = Awaited<
  ReturnType<typeof getVoicesAndUserImages>
>;

export const getUserImagesForVoices = async (voices: Voice[]) =>
  (
    await Promise.allSettled(
      voices.map(async (voice) => {
        try {
          const imageUrl = (await clerkClient.users.getUser(voice.userId))
            .imageUrl;
          return { ...voice, imageUrl };
        } catch (error) {
          console.log(error);
        }

        return voice;
      }),
    )
  )
    .filter((result) => result.status === "fulfilled")
    .map(
      (result) =>
        (result as PromiseFulfilledResult<Voice & { imageUrl?: string }>).value,
    );

export const getChats = async () =>
  await db.query.chats.findMany({
    orderBy: (voices, { desc }) => [desc(voices.createdAt)],
  });

export const getChatName = async (chatId: number) =>
  (
    await db.query.chats.findFirst({
      where: (chat, { eq }) => eq(chat.id, chatId),
    })
  )?.name;

export const createChat = async (name: string) => {
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
