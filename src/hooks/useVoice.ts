import { useEffect, useRef } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import { getVoiceTime } from "~/utils";
import { type SetState } from "~/utils/types";

const useVoice = (
  url: string,
  duration: number | undefined,
  currentTime: number,
  setCurrentTime: SetState<number>,
  setLocaleCreatedAt: SetState<string>,
  createdAt: Date,
) => {
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

  useEffect(
    () => () => {
      stop();
    },
    [stop],
  );

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

  return { togglePlayPause, isPlaying, voiceTime };
};

export default useVoice;
