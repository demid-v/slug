import { Chat } from "~/app/_components/chat";
import { getVoices } from "~/server/actions";

export default async function ChatPage() {
  const voices = await getVoices();

  return (
    <div className="flex h-full w-96 flex-col gap-8">
      <Chat voices={voices} />
    </div>
  );
}
