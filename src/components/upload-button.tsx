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
    if (isRecording) {
      const constraints = { audio: true };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream);

          mediaRecorder.ondataavailable = (e) => {
            const file = new File([e.data], `${new Date().toISOString()}.mp3`);
            void startUpload([file]);
          };

          mediaRecorder.start();

          console.log(mediaRecorder.state);
          console.log("recorder started");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      mediaRecorder?.stop();

      console.log(mediaRecorder?.state);
      console.log("recorder stopped");
    }

    return () => {
      mediaRecorder?.stop();
      mediaRecorder = null;
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
