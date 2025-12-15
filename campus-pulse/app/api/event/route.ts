import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { EventType, UserType } from "@/types/types";
import { randomUUID } from "crypto";
import { createEvent, placeholderImagePath, uploadImage } from "./eventdb_interactions";
import { updateUser } from "../user/userdb_interactions";

const EventTypeDefault: Partial<EventType> = {
  id: "",
  title: "Title",
  image_path: placeholderImagePath,
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
  user_enrolled: false,
};

function withDefaults<T>(data: Partial<T>, defaults: Partial<T>) {
  return { ...defaults, ...data } as T;
}

export async function POST(request: NextRequest) {
  const uid = request.headers.get("X-Device-Id") ?? "anonymous";

  const formData = await request.formData();
  const file = formData.get("image") as File;
  const data_json = formData.get("data") as string;
  const enroll_json = formData.get("enroll") as string;

  if (!data_json) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const data = withDefaults<EventType>(
    JSON.parse(data_json) as Partial<EventType>,
    EventTypeDefault
  );

  const enrollOnCreation = await JSON.parse(enroll_json);

  if (!file) {
    data.image_path = placeholderImagePath;
  } else {
    const fileExtension = path.extname(file.name);
    const filename = `${randomUUID()}${fileExtension}`;

    const uploadRes = await uploadImage(file, filename);

    if (uploadRes) {
      data.image_path = uploadRes.url
    }
  }

  
  data.id = randomUUID();
  if (enrollOnCreation && uid !== "anonymous") data.participants = 1;
  
  await createEvent(data)

  if (enrollOnCreation && uid !== "anonymous") await updateUser(uid, "enroll", data.id);
  
  await updateUser(uid, "create_event", data.id)

  

  return NextResponse.json(data, { status: 201 });
}
