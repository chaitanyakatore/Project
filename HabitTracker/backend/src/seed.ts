import { db } from "./db";
import { users, habits } from "./db/schema";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create a Test User
  const [newUser] = await db
    .insert(users)
    .values({
      email: "test@example.com",
    })
    .returning();

  console.log("✅ Created User:", newUser.id);

  // 2. Create some sample habits for them
  await db.insert(habits).values([
    { userId: newUser.id, name: "Drink 3L Water" },
    { userId: newUser.id, name: "Read 10 Pages" },
    { userId: newUser.id, name: "Gym" },
  ]);

  console.log("✅ Created 3 Habits");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
