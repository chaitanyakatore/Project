import { db } from "../db/index.js";
import { userTable } from "../models/index.js";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email){
    const [existingUser] = await db
    .select({ 
        id: userTable.id,
        firstname: userTable.firstname,
        lastname: userTable.lastname,
        email: userTable.email
        
    })
    .from(userTable)
    .where(eq(userTable.email, email));

    return existingUser;
}


export async function createUser(user){
    const [newUser] = await db
    .insert(userTable)
    .values({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      salt: user.salt,
      password: user.password,
    })
    .returning({ id: userTable.id });

    return newUser;
}