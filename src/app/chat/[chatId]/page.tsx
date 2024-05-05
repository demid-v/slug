import { z } from "zod";
import { Chat } from "~/app/_components/chat";
import { getVoicesAndUserImages } from "~/server/actions";

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  const chatIdParsed = z.coerce.number().parse(params.chatId);
  const voices = await getVoicesAndUserImages(chatIdParsed);
  const cursor = voices.at(-1)?.[0];

  return <Chat initialVoices={voices} cursor={cursor} />;
}
