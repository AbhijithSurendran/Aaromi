import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "projects.json");
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

// Get all projects
export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

// Create new project
export async function POST(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await request.json();
    if (!project.title || !project.category) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }

    const data = await readData();
    const newProject = {
      id: project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now(),
      title: project.title,
      category: project.category,
      year: project.year || new Date().getFullYear().toString(),
      description: project.description || "",
      imageUrl: project.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCldkP3CRuP7gktMRYwY8DWkC6T9cZTzyNn7_uqRF1Fe9pyxP_gr7o3tXi1iDxYEmLDDOedL8mwrK_PI9hHonaGyLIhWGou85S9FS_ChXn_kqt1ldCgoqYuVHVMF-hhQYYKukyX5beJGAj09ObaJzwPCaUW_UqjldLf6pH0UFluTDZvE14hfjVfxUZO46oV0J0odOorCzYC-iGqZ0YhBjLi7fwf4hjr4LbmkZU9rJo4rRuQPjaNjVM",
      featured: project.featured === undefined ? true : project.featured
    };

    data.push(newProject);
    await writeData(data);
    return NextResponse.json(newProject, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// Update existing project
export async function PUT(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedProject = await request.json();
    if (!updatedProject.id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const data = await readData();
    const index = data.findIndex((p: any) => p.id === updatedProject.id);

    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    data[index] = {
      ...data[index],
      ...updatedProject
    };

    await writeData(data);
    return NextResponse.json(data[index]);
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// Delete project
export async function DELETE(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const data = await readData();
    const filtered = data.filter((p: any) => p.id !== id);

    if (data.length === filtered.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await writeData(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
