import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../user/userdb_interactions";
import { getEvents } from "../event/eventdb_interactions";

export async function GET(request: NextRequest) {
  const uid = request.headers.get("X-Device-Id") ?? "anonymous";
  const events = await getEvents();

  if (!events) {
    console.error("Fetching events failed!");
    return NextResponse.json(
      { error: "Fetching events failed!" },
      { status: 500 }
    );
  }

  const user = await getUser(uid);

  events.forEach((ele, index, array) => {
    array[index] = {
      ...ele,
      user_enrolled:
        uid !== "anonymous" ? user?.enrollments.includes(ele.id) : false,
      created_by_user:
        uid !== "anonymous" ? user?.my_events.includes(ele.id) : false,
    };
  });

  return NextResponse.json(events);
}
