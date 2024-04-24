import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { env } from "~/env";

export const usePusher = () => {
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat-messages");
    channel.bind("message", () => router.refresh());

    return () => {
      pusher?.unsubscribe("chat-messages");
      channel.unbind_all();
    };
  }, [router]);
};
