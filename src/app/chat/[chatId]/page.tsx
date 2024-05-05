import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { Chat } from "~/app/_components/chat";
import { getVoicesAndUserImages } from "~/server/actions";

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { userId } = auth();

  const chatIdParsed = z.coerce.number().parse(params.chatId);
  const voices = await getVoicesAndUserImages(chatIdParsed);
  const cursor = voices.at(-1)?.id;

  return <Chat initialVoices={voices} cursor={cursor} currentUserId={userId} />;
}
