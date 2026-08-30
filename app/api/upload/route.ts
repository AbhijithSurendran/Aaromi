import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const SESSION_COOKIE = "aaromi_admin_session";

function checkAuth() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session && session.value === "authenticated";
}

export async function POST(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Clean name to prevent path traversal
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, uniqueName);

    await fs.writeFile(filePath, new Uint8Array(buffer));

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${uniqueName}` 
    });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed: " + (err as Error).message }, { status: 500 });
  }
}
