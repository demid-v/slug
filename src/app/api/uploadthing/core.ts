import { auth } from "@clerk/nextjs/server";
import Pusher from "pusher";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { voices } from "~/server/db/schema";

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
    .middleware(() => {
      const { userId } = auth();

      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .insert(voices)
        .values({ url: file.url, userId: metadata.userId });

      await pusher.trigger("chat-messages", "message", null);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
