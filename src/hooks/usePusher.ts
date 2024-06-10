import Pusher from "pusher-js";
import { useEffect } from "react";
import { env } from "~/env";
import { api } from "~/trpc/react";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "eu",
});

const usePusher = (chatId: number) => {
  const channelName = `slug-chat-${chatId}`;

  const utils = api.useUtils();

  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind("voice", () => {
      void utils.voice.all.invalidate({ chatId });
    });

    return () => {
      pusher.unsubscribe(channelName);
      channel.unbind("voice");
    };
  }, [channelName, chatId, utils.voice.all]);
};

export default usePusher;
