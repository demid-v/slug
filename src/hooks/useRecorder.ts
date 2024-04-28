import { useEffect } from "react";
import { type ClientUploadedFileData } from "uploadthing/types";

let mediaRecorder: MediaRecorder | null = null;

export const useRecorder = (
  isRecording: boolean,
  chatId: number,
  startUpload: (
    files: File[],
    input: { chatId: number },
  ) => Promise<ClientUploadedFileData<null>[] | undefined>,
) => {
  useEffect(() => {
    if (!isRecording) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        const uploadVoice = (e: BlobEvent) => {
          const file = new File([e.data], `${new Date().toISOString()}.mp3`);
          void startUpload([file], { chatId });
        };

        const stopRecording = () => {
          mediaRecorder?.stream.getTracks().forEach((track) => track.stop());

          mediaRecorder?.removeEventListener("dataavailable", uploadVoice);
          mediaRecorder?.removeEventListener("stop", stopRecording);
        };

        mediaRecorder.addEventListener("dataavailable", uploadVoice);
        mediaRecorder.addEventListener("stop", stopRecording);

        mediaRecorder.start();
      })
      .catch((err) => {
        console.error(err);
      });

    return () => mediaRecorder?.stop();
  }, [isRecording, chatId, startUpload]);
};
