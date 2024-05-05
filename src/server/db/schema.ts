import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
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

export const chats = createTable("chat", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const chatsRelations = relations(chats, ({ many }) => ({
  voices: many(voices),
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
