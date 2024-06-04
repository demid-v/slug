import Link from "next/link";
import { z } from "zod";
import CreateChatDialog from "~/app/_components/create-chat-dialog";
import ChatsPagination from "~/components/chats-pagination";
import { api } from "~/trpc/server";

const ChatsPage = async ({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) => {
  const { data: parsedSearchParams } = z
    .object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    })
    .safeParse(searchParams);
  const { page, limit } = parsedSearchParams ?? {};

  const chats = await api.chats.all({ page, limit });
  const chatsCount = await api.chats.count();

  return (
    <div className="flex flex-col gap-8 pb-16">
      <CreateChatDialog />
      <ChatsPagination page={page} limit={limit} chatsCount={chatsCount} />

      <div className="grid grid-cols-4 gap-2">
        {chats.map(({ id, name }) => (
          <Link key={id} href={`/chats/${id}`}>
            <div className="h-full min-h-28 rounded-md border border-slate-200 p-3">
              {name}
            </div>
          </Link>
        ))}
      </div>

      <ChatsPagination page={page} limit={limit} chatsCount={chatsCount} />
    </div>
  );
};

export default ChatsPage;
