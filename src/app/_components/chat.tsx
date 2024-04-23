"use client";

import { useRef, useState } from "react";
import { Recorder } from "~/components/recorder";
import { Voice } from "~/components/voice";
import { type GetVoices } from "~/server/actions";

export const Chat = ({ voices }: { voices: GetVoices }) => {
  const chat = useRef<HTMLDivElement | null>(null);
  const [voiceVisualizerWidth, setVoiceVisualizerWidth] = useState(0);

  return (
    <>
      <div
        ref={chat}
        className="flex h-full flex-col-reverse gap-3 overflow-y-auto border p-4"
      >
        {voices.map(([voiceId, { voice, userImg }]) => (
          <Voice
            key={voiceId}
            userImg={userImg}
            createdAt={voice.createdAt}
            url={voice.url}
            voiceVisualizerWidth={voiceVisualizerWidth}
            setVoiceVisualizerWidth={setVoiceVisualizerWidth}
          />
        ))}
      </div>
      <Recorder />
    </>
  );
};
