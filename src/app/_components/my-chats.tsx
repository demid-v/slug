import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getMyChats } from "~/server/actions";
import { cn } from "~/utils/classes";

const MyChats = async ({ className }: { className?: string }) => {
  const { userId } = auth();
  const myChats = userId !== null ? await getMyChats(userId) : [];

  return (
    <ol
      className={cn("flex w-96 flex-col gap-2 overflow-y-auto", className)}
      style={{ scrollbarWidth: "thin" }}
    >
      {myChats.map(({ id, name }) => (
        <li key={id}>
          <Link href={`/chats/${id}`}>
            <div className="rounded-md border border-slate-200 px-3 py-2">
              {name}
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
};

export default MyChats;
