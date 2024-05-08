import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  primaryKey,
  real,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `slug_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 32 }).primaryKey(),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToChats: many(usersToChats),
}));

export const chats = createTable("chat", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const chatsRelations = relations(chats, ({ many }) => ({
  voices: many(voices),
  usersToChats: many(usersToChats),
}));

export const usersToChats = createTable(
  "users_to_chats",
  {
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    chatId: integer("chat_id")
      .notNull()
      .references(() => chats.id),
  },
  (table) => ({
    primaryKey: primaryKey({ columns: [table.userId, table.chatId] }),
  }),
);

export const usersToChatsRelations = relations(usersToChats, ({ one }) => ({
  chat: one(chats, {
    fields: [usersToChats.chatId],
    references: [chats.id],
  }),
  user: one(users, {
    fields: [usersToChats.userId],
    references: [users.id],
  }),
}));

export const voices = createTable("voice", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 256 }).notNull(),
  duration: real("duration").notNull(),
  chatId: integer("chat_id")
    .notNull()
    .references(() => chats.id),
  userId: varchar("user_id", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const voicesRelations = relations(voices, ({ one }) => ({
  chat: one(chats, {
    fields: [voices.chatId],
    references: [chats.id],
  }),
}));
