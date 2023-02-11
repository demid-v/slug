import { type VoidComponent, createSignal, For } from "solid-js";
import { trpc } from "~/utils/trpc";
import ChatInput from "./ChatInput";
import TextBubble from "./TextBubble";
import { signOut } from "@auth/solid-start/client";

const Chat: VoidComponent = () => {
  const messagesRes = trpc.messages.getMessages.useQuery();

  const [messages, setMessages] = createSignal(messagesRes.data);

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
      <div class="mx-auto w-72">
        <div class="h-40 border-2 border-black p-2">
          <div class="flex h-full flex-col justify-end">
            <div class="flex flex-col-reverse overflow-y-auto">
              <For each={messages()}>
                {(message) => <TextBubble message={message.text} />}
              </For>
            </div>
          </div>
        </div>
        <div class="flex">
          <button class="-mt-0.5 -mr-0.5 border-2 border-black px-2">
            Clear
          </button>
          <ChatInput setMessages={setMessages} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
