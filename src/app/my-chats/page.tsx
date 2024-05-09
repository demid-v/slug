import { auth } from "@clerk/nextjs/server";
import "@uploadthing/react/styles.css";
import Link from "next/link";
import { getMyChats } from "~/server/actions";
import "~/styles/globals.css";

const MyChatsLayout = async () => {
  const { userId } = auth();
  const myChats = userId !== null ? await getMyChats(userId) : [];

  return (
    <div className="flex h-full w-96 flex-col gap-8">
      <ol className="flex flex-col gap-2">
        {myChats.map((chat) => (
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
};

export default MyChatsLayout;
