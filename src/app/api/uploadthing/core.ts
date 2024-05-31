import { auth } from "@clerk/nextjs/server";
import Pusher from "pusher";
import superjson from "superjson";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { env } from "~/env";
import { createVoice, getUserImagesForVoices } from "~/server/actions";
import { ratelimitVoices } from "~/server/ratelimit";

const f = createUploadthing();

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

export const voiceUploaderRouter = {
  voiceUploader: f({ audio: { maxFileSize: "4MB" } })
    .input(z.object({ duration: z.number(), chatId: z.number() }))
    .middleware(async ({ input: { duration, chatId } }) => {
      const { userId } = auth();
      if (!userId) throw new UploadThingError("Unauthorized");

      const { success } = await ratelimitVoices.limit(userId);
      if (!success) throw new UploadThingError("Too many requests");

      return { duration, chatId, userId };
    })
    .onUploadComplete(
      async ({ metadata: { chatId, userId, duration }, file }) => {
        const voice = await createVoice(file.url, duration, chatId, userId);

        const voiceAndUserImage = await getUserImagesForVoices(voice);

        const stringifiedVoiceAndUserImage = superjson.stringify(
          voiceAndUserImage[0],
        );

        await pusher.trigger(
          `slug-chat-${chatId}`,
          "voice",
          stringifiedVoiceAndUserImage,
        );
      },
    ),
} satisfies FileRouter;

export type VoiceUploaderRouter = typeof voiceUploaderRouter;
