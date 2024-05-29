import Link from "next/link";
import { z } from "zod";
import CreateChatDialog from "~/app/_components/create-chat-dialog";
import { getChats } from "~/server/actions";

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

  const chats = await getChats(page, limit);

  return (
    <div className="flex flex-col gap-8 pb-16">
      <CreateChatDialog />

      <div className="grid grid-cols-4 gap-2">
        {chats.map(({ id, name }) => (
          <Link key={id} href={`/chats/${id}`}>
            <div className="h-full min-h-28 rounded-md border border-slate-200 p-3">
              {name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatsPage;
