"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    name: "",
    email: "",
    phone: "",
    scope: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const servicesList = [
    "Fashion & Editorial",
    "Wedding Documentary",
    "Fine Art Portraiture",
    "Other Studio Shoot",
  ];

  const handleSelectService = (service) => {
    setFormData({ ...formData, service });
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    if (step === 2 && !formData.date) return;
    if (step === 3 && (!formData.name || !formData.email || !formData.phone)) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(5);
    }, 1500);
  };

  return (
    <section id="book" className="relative bg-[#0C0C0D] py-24 md:py-36 px-6 md:px-12 z-20">
      <div className="max-w-3xl mx-auto border border-white/5 bg-[#161618] p-8 md:p-12">
        
        {/* Header Block */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-[10px] font-sans tracking-[0.3em] text-[#C5A880] uppercase block mb-3">
            ENQUIRY PORTAL
          </span>
          <h2 className="text-3xl font-serif text-[#F4F1EA]">
            Begin your story
          </h2>
          {step < 5 && (
            <p className="text-xs font-sans text-[#8E8E93] mt-2">
              Step {step} of 4: {
                step === 1 ? "Select Photography Format" : 
                step === 2 ? "Date Preference" : 
                step === 3 ? "Contact Information" : "Creative Direction Notes"
              }
            </p>
          )}
        </div>

        {/* Wizard Form Frame */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Choose Service */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {servicesList.map((srv) => (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => handleSelectService(srv)}
                    className={`p-6 border text-left font-serif text-lg tracking-wide hover:border-[#C5A880] transition-colors duration-300 ${
                      formData.service === srv ? "border-[#C5A880] bg-[#C5A880]/5" : "border-white/5 bg-[#0C0C0D]"
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 2: Preferred Date */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="date" className="text-xs font-sans tracking-widest text-[#8E8E93] uppercase">
                    Preferred Session Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-[#0C0C0D] border border-white/5 p-4 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-xs font-sans tracking-widest text-[#8E8E93] hover:text-[#F4F1EA]"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.date}
                    className="text-xs font-sans tracking-widest text-[#C5A880] hover:text-[#F4F1EA] disabled:opacity-40"
                  >
                    CONTINUE
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Info */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-sans tracking-widest text-[#8E8E93] uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="[Client Name]"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#0C0C0D] border border-white/5 p-4 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-sans tracking-widest text-[#8E8E93] uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="[client@email.com]"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#0C0C0D] border border-white/5 p-4 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-sans tracking-widest text-[#8E8E93] uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="[+91 00000 00000]"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#0C0C0D] border border-white/5 p-4 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-xs font-sans tracking-widest text-[#8E8E93] hover:text-[#F4F1EA]"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.name || !formData.email || !formData.phone}
                    className="text-xs font-sans tracking-widest text-[#C5A880] hover:text-[#F4F1EA] disabled:opacity-40"
                  >
                    CONTINUE
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Creative Scope */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="scope" className="text-xs font-sans tracking-widest text-[#8E8E93] uppercase">
                    Tell us about your visual concept
                  </label>
                  <textarea
                    id="scope"
                    name="scope"
                    rows="5"
                    placeholder="[E.g., location ideas, references, stylistic elements, moodboards]"
                    value={formData.scope}
                    onChange={handleInputChange}
                    className="w-full bg-[#0C0C0D] border border-white/5 p-4 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C5A880] transition-colors resize-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-xs font-sans tracking-widest text-[#8E8E93] hover:text-[#F4F1EA]"
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-xs font-sans tracking-widest text-[#C5A880] hover:text-[#F4F1EA] disabled:opacity-40 uppercase"
                  >
                    {isSubmitting ? "Submitting..." : "Send Request →"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1.0 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-16 h-16 border border-[#C5A880] rounded-full flex items-center justify-center mx-auto text-[#C5A880] text-xl">
                  ✓
                </div>
                <h3 className="font-serif text-2xl text-[#F4F1EA]">
                  Request Submitted
                </h3>
                <p className="text-xs font-sans text-[#8E8E93] max-w-md mx-auto leading-relaxed">
                  Thank you for sharing your concept. We review every narrative carefully and will respond to your contact details within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ service: "", date: "", name: "", email: "", phone: "", scope: "" });
                    setStep(1);
                  }}
                  className="text-[10px] font-sans tracking-[0.2em] border border-white/10 hover:border-white/20 text-[#8E8E93] hover:text-[#F4F1EA] px-6 py-2 transition-all mt-4"
                >
                  START NEW ENQUIRY
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
