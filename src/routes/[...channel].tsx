import { type VoidComponent, For, createSignal, createEffect } from "solid-js";
import { trpc } from "~/utils/trpc";
import ChatInput from "~/components/ChatInput";
import TextBubble from "~/components/TextBubble";
import { signOut } from "@auth/solid-start/client";
import type { ClientMessage } from "~/utils/types";
import { A, useParams } from "solid-start";
import { useWebSocket } from "~/contexts/web-socket";
import { isServer } from "solid-js/web";

const Chat: VoidComponent = () => {
  const paramsSplit = useParams().channel.split("/");
  const serverId = paramsSplit[0];
  const [channelId, setChannelId] = createSignal(paramsSplit[1]);

  const server = trpc.servers.getServer.useQuery(() => ({ id: serverId }));

  const messagesRes = trpc.messages.getMessages.useQuery(() => ({
    channelId: channelId(),
  }));

  createEffect(() => {
    setChannelId(useParams().channel.split("/")[1]);
  });

  createEffect(() => {
    channelId();
    messagesRes.refetch();
  });

  const [messages, setMessages] = createSignal<ClientMessage[] | undefined>(
    messagesRes?.data
  );

  createEffect(() => {
    setMessages(messagesRes?.data);
  }, messagesRes?.data);

  const deleteAllMessages = trpc.messages.deleteAll.useMutation();

  const channels = trpc.channels.getChannelsForServer.useQuery(() => ({
    serverId,
  }));

  const webSocket = useWebSocket();

  createEffect(() => {
    webSocket?.()?.addEventListener("message", (event) => {
      setMessages((messages) => [
        JSON.parse(event.data),
        ...(messages ? messages : []),
      ]);
    });
  });

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
      <div class="mt-7 px-10">
        {!isServer &&
          (webSocket?.()?.readyState === WebSocket.OPEN ? "hi" : "hey")}
        <h1 class="mb-4 text-center text-3xl font-medium">
          {server.data?.name ?? "..."}
        </h1>
        <div class="mx-auto flex max-w-3xl">
          <ol class="-mr-0.5 w-44 border-2 border-black">
            <For each={channels.data}>
              {(channel) => (
                <A href={`${serverId}/${channel.id}`}>
                  <li
                    class={
                      "px-2 hover:bg-gray-300" +
                      (channelId() === channel.id ? " bg-gray-200" : "")
                    }
                  >
                    {channel.name}
                  </li>
                </A>
              )}
            </For>
          </ol>
          <div class="w-full">
            <div class="h-96 border-2 border-black py-2 pl-2">
              <div class="flex h-full flex-col justify-end">
                <div class="flex flex-col-reverse gap-1 overflow-y-auto pr-2">
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
              <ChatInput channelId={channelId()} setMessages={setMessages} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
