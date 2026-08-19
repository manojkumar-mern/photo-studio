"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CursorGrid from "@/components/ui/CursorGrid";

const PACKAGES = ["Standard", "Premium", "Elite", "Not Sure"];

const inputCls =
  "w-full bg-background border border-border p-3.5 rounded-md text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-colors";

export default function WeddingLeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    weddingDate: "",
    weddingLocation: "",
    guestCount: "",
    packageInterest: "",
    requirements: "",
  });

  const [attribution, setAttribution] = useState({
    source: "",
    sourceMedium: "",
    sourceCampaign: "",
    sourceContent: "",
    sourceTerm: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Capture UTM and source params from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setAttribution({
        source: params.get("utm_source") || params.get("source") || "",
        sourceMedium: params.get("utm_medium") || "",
        sourceCampaign: params.get("utm_campaign") || "",
        sourceContent: params.get("utm_content") || "",
        sourceTerm: params.get("utm_term") || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Your name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Please enter a valid name (at least 2 characters).";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.weddingDate) {
      newErrors.weddingDate = "Wedding date is required.";
    }

    if (!formData.weddingLocation.trim()) {
      newErrors.weddingLocation = "Wedding location is required.";
    }

    if (!formData.packageInterest) {
      newErrors.packageInterest = "Please select what you are interested in.";
    }

    if (formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (formData.guestCount !== "") {
      const count = Number(formData.guestCount);
      if (isNaN(count) || count < 0) {
        newErrors.guestCount = "Approximate guest count must be a positive number.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const submissionData = {
        ...formData,
        ...attribution,
      };

      const response = await fetch(`${apiUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit enquiry");
      }

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Wedding lead submission error:", err);
      setErrors((prev) => ({
        ...prev,
        submit: err.message || "Something went wrong while sending your enquiry. Please try again.",
      }));
      setIsSubmitting(false);
    }
  };

  // Today's date string for min date attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="relative bg-background py-16 md:py-24 px-4 sm:px-6 md:px-12 z-20 overflow-hidden">
      <CursorGrid
        cellSize={50}
        color="#C5A880"
        radius={140}
        holdTime={200}
        fadeDuration={600}
        lineWidth={1.0}
        maxOpacity={0.4}
        gridOpacity={0.025}
      />

      <div className="max-w-2xl mx-auto border border-border bg-card rounded-xl p-6 sm:p-8 md:p-12 relative z-10">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-2 font-semibold">
                  Wedding Consultation
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">
                  Plan Your Wedding Story
                </h2>
                <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                  Share details about your special day. Our team will review your requirements to curate a cinematic and personalized photography experience.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {errors.submit && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md font-sans">
                    {errors.submit}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[11px] font-sans tracking-wider uppercase text-muted-foreground block">
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Test User"
                      className={inputCls}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.name && (
                      <p className="text-[10px] font-sans text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-[11px] font-sans tracking-wider uppercase text-muted-foreground block">
                      Phone Number <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className={inputCls}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.phone && (
                      <p className="text-[10px] font-sans text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Wedding Date */}
                  <div className="space-y-2">
                    <label htmlFor="weddingDate" className="text-[11px] font-sans tracking-wider uppercase text-muted-foreground block">
                      Wedding Date <span className="text-primary">*</span>
                    </label>
                    <input
                      type="date"
                      id="weddingDate"
                      name="weddingDate"
                      min={today}
                      value={formData.weddingDate}
                      onChange={handleInputChange}
                      className={inputCls}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.weddingDate && (
                      <p className="text-[10px] font-sans text-destructive mt-1">{errors.weddingDate}</p>
                    )}
                  </div>

                  {/* Wedding Location */}
                  <div className="space-y-2">
                    <label htmlFor="weddingLocation" className="text-[11px] font-sans tracking-wider uppercase text-muted-foreground block">
                      Wedding Location <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="weddingLocation"
                      name="weddingLocation"
                      value={formData.weddingLocation}
                      onChange={handleInputChange}
                      placeholder="e.g. Chennai"
                      className={inputCls}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.weddingLocation && (
                      <p className="text-[10px] font-sans text-destructive mt-1">{errors.weddingLocation}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Package Interest */}
                  <div className="space-y-2">
                    <label htmlFor="packageInterest" className="text-[11px] font-sans tracking-wider uppercase text-muted-foreground block">
                      What are you interested in? <span className="text-primary">*</span>
                    </label>
                    <select
                      id="packageInterest"
                      name="packageInterest"
                      value={formData.packageInterest}
                      onChange={handleInputChange}
                      className={`${inputCls} appearance-none cursor-pointer bg-no-repeat`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238C8C8E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: `right 12px center`,
                        backgroundSize: `1.5em 1.5em`,
                        paddingRight: `2.5rem`
                      }}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="" disabled className="bg-card">Select Package Tier</option>
                      {PACKAGES.map((pkg) => (
                        <option key={pkg} value={pkg} className="bg-card text-foreground">{pkg}</option>
                      ))}
                    </select>
                    {errors.packageInterest && (
                      <p className="text-[10px] font-sans text-destructive mt-1">{errors.packageInterest}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[11px] font-sans tracking-wider uppercase text-muted-foreground block">
                      Email Address <span className="text-muted-foreground/50">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. test@example.com"
                      className={inputCls}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-[10px] font-sans text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Guest Count */}
                <div className="space-y-2">
                  <label htmlFor="guestCount" className="text-[11px] font-sans tracking-wider uppercase text-muted-foreground block">
                    Approximate Guest Count <span className="text-muted-foreground/50">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    id="guestCount"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    placeholder="e.g. 300"
                    min="0"
                    className={inputCls}
                    disabled={isSubmitting}
                  />
                  {errors.guestCount && (
                    <p className="text-[10px] font-sans text-destructive mt-1">{errors.guestCount}</p>
                  )}
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-[11px] font-sans tracking-wider uppercase text-muted-foreground block">
                    Tell us about your wedding <span className="text-muted-foreground/50">(Optional)</span>
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Share anything you'd like us to know about your wedding..."
                    rows={4}
                    maxLength={1000}
                    className={`${inputCls} resize-none`}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 text-center text-xs font-sans tracking-[0.25em] px-6 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md uppercase font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Enquiry...
                      </>
                    ) : (
                      "Send Enquiry"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12 px-4 space-y-6"
            >
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto text-primary text-2xl">
                ❤️
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-serif text-foreground">Thank you</h2>
                <p className="text-sm font-sans text-primary font-semibold tracking-wider uppercase">We&apos;ve received your wedding enquiry.</p>
              </div>
              <p className="text-xs font-sans text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Our team will review the details and get in touch with you shortly to plan your custom wedding story.
              </p>
              <div className="pt-6">
                <button
                  onClick={() => {
                    setFormData({
                      name: "",
                      phone: "",
                      email: "",
                      weddingDate: "",
                      weddingLocation: "",
                      guestCount: "",
                      packageInterest: "",
                      requirements: "",
                    });
                    setSubmitted(false);
                  }}
                  className="inline-block text-[10px] font-sans tracking-widest uppercase border border-border hover:border-primary px-6 py-3 rounded-md transition-colors duration-300 text-muted-foreground hover:text-foreground"
                >
                  Send another enquiry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
