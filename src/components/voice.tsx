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
import { useVoice, useVoiceVisualizer } from "~/hooks";
import { getVoiceTime } from "~/utils/getVoiceTime";

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

  const voiceTime = getVoiceTime(duration, currentTime, isPlaying);

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
