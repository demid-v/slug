import Link from "next/link";
import CreateChatDialog from "~/app/_components/create-chat-dialog";
import { getChats } from "~/server/actions";

const ChatsPage = async () => {
  const chats = await getChats();

  return (
    <div className="flex h-full w-96 flex-col gap-8">
      <CreateChatDialog />

      <ol className="flex flex-col gap-2">
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link href={`/chats/${chat.id}`}>
              <div className="rounded-md border border-slate-200 p-2">
                {chat.name}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ChatsPage;
