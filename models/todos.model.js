import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

import { usersTable } from "./users.model.js";

/*
|--------------------------------------------------------------------------
| TODOS TABLE
|--------------------------------------------------------------------------
*/
export const todosTable = pgTable("todos", {
  // primary key
  id: uuid("id").defaultRandom().primaryKey(),

  // title required
  title: varchar("title", { length: 200 }).notNull(),

  // optional description
  description: text("description"),

  // | connects todo → user using foreign key

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
