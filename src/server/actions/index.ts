"use server";

import { clerkClient, type User } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export const getVoices = async () => {
  const voices = await db.query.voices.findMany({
    orderBy: (voices, { desc }) => [desc(voices.createdAt)],
  });

  const users = await Promise.allSettled(
    voices.map((voice) => clerkClient.users.getUser(voice.userId)),
  );

  type VoiceAndUserImg = {
    voice: (typeof voices)[number];
    userImg: string | undefined;
  };

  const findUserImg = (userId: string) =>
    (
      users.find(
        (user) => user.status === "fulfilled" && user.value.id === userId,
      ) as PromiseFulfilledResult<User> | undefined
    )?.value.imageUrl;

  const voicesAndUserImgs = voices.reduce(
    (acc, voice) =>
      acc.set(voice.id, {
        voice,
        userImg: findUserImg(voice.userId),
      }),
    new Map<number, VoiceAndUserImg>(),
  );

  return [...voicesAndUserImgs];
};

export type GetVoices = Awaited<ReturnType<typeof getVoices>>;

export const getChats = async () =>
  await db.query.chats.findMany({
    orderBy: (voices, { desc }) => [desc(voices.createdAt)],
  });
