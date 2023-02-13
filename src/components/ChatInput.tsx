import type { Session } from "@auth/core/types";
import type { Message } from "@prisma/client";
import {
  createSignal,
  onMount,
  type VoidComponent,
  type Resource,
  type Setter,
} from "solid-js";
import { trpc } from "~/utils/trpc";
import type { ClientMessage } from "~/utils/types";

const ChatInput: VoidComponent<{
  sessionData: Resource<Session | null | undefined>;
  setMessages: Setter<ClientMessage[] | undefined>;
}> = (props) => {
  const [inputValue, setInputValue] = createSignal("");

  let ws: WebSocket | null = null;

  onMount(() => {
    ws = new WebSocket("wss://slug-server.glitch.me/");
    ws.addEventListener("message", (event) => {
      props.setMessages((messages) => [
        { text: event.data } as Message,
        ...(messages ? messages : []),
      ]);
    });
  });

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
          const text = inputValue();
          setInputValue("");

          const userId = props.sessionData()?.user?.id;

          if (userId === undefined) {
            throw new Error("Unauthorized");
          }

          props.setMessages((messages) => [
            { text, userId },
            ...(messages ? messages : []),
          ]);

          createMessage
            .mutateAsync({
              text,
              userId,
            })
            .then(() => {
              ws?.send(text);
            });
        }
      }}
    />
  );
};

export default ChatInput;
