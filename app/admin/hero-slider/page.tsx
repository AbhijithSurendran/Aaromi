"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Image as ImageIcon,
  CheckCircle2,
  SlidersHorizontal
} from "lucide-react";
import { HeroSlide } from "@/components/HeroCarousel";

export default function AdminHeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Modal state for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalSlide, setModalSlide] = useState<HeroSlide>({
    id: "",
    src: "",
    alt: "",
    tag: "",
    caption: ""
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/hero-slider");
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      } else {
        setError("Failed to fetch hero slider items.");
      }
    } catch (err) {
      setError("Network error fetching hero slides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setModalSlide({
      id: `slide-${Date.now()}`,
      src: "",
      alt: "Hero Mockup",
      tag: "Featured Product UI",
      caption: ""
    });
    setUploadError("");
    setShowModal(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setModalSlide({ ...slides[index] });
    setUploadError("");
    setShowModal(true);
  };

  const handleDelete = (index: number) => {
    if (!confirm("Are you sure you want to delete this mockup slide?")) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSlides((prev) => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    setSlides((prev) => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
        setModalSlide((prev) => ({ ...prev, src: data.url }));
      } else {
        setUploadError(data.error || "Image upload failed.");
      }
    } catch (err) {
      setUploadError("Network error during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSlide.src) {
      alert("Please provide an image URL or upload an image file.");
      return;
    }
    if (!modalSlide.caption) {
      alert("Please provide a caption headline.");
      return;
    }

    if (editingIndex !== null) {
      // Update existing
      setSlides((prev) => {
        const updated = [...prev];
        updated[editingIndex] = modalSlide;
        return updated;
      });
    } else {
      // Add new
      setSlides((prev) => [...prev, modalSlide]);
    }

    setShowModal(false);
  };

  const handleSaveChangesToServer = async () => {
    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/hero-slider", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slides),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save hero slider updates.");
      }
    } catch (err) {
      setError("Network error saving changes to hero slider.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary tracking-tighter flex items-center gap-3">
            <SlidersHorizontal className="w-8 h-8 text-primary" />
            Hero Mockup Slider
          </h1>
          <p className="font-sans text-sm text-on-surface-variant mt-2">
            Configure the showcase mockup images, tags, and caption overlays featured in the homepage hero carousel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-surface border border-outline-variant/60 hover:bg-surface-container text-primary px-5 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Slide
          </button>
          <button
            type="button"
            onClick={handleSaveChangesToServer}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest hover:bg-on-surface-variant transition-colors shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 bg-secondary-fixed/20 border border-secondary-fixed text-primary rounded-xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim" />
          Hero slider updated successfully! Live homepage now displays the updated mockups.
        </div>
      )}

      {error && (
        <div className="p-4 bg-error-container text-error rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Slides List */}
      {loading ? (
        <div className="text-center py-16 text-on-surface-variant font-sans">
          Loading hero mockup slides...
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-outline-variant/30 p-16 text-center text-on-surface-variant font-sans">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-outline" />
          <p className="font-bold text-primary text-lg">No slides configured yet.</p>
          <p className="text-sm mt-1">Click "Add Slide" above to add your first hero showcase mockup.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div
              key={slide.id || index}
              className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm hover:border-outline-variant/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6">
                {/* Order Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container disabled:opacity-30 disabled:hover:bg-transparent text-primary transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === slides.length - 1}
                    className="p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container disabled:opacity-30 disabled:hover:bg-transparent text-primary transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Slide Preview Thumbnail */}
                <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20 shrink-0">
                  {slide.src ? (
                    <Image
                      fill
                      sizes="128px"
                      className="object-cover"
                      alt={slide.alt || "Mockup thumbnail"}
                      src={slide.src}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Slide Metadata */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-sans font-bold tracking-wider bg-secondary-fixed/20 text-on-secondary-fixed px-2.5 py-0.5 rounded-full">
                      {slide.tag || "Mockup"}
                    </span>
                    <span className="text-xs text-outline font-mono">
                      #{index + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-primary line-clamp-1">
                    {slide.caption || "No caption headline"}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono mt-0.5 line-clamp-1 max-w-lg">
                    {slide.src}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(index)}
                  className="flex items-center gap-1.5 p-3 border border-outline-variant/50 hover:border-primary hover:bg-surface-container rounded-xl text-primary transition-all text-xs font-semibold"
                  title="Edit Slide"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="flex items-center gap-1.5 p-3 border border-error-container hover:bg-error-container text-error rounded-xl transition-all text-xs font-semibold"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Slide Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-surface rounded-2xl border border-outline-variant/30 max-w-2xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 text-outline hover:text-primary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-display font-bold text-primary mb-6 tracking-tighter">
              {editingIndex !== null ? `Edit Slide #${editingIndex + 1}` : "Add New Hero Mockup"}
            </h2>

            <form onSubmit={handleSaveModal} className="space-y-6">
              {/* Tag & Alt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline">
                    Tag Pill Label
                  </label>
                  <input
                    type="text"
                    required
                    value={modalSlide.tag || ""}
                    onChange={(e) => setModalSlide((prev) => ({ ...prev, tag: e.target.value }))}
                    className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                    placeholder="e.g. Featured Product UI"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline">
                    Image Alt Description
                  </label>
                  <input
                    type="text"
                    value={modalSlide.alt || ""}
                    onChange={(e) => setModalSlide((prev) => ({ ...prev, alt: e.target.value }))}
                    className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                    placeholder="e.g. Minimalist Tablet Web Layout Mockup"
                  />
                </div>
              </div>

              {/* Caption Headline */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest text-outline">
                  Caption Headline (Bottom Overlay)
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalSlide.caption || ""}
                  onChange={(e) => setModalSlide((prev) => ({ ...prev, caption: e.target.value }))}
                  className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 resize-none font-medium"
                  placeholder="e.g. Admin CMS Dashboard - Complete client control and image uploads"
                ></textarea>
              </div>

              {/* Image URL & File Upload */}
              <div className="border border-outline-variant/30 rounded-xl p-5 bg-surface-container-low/30 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline">
                    Mockup Image Source (URL or Upload)
                  </label>
                  <input
                    type="text"
                    required
                    value={modalSlide.src || ""}
                    onChange={(e) => setModalSlide((prev) => ({ ...prev, src: e.target.value }))}
                    className="border border-outline-variant rounded-xl px-4 py-3 bg-surface text-xs focus:border-primary focus:ring-0 font-mono"
                    placeholder="Paste image URL (e.g. https://... or /uploads/...)"
                  />
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-2 border border-outline border-dashed px-4 py-2.5 rounded-xl cursor-pointer hover:bg-surface-container transition-colors text-xs font-semibold uppercase tracking-wider text-primary">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? "Uploading..." : "Upload Local Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {uploadError && (
                    <span className="text-xs text-error font-semibold">{uploadError}</span>
                  )}
                  {modalSlide.src && (
                    <span className="text-xs text-on-surface-variant font-mono">
                      Image linked
                    </span>
                  )}
                </div>

                {/* Live Preview Card */}
                {modalSlide.src && (
                  <div className="mt-4 pt-4 border-t border-outline-variant/20">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-outline block mb-2">
                      Live Slide Preview
                    </span>
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low">
                      <Image
                        fill
                        sizes="600px"
                        className="object-cover"
                        alt={modalSlide.alt || "Preview"}
                        src={modalSlide.src}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent p-4 text-left z-20">
                        <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-secondary-fixed">
                          {modalSlide.tag || "Preview Tag"}
                        </span>
                        <h4 className="text-sm font-display font-bold text-background mt-1 line-clamp-1">
                          {modalSlide.caption || "Caption preview will display here"}
                        </h4>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-outline-variant/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary text-background px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-on-surface-variant transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Apply To List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
