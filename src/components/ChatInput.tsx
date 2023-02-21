import { createSignal, type VoidComponent, type Setter } from "solid-js";
import { useSession } from "~/contexts/session";
import { useWebSocket } from "~/contexts/web-socket";
import { trpc } from "~/utils/trpc";
import type { ClientMessage } from "~/utils/types";

const ChatInput: VoidComponent<{
  channelId: string;
  setMessages: Setter<ClientMessage[] | undefined>;
}> = (props) => {
  const session = useSession();
  const webSocket = useWebSocket();

  const [inputValue, setInputValue] = createSignal("");

  const createMessage = trpc.messages.createMessage.useMutation();

  function sendMessage(
    event: KeyboardEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    }
  ) {
    if (event.key === "Enter") {
      const text = inputValue().trim();

      if (text === "") return;

      setInputValue("");

      const { id: userId, name = null, image = null } = session?.()?.user ?? {};

      if (userId === undefined) {
        throw new Error("Unauthorized");
      }

      const message = {
        text,
        userId,
        user: { name, image },
        channelId: props.channelId,
      };

      props.setMessages((messages) => [message, ...(messages ? messages : [])]);

      createMessage.mutateAsync(message).then(() => {
        webSocket?.()?.send(JSON.stringify(message));
      });

      if (session?.()?.user?.id === "cle65lsgx00007knk4l4y26zd") {
        createMessage.mutate(message);
      }

      webSocket?.()?.send(JSON.stringify(message));
    }
  }

  return (
    <input
      type="text"
      value={inputValue()}
      class="-mt-0.5 w-full border-2 border-black px-2"
      onInput={({ target }) => {
        setInputValue((target as HTMLInputElement).value);
      }}
      onKeyDown={sendMessage}
    />
  );
};

export default ChatInput;
