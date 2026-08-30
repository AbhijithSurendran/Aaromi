import fs from "fs/promises";
import path from "path";
import WorkList from "@/components/WorkList";

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

async function getProjects(): Promise<Project[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "projects.json");
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main className="w-full px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
      {/* Hero Section */}
      <header className="mb-section-gap">
        <h1 className="text-5xl md:text-8xl font-display font-bold text-primary mb-6">Selected work</h1>
        <p className="text-lg md:text-xl font-sans text-on-surface-variant max-w-2xl leading-relaxed">
          A collection of brands, products, and digital experiences we've helped bring to life.
        </p>
      </header>

      <WorkList projects={projects} />
    </main>
  );
}
