import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderGit2, 
  Settings, 
  Compass, 
  Mail, 
  LogOut,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import AdminLogoutButton from "@/components/AdminLogoutButton";

const SESSION_COOKIE = "aaromi_admin_session";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const isAuthenticated = session && session.value === "authenticated";

  return (
    <div className="min-h-screen bg-surface-container-lowest text-primary flex flex-col font-sans">
      {/* Admin Top Banner */}
      <header className="bg-primary text-background px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-secondary-fixed" />
          <span className="font-display font-bold tracking-widest text-sm uppercase">
            Aaromi Studio · CMS Panel
          </span>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-xs uppercase font-semibold text-outline-variant hover:text-background transition-colors"
            >
              View Live Site ↗
            </Link>
            <AdminLogoutButton />
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Admin Sidebar Navigation */}
        {isAuthenticated && (
          <aside className="w-64 bg-surface border-r border-outline-variant/30 p-6 flex flex-col justify-between hidden md:flex">
            <div className="space-y-8">
              <div className="font-sans font-bold text-xs uppercase tracking-widest text-outline">
                Navigation
              </div>
              <nav className="flex flex-col gap-2">
                <Link 
                  href="/admin/dashboard" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 text-outline" />
                  Dashboard
                </Link>
                <Link 
                  href="/admin/hero-slider" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-sm font-semibold"
                >
                  <SlidersHorizontal className="w-4 h-4 text-outline" />
                  Hero Slider
                </Link>
                <Link 
                  href="/admin/projects" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-sm font-semibold"
                >
                  <FolderGit2 className="w-4 h-4 text-outline" />
                  Projects
                </Link>
                <Link 
                  href="/admin/services" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-sm font-semibold"
                >
                  <Settings className="w-4 h-4 text-outline" />
                  Services
                </Link>
                <Link 
                  href="/admin/process" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-sm font-semibold"
                >
                  <Compass className="w-4 h-4 text-outline" />
                  Process
                </Link>
                <Link 
                  href="/admin/about" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-sm font-semibold"
                >
                  <Sparkles className="w-4 h-4 text-outline" />
                  About Studio
                </Link>
                <Link 
                  href="/admin/contacts" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-sm font-semibold"
                >
                  <Mail className="w-4 h-4 text-outline" />
                  Submissions
                </Link>
              </nav>
            </div>
            <div className="text-center font-mono text-[10px] text-outline">
              v1.0.0 (Local JSON Mode)
            </div>
          </aside>
        )}

        {/* Admin Content Area */}
        <main className="flex-1 p-6 md:p-12 bg-surface-container-low/50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
