import { Button } from "./ui/button";
import { Radio, Mic } from "lucide-react";
import { useAudioRecorder, useUploader } from "~/hooks";

const Recorder = () => {
  const {
    isRecording,
    startRecording,
    stopRecording,
    recordingBlob: voiceBlob,
  } = useAudioRecorder();

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    startRecording();
  };

  const isUploading = useUploader(voiceBlob);

  return (
    <div className="flex items-center justify-start gap-5 px-2">
      <Button
        onClick={toggleRecording}
        className="h-auto w-auto rounded-full p-3"
        disabled={isUploading}
      >
        {isRecording ? <Radio /> : <Mic />}
      </Button>
      {isUploading && <span className="text-lg font-medium">Uploading...</span>}
    </div>
  );
};

export default Recorder;
