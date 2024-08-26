import { Button } from "./ui/button";
import { Pause, Play, User2 } from "lucide-react";
import Image from "next/image";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { AudioVisualizer as VoiceVisualizer } from "react-audio-visualize";
import { useVoice, useVoiceVisualizer } from "~/hooks";
import { cn } from "~/utils/classes";

const Voice = forwardRef(
  (
    {
      imageUrl,
      url,
      duration,
      createdAt,
      userId,
      currentUserId,
    }: {
      imageUrl: string | undefined;
      url: string;
      duration: number;
      createdAt: Date;
      userId: string;
      currentUserId: string | null;
    },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const voiceContainer = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => voiceContainer.current!, []);

    const {
      togglePlayPause,
      isPlaying,
      voiceTime,
      currentTime,
      localeCreatedAt,
    } = useVoice(url, duration, createdAt);

    const { voiceVisualizer, voiceBlob } = useVoiceVisualizer(url);

    return (
      <div ref={voiceContainer}>
        <div className="flex gap-1.5">
          <div
            className={cn(
              "self-center rounded-full",
              userId === currentUserId && "outline outline-2 outline-black",
            )}
          >
            {imageUrl !== undefined ? (
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
              ref={voiceVisualizer}
              blob={voiceBlob}
              width={271}
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
