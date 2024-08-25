"use client";

import { useParams } from "next/navigation";
import { useRef } from "react";
import { z } from "zod";
import Recorder from "~/components/recorder";
import Voice from "~/components/voice";
import { useChatSubscription, useInfiniteVoices, usePusher } from "~/hooks";
import { api } from "~/trpc/react";

const Chat = ({ currentUserId }: { currentUserId: string | null }) => {
  const { chatId } = useParams();

  const chatIdParsed = z.coerce.number().parse(chatId);
  const { data: chatName } = api.chat.name.useQuery(chatIdParsed);

  const chat = useRef<HTMLDivElement | null>(null);

  const { voices, voiceRef } = useInfiniteVoices(chatIdParsed);

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
