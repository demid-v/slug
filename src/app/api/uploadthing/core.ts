import { auth } from "@clerk/nextjs/server";
import Pusher from "pusher";
import superjson from "superjson";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { env } from "~/env";
import { getUserImagesForVoices } from "~/server/actions";
import { db } from "~/server/db";
import { voices } from "~/server/db/schema";
import { ratelimit } from "~/server/ratelimit";

const f = createUploadthing();

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

export const ourFileRouter = {
  voiceUploader: f({ audio: { maxFileSize: "4MB" } })
    .input(z.object({ chatId: z.number() }))
    .middleware(async ({ input }) => {
      const { userId } = auth();
      if (!userId) throw new UploadThingError("Unauthorized");

      const { success } = await ratelimit.limit(userId);
      if (!success) throw new UploadThingError("Too many requests");

      return { userId, chatId: input.chatId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const voice = await db
        .insert(voices)
        .values({
          url: file.url,
          chatId: metadata.chatId,
          userId: metadata.userId,
        })
        .returning();

      const voiceAndUserImage = await getUserImagesForVoices(voice);

      const stringifiedVoiceAndUserImage = superjson.stringify(
        voiceAndUserImage[0],
      );

      await pusher.trigger("slug-chat", "voice", stringifiedVoiceAndUserImage);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
