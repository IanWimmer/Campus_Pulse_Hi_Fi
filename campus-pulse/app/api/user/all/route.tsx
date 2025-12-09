import { UserType } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const userDataPath = path.join(process.cwd(), "public", "data", "users.json");
const lockFilePath = path.join(process.cwd(), "public", "data", "users.lock");


async function readUserData(): Promise<UserType[]> {
  try {
    const data = await fs.readFile(userDataPath, "utf-8");
    return JSON.parse(data) as UserType[];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const users = await readUserData();

  if (!users) {
    return NextResponse.json(
      { error: `Users not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(users, { status: 200 });
}
