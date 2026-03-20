import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

/*
|--------------------------------------------------------------------------
| USERS TABLE
|--------------------------------------------------------------------------
*/
export const usersTable = pgTable("users", {
  // Primary Key (UUID automatically generated)
  id: uuid("id").defaultRandom().primaryKey(),

  // user's name
  name: varchar("name", { length: 100 }).notNull(),

  // email must be unique
  email: varchar("email", { length: 150 }).notNull().unique(),

  // hashed password
  password: text("password").notNull(),

  // salt for password
  salt: text("salt").notNull(),

  // created timestamp
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
