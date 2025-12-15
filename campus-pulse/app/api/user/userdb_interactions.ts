import { UserType } from "@/types/types";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function readUser(uid: string): Promise<UserType | undefined> {
  const response = (await sql`SELECT * FROM users WHERE id = ${uid};`)[0];
  const user = response as UserType;

  if (!user) {
    return undefined;
  }

  return user;
}

export async function readUsers(): Promise<UserType[] | undefined> {
  const response = await sql`SELECT * FROM users;`;
  const users = response as UserType[];

  if (!users) {
    return undefined;
  }

  return users;
}

export async function writeUser(user: UserType) {
  const response = await sql`INSERT INTO users (
    id, name, enrollments, my_events
  ) VALUES (
    ${user.id},
    ${user.name},
    ${user.enrollments},
    ${user.my_events}
  );`;
  return response;
}

export async function updateUser(
  uid: string,
  action: "enroll" | "unenroll" | "create" | "delete" | "name",
  eid?: string,
  name?: string
) {
  if (action === "name" && !name) {
    return new Error("action is name, but no name was provided!")
  } else if (action !== "name" && !eid) {
    return new Error("action was set to manipulate enrollments or my_events but no eid was given!")
  }

  if (action === "enroll") {
    return await sql`UPDATE users SET enrollments = array_append(enrollments, ${eid}) WHERE id = ${uid};`;
  } else if (action === "unenroll") {
    return await sql`UPDATE users SET enrollments = array_remove(enrollments, ${eid}) WHERE id = ${uid};`;
  } else if (action === "create") {
    return await sql`UPDATE users SET enrollments = array_append(my_events, ${eid}) WHERE id = ${uid};`;
  } else if (action === "delete") {
    return await sql`UPDATE users SET enrollments = array_remove(my_events, ${eid}) WHERE id = ${uid};`;
  } else if (action === "name") {
    return await sql`UPDATE users SET name = ${name} WHERE id = ${uid};`;
  }

  return;
}
