"use client";

import { Button } from "./ui/button";
import { Mic, Radio } from "lucide-react";
import { useRecorder, useUploader } from "~/hooks";

export const Recorder = () => {
  const { toggleRecording, isRecording, voiceBlob } = useRecorder();

  const isUploading = useUploader(isRecording, voiceBlob);

  const recorderText = isRecording
    ? "Stop recording"
    : isUploading
      ? "Uploading..."
      : "Start recording";

  return (
    <div className="flex items-center justify-start gap-5 px-2">
      <Button
        onClick={toggleRecording}
        className="h-auto w-auto rounded-full p-3"
        disabled={isUploading}
      >
        {isRecording ? <Radio /> : <Mic />}
      </Button>
      <span className="text-lg font-medium">{recorderText}</span>
    </div>
  );
};
