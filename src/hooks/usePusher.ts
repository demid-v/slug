import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import superjson from "superjson";
import { env } from "~/env";
import { type VoicesAndUserImages } from "~/server/actions";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "eu",
});

export const usePusher = (chatId: number) => {
  const router = useRouter();

  const [pushedVoice, setPushedVoice] = useState<VoicesAndUserImages[number]>();

  useEffect(() => {
    const channel = pusher.subscribe(`slug-chat-${chatId}`);
    channel.bind("voice", (voice: string) => {
      const parsedVoice = superjson.parse<VoicesAndUserImages[number]>(
        JSON.stringify(voice),
      );

      setPushedVoice(parsedVoice);
    });

    return () => {
      pusher.unsubscribe(`slug-chat-${chatId}`);
      channel.unbind_all();
    };
  }, [router, chatId]);

  return pushedVoice;
};
