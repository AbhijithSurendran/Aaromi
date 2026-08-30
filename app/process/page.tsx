import fs from "fs/promises";
import path from "path";

interface ProcessStep {
  number: string;
  title: string;
  objectives: string;
  activities: string[];
  deliverables: string[];
}

async function getProcessData(): Promise<ProcessStep[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "process.json");
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

export default async function ProcessPage() {
  const steps = await getProcessData();

  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap gap-section-gap">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-start gap-8 md:gap-12">
        <h1 className="text-5xl md:text-8xl font-display font-bold text-primary max-w-4xl tracking-tighter leading-[1.05]">
          A better process creates a better outcome.
        </h1>
        <p className="text-lg md:text-xl font-sans text-on-surface-variant max-w-2xl leading-relaxed">
          We believe that intentionality and rigorous methodology are the bedrock of exceptional digital experiences. Our process is designed to uncover truth, build alignment, and execute with precision.
        </p>
      </section>

      {/* Process Timeline */}
      <section className="w-full relative flex flex-col gap-24 md:gap-32">
        {/* Connecting Line for Desktop */}
        <div className="hidden md:block absolute left-8 top-16 bottom-16 w-px bg-outline-variant/30"></div>

        {steps.map((step) => (
          <article key={step.number} className="relative flex flex-col md:flex-row gap-8 md:gap-16 items-start group">
            {/* Timeline Number Circle */}
            <div className="md:absolute md:left-8 md:top-0 md:-translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-surface-container border border-outline-variant/30 group-hover:bg-secondary-fixed group-hover:border-secondary-fixed transition-colors duration-500 z-10 shadow-[0_20px_40px_rgba(26,26,26,0.04)]">
              <span className="text-xl font-display font-bold text-primary">{step.number}</span>
            </div>

            {/* Step Card Content */}
            <div className="md:ml-32 flex-1 bg-surface-container-lowest border border-outline-variant/20 rounded-[16px] p-8 md:p-12 hover:shadow-[0_20px_40px_rgba(26,26,26,0.04)] transition-shadow duration-300">
              <h2 className="text-3xl font-display font-bold text-primary mb-6">{step.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-4">Objectives</h3>
                  <p className="text-sm font-sans text-on-surface leading-relaxed">{step.objectives}</p>
                </div>
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2">Activities</h3>
                    <ul className="text-sm font-sans text-on-surface list-disc list-inside space-y-1">
                      {step.activities.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2">Deliverables</h3>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((deliv, idx) => (
                        <span 
                          key={idx} 
                          className="bg-surface-variant text-on-surface px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                        >
                          {deliv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
