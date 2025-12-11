import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { EventType, UserType } from "@/types/types";
import { randomUUID } from "crypto";

const EventTypeDefault: Partial<EventType> = {
  id: "",
  title: "Title",
  image_path: "",
  description: "",
  datetime: "",
  recurring: false,
  recurrence_intervall: null,
  location: "",
  geo_location: "",
  public_status: "public",
  categories: [],
  max_participants: 0,
  participants: 0,
  user_enrolled: false,
};

const eventDataPath = path.join(process.cwd(), "public", "data", "events.json");
const eventLockPath = path.join(process.cwd(), "public", "data", "events.lock");
const userDataPath = path.join(process.cwd(), "public", "data", "users.json");
const userLockPath = path.join(process.cwd(), "public", "data", "users.lock");
const uploadsPath = path.join(process.cwd(), "public", "uploads");
const uploadsPathForClient = "uploads";
const placeholderImagePath = path.join("images", "image_placeholder.jpg");

function withDefaults<T>(data: Partial<T>, defaults: Partial<T>) {
  return { ...defaults, ...data } as T;
}

/**
 * Simple file lock - prevents concurrent writes
 */
async function acquireUserLock(): Promise<void> {
  const maxAttempts = 50;
  const delay = 100; // ms

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fs.access(userLockPath);
      // Lock exists, wait and retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch {
      // Lock doesn't exist, create it
      await fs.writeFile(userLockPath, Date.now().toString());
      return;
    }
  }
  throw new Error("Could not acquire lock after retries");
}

async function releaseUserLock(): Promise<void> {
  try {
    await fs.unlink(userLockPath);
  } catch {
    // Ignore if lock doesn't exist
  }
}

/** File locking */
async function acquireEventLock(): Promise<void> {
  const maxAttempts = 50;
  const delay = 100;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fs.access(eventLockPath);
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch {
      await fs.writeFile(eventLockPath, Date.now().toString());
      return;
    }
  }
  throw new Error("Could not acquire events lock");
}

async function releaseEventLock(): Promise<void> {
  try {
    await fs.unlink(eventLockPath);
  } catch {}
}

async function readUserData(): Promise<UserType[]> {
  try {
    const data = await fs.readFile(userDataPath, "utf-8");
    return JSON.parse(data) as UserType[];
  } catch {
    return [];
  }
}

async function readEventData(): Promise<EventType[]> {
  try {
    const data = await fs.readFile(eventDataPath, "utf8");
    return JSON.parse(data) as EventType[];
  } catch {
    return [];
  }
}

async function writeUserData(data: UserType[]): Promise<void> {
  await fs.mkdir(path.dirname(userDataPath), { recursive: true });
  await fs.writeFile(userDataPath, JSON.stringify(data, null, 2));
}

async function writeEventData(data: any[]) {
  await fs.mkdir(path.dirname(eventDataPath), { recursive: true });
  await fs.writeFile(eventDataPath, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get("X-Device-Id") ?? "anonymous";

  const formData = await request.formData();
  const file = formData.get("image") as File;
  const data_json = formData.get("data") as string;
  const enroll_json = formData.get("enroll") as string;

  if (!data_json) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  let data = withDefaults<EventType>(
    JSON.parse(data_json) as Partial<EventType>,
    EventTypeDefault
  );

  const enrollOnCreation = await JSON.parse(enroll_json)

  try {
    // **LOCK → READ → MODIFY → WRITE → UNLOCK**
    await acquireEventLock();
    await acquireUserLock();

    if (!file) {
      data.image_path = placeholderImagePath;
    } else {
      const fileExtension = path.extname(file.name);
      const filename = `${randomUUID()}${fileExtension}`;
      const filePath = path.join(uploadsPath, filename);

      await fs.mkdir(uploadsPath, { recursive: true });
      const bytes = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(bytes));
      data.image_path = path.join(uploadsPathForClient, filename);
    }

    

    const events = await readEventData();
    data.id = randomUUID();
    if (enrollOnCreation) data.participants = 1;
    events.push(data);
    await writeEventData(events);

    const users = await readUserData();
    const userIndex = users.findIndex((ele) => ele.id === userId);
    if (userIndex === -1) {
      await releaseUserLock();
      await releaseEventLock();
      return NextResponse.json(
        { error: `No user found with id ${userId}.` },
        { status: 404 }
      );
    }

    const user = users[userIndex]
    user.my_events.push(data.id)
    if (enrollOnCreation) {
      user.enrollments.push(data.id)
    }
    await writeUserData(users)

    await releaseUserLock();
    await releaseEventLock();

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    await releaseUserLock();
    await releaseEventLock();
    console.error("Event creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
