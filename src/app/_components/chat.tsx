"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Recorder } from "~/components/recorder";
import { Voice } from "~/components/voice";
import { usePusher } from "~/hooks";
import { useMoreVoices } from "~/hooks";
import { type VoicesAndUserImages } from "~/server/actions";

export const Chat = ({
  initialVoices,
  cursor,
}: {
  initialVoices: VoicesAndUserImages;
  cursor: number | undefined;
}) => {
  const router = useRouter();
  const { chatId } = useParams();

  const chatIdParsed = z.coerce.number().parse(chatId);

  const chat = useRef<HTMLDivElement | null>(null);

  const [voices, setVoices] = useState(initialVoices);
  const [voiceVisualizerWidth, setVoiceVisualizerWidth] = useState(0);

  useEffect(() => () => router.refresh(), [router]);

  const { moreVoices, voiceRef } = useMoreVoices(
    initialVoices.length,
    cursor,
    chatIdParsed,
  );

  useEffect(
    () => setVoices((voices) => [...voices, ...moreVoices]),
    [moreVoices],
  );

  const pushedVoice = usePusher(chatIdParsed);

  useEffect(() => {
    if (typeof pushedVoice === "undefined") return;

    setVoices((currentVoices) => [pushedVoice, ...currentVoices]);
  }, [pushedVoice]);

  return (
    <div className="flex h-full w-96 flex-col gap-8">
      <div
        ref={chat}
        className="flex h-full flex-col-reverse gap-3 overflow-y-auto border p-4"
      >
        {voices.map(({ id, url, duration, createdAt, imageUrl }, index) => (
          <Voice
            key={id}
            ref={index === voices.length - 1 ? voiceRef : null}
            imageUrl={imageUrl}
            url={url}
            duration={duration}
            createdAt={createdAt}
            voiceVisualizerWidth={voiceVisualizerWidth}
            setVoiceVisualizerWidth={setVoiceVisualizerWidth}
          />
        ))}
      </div>
      <Recorder />
    </div>
  );
};
