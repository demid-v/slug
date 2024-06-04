import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";

const useChatSubscription = (userId: string | null, chatId: number) => {
  const router = useRouter();

  const { mutate: subscribeUserToChat } =
    api.users.subscribeToChat.useMutation();

  const isSubscribed = useRef(false);

  useEffect(() => {
    if (userId === null || isSubscribed.current) return;

    subscribeUserToChat(
      { userId, chatId },
      {
        onSuccess: () => {
          isSubscribed.current = true;
          router.refresh();
        },
      },
    );
  }, [userId, chatId, router, subscribeUserToChat]);
};

export default useChatSubscription;
