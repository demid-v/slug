import { useEffect, useRef, useState } from "react";

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder>();
  const voiceBlob = useRef<Blob>();

  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const setVoiceBlob = (event: BlobEvent) => {
    voiceBlob.current = event.data;
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
      return;
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      mediaRecorder.current = new MediaRecorder(audioStream);

      mediaRecorder.current.addEventListener("start", startRecording);
      mediaRecorder.current.addEventListener("stop", stopRecording);
      mediaRecorder.current.addEventListener("dataavailable", setVoiceBlob);

      mediaRecorder.current.start();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isRecording) {
      mediaRecorder.current?.stream
        .getAudioTracks()
        .forEach((track) => track.stop());

      mediaRecorder.current?.removeEventListener("start", startRecording);
      mediaRecorder.current?.removeEventListener("stop", stopRecording);
      mediaRecorder.current?.removeEventListener("dataavailable", setVoiceBlob);
    }

    return () => {
      if (!isRecording) return;

      mediaRecorder.current?.stop();
      mediaRecorder.current?.stream
        .getAudioTracks()
        .forEach((track) => track.stop());

      mediaRecorder.current?.removeEventListener("start", startRecording);
      mediaRecorder.current?.removeEventListener("stop", stopRecording);
      mediaRecorder.current?.removeEventListener("dataavailable", setVoiceBlob);
    };
  }, [isRecording]);

  return { toggleRecording, isRecording, voiceBlob: voiceBlob.current };
};
