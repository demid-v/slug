import type { RouterOutputs } from "./trpc";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type Messages = RouterOutputs["messages"]["getMessages"];
type ClientMessage = Optional<Messages[0], "created">;

type Servers = RouterOutputs["servers"]["getServers"];

export type { ClientMessage, Servers };
