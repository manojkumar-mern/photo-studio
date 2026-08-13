"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { X } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers,
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    
    // Clear token
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    
    router.push("/admin/login");
  };

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/bookings`, {
        method: "GET",
        headers,
        credentials: "include"
      });

      const result = await response.json();

      if (response.status === 401) {
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
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents opening the details modal
    if (!window.confirm("Are you sure you want to delete this booking enquiry?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/bookings/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include"
      });

      const result = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete booking");
      }

      // Close details modal if the deleted one was open
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking(null);
      }

      // Refresh list after deletion
      fetchBookings();
    } catch (err) {
      setError(err.message || "Error deleting booking.");
    }
  };

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
                Pixelbees Photography
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-foreground">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="text-xs font-sans tracking-widest text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 px-4 py-2 rounded-md transition-colors"
              >
                Back to Site
              </button>
              <button
                onClick={fetchBookings}
                disabled={isLoading}
                className="text-xs font-sans tracking-widest text-foreground border border-border hover:border-primary/50 px-4 py-2 rounded-md transition-colors disabled:opacity-40"
              >
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="text-xs font-sans tracking-widest text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 px-4 py-2 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
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
                    <th className="p-4 text-[10px] font-sans tracking-widest text-muted-foreground uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      onClick={() => setSelectedBooking(booking)}
                      className="hover:bg-background/20 transition-colors cursor-pointer"
                      title="Click to view details"
                    >
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
                      <td className="p-4 text-xs text-muted-foreground max-w-xs truncate leading-relaxed">
                        {booking.message || <span className="italic text-muted-foreground/30">No notes provided</span>}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {formatDateTime(booking.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => handleDelete(e, booking._id)}
                          className="text-[10px] font-sans tracking-widest text-red-400 hover:text-red-300 uppercase transition-colors duration-200 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Luxury Details Modal Overlay */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-card border border-border rounded-xl p-8 max-w-xl w-full relative card-glow shimmer-top text-left space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-sans tracking-[0.2em] text-primary uppercase block mb-1">
                  Enquiry Details
                </span>
                <h3 className="text-2xl font-serif text-foreground">
                  {selectedBooking.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-sans tracking-wider text-muted-foreground uppercase block">
                  Email Address
                </span>
                <a
                  href={`mailto:${selectedBooking.email}`}
                  className="text-foreground hover:text-primary transition-colors block"
                >
                  {selectedBooking.email}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans tracking-wider text-muted-foreground uppercase block">
                  Phone Number
                </span>
                <a
                  href={`tel:${selectedBooking.phone}`}
                  className="text-foreground hover:text-primary transition-colors block"
                >
                  {selectedBooking.phone}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans tracking-wider text-muted-foreground uppercase block">
                  Photography Service
                </span>
                <span className="text-primary font-medium block">
                  {selectedBooking.service}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans tracking-wider text-muted-foreground uppercase block">
                  Preferred Date
                </span>
                <span className="text-foreground block">
                  {formatDate(selectedBooking.date)}
                </span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-[10px] font-sans tracking-wider text-muted-foreground uppercase block">
                  Submitted On
                </span>
                <span className="text-muted-foreground text-xs block">
                  {formatDateTime(selectedBooking.createdAt)}
                </span>
              </div>
            </div>

            {/* Modal Concept Notes */}
            <div className="border-t border-border pt-4 space-y-2">
              <span className="text-[10px] font-sans tracking-wider text-muted-foreground uppercase block">
                Visual Concept / Creative Notes
              </span>
              <div className="bg-background/40 border border-border/50 rounded-lg p-4 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {selectedBooking.message || (
                  <span className="italic text-muted-foreground/45">No notes provided for this session concept.</span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={(e) => handleDelete(e, selectedBooking._id)}
                className="text-xs font-sans tracking-widest text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-4 py-2 rounded-md transition-colors uppercase"
              >
                Delete Enquiry
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-xs font-sans tracking-widest text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 px-4 py-2 rounded-md transition-colors uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
