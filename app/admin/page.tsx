import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";

const SESSION_COOKIE = "aaromi_admin_session";

export default function AdminLoginPage() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const isAuthenticated = session && session.value === "authenticated";

  if (isAuthenticated) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="max-w-md mx-auto my-24 bg-surface rounded-xl border border-outline-variant/30 p-8 md:p-12 shadow-md">
      <h1 className="text-3xl font-display font-bold text-primary mb-2 text-center tracking-tighter">
        CMS Access
      </h1>
      <p className="font-sans text-sm text-on-surface-variant mb-8 text-center leading-relaxed">
        Enter the administrator password to manage site content.
      </p>
      <AdminLoginForm />
    </div>
  );
}
