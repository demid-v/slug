import { z } from "zod";
import { Chat } from "~/app/_components/chat";
import { getVoices } from "~/server/actions";

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  const chatIdParsed = z.coerce.number().parse(params.chatId);
  const voices = await getVoices(chatIdParsed);

  return (
    <div className="flex h-full w-96 flex-col gap-8">
      <Chat voices={voices} />
    </div>
  );
}
