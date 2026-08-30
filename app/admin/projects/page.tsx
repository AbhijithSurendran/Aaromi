"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Upload, Save, CheckSquare, Square, Info, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Metric {
  value: string;
  label: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  industry?: string;
  services?: string;
  challenge?: string;
  strategy?: string[];
  galleryImages?: string[];
  metrics?: Metric[];
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<"basic" | "meta" | "content">("basic");
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  
  // Upload states
  const [uploading, setUploading] = useState<number | null>(null); // null, -1 (thumbnail), or index 0-3 (gallery)
  const [uploadError, setUploadError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        setError("Failed to fetch projects list.");
      }
    } catch (err) {
      setError("Failed to connect to API server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setCurrentProject({
      title: "",
      category: "",
      year: new Date().getFullYear().toString(),
      description: "",
      imageUrl: "",
      featured: true,
      industry: "",
      services: "",
      challenge: "",
      strategy: ["", ""],
      galleryImages: ["", "", "", ""],
      metrics: [
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" }
      ]
    });
    setUploadError("");
    setActiveFormTab("basic");
    setShowModal(true);
  };

  const handleOpenEdit = (project: Project) => {
    // Map existing structure and initialize nested values if undefined
    setCurrentProject({
      ...project,
      industry: project.industry || "",
      services: project.services || "",
      challenge: project.challenge || "",
      strategy: project.strategy && project.strategy.length > 0 ? [...project.strategy] : ["", ""],
      galleryImages: project.galleryImages && project.galleryImages.length > 0 ? [...project.galleryImages] : ["", "", "", ""],
      metrics: project.metrics && project.metrics.length > 0 ? [...project.metrics] : [
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" }
      ]
    });
    setUploadError("");
    setActiveFormTab("basic");
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(targetIndex);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        if (targetIndex === -1) {
          // Main thumbnail URL
          setCurrentProject((prev) => prev ? { ...prev, imageUrl: data.url } : null);
        } else {
          // Gallery Image Index
          setCurrentProject((prev) => {
            if (!prev) return null;
            const gallery = prev.galleryImages ? [...prev.galleryImages] : ["", "", "", ""];
            gallery[targetIndex] = data.url;
            return { ...prev, galleryImages: gallery };
          });
        }
      } else {
        setUploadError(data.error || "File upload failed.");
      }
    } catch (err) {
      setUploadError("Network error during file upload.");
    } finally {
      setUploading(null);
    }
  };

  const handleMetricChange = (index: number, field: "value" | "label", value: string) => {
    setCurrentProject((prev) => {
      if (!prev || !prev.metrics) return null;
      const metrics = [...prev.metrics];
      metrics[index] = { ...metrics[index], [field]: value };
      return { ...prev, metrics };
    });
  };

  const handleStrategyChange = (index: number, value: string) => {
    setCurrentProject((prev) => {
      if (!prev || !prev.strategy) return null;
      const strategy = [...prev.strategy];
      strategy[index] = value;
      return { ...prev, strategy };
    });
  };

  const handleGalleryUrlChange = (index: number, value: string) => {
    setCurrentProject((prev) => {
      if (!prev || !prev.galleryImages) return null;
      const gallery = [...prev.galleryImages];
      gallery[index] = value;
      return { ...prev, galleryImages: gallery };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject?.title || !currentProject?.category) {
      alert("Title and Category are required");
      return;
    }

    const isEdit = !!currentProject.id;
    const method = isEdit ? "PUT" : "POST";

    // Clean up empty fields in metrics / gallery / strategy for projects without full case studies
    const preparedProject = { ...currentProject };
    if (!preparedProject.challenge) {
      delete preparedProject.industry;
      delete preparedProject.services;
      delete preparedProject.challenge;
      delete preparedProject.strategy;
      delete preparedProject.galleryImages;
      delete preparedProject.metrics;
    }

    try {
      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedProject),
      });

      if (res.ok) {
        fetchProjects();
        setShowModal(false);
        setCurrentProject(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save project.");
      }
    } catch (err) {
      alert("Connection error occurred while saving.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete project.");
      }
    } catch (err) {
      alert("Connection error occurred while deleting.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary tracking-tighter">Manage Projects</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-2">
            Create, edit, and configure dynamic Case Studies for your portfolio.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-primary text-background px-5 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest hover:bg-on-surface-variant transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-error rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant font-sans">
          Loading portfolio project items...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-surface rounded-xl border border-outline-variant/30 p-12 text-center text-on-surface-variant font-sans">
          No projects found. Add your first project using the button above!
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 divide-y divide-outline-variant/20">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-surface-container-low/25 transition-colors"
              >
                <div className="flex items-center gap-6">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/20 shrink-0">
                    <Image 
                      fill
                      sizes="80px"
                      className="object-cover"
                      alt={project.title}
                      src={project.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCldkP3CRuP7gktMRYwY8DWkC6T9cZTzyNn7_uqRF1Fe9pyxP_gr7o3tXi1iDxYEmLDDOedL8mwrK_PI9hHonaGyLIhWGou85S9FS_ChXn_kqt1ldCgoqYuVHVMF-hhQYYKukyX5beJGAj09ObaJzwPCaUW_UqjldLf6pH0UFluTDZvE14hfjVfxUZO46oV0J0odOorCzYC-iGqZ0YhBjLi7fwf4hjr4LbmkZU9rJo4rRuQPjaNjVM"}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-primary flex items-center gap-2">
                      {project.title}
                      {project.featured && (
                        <span className="text-[10px] uppercase font-sans tracking-wider bg-secondary-fixed/30 text-on-secondary-fixed font-semibold px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                      {project.challenge && (
                        <span className="text-[10px] uppercase font-sans tracking-wider bg-surface-variant text-primary font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Info className="w-3 h-3" /> Case Study
                        </span>
                      )}
                    </h3>
                    <p className="font-sans text-xs text-on-surface-variant mt-1">
                      {project.category} · {project.year}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-3 border border-outline-variant/50 hover:border-primary hover:bg-surface-container rounded-lg text-primary transition-all flex items-center justify-center"
                    title="Edit Project & Case Study"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-3 border border-error-container hover:bg-error-container text-error rounded-lg transition-all flex items-center justify-center"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Project Modal */}
      {showModal && currentProject && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-surface rounded-2xl border border-outline-variant/30 max-w-3xl w-full p-8 md:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 text-outline hover:text-primary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-display font-bold text-primary mb-6 tracking-tighter">
              {currentProject.id ? `Edit ${currentProject.title}` : "Add New Project"}
            </h2>

            {/* Modal Form Tabs */}
            <div className="flex border-b border-outline-variant/25 mb-6 font-sans">
              <button
                type="button"
                onClick={() => setActiveFormTab("basic")}
                className={`pb-3 px-4 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all ${
                  activeFormTab === "basic" ? "text-primary border-primary" : "text-outline border-transparent hover:text-primary"
                }`}
              >
                1. Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab("meta")}
                className={`pb-3 px-4 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all ${
                  activeFormTab === "meta" ? "text-primary border-primary" : "text-outline border-transparent hover:text-primary"
                }`}
              >
                2. Case Study Meta
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab("content")}
                className={`pb-3 px-4 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all ${
                  activeFormTab === "content" ? "text-primary border-primary" : "text-outline border-transparent hover:text-primary"
                }`}
              >
                3. Strategy &amp; Media
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 font-sans text-left">
              
              {/* TAB 1: BASIC INFO */}
              {activeFormTab === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-outline">Project Title</label>
                      <input
                        type="text"
                        required
                        value={currentProject.title}
                        onChange={(e) => setCurrentProject(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                        placeholder="e.g. Lumina Tech"
                      />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-outline">Category</label>
                      <input
                        type="text"
                        required
                        value={currentProject.category}
                        onChange={(e) => setCurrentProject(prev => prev ? { ...prev, category: e.target.value } : null)}
                        className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                        placeholder="e.g. Web Design, UI/UX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Year */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-outline">Year</label>
                      <input
                        type="text"
                        required
                        value={currentProject.year}
                        onChange={(e) => setCurrentProject(prev => prev ? { ...prev, year: e.target.value } : null)}
                        className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                        placeholder="e.g. 2024"
                      />
                    </div>

                    {/* Featured Status Toggle */}
                    <div className="flex flex-col gap-2 justify-center">
                      <label className="text-xs uppercase font-bold tracking-widest text-outline mb-2">Display Mode</label>
                      <button
                        type="button"
                        onClick={() => setCurrentProject(prev => prev ? { ...prev, featured: !prev.featured } : null)}
                        className="flex items-center gap-2 text-sm font-semibold hover:text-primary text-on-surface-variant text-left w-fit"
                      >
                        {currentProject.featured ? (
                          <CheckSquare className="w-5 h-5 text-secondary-fixed-dim" />
                        ) : (
                          <Square className="w-5 h-5 text-outline" />
                        )}
                        <span>Featured on Home Page</span>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-outline">Short Card Description</label>
                    <textarea
                      rows={3}
                      value={currentProject.description}
                      onChange={(e) => setCurrentProject(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 resize-none"
                      placeholder="Tell us a little bit about this project for cards..."
                    ></textarea>
                  </div>

                  {/* Main thumbnail upload */}
                  <div className="flex flex-col gap-4 border border-outline-variant/30 rounded-xl p-5 bg-surface-container-low/20">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-outline">Main Thumbnail URL</label>
                      <input
                        type="text"
                        value={currentProject.imageUrl}
                        onChange={(e) => setCurrentProject(prev => prev ? { ...prev, imageUrl: e.target.value } : null)}
                        className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-xs focus:border-primary focus:ring-0"
                        placeholder="Thumbnail path (e.g. /uploads/image.png)"
                      />
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <label className="flex items-center gap-2 border border-outline border-dashed px-4 py-3 rounded-xl cursor-pointer hover:bg-surface-container transition-colors text-xs font-semibold uppercase tracking-wider text-primary">
                        <Upload className="w-4 h-4" />
                        <span>{uploading === -1 ? "Uploading..." : "Upload Thumbnail Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, -1)}
                          disabled={uploading !== null}
                          className="hidden"
                        />
                      </label>
                      {uploadError && uploading === -1 && (
                        <span className="text-xs text-error font-semibold">{uploadError}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CASE STUDY META */}
              {activeFormTab === "meta" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Industry */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-outline">Industry</label>
                      <input
                        type="text"
                        value={currentProject.industry || ""}
                        onChange={(e) => setCurrentProject(prev => prev ? { ...prev, industry: e.target.value } : null)}
                        className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                        placeholder="e.g. Luxury Skincare"
                      />
                    </div>

                    {/* Services Tags */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-outline">Detailed Services List</label>
                      <input
                        type="text"
                        value={currentProject.services || ""}
                        onChange={(e) => setCurrentProject(prev => prev ? { ...prev, services: e.target.value } : null)}
                        className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                        placeholder="e.g. Brand Identity, E-commerce, UI/UX"
                      />
                    </div>
                  </div>

                  {/* Challenge Textarea */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-outline">
                      The Challenge Statement (Headline)
                    </label>
                    <textarea
                      rows={3}
                      value={currentProject.challenge || ""}
                      onChange={(e) => setCurrentProject(prev => prev ? { ...prev, challenge: e.target.value } : null)}
                      className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 resize-none font-bold"
                      placeholder="e.g. Creating a digital sanctuary for a brand rooted in ritual..."
                    ></textarea>
                    <span className="text-[10px] text-outline font-sans">
                      Leave this empty if this project does not have a Case Study detail view (it will fallback to card overview).
                    </span>
                  </div>

                  {/* Metrics Form Inputs */}
                  <div className="border border-outline-variant/30 rounded-xl p-5 bg-surface-container-low/20 space-y-4">
                    <label className="text-xs uppercase font-bold tracking-widest text-outline block">Impact Outcome Metrics (Max 3)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[0, 1, 2].map((idx) => (
                        <div key={idx} className="space-y-3 p-4 bg-surface rounded-xl border border-outline-variant/20">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Stat {idx+1} Value</label>
                            <input
                              type="text"
                              value={currentProject.metrics?.[idx]?.value || ""}
                              onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                              className="border border-outline-variant rounded-lg px-3 py-2 bg-transparent text-xs focus:border-primary focus:ring-0 font-bold"
                              placeholder="e.g. +42% or 2.1x"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Stat {idx+1} Label</label>
                            <input
                              type="text"
                              value={currentProject.metrics?.[idx]?.label || ""}
                              onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                              className="border border-outline-variant rounded-lg px-3 py-2 bg-transparent text-xs focus:border-primary focus:ring-0"
                              placeholder="e.g. Conversion Rate"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: STRATEGY & MEDIA */}
              {activeFormTab === "content" && (
                <div className="space-y-6">
                  {/* Strategy Paragraphs */}
                  <div className="border border-outline-variant/30 rounded-xl p-5 bg-surface-container-low/20 space-y-4">
                    <label className="text-xs uppercase font-bold tracking-widest text-outline block">Strategy & Insights Narrative</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Paragraph 1 (The Approach)</span>
                        <textarea
                          rows={4}
                          value={currentProject.strategy?.[0] || ""}
                          onChange={(e) => handleStrategyChange(0, e.target.value)}
                          className="border border-outline-variant rounded-xl px-4 py-3 bg-surface text-xs focus:border-primary focus:ring-0 resize-none"
                          placeholder="Describe the research, insight, and strategic planning..."
                        ></textarea>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Paragraph 2 (The Solution)</span>
                        <textarea
                          rows={4}
                          value={currentProject.strategy?.[1] || ""}
                          onChange={(e) => handleStrategyChange(1, e.target.value)}
                          className="border border-outline-variant rounded-xl px-4 py-3 bg-surface text-xs focus:border-primary focus:ring-0 resize-none"
                          placeholder="Describe the structural layouts, visual ideas, and checkout implementation..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Gallery image inputs and uploads */}
                  <div className="border border-outline-variant/30 rounded-xl p-5 bg-surface-container-low/20 space-y-4">
                    <label className="text-xs uppercase font-bold tracking-widest text-outline block">Mockups Media Gallery</label>
                    
                    {[
                      { idx: 0, label: "Hero Banner Mockup (Top full-width)" },
                      { idx: 1, label: "Secondary Full-Width Desktop Mockup" },
                      { idx: 2, label: "Left Mobile Mockup (Vertical)" },
                      { idx: 3, label: "Right Mobile Mockup (Vertical with margin)" }
                    ].map((item) => (
                      <div key={item.idx} className="flex flex-col gap-3 p-4 bg-surface rounded-xl border border-outline-variant/20">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-outline uppercase tracking-wider">{item.label}</label>
                          <input
                            type="text"
                            value={currentProject.galleryImages?.[item.idx] || ""}
                            onChange={(e) => handleGalleryUrlChange(item.idx, e.target.value)}
                            className="border border-outline-variant rounded-lg px-3 py-2 bg-transparent text-xs focus:border-primary focus:ring-0 font-mono"
                            placeholder="Image file path or URL"
                          />
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <label className="flex items-center gap-1.5 border border-outline border-dashed px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-container transition-colors text-[10px] font-semibold uppercase tracking-wider text-primary">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploading === item.idx ? "Uploading..." : "Upload Image"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, item.idx)}
                              disabled={uploading !== null}
                              className="hidden"
                            />
                          </label>
                          {currentProject.galleryImages?.[item.idx] && (
                            <span className="text-[9px] text-on-surface-variant font-semibold flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5" /> Attached
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Controls */}
              <div className="pt-6 border-t border-outline-variant/20 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-on-surface-variant transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
