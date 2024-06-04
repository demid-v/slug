import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { z } from "zod";
import Chat from "~/app/_components/chat";
import { api } from "~/trpc/server";

const ChatPage = async ({
  params: { chatId },
}: {
  params: { chatId: string };
}) => {
  const { userId } = auth();

  const { success, data: chatIdParsed } = z.coerce.number().safeParse(chatId);
  if (!success) return notFound();

  const chatName = await api.chats.name(chatIdParsed);
  if (typeof chatName === "undefined") return notFound();

  const voices = await api.voices.withUserImage({
    chatId: chatIdParsed,
  });

  return (
    <Chat chatName={chatName} initialVoices={voices} currentUserId={userId} />
  );
};

export default ChatPage;
