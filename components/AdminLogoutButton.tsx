"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 bg-surface/10 hover:bg-surface/20 text-background px-4 py-2 rounded-lg text-xs uppercase font-semibold transition-colors"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign Out
    </button>
  );
}
