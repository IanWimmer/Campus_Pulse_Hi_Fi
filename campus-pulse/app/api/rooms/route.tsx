import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { RoomType } from "@/types/types";

const roomsDataPath = path.join(process.cwd(), "public", "data", "rooms.json");

async function readData() {
  try {
    // console.log(eventDataPath)
    const data_json = await fs.readFile(roomsDataPath, "utf8");
    const data = Object.entries(JSON.parse(data_json)) as [
      string,
      { lat: string; lon: string } | unknown
    ][];
    return data.map(([roomName, roomGeo]) => {
      return typeof roomGeo === "object" && roomGeo !== null
        ? { ...roomGeo, roomName: roomName }
        : { roomName: roomName, lat: "", lon: "" };
    }) as RoomType[];
  } catch (error) {
    console.error("Error while reading all events", error);
    return []; // empty array if file doesn't exist
  }
}

export async function GET(request: NextRequest) {
  const rooms = await readData();

  return NextResponse.json(rooms);
}
