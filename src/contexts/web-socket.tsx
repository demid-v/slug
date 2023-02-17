import {
  type Accessor,
  createContext,
  createSignal,
  onMount,
  useContext,
  type JSXElement,
  createEffect,
} from "solid-js";

const WebSocketContext = createContext<Accessor<WebSocket | undefined>>();

export function WebSocketProvider(props: { children: JSXElement }) {
  const [webSocket, setWebSocket] = createSignal<WebSocket>();

  onMount(() => {
    setWebSocket(new WebSocket("wss://slug-server.glitch.me/"));
  });

  createEffect(() => {
    webSocket?.()?.addEventListener("open", (event) => {
      console.log("open", event);
    });

    webSocket?.()?.addEventListener("close", (event) => {
      console.log("close", event);
      setWebSocket(new WebSocket("wss://slug-server.glitch.me/"));
    });

    webSocket?.()?.addEventListener("error", (event) => {
      console.log("error", event);
    });
  });

  return (
    <WebSocketContext.Provider value={webSocket}>
      {props.children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
