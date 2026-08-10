"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/bookings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error(result.message || "Failed to load bookings");
        }

        setBookings(result.data || []);
      } catch (err) {
        setError(err.message || "Error loading bookings list.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  // Format date utility
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    } catch {
      return dateStr;
    }
  };

  // Format created at utility
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-28 md:pt-32 min-h-[85vh] pb-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 mb-8 gap-4">
            <div>
              <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-1">
                Studio Management
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-foreground">
                Client Enquiries
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-sans tracking-widest text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 px-4 py-2 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/20 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Main Content Area */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="text-xs font-sans tracking-widest text-muted-foreground animate-pulse">
                Retrieving reservation logs…
              </span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="border border-border bg-card rounded-xl p-12 text-center max-w-md mx-auto">
              <h3 className="font-serif text-xl text-foreground mb-2">No bookings found</h3>
              <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                When prospective clients fill out the enquiry form, their details will display here.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-xl border border-border bg-card scrollbar-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="p-4 text-[10px] font-sans tracking-widest text-muted-foreground uppercase">Client Details</th>
                    <th className="p-4 text-[10px] font-sans tracking-widest text-muted-foreground uppercase">Service</th>
                    <th className="p-4 text-[10px] font-sans tracking-widest text-muted-foreground uppercase">Preferred Date</th>
                    <th className="p-4 text-[10px] font-sans tracking-widest text-muted-foreground uppercase">Concept / Notes</th>
                    <th className="p-4 text-[10px] font-sans tracking-widest text-muted-foreground uppercase">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-background/20 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-foreground text-sm">{booking.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{booking.email}</div>
                        <div className="text-[11px] text-muted-foreground/80 mt-0.5">{booking.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 text-[11px] font-sans tracking-wider border border-primary/20 bg-primary/5 text-primary rounded-full">
                          {booking.service}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {formatDate(booking.date)}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground max-w-xs break-words whitespace-pre-line leading-relaxed">
                        {booking.message || <span className="italic text-muted-foreground/30">No notes provided</span>}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {formatDateTime(booking.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
