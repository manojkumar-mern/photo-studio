"use client";

import { useState, useId } from "react";

const inputBase =
  "w-full bg-[#FAF8F5] border border-[#E8E4DC] p-3.5 text-sm text-[#1C1C1E] placeholder:text-[#5C5C5E]/40 focus:outline-none focus:border-primary transition-colors rounded-md";

function Field({ id, label, error, children }) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-sans tracking-widest text-[#5C5C5E] uppercase font-semibold">
        {label} <span className="text-primary" aria-hidden="true">*</span>
      </label>
      {/* Clone child to inject aria attributes */}
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 mt-0.5 font-sans">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const uid = useId();
  const nameId    = `${uid}-name`;
  const emailId   = `${uid}-email`;
  const messageId = `${uid}-message`;

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors,   setErrors]   = useState({});
  const [status,   setStatus]   = useState(""); // "" | "submitting" | "success"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim())
      next.name = "Name is required.";
    if (!formData.email.trim())
      next.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Please enter a valid email address.";
    if (!formData.message.trim())
      next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    }, 1200);
  };

  if (status === "success") {
    return (
      <div className="bg-white border border-[#E8E4DC] p-8 md:p-10 text-center space-y-5 rounded-xl shadow-sm" role="status" aria-live="polite">
        <div
          className="w-12 h-12 border border-primary rounded-full flex items-center justify-center mx-auto"
          aria-hidden="true"
        >
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="font-serif text-xl text-[#1C1C1E]">Message Sent</h2>
        <p className="text-xs font-sans text-[#5C5C5E] leading-relaxed max-w-sm mx-auto">
          Thank you for reaching out. We have received your message and will respond within 24 hours.
        </p>
        <button
          onClick={() => setStatus("")}
          className="text-[10px] font-sans tracking-[0.2em] border border-[#E8E4DC] hover:border-primary/50 text-[#5C5C5E] hover:text-[#1C1C1E] px-6 py-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E4DC] p-6 sm:p-8 md:p-10 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Contact form">

        <Field id={nameId} label="Name" error={errors.name}>
          <input
            type="text"
            id={nameId}
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            aria-invalid={!!errors.name}
            className={`${inputBase} ${errors.name ? "border-red-400 focus:border-red-400" : "border-[#E8E4DC] focus:border-primary"}`}
          />
        </Field>

        <Field id={emailId} label="Email" error={errors.email}>
          <input
            type="email"
            id={emailId}
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            aria-invalid={!!errors.email}
            className={`${inputBase} ${errors.email ? "border-red-400 focus:border-red-400" : "border-[#E8E4DC] focus:border-primary"}`}
          />
        </Field>

        <Field id={messageId} label="Message" error={errors.message}>
          <textarea
            id={messageId}
            name="message"
            required
            rows={5}
            placeholder="Tell us about your project or enquiry…"
            value={formData.message}
            onChange={handleChange}
            aria-describedby={errors.message ? `${messageId}-error` : undefined}
            aria-invalid={!!errors.message}
            className={`${inputBase} resize-none ${errors.message ? "border-red-400 focus:border-red-400" : "border-[#E8E4DC] focus:border-primary"}`}
          />
        </Field>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full text-xs font-sans tracking-[0.25em] uppercase bg-primary text-white hover:bg-[#b09470] disabled:opacity-60 p-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary font-semibold rounded-md"
        >
          {status === "submitting" ? "Sending…" : "Submit Message"}
        </button>
      </form>
    </div>
  );
}
