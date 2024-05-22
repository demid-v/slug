import { Button } from "./ui/button";
import { Pause, Play, User2 } from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  type ForwardedRef,
  useImperativeHandle,
} from "react";
import { AudioVisualizer as VoiceVisualizer } from "react-audio-visualize";
import { useVoice, useVoiceVisualizer } from "~/hooks";
import { cn } from "~/utils/classes";
import { type SetState } from "~/utils/types";

const Voice = forwardRef(
  (
    {
      imageUrl,
      url,
      duration,
      createdAt,
      voiceVisualizerWidth,
      setVoiceVisualizerWidth,
      userId,
      currentUserId,
    }: {
      imageUrl: string | undefined;
      url: string;
      duration: number;
      createdAt: Date;
      voiceVisualizerWidth: number;
      setVoiceVisualizerWidth: SetState<number>;
      userId: string;
      currentUserId: string | null;
    },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const voiceContainer = useRef<HTMLDivElement>(null);

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [localeCreatedAt, setLocaleCreatedAt] = useState("Loading...");

    useImperativeHandle(ref, () => voiceContainer.current as HTMLInputElement);

    const { togglePlayPause, isPlaying, voiceTime } = useVoice(
      url,
      duration,
      currentTime,
      setCurrentTime,
      setLocaleCreatedAt,
      createdAt,
    );

    const { voiceBlob, voiceVisualizer } = useVoiceVisualizer(url);
    const [voiceKey, setVoiceKey] = useState<number | null>(null);

    useEffect(() => {
      setVoiceKey(Math.random());
    }, [voiceVisualizerWidth]);

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
          <div
            className={cn(
              "self-center rounded-full",
              userId === currentUserId && "outline outline-2 outline-black",
            )}
          >
            {typeof imageUrl !== "undefined" ? (
              <Image
                src={imageUrl}
                alt="Profile pic"
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <User2 width={20} height={20} className="rounded-full" />
            )}
          </div>
          <Button
            className="h-auto w-auto rounded-full p-2.5"
            onClick={togglePlayPause}
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
  },
);

Voice.displayName = "Voice";

export default Voice;
