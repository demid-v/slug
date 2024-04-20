import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { voices } from "~/server/db/schema";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  voiceUploader: f({ audio: { maxFileSize: "4MB" } })
    .middleware(() => {
      const { userId } = auth();

      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(voices).values({ url: file.url, userId: metadata.userId });
     }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
