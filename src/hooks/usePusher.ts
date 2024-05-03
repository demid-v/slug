import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import superjson from "superjson";
import { env } from "~/env";
import { type VoicesAndUserImages } from "~/server/actions";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "eu",
});

export const usePusher = (chatId: number) => {
  const [pushedVoice, setPushedVoice] = useState<VoicesAndUserImages[number]>();

  const channelName = `slug-chat-${chatId}`;

  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind("voice", (voice: object) => {
      const parsedVoice = superjson.parse<VoicesAndUserImages[number]>(
        JSON.stringify(voice),
      );

      setPushedVoice(parsedVoice);
    });

    return () => {
      pusher.unsubscribe(channelName);
      channel.unbind("voice");
    };
  }, [channelName]);

  return pushedVoice;
};
