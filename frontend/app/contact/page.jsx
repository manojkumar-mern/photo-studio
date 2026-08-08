"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-16 text-center md:text-left">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              GET IN TOUCH
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-sm font-sans text-muted-foreground max-w-xl leading-relaxed">
              Have questions or want to collaborate? Write us a message below or reach out via our direct channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left Column: Direct Info Placeholders */}
            <div className="lg:col-span-5 space-y-8 text-sm font-sans text-muted-foreground">
              <div className="space-y-2">
                <h4 className="text-[10px] tracking-[0.2em] text-foreground uppercase font-bold">EMAIL DIRECT</h4>
                <p className="hover:text-primary transition-colors">hello@auraphotostudio.com</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] tracking-[0.2em] text-foreground uppercase font-bold">TELEPHONE</h4>
                <p className="hover:text-primary transition-colors">+91 98765 43210</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] tracking-[0.2em] text-foreground uppercase font-bold">STUDIO LOCATION</h4>
                <p>[Studio Location Address Placeholder]</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] tracking-[0.2em] text-foreground uppercase font-bold">AVAILABILITY</h4>
                <p>[Monday – Friday: 09:00 – 18:00]</p>
                <p>[Sessions by reservation only]</p>
              </div>
            </div>

            {/* Right Column: Interactive Simple Form */}
            <div className="lg:col-span-7 bg-card border border-border p-8 md:p-10">
              {status === "success" ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-12 h-12 border border-primary rounded-full flex items-center justify-center mx-auto text-primary">
                    ✓
                  </div>
                  <h3 className="font-serif text-xl text-foreground">Message Sent</h3>
                  <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                    Thank you for reaching out. We have received your message and will respond shortly.
                  </p>
                  <button
                    onClick={() => setStatus("")}
                    className="text-[10px] font-sans tracking-[0.2em] border border-border hover:border-white/20 text-muted-foreground hover:text-foreground px-6 py-2 transition-all mt-4"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs tracking-widest uppercase">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="[Your Name]"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-border p-4 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs tracking-widest uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="[you@email.com]"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-border p-4 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs tracking-widest uppercase">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="4"
                      placeholder="[Write your message details here...]"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-border p-4 text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full text-xs font-sans tracking-[0.25em] bg-primary text-primary-foreground hover:bg-[#D5B890] p-4 transition-colors font-bold uppercase"
                  >
                    {status === "submitting" ? "Sending..." : "Submit Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
