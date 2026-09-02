import fs from "fs/promises";
import path from "path";
import Image from "next/image";

interface PhilosophyItem {
  title: string;
  description: string;
}

interface ValueItem {
  name: string;
  featured: boolean;
}

interface AboutData {
  intro: string;
  studioDescription: string;
  philosophy: PhilosophyItem[];
  values: ValueItem[];
  imageUrl: string;
}

async function getAboutData(): Promise<AboutData> {
  try {
    const filePath = path.join(process.cwd(), "data", "about.json");
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return { intro: "", studioDescription: "", philosophy: [], values: [], imageUrl: "" };
  }
}

export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-section-gap">
      {/* Hero Section */}
      <section className="min-h-[50vh] flex flex-col justify-center">
        <h1 className="text-5xl md:text-8xl font-display font-bold text-primary max-w-5xl leading-[1.05] tracking-tighter">
          {data.intro}
        </h1>
      </section>

      {/* Story Section */}
      <section className="mt-section-gap grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-4">
          <h2 className="text-3xl font-display font-bold text-primary">The Studio</h2>
        </div>
        <div className="md:col-span-8 flex flex-col gap-8">
          <p className="text-xl md:text-2xl font-sans text-on-surface-variant max-w-3xl leading-relaxed">
            {data.studioDescription}
          </p>
          <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden border border-outline-variant/30 relative">
            <Image
              fill
              sizes="(max-w-768px) 100vw, 66vw"
              className="object-cover"
              alt="Sophisticated, minimalist studio workspace"
              src={data.imageUrl}
            />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mt-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-4">
            <h2 className="text-3xl font-display font-bold text-primary">Philosophy</h2>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.philosophy.map((item, idx) => (
              <div
                key={idx}
                className="p-8 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_20px_40px_rgba(26,26,26,0.04)]"
              >
                <h3 className="text-lg font-sans font-bold text-primary mb-4">
                  {item.title}
                </h3>
                <p className="text-sm font-sans text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mt-section-gap">
        <div className="bg-primary text-surface-bright rounded-2xl p-margin-mobile md:p-margin-desktop overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-4">
              <h2 className="text-3xl font-display font-bold text-surface-bright">Our Core Values</h2>
            </div>
            <div className="md:col-span-8 flex flex-wrap gap-4">
              {data.values.map((val, idx) => (
                <span
                  key={idx}
                  className={`px-6 py-3 rounded-full border text-xs font-semibold uppercase tracking-widest ${val.featured
                      ? "text-primary bg-secondary-fixed border-transparent"
                      : "border-surface-bright/20 text-surface-bright bg-surface-bright/5"
                    }`}
                >
                  {val.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
