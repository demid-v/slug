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
import { AudioVisualizer as VoiceVisualizer } from "react-audio-visualize";

const useVoice = (
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

const formatTime = (time: number | undefined) => {
  if (typeof time === "undefined") return "0:00";

  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(1, "0");
  const seconds = Math.round(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const useVoiceTime = (
  duration: number | undefined,
  currentTime: number,
  isPlaying: boolean,
) => {
  return isPlaying ? formatTime(currentTime) : formatTime(duration);
};

const useVoiceVisualizer = (url: string) => {
  const isFetchingVoiceBlob = useRef(false);
  const [voiceBlob, setVoiceBlob] = useState<Blob>();

  const voiceVisualizer = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isFetchingVoiceBlob.current) return;

    isFetchingVoiceBlob.current = true;

    fetch(url)
      .then((res) => {
        res
          .blob()
          .then((blob) => {
            setVoiceBlob(blob);
          })
          .catch(console.error);
      })
      .catch(console.error)
      .finally(() => {
        isFetchingVoiceBlob.current = false;
      });
  }, [url]);

  return { voiceBlob, voiceVisualizer };
};

export const Voice = ({
  userImg,
  createdAt,
  url,
  voiceVisualizerWidth,
  setVoiceVisualizerWidth,
}: {
  userImg: string | undefined;
  createdAt: Date;
  url: string;
  voiceVisualizerWidth: number;
  setVoiceVisualizerWidth: Dispatch<SetStateAction<number>>;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>();
  const [currentTime, setCurrentTime] = useState<number>(0);
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

  const voiceTime = useVoiceTime(duration, currentTime, isPlaying);

  const { voiceBlob, voiceVisualizer } = useVoiceVisualizer(url);
  const [voiceKey, setVoiceKey] = useState<number | null>(null);

  useEffect(() => setVoiceKey(Math.random()), [voiceVisualizerWidth]);

  const voiceContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (voiceContainer.current === null || voiceVisualizer.current === null)
      return;

    setVoiceVisualizerWidth(
      voiceContainer.current.offsetLeft +
        voiceContainer.current.offsetWidth -
        voiceVisualizer.current.offsetLeft,
    );
  }, [voiceBlob, voiceVisualizer, setVoiceVisualizerWidth]);

  return (
    <div ref={voiceContainer}>
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
        {voiceBlob && (
          <VoiceVisualizer
            key={voiceKey}
            ref={voiceVisualizer}
            blob={voiceBlob}
            width={voiceVisualizerWidth}
            height={36}
            barWidth={3}
            gap={5}
            barColor="#0a0a0a"
            barPlayedColor="#d4d4d4"
            currentTime={currentTime}
          />
        )}
      </div>
      <div className="flex justify-between pt-1">
        <span className="flex gap-1">
          <span className="text-xs">{voiceTime}</span>
        </span>
        <span className="text-xs">{localeCreatedAt}</span>
      </div>
    </div>
  );
};
