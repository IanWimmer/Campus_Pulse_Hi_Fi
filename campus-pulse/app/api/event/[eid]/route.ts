import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { EventType, UserType } from "@/types/types";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";

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
};

const sql = neon(process.env.DATABASE_URL!);

const eventDataPath = path.join(process.cwd(), "public", "data", "events.json");
const eventLockPath = path.join(process.cwd(), "public", "data", "events.lock");
const userDataPath = path.join(process.cwd(), "public", "data", "users.json");
const userLockPath = path.join(process.cwd(), "public", "data", "users.lock");
const uploadsPath = path.join(process.cwd(), "public", "uploads");
const uploadsPathForClient = "uploads";


async function getEvent(eid: string) {
  const response = (await sql`SELECT * FROM events WHERE id = ${eid}`)[0];
  return response as EventType | undefined;
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

/** Event file locking */
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

async function releaseUserLock(): Promise<void> {
  try {
    await fs.unlink(userLockPath);
  } catch {
    // Ignore if lock doesn't exist
  }
}

async function releaseEventLock(): Promise<void> {
  try {
    await fs.unlink(eventLockPath);
  } catch {}
}

async function readEventData(): Promise<EventType[]> {
  try {
    const data = await fs.readFile(eventDataPath, "utf8");
    return JSON.parse(data) as EventType[];
  } catch {
    return [];
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

async function writeEventData(data: any[]) {
  await fs.mkdir(path.dirname(eventDataPath), { recursive: true });
  await fs.writeFile(eventDataPath, JSON.stringify(data, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eid: string }> }
) {
  const userId = request.headers.get("X-Device-Id") ?? "anonymous";
  const { eid } = await params;

  const events = await readEventData();
  let event = events.find((value) => value.id === eid);

  if (!event) {
    return NextResponse.json(
      { error: `Event with id ${eid} not found.` },
      { status: 404 }
    );
  }

  if (userId !== "anonymous") {
    const users = await readUserData();
    const user = users.find((ele) => ele.id === userId);
    event = {
      ...event,
      user_enrolled: user?.enrollments.includes(event.id),
      created_by_user: user?.my_events.includes(event.id),
    };
  }

  return NextResponse.json(event, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eid: string }> }
) {
  const { eid } = await params;
  const formData = await request.formData();
  const data_json = formData.get("data") as string;
  const file = formData.get("image") as File;

  if (!data_json) {
    return NextResponse.json({ error: "Missing data body" }, { status: 400 });
  }

  const data = JSON.parse(data_json) as Partial<EventType>;
  if (!eid) {
    return NextResponse.json(
      { error: "Missing or invalid id" },
      { status: 400 }
    );
  }

  const keys = Object.keys(data);
  if (!((keys.length === 1 && file) || keys.length > 1)) {
    return NextResponse.json(
      {
        error: "Only id was given, add at least one more parameter or an image",
      },
      { status: 400 }
    );
  }

  try {
    // **LOCK → READ → MODIFY → WRITE → UNLOCK**
    await acquireEventLock();

    const events = await readEventData();
    const index = events.findIndex((e: any) => e.id === eid);

    if (index === -1) {
      await releaseEventLock();
      return NextResponse.json(
        { error: `Event with id ${eid} not found` },
        { status: 404 }
      );
    }

    let updatedEvent = events[index];
    const oldImagePath = updatedEvent.image_path;

    if (keys.length > 1) {
      const { id, ...updatedData } = data;
      updatedEvent = { ...updatedEvent, ...updatedData };
    }

    if (file) {
      if (oldImagePath && !oldImagePath.includes("image_placeholder.jpg")) {
        try {
          const fullOldPath = path.join(process.cwd(), "public", oldImagePath);
          await fs.unlink(fullOldPath);
          console.log("Deleted old image:", oldImagePath);
        } catch (error) {
          console.warn("Failed to delete old image:", error);
        }
      }

      const fileExtension = path.extname(file.name);
      const filename = `${randomUUID()}${fileExtension}`;
      const filePath = path.join(uploadsPath, filename);

      await fs.mkdir(uploadsPath, { recursive: true });
      const bytes = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(bytes));

      updatedEvent.image_path = path.join(uploadsPathForClient, filename);
    }

    events[index] = updatedEvent;
    await writeEventData(events);
    await releaseEventLock();

    return NextResponse.json({ message: "successful" }, { status: 200 });
  } catch (error) {
    await releaseEventLock();
    console.error("Event update failed:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eid: string }> }
) {
  const userId = request.headers.get("X-Device-Id") ?? "anonymous";
  const { eid } = await params;

  if (!eid) {
    return NextResponse.json(
      { error: "Missing or invalid id" },
      { status: 400 }
    );
  }

  try {
    await acquireEventLock();

    const events = await readEventData();
    const index = events.findIndex((e: EventType) => e.id === eid);

    if (index === -1) {
      await releaseEventLock();
      return NextResponse.json(
        { error: `Event with id ${eid} not found` },
        { status: 404 }
      );
    }

    // Delete image first
    const eventImagePath = events[index].image_path;
    if (eventImagePath && !eventImagePath.includes("image_placeholder.jpg")) {
      try {
        const fullPath = path.join(process.cwd(), "public", eventImagePath);
        await fs.unlink(fullPath);
        console.log("Deleted image:", eventImagePath);
      } catch (error) {
        console.warn("Failed to delete image:", error);
      }
    }

    events.splice(index, 1);
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

    const user = users[userIndex];
    user.my_events.filter((ele) => ele !== eid);
    await writeUserData(users);
    await releaseEventLock();

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    await releaseEventLock();
    console.error("Event deletion failed:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
