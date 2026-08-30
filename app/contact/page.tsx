"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    project_types: [] as string[],
    budget: "",
    timeline: "",
    details: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChipToggle = (type: string) => {
    setFormData((prev) => {
      const types = [...prev.project_types];
      const index = types.indexOf(type);
      if (index === -1) {
        types.push(type);
      } else {
        types.splice(index, 1);
      }
      return { ...prev, project_types: types };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          company: "",
          project_types: [],
          budget: "",
          timeline: "",
          details: "",
        });
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit request. Please check your internet connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left column info */}
        <div className="lg:col-span-5 flex flex-col justify-start pt-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-6 max-w-lg leading-tight tracking-tighter">
            Let's make something remarkable.
          </h1>
          <p className="text-base md:text-lg font-sans text-on-surface-variant mb-16 max-w-md leading-relaxed">
            Tell us what you're building, where you're stuck, or what you'd like to improve.
          </p>

          <div className="space-y-12">
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-outline mb-4">Email</h3>
              <a 
                href="mailto:hello@aaromi.com" 
                className="text-lg md:text-xl font-sans font-semibold text-primary hover:text-secondary-fixed-dim transition-colors relative inline-block group"
              >
                hello@aaromi.com
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary-fixed transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-outline mb-4">Location</h3>
              <p className="text-lg md:text-xl font-sans font-semibold text-primary">India</p>
              <p className="text-sm font-sans text-on-surface-variant">Working Worldwide</p>
            </div>
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-outline mb-4">Social</h3>
              <div className="flex gap-6 font-sans text-sm font-semibold">
                <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Instagram</a>
                <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">LinkedIn</a>
                <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Behance</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right column form */}
        <div className="lg:col-span-7 lg:pl-12 mt-16 lg:mt-0">
          {success ? (
            <div className="bg-secondary-fixed/15 border border-secondary/20 rounded-xl p-8 md:p-12 text-center shadow-[0px_20px_40px_rgba(26,26,26,0.04)]">
              <span className="material-symbols-outlined text-5xl text-secondary-fixed-dim mb-4">check_circle</span>
              <h2 className="text-2xl font-display font-bold text-primary mb-4">Message Sent Successfully!</h2>
              <p className="font-sans text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to Aaromi Studio. We've received your project details and will get back to you within 24-48 hours.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-8 border border-primary text-primary px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-primary hover:text-background transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form 
              onSubmit={handleSubmit}
              className="bg-surface-bright rounded-xl border border-outline-variant/30 p-8 md:p-12 shadow-[0px_20px_40px_rgba(26,26,26,0.04)]"
            >
              <div className="space-y-10">
                {error && (
                  <div className="p-4 bg-error-container text-error rounded-lg text-sm font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Name */}
                  <div className="relative group">
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="block w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 text-sm font-sans text-primary focus:border-primary focus:ring-0 peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="name" 
                      className="absolute left-0 top-3 text-sm font-sans text-outline transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary peer-valid:-top-4 peer-valid:text-xs"
                    >
                      Your Name
                    </label>
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="block w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 text-sm font-sans text-primary focus:border-primary focus:ring-0 peer placeholder-transparent"
                    />
                    <label 
                      htmlFor="email" 
                      className="absolute left-0 top-3 text-sm font-sans text-outline transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary peer-valid:-top-4 peer-valid:text-xs"
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                {/* Company */}
                <div className="relative group">
                  <input 
                    type="text" 
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company / Organization"
                    className="block w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 text-sm font-sans text-primary focus:border-primary focus:ring-0 peer placeholder-transparent"
                  />
                  <label 
                    htmlFor="company" 
                    className="absolute left-0 top-3 text-sm font-sans text-outline transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary peer-valid:-top-4 peer-valid:text-xs"
                  >
                    Company / Organization (Optional)
                  </label>
                </div>

                {/* Project Types */}
                <div>
                  <p className="font-sans font-bold text-xs uppercase tracking-widest text-outline mb-4">Project Type</p>
                  <div className="flex flex-wrap gap-3">
                    {["branding", "web design", "app design", "development"].map((type) => {
                      const isSelected = formData.project_types.includes(type);
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => handleChipToggle(type)}
                          className={`px-5 py-2 rounded-full border text-sm font-sans font-semibold transition-all ${
                            isSelected 
                              ? "bg-secondary-fixed/20 border-secondary text-secondary-fixed-dim" 
                              : "border-outline-variant text-on-surface-variant hover:border-primary"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="block font-sans font-bold text-xs uppercase tracking-widest text-outline mb-2">
                      Estimated Budget
                    </label>
                    <select 
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="block w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 text-sm font-sans text-primary focus:border-primary focus:ring-0 cursor-pointer"
                    >
                      <option value="">Select a range</option>
                      <option value="25k-50k">₹25k - ₹50k</option>
                      <option value="50k-1L">₹50k - ₹1L</option>
                      <option value="1L-5L">₹1L - ₹5L</option>
                      <option value="5L+">₹5L+</option>
                    </select>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label htmlFor="timeline" className="block font-sans font-bold text-xs uppercase tracking-widest text-outline mb-2">
                      Timeline
                    </label>
                    <select 
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="block w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 text-sm font-sans text-primary focus:border-primary focus:ring-0 cursor-pointer"
                    >
                      <option value="">Select a timeframe</option>
                      <option value="asap">ASAP (1-2 weeks)</option>
                      <option value="1month">Within 1 month</option>
                      <option value="2-3months">2-3 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                {/* Details */}
                <div className="relative group">
                  <textarea 
                    id="details"
                    name="details"
                    required
                    rows={4}
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Tell us more..."
                    className="block w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 text-sm font-sans text-primary focus:border-primary focus:ring-0 peer placeholder-transparent resize-none"
                  ></textarea>
                  <label 
                    htmlFor="details" 
                    className="absolute left-0 top-3 text-sm font-sans text-outline transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary peer-valid:-top-4 peer-valid:text-xs"
                  >
                    Tell us more about the project...
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto bg-secondary-fixed text-primary px-10 py-4 rounded-xl font-sans font-bold text-xs uppercase tracking-widest hover:bg-secondary-fixed-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    {!submitting && <ArrowUpRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
