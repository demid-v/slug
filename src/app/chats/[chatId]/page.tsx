import { auth } from "@clerk/nextjs/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { z } from "zod";
import Chat from "~/app/_components/chat";
import { helpers } from "~/trpc/helpers";

const ChatPage = async ({
  params: { chatId },
}: {
  params: { chatId: string };
}) => {
  const { userId } = auth();

  const { success, data: chatIdParsed } = z.coerce.number().safeParse(chatId);
  if (!success) return notFound();

  const chatName = await helpers.chats.chatName.fetch(chatIdParsed);
  if (typeof chatName === "undefined") return notFound();

  await helpers.voices.voicesAndUserImages.prefetchInfinite({
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
