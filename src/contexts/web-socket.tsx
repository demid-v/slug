import {
  type Accessor,
  createContext,
  createSignal,
  onMount,
  useContext,
  type JSXElement,
} from "solid-js";

const SessionContext =
  createContext<
    [WebSocket | null, Accessor<WebSocket["readyState"] | "error" | undefined>]
  >();

export function WebSocketProvider(props: { children: JSXElement }) {
  const [webSocketState, setWebSocketState] = createSignal<
    WebSocket["readyState"] | "error"
  >();

  let webSocket: WebSocket | null = null;

  onMount(() => {
    webSocket = new WebSocket("wss://slug-server.glitch.me/");
    setWebSocketState(WebSocket.CONNECTING);

    webSocket.addEventListener("open", (event) => {
      console.log("open", event);
      setWebSocketState(WebSocket.OPEN);
    });

    webSocket.addEventListener("close", (event) => {
      console.log("close", event);
      setWebSocketState(WebSocket.CLOSED);
      webSocket = new WebSocket("wss://slug-server.glitch.me/");
      setWebSocketState(WebSocket.CONNECTING);
    });

    webSocket.addEventListener("error", (event) => {
      console.log("error", event);
      setWebSocketState("error");
    });
  });

  return (
    <SessionContext.Provider value={[webSocket, webSocketState]}>
      {props.children}
    </SessionContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(SessionContext);
}
