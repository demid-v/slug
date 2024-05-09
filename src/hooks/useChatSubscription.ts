import { useEffect } from "react";
import { subscribeUserToChat } from "~/server/actions";

const useChatSubscription = (userId: string | null, chatId: number) => {
  useEffect(() => {
    if (userId === null) return;

    void subscribeUserToChat(userId, chatId);
  }, [userId, chatId]);
};

export default useChatSubscription;
