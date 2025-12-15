import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { EventType, UserType } from "@/types/types";
import path from "path";
import { put } from "@vercel/blob";

const eventDataPath = path.join(process.cwd(), "public", "data", "events.json");
const userDataPath = path.join(process.cwd(), "public", "data", "users.json");

const sql = neon(process.env.DATABASE_URL!);

async function readEvents(): Promise<EventType[]> {
  try {
    const data = await fs.readFile(eventDataPath, "utf8");
    return JSON.parse(data) as EventType[];
  } catch {
    return [];
  }
}

async function readUsers() {
  try {
    const data = await fs.readFile(userDataPath, "utf8")
    return JSON.parse(data) as UserType[]
  } catch {
    return []
  }
}

async function getData(eid: string) {
  const response = (await sql`SELECT * FROM events WHERE id = ${eid}`)[0];
  console.log(response as EventType);
  return response as EventType | undefined;
}

async function writeData(event: EventType) {
  const response = await sql`INSERT INTO events (
  id, title, image_path, description, datetime, 
  recurring, recurrence_intervall, location, geo_location, 
  public_status, categories, max_participants, participants
) VALUES (
  ${event.id},
  ${event.title},
  ${"event.image_path"},
  ${event.description},
  ${event.datetime},
  ${event.recurring},
  ${event.recurrence_intervall},
  ${event.location},
  ${event.geo_location},
  ${event.public_status},
  ${event.categories},
  ${event.max_participants},
  ${event.participants}
);`;
  return response;
}

async function writeUsers(user: UserType) {
  const response = await sql`INSERT INTO users (
    id, name, enrollments, my_events
  ) VALUES (
    ${user.id},
    ${user.name},
    ${user.enrollments},
    ${user.my_events}
);`;
  return response;
}

async function updateImages() {
  try {
    // Read legacy JSON data
    const eventsPath = path.join(
      process.cwd(),
      "public",
      "data",
      "events.json"
    );
    const eventsData = await fs.readFile(eventsPath, "utf-8");
    const events: any[] = JSON.parse(eventsData);

    console.log(`Processing ${events.length} events...`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Process each event
    for (const event of events) {
      // Skip if no image or placeholder
      if (
        !event.image_path ||
        event.image_path.includes("image_placeholder.jpg")
      ) {
        console.log(`Skipping ${event.id}: no image or placeholder`);
        skippedCount++;
        continue;
      }

      try {
        // Construct full local path
        const fullImagePath = path.join(
          process.cwd(),
          "public",
          event.image_path
        );

        // Check if file exists
        await fs.access(fullImagePath);

        // Read image file
        const fileBuffer = await fs.readFile(fullImagePath);
        const fileName = path.basename(event.image_path);

        // Upload to Vercel Blob
        const newBlob = await put(fileName, fileBuffer, {
          access: "public",
        });

        console.log(
          `✅ Migrated ${event.id}: ${event.image_path} → ${newBlob.url}`
        );

        // Update Neon DB
        await sql`
          UPDATE events 
          SET image_path = ${newBlob.url}
          WHERE id = ${event.id}
        `;

        updatedCount++;
      } catch (fileError) {
        if (fileError instanceof Error) {
          console.warn(`⚠️ Failed to process ${event.id}:`, fileError.message);
        } else {
          console.warn(`⚠️ Failed to process ${event.id}:`, fileError);
        }
        skippedCount++;
      }
    }

    console.log(`\nMigration complete!`);
    console.log(`✅ Updated: ${updatedCount} images`);
    console.log(`⏭️  Skipped: ${skippedCount} events`);

    return { updated: updatedCount, skipped: skippedCount };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const users = await readUsers();

  /*.forEach(async (user) => {
    const result = await writeUsers(user)
    results.push(result)
    console.log(result)
  })*/

  /*
  const result = await getData("0");
  console.log(result);
  if (typeof result === "undefined") {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }*/

  return NextResponse.json(users);
}
