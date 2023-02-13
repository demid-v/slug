import type { Message } from "@prisma/client";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type ClientMessage = Optional<Message, "id" | "created">;

export type { ClientMessage };
