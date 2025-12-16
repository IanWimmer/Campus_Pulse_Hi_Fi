import { UserType } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { createUser, getUser, updateUser } from "./userdb_interactions";

export async function GET(request: NextRequest) {
  const uid = request.headers.get("X-Device-Id") ?? "anonymous";
  const user = await getUser(uid);

  if (!user) {
    return NextResponse.json(
      { error: `No user found with id ${uid}.` },
      { status: 404 }
    );
  }

  return NextResponse.json(user, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const uid = request.headers.get("X-Device-Id") ?? "anonymous";
  const formData = await request.formData();
  const data_json = formData.get("data") as string;

  if (!data_json) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const user = JSON.parse(data_json) as UserType;

  await updateUser(uid, "name", undefined, user.name);

  return NextResponse.json(
    { message: "successfully updated name" },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const data_json = formData.get("data") as string;
  // console.log(data_json)

  if (!data_json) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const user = JSON.parse(data_json) as UserType;

  await createUser(user);

  return NextResponse.json(
    {
      user,
    },
    { status: 201 }
  );
}
