import { EventType } from "@/types/types";
import { neon } from "@neondatabase/serverless";
import { del, put } from "@vercel/blob";

const sql = neon(process.env.DATABASE_URL!);

export const placeholderImagePath =
  "https://aeqyrjgk4pnzalxs.public.blob.vercel-storage.com/image_placeholder.jpg";

export async function deleteImage(imageUrl: string) {
  try {
    const cleanUrl = imageUrl.split("?")[0];

    if (!cleanUrl.includes("blob.vercel-storage.com")) {
      console.warn("Not a Vercel Blob URL:", imageUrl);
      return false;
    }

    await del(cleanUrl);
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

export async function updateEventEnrollmentCount(
  eid: string,
  action: "enroll" | "unenroll"
): Promise<{ successful: false; message: string } | { successful: true }> {
  if (!eid) {
    console.error("Event id required!");
    return { successful: false, message: "Event id required!" };
  }

  const event = await getEvent(eid);

  if (!event) {
    console.error(`Event with id ${eid} not found!`);
    return { successful: false, message: `Event with id ${eid} not found!` };
  }

  if (action === "enroll") {
    if (event.participants >= event.max_participants) {
      console.error(
        `Event with id ${eid} has reached max amount of participants`
      );
      return { successful: false, message: "Max participants reached" };
    }
    const prompt = `UPDATE events SET participants = ${
      event.participants + 1
    } WHERE id = '${String(eid)}'`;

    await sql.query(prompt);
    return { successful: true };
  } else {
    const prompt = `UPDATE events SET participants = ${Math.max(
      event.participants - 1,
      0
    )} WHERE id = '${eid}'`;

    await sql.query(prompt);
    return { successful: true };
  }
}

export async function updateEvent(
  eid: string,
  event: Partial<EventType>,
  verbose = false as boolean
) {
  if (!eid) {
    console.error("Event id required!");
    return false;
  }

  const prev = await getEvent(eid);

  if (!prev) {
    console.error(`Event with id ${eid} not found!`);
    return false;
  }

  const set_list: string[] = [];

  const reduced_keys = Object.keys(event) as (keyof EventType)[];

  reduced_keys.forEach((key) => {
    if (key === "id" || key === "user_enrolled" || key === "created_by_user") {
      if (verbose) console.log("unnecessary key", key);
      return;
    }

    if (prev[key] === event[key]) {
      if (verbose) console.log("same", key);
      return;
    }

    if (key === "datetime") {
      const prev_datetime = new Date(prev.datetime);
      const event_datetime = new Date(event.datetime || "");

      if (prev_datetime.getTime() === event_datetime.getTime()) {
        if (verbose) console.log("same", key);
        return;
      }
    }

    if (key === "categories") {
      const prev_sorted = prev.categories.toSorted();
      const event_sorted = event.categories?.toSorted();

      if (prev_sorted.every((val, i) => val === event_sorted?.[i])) {
        if (verbose) console.log("same", key);
        return;
      }

      if (typeof event_sorted === "undefined") {
        if (verbose) console.log("categories not attached");
        return;
      }

      set_list.push(
        `${key} = ARRAY[${event_sorted.map((cat) => `'${cat}'`).join(",")}]`
      );
      return;
    }

    if (verbose) console.log("not same", key);

    if (key === "max_participants") {
      set_list.push(`${key} = ${event[key]}`);
      return;
    }

    if (typeof event[key] === "string") {
      set_list.push(`${key} = '${event[key]}'`);
      return;
    }

    set_list.push(`${key} = ${event[key]}`);
    return;
  });

  if (verbose) console.log(set_list);

  if (set_list.length === 0) {
    if (verbose) console.log(set_list);
    console.warn("No changes found");
    return true;
  }

  const set_clause = set_list.join(", ");

  const prompt = `UPDATE events SET ${set_clause} WHERE id = '${event.id}';`;

  if (verbose) console.log(prompt);

  await sql.query(prompt);

  return true;
}

export async function createEvent(event: EventType) {
  const keys = Object.keys(event).filter(
    (ele) => ele !== "user_enrolled" && ele !== "created_by_user"
  );

  const filtered_values = Object.entries(event)
    .filter(
      ([key, value]) => key !== "user_enrolled" && key !== "created_by_user"
    )
  const values = filtered_values.map(([key, value]) => {
      if (key === "categories" && Array.isArray(value)) {
        const event_sorted = value.toSorted();

        if (typeof event_sorted === "undefined") {
          return "{}";
        }

        return `ARRAY[${event_sorted.map((cat) => `'${cat}'`).join(",")}]`;
      }

      if (key === "max_participants") {
        return `${event[key]}`;
      }

      if (typeof value === "string") {
        return `'${value}'`;
      }

      return `${value}`;
    });

  const prompt = `INSERT INTO events (${keys.join(", ")}) VALUES (${values.join(
    ", "
  )});`;

  const res = await sql.query(prompt);

  return res;
}

export async function getEvent(eid: string) {
  const response = (await sql`SELECT * FROM events WHERE id = ${eid}`)[0];
  return response as EventType | undefined;
}

export async function getEvents() {
  const response = await sql`SELECT * FROM events`;
  return response as EventType[] | undefined;
}
