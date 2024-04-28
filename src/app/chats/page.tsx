import Link from "next/link";
import { getChats } from "~/server/actions";

export default async function ChatsPage() {
  const chats = await getChats();

  return (
    <div className="flex h-full w-96 flex-col gap-8">
      <ol className="flex flex-col gap-2">
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link href={`/chat/${chat.id}`}>
              <div className="rounded-md border border-slate-200 p-2">
                {chat.name}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
