import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { EventType } from "@/types/types";
import { randomUUID } from "crypto";

const EventTypeDefault: Partial<EventType> = {
  id: -1,
  title: "Title",
  image_path: "",
  description: "",
  datetime: 0,
  recurring: false,
  recurrence_intervall: null,
  location: "",
  geo_location: "",
  public_status: "public",
  categories: [],
  max_participants: 0,
  participants: 0,
};

const dataPath = path.join(process.cwd(), "data", "events.json");
const uploadsPath = path.join(process.cwd(), "public", "uploads");
const uploadsPathForClient = path.join("uploads")
const placholderImagePath = path.join(
  process.cwd(),
  "images",
  "image_placeholder.jpg"
);


function withDefaults<T>(data: Partial<T>, defaults: Partial<T>) {
  return { ...defaults, ... data } as T
}


async function readData(): Promise<EventType[]> {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data) as EventType[];
  } catch {
    return [] as EventType[]; // empty array if file doesn't exist
  }
}

async function writeData(data: any[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const events = await readData();
  const event = events.find((value) => value.id == params.id);
  return NextResponse.json(event);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("image") as File;
  const data_json = formData.get("data") as string;

  if (!data_json) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  let data = withDefaults<EventType>(JSON.parse(data_json) as Partial<EventType>, EventTypeDefault);

  if (!file) {
    console.log("no file found");
    data.image_path = placholderImagePath;
  } else {
    const fileExtension = path.extname(file.name);
    const filename = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(uploadsPath, filename);

    await fs.mkdir(uploadsPath, { recursive: true });

    const bytes = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes))
    data.image_path = path.join(uploadsPathForClient, filename)
  }

  
  const events = await readData();
  data.id = events.length;
  events.push(data);
  await writeData(events);
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const updatedEvent = await request.json();
  const events = await readData();
  const index = events.findIndex((e: any) => e.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    await writeData(events);
    return NextResponse.json(updatedEvent);
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
