import { auth } from "@clerk/nextjs/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { z } from "zod";
import Chat from "~/app/_components/chat";
import { createSSRHelper } from "~/trpc/helpers";

const ChatPage = async ({
  params: { chatId },
}: {
  params: { chatId: string };
}) => {
  const helpers = await createSSRHelper();

  const { userId } = auth();

  const { success, data: chatIdParsed } = z.coerce.number().safeParse(chatId);
  if (!success) return notFound();

  const chatName = await helpers.chat.name.fetch(chatIdParsed);
  if (chatName === undefined) return notFound();

  await helpers.voice.all.prefetchInfinite({
    chatId: chatIdParsed,
  });

  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Chat currentUserId={userId} />
    </HydrationBoundary>
  );
};

export default ChatPage;
