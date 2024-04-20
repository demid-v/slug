"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Pause, Play } from "lucide-react";

export const Voice = ({
  userImg,
  createdAt,
  url,
}: {
  userImg: string | undefined;
  createdAt: Date;
  url: string;
}) => {
  const audio = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [localeCreatedAt, setLocaleCreatedAt] = useState("");

  useEffect(() => {
    if (audio.current !== null) {
      return;
    }

    audio.current = new Audio(url);
    audio.current.currentTime = 1e101;
  }, [url]);

  useEffect(() => {
    const currentAudio = audio.current;

    if (currentAudio === null) {
      return;
    }

    const playListener = () => setIsPlaying(true);
    currentAudio.addEventListener("play", playListener);

    const pauseListener = () => setIsPlaying(false);
    currentAudio.addEventListener("pause", pauseListener);

    const timeUpdateListener = () => {
      if (audio.current === null || duration !== null) {
        return;
      }

      setDuration(audio.current.duration);
      audio.current.currentTime = 0;
    };
    currentAudio.addEventListener("timeupdate", timeUpdateListener);

    return () => {
      currentAudio.removeEventListener("play", playListener);
      currentAudio.removeEventListener("pause", pauseListener);
      currentAudio.removeEventListener("timeupdate", timeUpdateListener);
    };
  }, [duration]);

  const toggleVoiceState = () => {
    if (audio.current === null) {
      return;
    }

    if (audio.current.paused) {
      void audio.current.play();
    } else {
      audio.current.pause();
    }
  };

  useEffect(() => {
    setLocaleCreatedAt(createdAt.toLocaleTimeString());
  }, [createdAt]);

  return (
    <div>
      <Button
        className="h-auto w-auto rounded-full py-4"
        onClick={toggleVoiceState}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <p>{duration}</p>
      <p>{localeCreatedAt}</p>
    </div>
  );
};
