import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "services.json");
const SESSION_COOKIE = "aaromi_admin_session";

async function readData() {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

async function writeData(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function checkAuth() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session && session.value === "authenticated";
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read services data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedData = await request.json();
    await writeData(updatedData);
    return NextResponse.json(updatedData);
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
