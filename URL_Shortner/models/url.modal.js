import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./user.modal.js";

export const urlsTable = pgTable("urls", {
  id: uuid().primaryKey().defaultRandom(),
  shortCode: varchar("code", { length: 100 }).notNull().unique(),
  targetUrl: text("target_url").notNull(),
  userId: uuid("user_id")
    .references(() => userTable.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
