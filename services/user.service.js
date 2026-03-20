import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../models/users.model.js";

// define the existing user
export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      password: usersTable.password,
      salt: usersTable.salt,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return existingUser;
}

// store the user data in db
export async function storeUserInDb({
  name,
  email,
  password: hashedPassword,
  salt,
}) {
  const [user] = await db
    .insert(usersTable)
    .values({ name, email, password: hashedPassword, salt })
    .returning({ id: usersTable.id });

  return user;
}
