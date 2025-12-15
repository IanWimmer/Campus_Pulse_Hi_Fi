import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "../userdb_interactions";

export async function GET() {
  const users = await getUsers();

  if (!users) {
    return NextResponse.json({ error: `Users not found` }, { status: 404 });
  }

  return NextResponse.json(users, { status: 200 });
}
