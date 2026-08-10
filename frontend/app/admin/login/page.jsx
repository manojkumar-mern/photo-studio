"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If token exists, redirect straight to admin page
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid credentials");
      }

      localStorage.setItem("admin_token", result.token);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-28 md:pt-32 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full px-4 py-12">
          <div className="border border-border bg-card rounded-xl p-8 card-glow shimmer-top">
            <div className="text-center mb-8">
              <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-2">
                Restricted Access
              </span>
              <h1 className="text-3xl font-serif text-foreground mb-2">
                Studio Admin
              </h1>
              <p className="text-xs font-sans text-muted-foreground">
                Please sign in to manage bookings.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div role="alert" className="text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded p-3 text-center">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="username" className="text-xs font-sans tracking-widest text-muted-foreground uppercase">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full bg-background border border-border p-3.5 rounded-md text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-sans tracking-widest text-muted-foreground uppercase">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-background border border-border p-3.5 rounded-md text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-xs font-sans tracking-[0.2em] uppercase text-primary hover:text-foreground disabled:opacity-40 min-h-[48px] rounded-md border border-primary/20 hover:border-primary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-primary/5 cursor-pointer"
              >
                {isLoading ? "Signing In…" : "Authenticate"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
