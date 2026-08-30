"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect password. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="p-4 bg-error-container text-error rounded-lg text-xs font-semibold">
          {error}
        </div>
      )}
      <div className="relative">
        <input 
          type="password" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="block w-full border border-outline-variant bg-transparent py-3 px-4 rounded-xl text-sm font-sans text-primary focus:border-primary focus:ring-1 focus:ring-primary placeholder-on-surface-variant/40"
        />
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-background font-sans font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-on-surface-variant transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <KeyRound className="w-4 h-4" />
        {loading ? "Authenticating..." : "Unlock Dashboard"}
      </button>
    </form>
  );
}
