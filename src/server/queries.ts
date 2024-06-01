import { type Voice } from "./actions";
import { clerkClient } from "@clerk/clerk-sdk-node";
import "server-only";
import { isPromiseFulfilledResult } from "~/utils";

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
