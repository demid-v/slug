import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";
import { useUploadThing } from "~/utils/uploadthing";

export const useUploader = (
  isRecording: boolean,
  voiceBlob: Blob | undefined,
) => {
  const router = useRouter();
  const { chatId } = useParams();

  const { startUpload, isUploading } = useUploadThing("voiceUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload Completed.", res);
      router.refresh();
    },
  });

  const chatIdParsed = z.coerce.number().parse(chatId);

  useEffect(() => {
    if (isRecording || typeof voiceBlob === "undefined") return;

    const file = new File([voiceBlob], `${new Date().toISOString()}.mp3`);
    void startUpload([file], { chatId: chatIdParsed });
  }, [isRecording, voiceBlob, startUpload, chatIdParsed]);

  return isUploading;
};
