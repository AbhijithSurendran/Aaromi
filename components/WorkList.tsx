"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

export default function WorkList({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Web Design", "UI/UX", "E-commerce", "Branding", "Development"];

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <>
      {/* Categories Filter */}
      <div className="flex flex-wrap gap-4 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-sans text-xs font-semibold uppercase tracking-widest border transition-colors ${
              activeCategory === cat
                ? "bg-secondary-fixed text-primary border-transparent"
                : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {filteredProjects.map((project, idx) => {
          // Asymmetric spacing matching the design layout:
          // Even indices are span-8, odd indices span-4 with top margin shift and taller aspect ratio
          const isEven = idx % 2 === 0;
          const colSpan = isEven ? "md:col-span-8" : "md:col-span-4";
          const mtClass = !isEven ? "md:mt-24" : "";
          const aspectClass = isEven ? "aspect-[4/3]" : "aspect-[3/4]";

          return (
            <Link 
              key={project.id}
              href={`/work/${project.id}`} 
              className={`group flex flex-col gap-4 ${colSpan} ${mtClass} cursor-pointer`}
            >
              <div className={`relative w-full ${aspectClass} rounded-[16px] overflow-hidden bg-surface-container-low border border-outline-variant/30`}>
                <Image
                  fill
                  sizes="(max-w-768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  alt={project.title}
                  src={project.imageUrl}
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-display font-bold text-primary group-hover:text-secondary-fixed-dim transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm font-sans text-on-surface-variant mt-1">
                    {project.category} · {project.year}
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
