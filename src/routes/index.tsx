import { createSignal, For, type VoidComponent } from "solid-js";
import { trpc } from "../utils/trpc";
import ChatInput from "~/components/ChatInput";
import TextBubble from "~/components/TextBubble";

const Home: VoidComponent = () => {
  const messagesRes = trpc.messages.getMessages.useQuery();

  const [messages, setMessages] = createSignal(messagesRes.data);

  return (
    <div class="mx-auto mt-10 w-72">
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
  );
};

export default Home;
