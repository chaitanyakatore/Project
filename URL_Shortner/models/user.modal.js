
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  firstname: varchar('firstname', { length: 40 }).notNull(),
  lastname: varchar('lastname', { length: 40 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: text("password", { length: 255 }).notNull(),
  salt: text("salt", { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(()=> new Date()),
});
