"use server";

import { clerkClient, type User } from "@clerk/nextjs/server";
import { type InferSelectModel } from "drizzle-orm";
import { db } from "~/server/db";
import { chats, voices } from "~/server/db/schema";

export type Voice = InferSelectModel<typeof voices>;

type VoiceAndUserImage = {
  voice: Voice;
  userImage: string | undefined;
};

export const getVoicesAndUserImages = async (
  chatId: number,
  cursor?: number,
) => {
  const voices = await db.query.voices.findMany({
    where: (voices, { eq, and, lt }) =>
      and(
        eq(voices.chatId, chatId),
        typeof cursor !== "undefined" ? lt(voices.id, cursor) : undefined,
      ),
    limit: 15,
    orderBy: (voices, { desc }) => [desc(voices.createdAt)],
  });

  return await getUserImagesForVoices(voices);
};

export const getUserImagesForVoices = async (voices: Voice[]) => {
  const users = await Promise.allSettled(
    voices.map((voice) => clerkClient.users.getUser(voice.userId)),
  );

  const findUserImage = (userId: string) =>
    (
      users.find(
        (user) => user.status === "fulfilled" && user.value.id === userId,
      ) as PromiseFulfilledResult<User> | undefined
    )?.value.imageUrl;

  const voicesAndUserImages = voices.reduce(
    (acc, voice) =>
      acc.set(voice.id, {
        voice,
        userImage: findUserImage(voice.userId),
      }),
    new Map<number, VoiceAndUserImage>(),
  );

  return [...voicesAndUserImages];
};

export type VoicesAndUserImages = Awaited<
  ReturnType<typeof getVoicesAndUserImages>
>;

export const getChats = async () =>
  await db.query.chats.findMany({
    orderBy: (voices, { desc }) => [desc(voices.createdAt)],
  });

export const createChat = async (name: string) => {
  await db.insert(chats).values({ name });
};

export const createVoice = async (
  url: string,
  chatId: number,
  userId: string,
) =>
  await db
    .insert(voices)
    .values({
      url,
      chatId,
      userId,
    })
    .returning();
