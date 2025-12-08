import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "public", "data", "categories.json");

async function readData(): Promise<number[]> {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data) as number[];
  } catch {
    return [] as number[]; // empty array if file doesn't exist
  }
}

/**
 * Method to fetch event information for specific event
 *
 * @param request
 * @param params: { id: number }
 * @returns Event information or error message
 */
export async function GET(request: NextRequest) {
  const categories = await readData();
  return NextResponse.json(categories, { status: 200 });
}
