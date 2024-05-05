import { useParams } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";
import { useUploadThing } from "~/utils/uploadthing";

export const useUploader = (voiceBlob: Blob | undefined) => {
  const { chatId } = useParams();
  const chatIdParsed = z.coerce.number().parse(chatId);

  const { startUpload, isUploading } = useUploadThing("voiceUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload Completed.", res);
    },
  });

  useEffect(() => {
    if (typeof voiceBlob === "undefined") return;

    const file = new File([voiceBlob], `${new Date().toISOString()}.mp3`);
    const audio = new Audio(URL.createObjectURL(voiceBlob));

    audio.addEventListener("loadedmetadata", () => {
      audio.currentTime = 1e101;

      audio.addEventListener("loadeddata", () => {
        void startUpload([file], {
          duration: audio.duration,
          chatId: chatIdParsed,
        });
      });

      URL.revokeObjectURL(audio.src);
    });
  }, [voiceBlob, chatIdParsed, startUpload]);

  return isUploading;
};
