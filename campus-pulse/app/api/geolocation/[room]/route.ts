import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";

const roomsPath = path.join(process.cwd(), "public", "data", "rooms.json");

type RoomCoordinatesRaw = {
  lat: string;
  lon: string;
};

type RoomsMap = Record<string, RoomCoordinatesRaw>;

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ room?: string }> }
) {
  const { room } = await context.params;

  if (!room) {
    return NextResponse.json(
      { error: "Room parameter is required" },
      { status: 400 }
    );
  }

  const rooms = (await readJsonFile<RoomsMap>(roomsPath)) ?? {};
  const coordinates = rooms[room];

  if (!coordinates) {
    return NextResponse.json(
      { error: `Coordinates not found for room "${room}"` },
      { status: 404 }
    );
  }

  const numericCoordinates = {
    lat: parseFloat(coordinates.lat),
    lon: parseFloat(coordinates.lon),
  };

  return NextResponse.json(numericCoordinates);
}
