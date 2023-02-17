import {
  createSignal,
  type VoidComponent,
  type Setter,
  createEffect,
} from "solid-js";
import { useSession } from "~/contexts/session";
import { useWebSocket } from "~/contexts/web-socket";
import { trpc } from "~/utils/trpc";
import type { ClientMessage } from "~/utils/types";

const ChatInput: VoidComponent<{
  setMessages: Setter<ClientMessage[] | undefined>;
}> = (props) => {
  const session = useSession();
  const [webSocket] = useWebSocket() ?? [];

  createEffect(() => 0, session?.());

  const [inputValue, setInputValue] = createSignal("");

  const createMessage = trpc.messages.createMessage.useMutation();

  return (
    <input
      type="text"
      value={inputValue()}
      class="-mt-0.5 w-full border-2 border-black px-2"
      onInput={({ target }) => {
        setInputValue((target as HTMLInputElement).value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          const text = inputValue().trim();

          if (text === "") return;

          setInputValue("");

          const {
            id: userId,
            name = null,
            image = null,
          } = session?.()?.user ?? {};

          if (userId === undefined) {
            throw new Error("Unauthorized");
          }

          const message = {
            text,
            userId,
            user: { name, image },
            channelId: "cle6cv9fg000b7k2kawj20syd",
          };

          props.setMessages((messages) => [
            message,
            ...(messages ? messages : []),
          ]);

          createMessage.mutateAsync(message).then(() => {
            webSocket?.send(JSON.stringify(message));
          });
        }
      }}
    />
  );
};

export default ChatInput;
