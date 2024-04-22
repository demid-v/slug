"use client";

import { Button } from "./ui/button";
import { Mic, Radio } from "lucide-react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { type ClientUploadedFileData } from "uploadthing/types";
import { env } from "~/env";
import { useUploadThing } from "~/utils/uploadthing";

let mediaRecorder: MediaRecorder | null = null;

const useRecorder = (
  isRecording: boolean,
  startUpload: (
    files: File[],
    input?: undefined,
  ) => Promise<ClientUploadedFileData<null>[] | undefined>,
) => {
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

      if (mediaRecorder === null) return;

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

    return () => mediaRecorder?.stop();
  }, [isRecording, startUpload]);
};

const usePusher = () => {
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat-messages");

    channel.bind("message", () => router.refresh());

    return () => {
      pusher?.unsubscribe("chat-messages");
      channel.unbind_all();
    };
  }, [router]);
};

export const Recorder = () => {
  const router = useRouter();

  const [isRecording, setIsRecording] = useState(false);

  const { startUpload, isUploading } = useUploadThing("voiceUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload Completed.", res);

      router.refresh();
    },
  });

  const recorderText = (() => {
    if (isRecording) return "Stop Recording";
    if (isUploading) return "Uploading...";
    return "Start Recording";
  })();

  useRecorder(isRecording, startUpload);
  usePusher();

  return (
    <div className="flex items-center justify-start gap-5 px-2">
      <Button
        onClick={() => setIsRecording((state) => !state)}
        className="h-auto w-auto rounded-full p-3"
        disabled={isUploading}
      >
        {isRecording ? <Radio /> : <Mic />}
      </Button>
      <span className="text-lg font-medium">{recorderText}</span>
    </div>
  );
};
