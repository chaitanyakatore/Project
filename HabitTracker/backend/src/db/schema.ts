import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  date,
  unique,
} from "drizzle-orm/pg-core";

// 1. Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Habits Table
export const habits = pgTable("habits", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(), // e.g., "Gym"
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. Habit Logs (The Checkboxes)
export const habitLogs = pgTable(
  "habit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    habitId: uuid("habit_id")
      .references(() => habits.id)
      .notNull(),
    date: date("date").notNull(), // YYYY-MM-DD
    completed: boolean("completed").default(true),
  },
  (t) => [
    // This constraint prevents a user from having two "Gym" logs on the same day
    unique("unique_habit_log").on(t.habitId, t.date),
  ]
);
