import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, "test@example.com"))
    .limit(1);

  if (user.length > 0) {
    console.log("USER_ID:", user[0].id);
  } else {
    console.log("User not found");
  }
  process.exit(0);
}

main();
