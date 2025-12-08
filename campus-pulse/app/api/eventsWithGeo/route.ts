import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { EventType } from "@/types/types";

const eventsPath = path.join(process.cwd(), "public", "data", "events.json");
const roomsPath = path.join(process.cwd(), "public", "data", "rooms.json");

type RoomEntryRaw = {
  lat: string;
  lon: string;
};

type RoomsMap = Record<string, RoomEntryRaw>;

type EventWithGeo = EventType & {
  geo: { lat: number; lon: number } | null;
};

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

export async function GET() {
  const events = (await readJsonFile<EventType[]>(eventsPath)) ?? [];
  const rooms = (await readJsonFile<RoomsMap>(roomsPath)) ?? {};

  const eventsWithGeo: EventWithGeo[] = events.map((event) => {
    const room = rooms[event.location];
    if (!room) {
      // No geo info for this location
      return { ...event, geo: null };
    }

    const lat = parseFloat(room.lat);
    const lon = parseFloat(room.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return { ...event, geo: null };
    }

    return {
      ...event,
      geo: { lat, lon },
    };
  });

  return NextResponse.json(eventsWithGeo);
}
