"use client";

import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";
import Recorder from "~/components/recorder";
import Voice from "~/components/voice";
import { useChatSubscription, useInfiniteVoices, usePusher } from "~/hooks";
import { type VoicesWithUserImage } from "~/trpc/types";

const Chat = ({
  chatName,
  initialVoices,
  currentUserId,
}: {
  chatName: string;
  initialVoices: VoicesWithUserImage;
  currentUserId: string | null;
}) => {
  const { chatId } = useParams();

  const chatIdParsed = z.coerce.number().parse(chatId);

  const chat = useRef<HTMLDivElement | null>(null);

  const [voiceVisualizerWidth, setVoiceVisualizerWidth] = useState(0);

  const { voices, voiceRef } = useInfiniteVoices(chatIdParsed, initialVoices);

  useChatSubscription(currentUserId, chatIdParsed);
  usePusher(chatIdParsed);

  return (
    <div className="flex w-96 flex-col gap-8">
      <div className="flex h-full min-h-0 flex-col justify-between border">
        <div className="border-b px-8 py-3 text-center">
          <div
            className="mx-auto overflow-hidden text-ellipsis whitespace-nowrap"
            title={chatName}
          >
            {chatName}
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

export default Chat;
