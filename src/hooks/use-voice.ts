import { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import { useUnmount } from "usehooks-ts";
import { getVoiceTime } from "~/utils";

const useVoice = (
  url: string,
  duration: number | undefined,
  createdAt: Date,
) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [localeCreatedAt, setLocaleCreatedAt] = useState("Loading...");
  const currentTimeRequest = useRef<number>();

  const {
    playing: isPlaying,
    stopped: isStopped,
    paused: isPaused,
    load,
    togglePlayPause,
    stop,
    getPosition: getCurrentTime,
  } = useAudioPlayer();

  useEffect(() => {
    load(url, {
      onplay() {
        const requestCurrentTime = () => {
          currentTimeRequest.current = requestAnimationFrame(() => {
            setCurrentTime(getCurrentTime());
            requestCurrentTime();
          });
        };

        requestCurrentTime();
      },
      onend() {
        if (currentTimeRequest.current !== undefined)
          cancelAnimationFrame(currentTimeRequest.current);

        setCurrentTime(0);
      },
    });
  }, [url, load, setCurrentTime, getCurrentTime]);

  useUnmount(stop);

  const voiceTime = getVoiceTime(
    duration,
    currentTime,
    isPlaying,
    isPaused,
    isStopped,
  );

  useEffect(() => {
    setLocaleCreatedAt(createdAt.toLocaleTimeString());
  }, [setLocaleCreatedAt, createdAt]);

  return {
    togglePlayPause,
    isPlaying,
    voiceTime,
    currentTime,
    localeCreatedAt,
  };
};

export default useVoice;
