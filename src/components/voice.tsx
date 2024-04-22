"use client";

import { Button } from "./ui/button";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

const useVoice = (
  url: string,
  duration: number | null,
  setIsPlaying: Dispatch<SetStateAction<boolean>>,
  setDuration: Dispatch<SetStateAction<number | null>>,
  setCurrentTime: Dispatch<SetStateAction<number | null>>,
  setLocaleCreatedAt: Dispatch<SetStateAction<string>>,
  createdAt: Date,
) => {
  const audio = useRef<HTMLAudioElement | null>(null);

  const toggleVoiceState = () => {
    if (audio.current === null) return;

    if (audio.current.paused) void audio.current.play();
    else audio.current.pause();
  };

  useEffect(() => {
    if (audio.current !== null) return;

    audio.current = new Audio(url);
    audio.current.currentTime = 1e101;
  }, [url]);

  useEffect(() => {
    const currentAudio = audio.current;

    if (currentAudio === null) return;

    const playListener = () => setIsPlaying(true);
    const pauseListener = () => setIsPlaying(false);
    const timeUpdateListener = () => {
      if (audio.current === null) return;

      if (duration === null) {
        setDuration(Math.round(audio.current.duration));
        audio.current.currentTime = 0;
      }

      setCurrentTime(Math.round(audio.current.currentTime));
    };
    const ended = () => setCurrentTime(0);

    currentAudio.addEventListener("play", playListener);
    currentAudio.addEventListener("pause", pauseListener);
    currentAudio.addEventListener("timeupdate", timeUpdateListener);
    currentAudio.addEventListener("ended", ended);

    return () => {
      currentAudio.removeEventListener("play", playListener);
      currentAudio.removeEventListener("pause", pauseListener);
      currentAudio.removeEventListener("timeupdate", timeUpdateListener);
      currentAudio.removeEventListener("ended", ended);
    };
  }, [duration, setIsPlaying, setDuration, setCurrentTime]);

  useEffect(
    () => setLocaleCreatedAt(createdAt.toLocaleTimeString()),
    [setLocaleCreatedAt, createdAt],
  );

  return toggleVoiceState;
};

export const Voice = ({
  userImg,
  createdAt,
  url,
}: {
  userImg: string | undefined;
  createdAt: Date;
  url: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(0);
  const [localeCreatedAt, setLocaleCreatedAt] = useState("Loading...");

  const toggleVoiceState = useVoice(
    url,
    duration,
    setIsPlaying,
    setDuration,
    setCurrentTime,
    setLocaleCreatedAt,
    createdAt,
  );

  return (
    <div>
      <div className="flex gap-1.5">
        {typeof userImg !== "undefined" && (
          <Image
            src={userImg}
            alt="Profile pic"
            width={20}
            height={20}
            className="self-center rounded-full"
          />
        )}
        <Button
          className="h-auto w-auto rounded-full p-2.5"
          onClick={toggleVoiceState}
        >
          {isPlaying ? (
            <Pause width={16} height={16} />
          ) : (
            <Play width={16} height={16} />
          )}
        </Button>
      </div>
      <div className="flex justify-between pt-1">
        <span className="flex gap-1">
          <span className="text-xs">
            {duration !== null ? (
              <>
                {currentTime}/{duration}
              </>
            ) : (
              "Loading..."
            )}
          </span>
        </span>
        <span className="text-xs">{localeCreatedAt}</span>
      </div>
    </div>
  );
};
