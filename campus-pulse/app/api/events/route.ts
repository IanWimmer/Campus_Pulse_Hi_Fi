import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { EventType, UserType } from "@/types/types";

const eventDataPath = path.join(process.cwd(), "public", "data", "events.json");

const userDataPath = path.join(process.cwd(), "public", "data", "users.json");

async function readData() {
  try {
    // console.log(eventDataPath)
    const data = await fs.readFile(eventDataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error while reading all events", error);
    return []; // empty array if file doesn't exist
  }
}

async function readUserData(): Promise<UserType[]> {
  try {
    const data = await fs.readFile(userDataPath, "utf-8");
    return JSON.parse(data) as UserType[];
  } catch {
    return [] as UserType[];
  }
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get("X-Device-Id") ?? "anonymous";
  const events = (await readData()) as EventType[];

  if (userId !== "anonymous") {
    const users = await readUserData();
    // console.log(users)
    const user = users.find((ele) => ele.id == userId);
    // console.log(userId)
    events.forEach((ele, index, array) => {
      array[index] = {
        ...ele,
        user_enrolled: user?.enrollments.includes(ele.id),
        created_by_user: user?.my_events.includes(ele.id),
      };
    });
  }

  return NextResponse.json(events);
}
