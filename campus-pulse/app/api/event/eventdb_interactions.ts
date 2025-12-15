import { EventType } from "@/types/types";
import { neon } from "@neondatabase/serverless";
import { del, put } from "@vercel/blob";

const sql = neon(process.env.DATABASE_URL!);

export async function deleteImage(imageUrl: string) {
  try {
    const cleanUrl = imageUrl.split("?")[0];

    if (!cleanUrl.includes("blob.vercel-storage.com")) {
      console.warn("Not a Vercel Blob URL:", imageUrl);
      return false;
    }

    await del(cleanUrl);

    console.log(`✅ Deleted blob: ${cleanUrl}`);
    return true;
  } catch (error) {
    console.error("Error occured while deleting image from vercel blob", error);
    return false;
  }
}

export async function uploadImage(image: File, filename: string) {
  try {
    if (!image || !filename) {
      console.warn("image or filename not provided!");
      return false;
    }

    const newBlob = await put(
      filename,
      Buffer.from(await image.arrayBuffer()),
      { access: "public" }
    );

    return newBlob;
  } catch (error) {
    console.error("Error occured while uploading image to vercel blob", error);
    return false;
  }
}

export async function deleteEvent(eid: string) {
  return await sql`DELETE FROM events WHERE id = ${eid};`;
}

export async function updateEvent(event: EventType) {
  const reduced_event = event as Omit<
    EventType,
    "id" | "user_enrolled" | "created_by_user"
  >;

  const key_value = Object.entries(reduced_event).map(([key, value]) => {
    return `${key} = ${value}`;
  });

  return await sql`UPDATE events SET ${key_value.join(", ")} WHERE id = ${
    event.id
  };`;
}

export async function createEvent(event: EventType) {
  const reduced_event = event as Omit<
    EventType,
    "user_enrolled" | "created_by_user"
  >;

  const keys = Object.keys(reduced_event);

  const values = Object.entries(reduced_event).map(([key, value]) => {
    return `${key} = ${value}`;
  });

  return await sql`INSERT INTO events (${keys.join(
    ", "
  )}) VALUES (${values.join(", ")});`;
}

export async function getEvent(eid: string) {
  const response = (await sql`SELECT * FROM events WHERE id = ${eid}`)[0];
  return response as EventType | undefined;
}

export async function getEvents() {
  const response = await sql`SELECT * FROM events`;
  return response as EventType[] | undefined;
}
