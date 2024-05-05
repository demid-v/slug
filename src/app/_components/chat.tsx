"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { z } from "zod";
import { Recorder } from "~/components/recorder";
import { Voice } from "~/components/voice";
import { usePusher } from "~/hooks";
import {
  getVoicesAndUserImages,
  type VoicesAndUserImages,
} from "~/server/actions";

export const Chat = ({
  initialVoices,
  cursor,
}: {
  initialVoices: VoicesAndUserImages;
  cursor: number | undefined;
}) => {
  const { chatId } = useParams();
  const chatIdParsed = z.coerce.number().parse(chatId);

  const chat = useRef<HTMLDivElement | null>(null);

  const [voices, setVoices] = useState(initialVoices);
  const voicesCursor = useRef(cursor);
  const isFetchingVoices = useRef(false);
  const isAllFetched = useRef(false);

  const [voiceVisualizerWidth, setVoiceVisualizerWidth] = useState(0);

  const { ref: voiceRef, inView } = useInView();

  useEffect(() => {
    if (!inView || isFetchingVoices.current || isAllFetched.current) return;

    isFetchingVoices.current = true;
    getVoicesAndUserImages(chatIdParsed, voicesCursor.current)
      .then((voices) => {
        if (voices.length < 15) isAllFetched.current = true;

        setVoices((currentVoices) => {
          voicesCursor.current = voices.at(-1)?.[0];
          return [...currentVoices, ...voices];
        });
      })
      .catch(console.error)
      .finally(() => (isFetchingVoices.current = false));
  }, [inView, chatIdParsed]);

  const pushedVoice = usePusher(chatIdParsed);

  useEffect(() => {
    if (typeof pushedVoice === "undefined") return;

    setVoices((currentVoices) => [pushedVoice, ...currentVoices]);
  }, [pushedVoice]);

  const router = useRouter();

  useEffect(() => () => router.refresh(), [router]);

  return (
    <div className="flex h-full w-96 flex-col gap-8">
      <div
        ref={chat}
        className="flex h-full flex-col-reverse gap-3 overflow-y-auto border p-4"
      >
        {voices.map(
          (
            [
              voiceId,
              {
                voice: { url, duration, createdAt },
                userImage: userImg,
              },
            ],
            index,
          ) => (
            <Voice
              key={voiceId}
              ref={index === voices.length - 1 ? voiceRef : null}
              userImg={userImg}
              url={url}
              duration={duration}
              createdAt={createdAt}
              voiceVisualizerWidth={voiceVisualizerWidth}
              setVoiceVisualizerWidth={setVoiceVisualizerWidth}
            />
          ),
        )}
      </div>
      <Recorder />
    </div>
  );
};
