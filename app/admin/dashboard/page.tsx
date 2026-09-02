import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { FolderGit2, Settings, Compass, Mail, ExternalLink, Calendar, User, SlidersHorizontal, Sparkles } from "lucide-react";

async function getStats() {
  let projectCount = 0;
  let submissionCount = 0;
  let slideCount = 0;
  let recentSubmissions = [];

  try {
    const projectsPath = path.join(process.cwd(), "data", "projects.json");
    const projectsContent = await fs.readFile(projectsPath, "utf8");
    projectCount = JSON.parse(projectsContent).length;
  } catch (e) {}

  try {
    const slidesPath = path.join(process.cwd(), "data", "hero_slider.json");
    const slidesContent = await fs.readFile(slidesPath, "utf8");
    slideCount = JSON.parse(slidesContent).length;
  } catch (e) {}

  try {
    const contactsPath = path.join(process.cwd(), "data", "contacts.json");
    const contactsContent = await fs.readFile(contactsPath, "utf8");
    const submissions = JSON.parse(contactsContent);
    submissionCount = submissions.length;
    
    // Get latest 3 submissions
    recentSubmissions = submissions
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  } catch (e) {}

  return { projectCount, submissionCount, slideCount, recentSubmissions };
}

export default async function AdminDashboard() {
  const { projectCount, submissionCount, slideCount, recentSubmissions } = await getStats();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-display font-bold text-primary tracking-tighter">Dashboard Overview</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2">
          Monitor site statistics and review incoming digital project requests.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div className="bg-surface border border-outline-variant/30 rounded-xl p-8 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-sans font-bold tracking-wider text-on-surface-variant mb-2">Total Projects</div>
            <div className="text-5xl font-display font-bold text-primary">{projectCount}</div>
          </div>
          <div className="p-4 bg-surface-container-high rounded-full">
            <FolderGit2 className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant/30 rounded-xl p-8 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-sans font-bold tracking-wider text-on-surface-variant mb-2">Hero Slides</div>
            <div className="text-5xl font-display font-bold text-primary">{slideCount}</div>
          </div>
          <div className="p-4 bg-surface-container-high rounded-full">
            <SlidersHorizontal className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant/30 rounded-xl p-8 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-sans font-bold tracking-wider text-on-surface-variant mb-2">Project Submissions</div>
            <div className="text-5xl font-display font-bold text-primary">{submissionCount}</div>
          </div>
          <div className="p-4 bg-surface-container-high rounded-full">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Links */}
        <div className="lg:col-span-4 bg-surface border border-outline-variant/30 rounded-xl p-8 shadow-sm h-fit">
          <h2 className="text-xl font-display font-bold text-primary mb-6">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link 
              href="/admin/hero-slider"
              className="flex items-center justify-between px-4 py-3 bg-surface-container-low hover:bg-surface-container rounded-lg font-semibold text-sm transition-colors text-primary"
            >
              <span>Edit Hero Slider</span>
              <SlidersHorizontal className="w-4 h-4 text-outline" />
            </Link>
            <Link 
              href="/admin/projects"
              className="flex items-center justify-between px-4 py-3 bg-surface-container-low hover:bg-surface-container rounded-lg font-semibold text-sm transition-colors text-primary"
            >
              <span>Manage Projects</span>
              <FolderGit2 className="w-4 h-4 text-outline" />
            </Link>
            <Link 
              href="/admin/services"
              className="flex items-center justify-between px-4 py-3 bg-surface-container-low hover:bg-surface-container rounded-lg font-semibold text-sm transition-colors text-primary"
            >
              <span>Edit Services</span>
              <Settings className="w-4 h-4 text-outline" />
            </Link>
            <Link 
              href="/admin/process"
              className="flex items-center justify-between px-4 py-3 bg-surface-container-low hover:bg-surface-container rounded-lg font-semibold text-sm transition-colors text-primary"
            >
              <span>Update Timeline</span>
              <Compass className="w-4 h-4 text-outline" />
            </Link>
            <Link 
              href="/admin/about"
              className="flex items-center justify-between px-4 py-3 bg-surface-container-low hover:bg-surface-container rounded-lg font-semibold text-sm transition-colors text-primary"
            >
              <span>Edit About Studio</span>
              <Sparkles className="w-4 h-4 text-outline" />
            </Link>
            <Link 
              href="/admin/contacts"
              className="flex items-center justify-between px-4 py-3 bg-surface-container-low hover:bg-surface-container rounded-lg font-semibold text-sm transition-colors text-primary"
            >
              <span>View Submissions</span>
              <Mail className="w-4 h-4 text-outline" />
            </Link>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="lg:col-span-8 bg-surface border border-outline-variant/30 rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold text-primary">Recent Inquiries</h2>
            <Link 
              href="/admin/contacts"
              className="font-sans font-bold text-xs uppercase tracking-wider text-secondary-fixed-dim hover:text-primary flex items-center gap-1.5 transition-colors"
            >
              View All <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-6">
            {recentSubmissions.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant font-sans text-sm">
                No contact requests submitted yet.
              </div>
            ) : (
              recentSubmissions.map((sub: any) => (
                <div 
                  key={sub.id}
                  className="p-5 bg-surface-container-low/50 rounded-xl border border-outline-variant/20 hover:border-outline-variant/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-outline" />
                      <span className="font-sans font-bold text-sm text-primary">{sub.name}</span>
                      {sub.company && sub.company !== "N/A" && (
                        <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                          {sub.company}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-outline font-sans">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(sub.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm font-sans text-on-surface-variant line-clamp-2 leading-relaxed">
                    {sub.details}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
