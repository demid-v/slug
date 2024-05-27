import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getMyChats } from "~/server/actions";

const MyChatsPage = async () => {
  const { userId } = auth();
  const myChats = userId !== null ? await getMyChats(userId) : [];

  return (
    <div className="flex justify-center pb-16">
      <ol className="flex w-96 flex-col gap-2">
        {myChats.map((chat) => (
          <li key={chat.id}>
            <Link href={`/chats/${chat.id}`}>
              <div className="rounded-md border border-slate-200 px-3 py-2">
                {chat.name}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default MyChatsPage;
