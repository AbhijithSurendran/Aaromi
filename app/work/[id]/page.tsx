import fs from "fs/promises";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface Metric {
  value: string;
  label: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  industry?: string;
  services?: string;
  challenge?: string;
  strategy?: string[];
  galleryImages?: string[];
  metrics?: Metric[];
}

async function getProjectById(id: string): Promise<{ project: Project | null; nextProject: Project | null }> {
  try {
    const filePath = path.join(process.cwd(), "data", "projects.json");
    const content = await fs.readFile(filePath, "utf8");
    const projects: Project[] = JSON.parse(content);
    
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return { project: null, nextProject: null };

    const project = projects[index];
    const nextProject = projects[(index + 1) % projects.length]; // Loop back to start

    return { project, nextProject };
  } catch (err) {
    return { project: null, nextProject: null };
  }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { project, nextProject } = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const hasCaseStudy = !!project.challenge;

  return (
    <main className="w-full">
      {/* 1. HERO HEADER */}
      <section className="w-full pt-24 pb-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <span className="font-sans font-semibold tracking-widest text-xs text-on-surface-variant uppercase mb-4 block">
            Case Study
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-primary mb-12 tracking-tighter">
            {project.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 font-sans text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
            <div>
              <span className="block text-outline mb-2">Client</span>
              <span className="text-primary font-bold">{project.title}</span>
            </div>
            <div>
              <span className="block text-outline mb-2">Industry</span>
              <span className="text-primary font-bold">{project.industry || "Digital Agency"}</span>
            </div>
            <div>
              <span className="block text-outline mb-2">Services</span>
              <span className="text-primary font-bold">{project.services || project.category}</span>
            </div>
            <div>
              <span className="block text-outline mb-2">Year</span>
              <span className="text-primary font-bold">{project.year}</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Image */}
        <div className="w-full h-[60vh] md:h-[80vh] relative mt-12 bg-surface-container-low border-y border-outline-variant/20">
          <Image 
            fill
            priority
            sizes="100vw"
            className="object-cover"
            alt={`${project.title} Hero Banner`}
            src={project.galleryImages?.[0] || project.imageUrl}
          />
        </div>
      </section>

      {hasCaseStudy ? (
        <>
          {/* 2. THE CHALLENGE */}
          <section className="max-w-[1000px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary leading-tight tracking-tighter">
              {project.challenge}
            </h2>
          </section>

          {/* 3. STRATEGY & INSIGHT */}
          {project.strategy && project.strategy.length > 0 && (
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap border-t border-outline-variant/20">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                <div className="md:col-span-4">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-primary">Strategy &amp; Insight</h3>
                </div>
                <div className="md:col-span-8 space-y-6">
                  {project.strategy.map((paragraph, index) => (
                    <p key={index} className="text-lg md:text-xl font-sans text-on-surface-variant leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 4. DESIGN GALLERY */}
          {project.galleryImages && project.galleryImages.length > 1 && (
            <section className="w-full bg-surface-container py-section-gap">
              <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-24">
                {/* Secondary Large Banner */}
                {project.galleryImages[1] && (
                  <div className="w-full rounded-lg overflow-hidden border border-outline-variant/30 bg-surface relative aspect-[16/10]">
                    <Image 
                      fill
                      sizes="(max-w-768px) 100vw, 90vw"
                      className="object-cover"
                      alt={`${project.title} Desktop Mockup`}
                      src={project.galleryImages[1]}
                    />
                  </div>
                )}

                {/* Asymmetric Mobile Mockup Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {project.galleryImages[2] && (
                    <div className="w-full rounded-lg overflow-hidden border border-outline-variant/30 bg-surface shadow-[0px_20px_40px_rgba(26,26,26,0.04)] hover:-translate-y-2 transition-transform duration-500 relative aspect-[3/4]">
                      <Image 
                        fill
                        sizes="(max-w-768px) 100vw, 45vw"
                        className="object-cover"
                        alt={`${project.title} Mobile Mockup 1`}
                        src={project.galleryImages[2]}
                      />
                    </div>
                  )}
                  {project.galleryImages[3] && (
                    <div className="w-full rounded-lg overflow-hidden border border-outline-variant/30 bg-surface shadow-[0px_20px_40px_rgba(26,26,26,0.04)] hover:-translate-y-2 transition-transform duration-500 mt-12 md:mt-24 relative aspect-[3/4]">
                      <Image 
                        fill
                        sizes="(max-w-768px) 100vw, 45vw"
                        className="object-cover"
                        alt={`${project.title} Mobile Mockup 2`}
                        src={project.galleryImages[3]}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 5. METRICS / IMPACT OUTCOME */}
          {project.metrics && project.metrics.length > 0 && (
            <section className="w-full bg-surface-container-highest py-section-gap text-on-surface">
              <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-16 text-primary">The Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {project.metrics.map((metric, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-5xl md:text-7xl font-display font-bold text-primary mb-4">
                        {metric.value}
                      </span>
                      <span className="font-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        /* Fallback section if CMS Case Study details are not filled */
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap border-t border-outline-variant/20 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-4">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-primary">Case Study Overview</h3>
            </div>
            <div className="md:col-span-8 space-y-6">
              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
                {project.description}
              </p>
              <div className="p-8 bg-surface-container rounded-xl border border-outline-variant/30 mt-8">
                <h4 className="font-bold text-primary mb-2 text-sm uppercase tracking-wider">CMS Mode Active</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  You can edit the full case study for this project (including strategy paragraphs, impact stats, and mockup image gallery paths) by accessing the CMS dashboard.
                </p>
                <Link 
                  href={`/admin/projects`}
                  className="mt-6 inline-flex bg-primary text-background px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-on-surface-variant transition-colors"
                >
                  Edit Project in CMS Panel
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. NEXT PROJECT FOOTER */}
      {nextProject && (
        <section className="w-full bg-surface py-section-gap border-b border-outline-variant/20">
          <Link 
            href={`/work/${nextProject.id}`}
            className="block max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop group"
          >
            <div className="flex justify-between items-end border-b border-outline-variant/30 pb-8 hover:border-primary transition-colors duration-500">
              <div>
                <span className="font-sans font-bold text-xs uppercase text-on-surface-variant mb-4 block tracking-widest">
                  Next Project
                </span>
                <h2 className="text-4xl md:text-7xl font-display font-bold text-primary group-hover:translate-x-4 transition-transform duration-500">
                  {nextProject.title}
                </h2>
              </div>
              <div className="bg-secondary-fixed text-primary p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </Link>
        </section>
      )}
    </main>
  );
}
