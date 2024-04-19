import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  voiceUploader: f({ audio: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete.");
      console.log("file url", file.url);
 
      return { uploadUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
