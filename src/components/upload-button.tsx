"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUploadThing } from "~/utils/uploadthing";
import { Button } from "./ui/button";
import { Mic } from "lucide-react";

let mediaRecorder: MediaRecorder | null = null;

export const RecordButton = () => {
  const router = useRouter();

  const [isRecording, setIsRecording] = useState(false);

  const { startUpload } = useUploadThing("voiceUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload Completed.", res);

      router.refresh();
    },
  });

  useEffect(() => {
    const dataAvailable = (e: BlobEvent) => {
      const file = new File([e.data], `${new Date().toISOString()}.mp3`);
      void startUpload([file]);
    };

    const start = () => {
      console.log(mediaRecorder?.state);
      console.log("recorder started");
    };

    const stop = () => {
      console.log(mediaRecorder?.state);
      console.log("recorder stopped");

      if (mediaRecorder === null) {
        return;
      }

      mediaRecorder.stream.getTracks().forEach((track) => {
        track.stop();
      });

      mediaRecorder.removeEventListener("dataavailable", dataAvailable);
      mediaRecorder.removeEventListener("start", start);
      mediaRecorder.removeEventListener("stop", stop);

      mediaRecorder = null;
    };

    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          console.log("new MediaRecorder");
          mediaRecorder = new MediaRecorder(stream);

          mediaRecorder.addEventListener("dataavailable", dataAvailable);
          mediaRecorder.addEventListener("start", start);
          mediaRecorder.addEventListener("stop", stop);

          mediaRecorder.start();
        })
        .catch((err) => {
          console.error(err);
        });
    }

    return () => {
      mediaRecorder?.stop();
    };
  }, [isRecording, startUpload]);

  return (
    <div className="flex items-center justify-start gap-5 px-2">
      <Button
        onClick={() => setIsRecording((state) => !state)}
        className="h-auto w-auto rounded-full py-4"
      >
        <Mic />
      </Button>
      {isRecording ? <span>Stop Recording</span> : <span>Start Recording</span>}
    </div>
  );
};
