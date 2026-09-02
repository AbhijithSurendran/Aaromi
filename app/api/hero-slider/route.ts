import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "hero_slider.json");
const SESSION_COOKIE = "aaromi_admin_session";

async function readData() {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
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
    return NextResponse.json({ error: "Failed to read hero slider data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedData = await request.json();
    if (!Array.isArray(updatedData)) {
      return NextResponse.json({ error: "Invalid data format: Expected an array of slides" }, { status: 400 });
    }
    await writeData(updatedData);
    return NextResponse.json(updatedData);
  } catch (err) {
    return NextResponse.json({ error: "Failed to save hero slider data" }, { status: 400 });
  }
}
