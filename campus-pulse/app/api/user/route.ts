import { UserType } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const userDataPath = path.join(process.cwd(), "public", "data", "users.json");
const lockFilePath = path.join(process.cwd(), "public", "data", "users.lock");

/**
 * Simple file lock - prevents concurrent writes
 */
async function acquireLock(): Promise<void> {
  const maxAttempts = 50;
  const delay = 100; // ms
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fs.access(lockFilePath);
      // Lock exists, wait and retry
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch {
      // Lock doesn't exist, create it
      await fs.writeFile(lockFilePath, Date.now().toString());
      return;
    }
  }
  throw new Error("Could not acquire lock after retries");
}

async function releaseLock(): Promise<void> {
  try {
    await fs.unlink(lockFilePath);
  } catch {
    // Ignore if lock doesn't exist
  }
}

async function readUserData(): Promise<UserType[]> {
  try {
    const data = await fs.readFile(userDataPath, "utf-8");
    return JSON.parse(data) as UserType[];
  } catch {
    return [];
  }
}

async function writeUserData(data: UserType[]): Promise<void> {
  await fs.mkdir(path.dirname(userDataPath), { recursive: true });
  await fs.writeFile(userDataPath, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get("X-Device-Id") ?? "anonymous";
  const users = await readUserData();
  const user = users.find((ele) => ele.id === userId);

  if (!user) {
    return NextResponse.json(
      { error: `No user found with id ${userId}.` },
      { status: 404 }
    );
  }

  return NextResponse.json(user, { status: 200 });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const data_json = formData.get("data") as string;
  // console.log(data_json)

  if (!data_json) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  let user = JSON.parse(data_json) as UserType;

  try {
    // **SYNCHRONOUS: Acquire lock first**
    await acquireLock();

    // Read current data (locked)
    let users = await readUserData();
    
    // Check if user already exists
    const alreadyExists = users.some((value) => value.id === user.id);
    
    if (!alreadyExists) {
      users.push(user);
      // Write back (still locked)
      await writeUserData(users);
    }

    // **Release lock**
    await releaseLock();

    return NextResponse.json(
      { 
        message: alreadyExists ? "User already exists" : "User created",
        user 
      }, 
      { status: alreadyExists ? 200 : 201 }
    );
  } catch (error) {
    await releaseLock(); // Ensure lock is released on error
    console.error("User creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create user" }, 
      { status: 500 }
    );
  }
}
