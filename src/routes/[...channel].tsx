import { type VoidComponent, For, createSignal, createEffect } from "solid-js";
import { trpc } from "~/utils/trpc";
import ChatInput from "~/components/ChatInput";
import TextBubble from "~/components/TextBubble";
import { signOut } from "@auth/solid-start/client";
import type { ClientMessage } from "~/utils/types";
import { useParams } from "solid-start";
import { useSession } from "~/session-context";

const Chat: VoidComponent = () => {
  const session = useSession();

  const params = useParams();
  const [serverId, channelId] = params.channel.split("/");

  const server = trpc.servers.getServer.useQuery(() => ({ id: serverId }));

  const messagesRes = trpc.messages.getMessages.useQuery();

  const [messages, setMessages] = createSignal<ClientMessage[] | undefined>(
    messagesRes?.data
  );

  createEffect(() => {
    setMessages(messagesRes?.data);
  }, messagesRes?.data);

  const deleteAllMessages = trpc.messages.deleteAll.useMutation();

  const createServer = trpc.servers.createServer.useMutation();
  const createChannel = trpc.channels.createChannel.useMutation();

  const channels = trpc.channels.getChannelsForServer.useQuery(() => ({
    serverId,
  }));

  return (
    <div>
      <header class="flex justify-end px-10 py-2">
        <button
          class="text-black hover:underline"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </header>
      {/* <button
        onClick={() => {
          createServer.mutateAsync({ name: "Test server" }).then(console.log);
        }}
      >
        New server
      </button>
      <button
        onClick={() => {
          createChannel
            .mutateAsync({
              name: "Test channel 3",
              serverId: "cle6cuf5g00087k2kt7hvceqm",
            })
            .then(console.log);
        }}
      >
        New channel
      </button> */}
      <div class="mt-7 px-10">
        <h1 class="mb-4 text-center text-3xl font-medium">
          {server.data?.name}
        </h1>
        <div class="mx-auto flex">
          <ol class="-mr-0.5 w-56 border-2 border-black py-1">
            <For each={channels.data}>
              {(channel) => (
                <li class="cursor-pointer px-2 hover:bg-gray-300">
                  {channel.name}
                </li>
              )}
            </For>
          </ol>
          <div class="w-full">
            <div class="h-72 border-2 border-black p-2">
              <div class="flex h-full flex-col justify-end">
                <div class="flex flex-col-reverse gap-1 overflow-y-auto">
                  <For each={messages()}>
                    {(message) => <TextBubble message={message} />}
                  </For>
                </div>
              </div>
            </div>
            <div class="flex">
              <button
                class="-mt-0.5 -mr-0.5 border-2 border-black px-2"
                onClick={() => {
                  deleteAllMessages.mutateAsync().then(() => {
                    setMessages([]);
                  });
                }}
              >
                Clear
              </button>
              <ChatInput session={session} setMessages={setMessages} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
