"use client";

import { Button } from "./ui/button";
import { Mic, Radio } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecorder, usePusher } from "~/hooks";
import { useUploadThing } from "~/utils/uploadthing";

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
    if (isRecording) return "Stop recording";
    if (isUploading) return "Uploading...";
    return "Start recording";
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
