import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "contacts.json");
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

// Get all submissions (Admin only)
export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await readData();
    // Sort from newest to oldest
    data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read contact submissions" }, { status: 500 });
  }
}

// Submit a new contact request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, project_types, budget, timeline, details } = body;

    if (!name || !email || !details) {
      return NextResponse.json({ error: "Name, email, and details are required" }, { status: 400 });
    }

    const data = await readData();
    const submission = {
      id: "sub-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      name,
      email,
      company: company || "N/A",
      project_types: project_types || [],
      budget: budget || "Not specified",
      timeline: timeline || "Not specified",
      details,
      date: new Date().toISOString()
    };

    data.push(submission);
    await writeData(data);

    return NextResponse.json({ success: true, submission });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
