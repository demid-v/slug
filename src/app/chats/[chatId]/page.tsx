import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { z } from "zod";
import Chat from "~/app/_components/chat";
import { getChatName, getVoicesAndUserImages } from "~/server/actions";

const ChatPage = async ({
  params: { chatId },
}: {
  params: { chatId: string };
}) => {
  const { userId } = auth();

  const chatIdParsed = z.coerce.number().parse(chatId);

  const chatName = await getChatName(chatIdParsed);
  if (typeof chatName === "undefined") return notFound();

  const voices = await getVoicesAndUserImages(chatIdParsed);
  const cursor = voices.at(-1)?.id;

  return (
    <Chat
      name={chatName}
      initialVoices={voices}
      currentUserId={userId}
      cursor={cursor}
    />
  );
};

export default ChatPage;
