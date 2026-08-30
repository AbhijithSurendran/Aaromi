import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "projects.json");
    const content = await fs.readFile(filePath, "utf8");
    const projects: Project[] = JSON.parse(content);
    return projects.filter(p => p.featured).slice(0, 4); // Display up to 4 featured projects
  } catch (err) {
    return [];
  }
}

export default async function HomePage() {
  const projects = await getFeaturedProjects();

  return (
    <main>
      {/* 1. HERO */}
      <section className="relative pt-24 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-[90vh] flex flex-col justify-center hero-gradient">
        <div className="max-w-4xl mx-auto text-center z-10">
          <span className="font-sans font-semibold tracking-widest text-xs text-on-surface-variant uppercase mb-6 block">
            INDEPENDENT DIGITAL DESIGN STUDIO
          </span>
          <h1 className="font-display text-5xl md:text-8xl text-primary mb-8 tracking-tighter leading-[0.95] font-bold">
            We turn ideas into digital experiences people remember.
          </h1>
          <p className="font-sans text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed">
            Aaromi creates strategic websites, intuitive digital experiences, and distinctive visual identities for ambitious businesses.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/contact" 
              className="w-full sm:w-auto bg-secondary-fixed text-primary font-sans font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-secondary-fixed-dim transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start a Project 
              <span className="material-symbols-outlined text-sm font-light">arrow_outward</span>
            </Link>
            <Link 
              href="/work" 
              className="w-full sm:w-auto border border-primary text-primary font-sans font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-primary hover:text-background transition-all duration-300 flex items-center justify-center gap-2"
            >
              View Our Work 
              <span className="material-symbols-outlined text-sm font-light">south</span>
            </Link>
          </div>
        </div>

        {/* Hero mockup sliding carousel */}
        <HeroCarousel />
      </section>

      {/* 2. TRUST / CAPABILITY intro */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-t border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-4">
            <span className="font-sans font-semibold tracking-widest text-xs text-on-surface-variant uppercase flex items-center gap-2">
              <span className="w-8 h-[1px] bg-outline-variant inline-block"></span>
              WHY AAROMI
            </span>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl text-primary leading-tight font-bold">
              Good design looks beautiful.<br />Great design makes a business better.
            </h2>
          </div>
        </div>
      </section>

      {/* 3. SELECTED WORK */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="work">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Selected Work</h2>
          <Link 
            href="/work" 
            className="font-sans font-semibold tracking-wider text-xs uppercase text-primary border-b border-primary pb-1 hover:text-on-surface-variant hover:border-on-surface-variant transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-24">
          {projects.map((project, idx) => (
            <Link 
              key={project.id}
              href="/work"
              className={`group cursor-pointer ${idx % 2 === 1 ? "md:mt-24" : ""}`}
            >
              <div className="rounded-xl overflow-hidden bg-surface-container mb-6 relative border border-outline-variant/30 aspect-[4/3] w-full">
                <Image 
                  fill
                  sizes="(max-w-768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                  alt={project.title}
                  src={project.imageUrl}
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary mb-2">
                    {project.title}
                  </h3>
                  <p className="font-sans text-sm text-on-surface-variant">
                    {project.category}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform font-light">
                  arrow_outward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
