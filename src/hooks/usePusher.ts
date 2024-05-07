import Pusher from "pusher-js";
import { useEffect } from "react";
import superjson from "superjson";
import { env } from "~/env";
import { type VoicesAndUserImages } from "~/server/actions";
import { type SetState } from "~/utils/setStateType";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "eu",
});

const usePusher = (
  chatId: number,
  setVoices: SetState<VoicesAndUserImages>,
) => {
  const channelName = `slug-chat-${chatId}`;

  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind("voice", (voice: object) => {
      const parsedVoice = superjson.parse<VoicesAndUserImages[number]>(
        JSON.stringify(voice),
      );

      setVoices((currentVoices) => [...currentVoices, parsedVoice]);
    });

    return () => {
      pusher.unsubscribe(channelName);
      channel.unbind("voice");
    };
  }, [channelName, setVoices]);
};

export default usePusher;
