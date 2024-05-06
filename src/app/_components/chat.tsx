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
  name,
  initialVoices,
  cursor,
  currentUserId,
}: {
  name: string | undefined;
  initialVoices: VoicesAndUserImages;
  cursor: number | undefined;
  currentUserId: string | null;
}) => {
  const router = useRouter();
  const { chatId } = useParams();

  const chatIdParsed = z.coerce.number().parse(chatId);

  const chat = useRef<HTMLDivElement | null>(null);

  const [voices, setVoices] = useState(initialVoices);
  const [voiceVisualizerWidth, setVoiceVisualizerWidth] = useState(0);

  usePusher(chatIdParsed, setVoices);

  const { voiceRef } = useMoreVoices(
    initialVoices.length,
    cursor,
    chatIdParsed,
    setVoices,
  );

  useEffect(() => () => router.refresh(), [router]);

  return (
    <div className="flex h-full w-96 flex-col gap-8">
      <div className="flex h-full min-h-0 flex-shrink flex-col border">
        <div className="border-b px-8 py-3 text-center">
          <div
            className="mx-auto overflow-hidden text-ellipsis whitespace-nowrap"
            title={name}
          >
            {name}
          </div>
        </div>
        <div
          ref={chat}
          className="flex flex-col-reverse gap-3 overflow-y-auto p-4"
          style={{ scrollbarWidth: "thin" }}
        >
          {voices.map(
            ({ id, url, duration, createdAt, userId, imageUrl }, index) => (
              <Voice
                key={id}
                ref={index === voices.length - 1 ? voiceRef : null}
                imageUrl={imageUrl}
                url={url}
                duration={duration}
                createdAt={createdAt}
                voiceVisualizerWidth={voiceVisualizerWidth}
                setVoiceVisualizerWidth={setVoiceVisualizerWidth}
                userId={userId}
                currentUserId={currentUserId}
              />
            ),
          )}
        </div>
      </div>
      <Recorder />
    </div>
  );
};
