import { useEffect, useRef, useState } from "react";

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder>();
  const voiceBlob = useRef<Blob>();

  const isStarting = useRef(false);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    isStarting.current = false;
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const setVoiceBlob = (event: BlobEvent) => (voiceBlob.current = event.data);

  const toggleRecording = async () => {
    if (isStarting.current) return;

    if (isRecording) {
      mediaRecorder.current?.stop();
      return;
    }

    isStarting.current = true;

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
    const cleanup = () => {
      mediaRecorder.current?.stream
        .getAudioTracks()
        .forEach((track) => track.stop());

      mediaRecorder.current?.removeEventListener("start", startRecording);
      mediaRecorder.current?.removeEventListener("stop", stopRecording);
      mediaRecorder.current?.removeEventListener("dataavailable", setVoiceBlob);
    };

    if (!isRecording) cleanup();

    return () => {
      if (!isRecording) return;

      mediaRecorder.current?.stop();
      cleanup();
    };
  }, [isRecording]);

  return { toggleRecording, isRecording, voiceBlob: voiceBlob.current };
};
