"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CursorGrid from "@/components/ui/CursorGrid";

const SERVICES = [
  "Fashion & Editorial",
  "Wedding Documentary",
  "Fine Art Portraiture",
  "Other Studio Shoot",
];

const STEP_LABELS = {
  1: "Select Photography Format",
  2: "Date Preference",
  3: "Contact Information",
  4: "Creative Direction Notes",
};

// Shared input class
const inputCls =
  "w-full bg-background border border-border p-3.5 rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors";

// Step indicator
function StepDots({ current, total }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${current} of ${total}`} role="status">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-[2px] transition-all duration-300 ${
            i < current ? "bg-primary" : "bg-border"
          } ${i === current - 1 ? "w-6" : "w-3"}`}
          aria-hidden="true"
        />
      ))}
      <span className="text-[10px] font-sans tracking-[0.15em] text-muted-foreground ml-1">
        {current}/{total}
      </span>
    </div>
  );
}

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    category: "Standard",
    date: "",
    name: "",
    email: "",
    phone: "",
    scope: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get("service");
      const categoryParam = params.get("category");
      if (serviceParam) {
        setFormData((prev) => ({
          ...prev,
          service: serviceParam,
          category: categoryParam ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase() : "Standard",
          scope: categoryParam ? `Category Tier: ${categoryParam.toUpperCase()}` : prev.scope,
        }));
        setStep(2);
      }
    }
  }, []);

  const handleSelectService = (service) => {
    setFormData((prev) => ({ ...prev, service }));
  };

  const handleSelectCategory = (category) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 2 && !formData.date) {
      newErrors.date = "Please select a preferred date.";
    }
    if (step === 3) {
      if (!formData.name.trim())  newErrors.name  = "Full name is required.";
      if (!formData.email.trim()) newErrors.email = "Email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Please enter a valid email address.";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const submissionData = {
        ...formData,
        service: `${formData.service} (${formData.category} Tier)`,
      };
      
      const response = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit booking");
      }

      setIsSubmitting(false);
      setStep(5);
    } catch (err) {
      console.error("Booking submission error:", err);
      setErrors((prev) => ({
        ...prev,
        submit: err.message || "An unexpected error occurred. Please try again.",
      }));
      setIsSubmitting(false);
    }
  };

  // Today's date string for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="book" className="relative bg-background py-20 md:py-32 px-4 sm:px-6 md:px-12 z-20 overflow-hidden">
      {/* Background Grid Hover Glow Effect */}
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

        {/* Header */}
        <div className="mb-8">
          <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-2">
            Enquiry Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">
            Begin your story
          </h2>
          {step < 5 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs font-sans text-muted-foreground">
                {STEP_LABELS[step]}
              </p>
              <StepDots current={step} total={4} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <AnimatePresence mode="wait">

            {/* Step 1 — Service & Category selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <fieldset>
                  <legend className="text-xs font-sans tracking-widest text-muted-foreground uppercase mb-3.5 block font-bold">
                    Choose photography format
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICES.map((srv) => (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => handleSelectService(srv)}
                        className={`p-4 border rounded-md text-left font-serif text-base tracking-wide transition-colors duration-300 min-h-[64px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                          ${formData.service === srv
                            ? "border-primary bg-primary/8 text-foreground"
                            : "border-border bg-background text-foreground hover:border-primary/60"
                          }`}
                        aria-pressed={formData.service === srv}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {formData.service && (
                  <fieldset className="pt-2">
                    <legend className="text-xs font-sans tracking-widest text-muted-foreground uppercase mb-3.5 block font-bold">
                      Choose Package Tier
                    </legend>
                    <div className="grid grid-cols-3 gap-2.5">
                      {["Standard", "Premium", "Elite"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleSelectCategory(cat)}
                          className={`py-3.5 border rounded-md text-center font-sans text-xs tracking-wider font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                            ${formData.category.toLowerCase() === cat.toLowerCase()
                              ? "border-[#C5A880] bg-[#C5A880]/10 text-foreground"
                              : "border-border bg-background text-[#5C5C5E] hover:border-primary/60"
                            }`}
                          aria-pressed={formData.category.toLowerCase() === cat.toLowerCase()}
                        >
                          {cat.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                <NavRow
                  onNext={nextStep}
                  disabled={!formData.service || !formData.category}
                />
              </motion.div>
            )}

            {/* Step 2 — Date */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="booking-date" className="text-xs font-sans tracking-widest text-muted-foreground uppercase">
                    Preferred Session Date
                  </label>
                  <input
                    type="date"
                    id="booking-date"
                    name="date"
                    required
                    min={today}
                    value={formData.date}
                    onChange={handleInputChange}
                    aria-describedby={errors.date ? "date-error" : undefined}
                    aria-invalid={!!errors.date}
                    className={inputCls}
                  />
                  {errors.date && (
                    <p id="date-error" role="alert" className="text-xs text-red-400 mt-1">
                      {errors.date}
                    </p>
                  )}
                </div>
                <NavRow onBack={prevStep} onNext={nextStep} disabled={!formData.date} />
              </motion.div>
            )}

            {/* Step 3 — Contact info */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <FormField
                  id="booking-name" name="name" type="text" label="Full Name"
                  placeholder="Your name" value={formData.name}
                  onChange={handleInputChange} error={errors.name} required
                />
                <FormField
                  id="booking-email" name="email" type="email" label="Email Address"
                  placeholder="you@example.com" value={formData.email}
                  onChange={handleInputChange} error={errors.email} required
                />
                <FormField
                  id="booking-phone" name="phone" type="tel" label="Phone Number"
                  placeholder="+91 00000 00000" value={formData.phone}
                  onChange={handleInputChange} error={errors.phone} required
                />
                <NavRow
                  onBack={prevStep}
                  onNext={nextStep}
                  disabled={!formData.name || !formData.email || !formData.phone}
                />
              </motion.div>
            )}

            {/* Step 4 — Creative scope */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="booking-scope" className="text-xs font-sans tracking-widest text-muted-foreground uppercase">
                    Tell us about your visual concept{" "}
                    <span className="text-muted-foreground/50 normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    id="booking-scope"
                    name="scope"
                    rows={5}
                    placeholder="Location ideas, references, stylistic elements, mood boards…"
                    value={formData.scope}
                    onChange={handleInputChange}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                {errors.submit && (
                  <p role="alert" className="text-xs text-red-400 text-center">
                    {errors.submit}
                  </p>
                )}
                <NavRow
                  onBack={prevStep}
                  submitLabel={isSubmitting ? "Submitting…" : "Send Request"}
                  isSubmit
                  disabled={isSubmitting}
                />
              </motion.div>
            )}

            {/* Step 5 — Confirmation */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="text-center py-10 space-y-6"
              >
                <div
                  className="w-14 h-14 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 bg-emerald-500/10"
                  aria-hidden="true"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-foreground">Request Submitted</h3>
                <div role="alert" className="text-sm md:text-base font-sans text-muted-foreground max-w-md mx-auto leading-relaxed px-4">
                  Booking request submitted successfully! Thank you for choosing Pixelbees Photography. We’ve received your request and will get back to you soon.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ service: "", category: "Standard", date: "", name: "", email: "", phone: "", scope: "" });
                    setErrors({});
                    setStep(1);
                  }}
                  className="text-[10px] font-sans tracking-[0.2em] border border-border hover:border-primary/50 rounded-md text-muted-foreground hover:text-foreground px-6 py-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Start New Enquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────

function FormField({ id, name, type, label, placeholder, value, onChange, error, required }) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-sans tracking-widest text-muted-foreground uppercase">
        {label}
        {required && <span className="text-primary ml-1" aria-hidden="true">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={`w-full bg-background border p-3.5 rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
          error ? "border-red-500/60 focus:border-red-400" : "border-border focus:border-primary"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function NavRow({ onBack, onNext, submitLabel, isSubmit = false, disabled = false }) {
  return (
    <div className="flex items-center justify-between pt-4 gap-4">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-sans tracking-widest text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}
      {isSubmit ? (
        <button
          type="submit"
          disabled={disabled}
          className="text-xs font-sans tracking-[0.2em] uppercase text-primary hover:text-foreground disabled:opacity-40 min-h-[44px] px-4 rounded-md border border-primary/20 hover:border-primary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {submitLabel} →
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="text-xs font-sans tracking-[0.2em] uppercase text-primary hover:text-foreground disabled:opacity-40 min-h-[44px] px-4 rounded-md border border-primary/20 hover:border-primary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Continue →
        </button>
      )}
    </div>
  );
}
