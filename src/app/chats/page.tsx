import Link from "next/link";
import CreateChatDialog from "~/app/_components/create-chat-dialog";
import { getChats } from "~/server/actions";

const ChatsPage = async () => {
  const chats = await getChats();

  return (
    <div className="flex flex-col gap-8">
      <CreateChatDialog />

      <div className="grid grid-cols-4 gap-2">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chats/${chat.id}`}>
            <div className="h-full min-h-28 rounded-md border border-slate-200 p-3">
              {chat.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatsPage;
