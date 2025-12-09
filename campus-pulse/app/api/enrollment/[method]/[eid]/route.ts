import { EventType, UserType } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const userDataPath = path.join(process.cwd(), "public", "data", "users.json");
const lockFilePath = path.join(process.cwd(), "public", "data", "users.lock");
const eventDataPath = path.join(process.cwd(), "public", "data", "events.json");
const eventLockPath = path.join(process.cwd(), "public", "data", "events.lock");

/**
 * Simple file lock - prevents concurrent writes
 */
async function acquireUserLock(): Promise<void> {
  const maxAttempts = 50;
  const delay = 100; // ms

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fs.access(lockFilePath);
      // Lock exists, wait and retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch {
      // Lock doesn't exist, create it
      await fs.writeFile(lockFilePath, Date.now().toString());
      return;
    }
  }
  throw new Error("Could not acquire lock after retries");
}

async function releaseUserLock(): Promise<void> {
  try {
    await fs.unlink(lockFilePath);
  } catch {
    // Ignore if lock doesn't exist
  }
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ method: string; eid: string }> }
) {
  const { method, eid } = await params;
  const userId = request.headers.get("X-Device-Id") ?? "anonymous";

  if (!userId || userId === "anonymous") {
    return NextResponse.json({ error: "User ID required!" }, { status: 400 });
  }

  try {
    await acquireUserLock();
    await acquireEventLock();

    const users = await readUserData();
    const events = await readEventData();

    const userIndex = users.findIndex((ele) => ele.id === userId);
    if (userIndex === -1) {
      await releaseUserLock();
      await releaseEventLock();
      return NextResponse.json(
        { error: `No user found with id ${userId}.` },
        { status: 404 }
      );
    }

    const eventIndex = events.findIndex((e: EventType) => e.id === eid);
    if (eventIndex === -1) {
      await releaseUserLock();
      await releaseEventLock();
      return NextResponse.json(
        { error: `Event with id ${eid} not found.` },
        { status: 404 }
      );
    }

    const user = users[userIndex];
    const event = events[eventIndex];

    let changes = false;
    let message = "";

    if (method === "enroll") {
      if (user.enrollments.includes(eid)) {
        message = "Already enrolled";
        console.log(message)
      } else if (event.participants >= event.max_participants) {
        await releaseUserLock();
        await releaseEventLock();
        return NextResponse.json(
          {
            error: `Event is full! (${event.participants}/${event.max_participants} spots taken)`,
          },
          { status: 400 }
        );
      } else {
        // **ENROLL + INCREMENT COUNT**
        user.enrollments.push(eid);
        events[eventIndex].participants += 1; // ← INCREMENT
        changes = true;
        message = "Enrollment successful";
      }
    } else if (method === "unenroll") {
      if (user.enrollments.includes(eid)) {
        user.enrollments = user.enrollments.filter((ele) => ele !== eid);
        events[eventIndex].participants -= 1; // ← DECREMENT
        events[eventIndex].participants = Math.max(
          0,
          events[eventIndex].participants
        ); // Prevent negative
        changes = true;
        message = "Unenrollment successful";
      } else {
        message = "Not enrolled in this event";
      }
    }

    if (changes) {
      await writeUserData(users);
      await writeEventData(events); // ← Write updated events too!
    }

    await releaseUserLock();
    await releaseEventLock();

    return NextResponse.json(
      {
        message,
        enrolled: user.enrollments.includes(eid),
        spots: `${event.participants}/${event.max_participants}`,
      },
      { status: 200 }
    );
  } catch (error) {
    await releaseUserLock();
    await releaseEventLock();
    console.error("Enrollment failed:", error);
    return NextResponse.json(
      { error: "Failed to process enrollment" },
      { status: 500 }
    );
  }
}
