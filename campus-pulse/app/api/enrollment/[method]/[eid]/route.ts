import { updateEventEnrollmentCount } from "@/app/api/event/eventdb_interactions";
import { getUser, updateUser } from "@/app/api/user/userdb_interactions";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ method: "enroll" | "unenroll"; eid: string }> }
) {
  const { method, eid } = await params;
  const uid = request.headers.get("X-Device-Id") ?? "anonymous";

  if (!uid || uid === "anonymous") {
    console.error("User ID required!");
    return NextResponse.json({ error: "User ID required!" }, { status: 400 });
  }

  const user = await getUser(uid);

  if (!user) {
    console.error(`User with ID ${uid} not found!`);
    return NextResponse.json(
      { error: `User with ID ${uid} not found!` },
      { status: 404 }
    );
  }

  if (method === "unenroll" && !user.enrollments.includes(eid)) {
    console.error(`User not enrolled in event with ID ${eid}`);
    return NextResponse.json(
      { error: `User not enrolled in event with ID ${eid}` },
      { status: 400 }
    );
  }

  const resEvent = await updateEventEnrollmentCount(eid, method);
  if (
    resEvent.successful === false &&
    resEvent.message === "Max participants reached"
  ) {
    console.error("Max participants reached");
    return NextResponse.json(
      { error: "Max participants reached" },
      { status: 400 }
    );
  }
  const resUser = await updateUser(uid, method, eid);

  console.log([resUser, resEvent]);

  return NextResponse.json([resUser, resEvent]);
}
