import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { EventType } from "@/types/types";
import { randomUUID } from "crypto";
import {
  deleteEvent,
  deleteImage,
  getEvent,
  updateEvent,
  uploadImage,
} from "../eventdb_interactions";
import { getUser, updateUser } from "../../user/userdb_interactions";



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eid: string }> }
) {
  const uid = request.headers.get("X-Device-Id") ?? "anonymous";
  const { eid } = await params;

  let event = await getEvent(eid);

  if (!event) {
    return NextResponse.json(
      { error: `Event with id ${eid} not found.` },
      { status: 404 }
    );
  }

  const user = await getUser(uid);
  event = {
    ...event,
    user_enrolled:
      uid !== "anonymous" ? user?.enrollments.includes(event.id) : false,
    created_by_user:
      uid !== "anonymous" ? user?.my_events.includes(event.id) : false,
  };

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

  const oldEvent = await getEvent(eid);

  if (!oldEvent) {
    console.warn(`Event with id ${eid} not found`);
    return NextResponse.json(
      { error: `Event with id ${eid} not found` },
      { status: 404 }
    );
  }

  const oldImagePath = oldEvent.image_path;

  if (file) {
    if (oldImagePath && !oldImagePath.includes("image_placeholder.jpg")) {
      deleteImage(oldImagePath);
    }

    const fileExtension = path.extname(file.name);
    const filename = `${randomUUID()}${fileExtension}`;

    const uploadRes = await uploadImage(file, filename);

    if (uploadRes) {
      data.image_path = uploadRes.url;
    }
  }

  await updateEvent(eid, data);

  return NextResponse.json({ message: "successful" }, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eid: string }> }
) {
  const uid = request.headers.get("X-Device-Id") ?? "anonymous";
  const { eid } = await params;

  if (!eid) {
    return NextResponse.json(
      { error: "Missing or invalid id" },
      { status: 400 }
    );
  }

  const event = await getEvent(eid);

  if (!event) {
    console.warn(`Event with id ${eid} not found`);
    return NextResponse.json(
      { error: `Event with id ${eid} not found` },
      { status: 404 }
    );
  }

  // Delete image first
  const eventImagePath = event.image_path;
  if (eventImagePath && !eventImagePath.includes("image_placeholder.jpg")) {
    deleteImage(eventImagePath);
  }

  await deleteEvent(eid);

  if (uid !== "anonymous") {
    await updateUser(uid, "delete_event", eid);
  }

  return NextResponse.json(
    { message: "Event deleted successfully" },
    { status: 200 }
  );
}
