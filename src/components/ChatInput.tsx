import type { Session } from "@auth/core/types";
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
        JSON.parse(event.data),
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

          if (text.trim() === "") return;

          setInputValue("");

          const { id: userId, image = null } = props.sessionData()?.user ?? {};

          if (userId === undefined) {
            throw new Error("Unauthorized");
          }

          const message = { text, userId, user: { image } };

          props.setMessages((messages) => [
            message,
            ...(messages ? messages : []),
          ]);

          createMessage.mutateAsync(message).then(() => {
            ws?.send(JSON.stringify(message));
          });
        }
      }}
    />
  );
};

export default ChatInput;
