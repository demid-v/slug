import { db } from "./db";
import { voices } from "./db/schema";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { type InferSelectModel } from "drizzle-orm";
import "server-only";
import { isPromiseFulfilledResult } from "~/utils";

export type Voice = InferSelectModel<typeof voices>;

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
