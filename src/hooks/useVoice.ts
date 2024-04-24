import { type Dispatch, type SetStateAction, useRef, useEffect } from "react";

export const useVoice = (
  url: string,
  duration: number | undefined,
  setIsPlaying: Dispatch<SetStateAction<boolean>>,
  setDuration: Dispatch<SetStateAction<number | undefined>>,
  setCurrentTime: Dispatch<SetStateAction<number>>,
  setLocaleCreatedAt: Dispatch<SetStateAction<string>>,
  createdAt: Date,
) => {
  const voice = useRef<HTMLAudioElement | null>(null);

  const toggleVoiceState = () => {
    if (voice.current === null) return;

    if (voice.current.paused) void voice.current.play();
    else voice.current.pause();
  };

  useEffect(() => {
    if (voice.current !== null) return;

    voice.current = new Audio(url);
    voice.current.currentTime = 1e101;
  }, [url]);

  useEffect(() => {
    const currentVoice = voice.current;

    if (currentVoice === null) return;

    const playListener = () => setIsPlaying(true);
    const pauseListener = () => setIsPlaying(false);
    const timeUpdateListener = () => {
      if (voice.current === null) return;

      if (typeof duration === "undefined") {
        setDuration(Math.round(voice.current.duration));
        voice.current.currentTime = 0;
      }

      setCurrentTime(voice.current.currentTime);
    };
    const ended = () => setCurrentTime(0);

    currentVoice.addEventListener("play", playListener);
    currentVoice.addEventListener("pause", pauseListener);
    currentVoice.addEventListener("timeupdate", timeUpdateListener);
    currentVoice.addEventListener("ended", ended);

    return () => {
      currentVoice.removeEventListener("play", playListener);
      currentVoice.removeEventListener("pause", pauseListener);
      currentVoice.removeEventListener("timeupdate", timeUpdateListener);
      currentVoice.removeEventListener("ended", ended);
    };
  }, [duration, setIsPlaying, setDuration, setCurrentTime]);

  useEffect(
    () => setLocaleCreatedAt(createdAt.toLocaleTimeString()),
    [setLocaleCreatedAt, createdAt],
  );

  return toggleVoiceState;
};
