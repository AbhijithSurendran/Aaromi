import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Check, Code, Layout, Paintbrush, Store } from "lucide-react";

interface Capability {
  id: string;
  title: string;
  number: string;
  description: string;
  approach: string;
  deliverables: string[];
  icon: string;
}

interface ChecklistItem {
  feature: string;
  aaromi: string;
  templates: string;
}

interface ServicesData {
  capabilities: Capability[];
  standardChecklist: ChecklistItem[];
}

async function getServicesData(): Promise<ServicesData> {
  try {
    const filePath = path.join(process.cwd(), "data", "services.json");
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return { capabilities: [], standardChecklist: [] };
  }
}

export default async function ServicesPage() {
  const { capabilities, standardChecklist } = await getServicesData();

  // Helper to map icon name to component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "web":
        return <Layout className="w-8 h-8 text-primary" />;
      case "brush":
        return <Paintbrush className="w-8 h-8 text-primary" />;
      case "code":
        return <Code className="w-8 h-8 text-secondary-fixed" />;
      case "storefront":
        return <Store className="w-8 h-8 text-primary" />;
      default:
        return <Layout className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="px-margin-mobile md:px-margin-desktop pt-24 md:pt-40 pb-section-gap max-w-container-max mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-tertiary-fixed/20 to-transparent -z-10 blur-3xl opacity-50 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-4xl">
          <h1 className="font-display text-5xl md:text-8xl text-primary mb-8 leading-tight font-bold">
            We design digital experiences from strategy to screen.
          </h1>
          <p className="font-sans text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12 leading-relaxed">
            Aaromi Studio combines sophisticated editorial aesthetics with technical precision to build platforms that elevate your brand and drive results.
          </p>
          <a 
            href="#capabilities" 
            className="bg-secondary-fixed text-primary px-8 py-4 rounded-xl font-sans font-semibold text-xs tracking-widest uppercase hover:bg-secondary-container transition-all inline-flex items-center gap-2 shadow-[0_20px_40px_rgba(26,26,26,0.04)]"
          >
            Explore Services 
            <span className="material-symbols-outlined text-sm font-light">arrow_downward</span>
          </a>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section id="capabilities" className="px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto bg-surface-container-low rounded-3xl mx-4 md:mx-10 relative">
        <div className="mb-20">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">Core Capabilities</h2>
          <div className="w-24 h-1 bg-secondary-fixed"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[auto]">
          {capabilities.map((cap) => {
            // Web & UI/UX Design -> span 8
            // Brand Design -> span 4
            // Web Dev -> span 6 with primary dark bg
            // E-commerce -> span 6
            const isWebDev = cap.id === "web-dev";
            const isWebUI = cap.id === "web-ui-ux";
            
            const cardColSpan = isWebUI ? "md:col-span-8" : cap.id === "brand-design" ? "md:col-span-4" : "md:col-span-6";
            
            const cardBg = isWebDev 
              ? "bg-primary text-on-primary" 
              : "bg-surface text-on-background";

            const borderClass = isWebDev
              ? "border-none"
              : "border border-outline-variant/30";

            return (
              <div 
                key={cap.id} 
                className={`${cardColSpan} ${cardBg} ${borderClass} rounded-2xl p-8 md:p-12 hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <span className={`p-4 rounded-full ${isWebDev ? "bg-surface/10" : "bg-surface-container"}`}>
                      {getIcon(cap.icon)}
                    </span>
                    <span className={`font-sans text-sm font-bold tracking-widest ${isWebDev ? "text-outline" : "text-on-surface-variant"}`}>
                      {cap.number}
                    </span>
                  </div>
                  <h3 className={`font-display text-3xl font-bold mb-6 ${isWebDev ? "text-on-primary" : "text-primary"}`}>
                    {cap.title}
                  </h3>
                  <p className={`font-sans text-base leading-relaxed ${isWebDev ? "text-outline-variant" : "text-on-surface-variant"} mb-8 max-w-xl`}>
                    {cap.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-outline-variant/20">
                  <div>
                    <h4 className="font-bold mb-2 text-sm uppercase tracking-wider">Approach</h4>
                    <p className={`text-sm ${isWebDev ? "text-outline-variant" : "text-on-surface-variant"}`}>
                      {cap.approach}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-sm uppercase tracking-wider">Deliverables</h4>
                    <ul className={`text-sm ${isWebDev ? "text-outline-variant" : "text-on-surface-variant"} space-y-1`}>
                      {cap.deliverables.map((deliv, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          {isWebDev ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>
                          ) : (
                            <Check className="w-3.5 h-3.5 text-secondary-fixed-dim shrink-0" />
                          )}
                          {deliv}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Checklist */}
      <section className="px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-primary mb-6">The Aaromi Standard</h2>
          <p className="font-sans text-lg text-on-surface-variant">What you get when you partner with us for a full-cycle project.</p>
        </div>

        <div className="max-w-5xl mx-auto overflow-x-auto border border-outline-variant/30 rounded-2xl bg-surface-bright shadow-[0px_20px_40px_rgba(26,26,26,0.04)]">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container/50">
                <th className="p-6 font-sans font-bold text-xs uppercase tracking-widest text-primary">Feature</th>
                <th className="p-6 font-sans font-bold text-xs uppercase tracking-widest text-secondary-fixed-dim">Aaromi Studio</th>
                <th className="p-6 font-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant">Generic Templates</th>
              </tr>
            </thead>
            <tbody>
              {standardChecklist.map((item, idx) => (
                <tr 
                  key={idx} 
                  className={`border-b border-outline-variant/20 hover:bg-surface-container-low/20 transition-colors ${
                    idx === standardChecklist.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="p-6 font-sans font-bold text-sm text-primary">{item.feature}</td>
                  <td className="p-6 font-sans text-sm text-on-surface font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
                    {item.aaromi}
                  </td>
                  <td className="p-6 font-sans text-sm text-on-surface-variant">{item.templates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
