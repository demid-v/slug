import type { message } from "@prisma/client";
import { createSignal, onMount, type Setter } from "solid-js";

export default function ChatInput(props: {
  setMessages: Setter<message[] | undefined>;
}) {
  const [inputValue, setInputValue] = createSignal("");

  let ws: WebSocket | null = null;

  onMount(() => {
    ws = new WebSocket("wss://slug-server.glitch.me/");
    ws.addEventListener("message", (event) => {
      props.setMessages((messages) => [
        { text: event.data } as message,
        ...(messages ? messages : []),
      ]);
    });
  });

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
          const message = inputValue();

          props.setMessages((messages) => [
            { text: message } as message,
            ...(messages ? messages : []),
          ]);

          ws?.send(message);

          setInputValue("");
        }
      }}
    />
  );
}
