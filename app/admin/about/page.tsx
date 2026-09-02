"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Image as ImageIcon,
  CheckSquare, 
  Square
} from "lucide-react";

interface PhilosophyItem {
  title: string;
  description: string;
}

interface ValueItem {
  name: string;
  featured: boolean;
}

interface AboutData {
  intro: string;
  studioDescription: string;
  philosophy: PhilosophyItem[];
  values: ValueItem[];
  imageUrl: string;
}

export default function AdminAbout() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [newValueName, setNewValueName] = useState("");

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/about");
      if (res.ok) {
        const json = await res.json();
        setData({
          intro: json.intro || "",
          studioDescription: json.studioDescription || "",
          philosophy: json.philosophy || [],
          values: json.values || [],
          imageUrl: json.imageUrl || "",
        });
      } else {
        setError("Failed to fetch About page data.");
      }
    } catch (err) {
      setError("Network error fetching About data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

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

      const result = await res.json();

      if (res.ok) {
        setData((prev) => (prev ? { ...prev, imageUrl: result.url } : null));
      } else {
        setUploadError(result.error || "Image upload failed.");
      }
    } catch (err) {
      setUploadError("Network error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const handlePhilosophyChange = (
    index: number,
    field: keyof PhilosophyItem,
    value: string
  ) => {
    setData((prev) => {
      if (!prev) return null;
      const updated = [...prev.philosophy];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, philosophy: updated };
    });
  };

  const handleAddPhilosophy = () => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        philosophy: [
          ...prev.philosophy,
          { title: "New Principle", description: "Principle description here..." },
        ],
      };
    });
  };

  const handleDeletePhilosophy = (index: number) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        philosophy: prev.philosophy.filter((_, i) => i !== index),
      };
    });
  };

  const handleToggleValueFeatured = (index: number) => {
    setData((prev) => {
      if (!prev) return null;
      const updated = [...prev.values];
      updated[index] = { ...updated[index], featured: !updated[index].featured };
      return { ...prev, values: updated };
    });
  };

  const handleDeleteValue = (index: number) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        values: prev.values.filter((_, i) => i !== index),
      };
    });
  };

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValueName.trim()) return;
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        values: [...prev.values, { name: newValueName.trim(), featured: false }],
      };
    });
    setNewValueName("");
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const result = await res.json();
        setError(result.error || "Failed to save About page updates.");
      }
    } catch (err) {
      setError("Network error saving About page.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 font-sans text-on-surface-variant">
        Loading About page editor...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 font-sans text-error">
        Failed to load About page data.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary tracking-tighter flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Edit About Page
          </h1>
          <p className="font-sans text-sm text-on-surface-variant mt-2">
            Update studio intro headlines, narrative story, workspace photography, philosophy pillars, and core values.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest hover:bg-on-surface-variant transition-colors shadow-md disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 bg-secondary-fixed/20 border border-secondary-fixed text-primary rounded-xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim" />
          About page updated successfully! Changes are live at /about.
        </div>
      )}

      {error && (
        <div className="p-4 bg-error-container text-error rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Section 1: Intro & Story */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-display font-bold text-primary border-b border-outline-variant/20 pb-4">
          1. Hero &amp; Studio Story
        </h2>

        {/* Intro Headline */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-bold tracking-widest text-outline">
            Hero Headline (Large Display Text)
          </label>
          <textarea
            rows={2}
            value={data.intro}
            onChange={(e) => setData({ ...data, intro: e.target.value })}
            className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 resize-none font-display font-bold text-primary text-lg"
            placeholder="e.g. We believe the best digital experiences feel obvious."
          ></textarea>
        </div>

        {/* Studio Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-bold tracking-widest text-outline">
            The Studio Narrative (Paragraph)
          </label>
          <textarea
            rows={4}
            value={data.studioDescription}
            onChange={(e) => setData({ ...data, studioDescription: e.target.value })}
            className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 leading-relaxed"
            placeholder="Describe the studio's origin, ethos, and mission..."
          ></textarea>
        </div>

        {/* Workspace Image */}
        <div className="border border-outline-variant/30 rounded-xl p-6 bg-surface-container-low/30 space-y-4">
          <label className="text-xs uppercase font-bold tracking-widest text-outline block">
            Studio Workspace Image
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Thumbnail Preview */}
            <div className="relative w-48 h-32 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30 shrink-0">
              {data.imageUrl ? (
                <Image
                  fill
                  sizes="200px"
                  className="object-cover"
                  alt="Workspace image preview"
                  src={data.imageUrl}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-outline">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-3">
              <input
                type="text"
                value={data.imageUrl}
                onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
                className="w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface text-xs font-mono focus:border-primary focus:ring-0"
                placeholder="Image URL (or upload local file below)"
              />

              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 border border-outline border-dashed px-4 py-2 rounded-xl cursor-pointer hover:bg-surface-container transition-colors text-xs font-semibold uppercase tracking-wider text-primary">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? "Uploading..." : "Upload Workspace Photo"}</span>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Philosophy Pillars */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h2 className="text-xl font-display font-bold text-primary">
            2. Philosophy Pillars
          </h2>
          <button
            type="button"
            onClick={handleAddPhilosophy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-xs font-bold uppercase tracking-wider text-primary transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Pillar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.philosophy.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-surface-container-low/40 rounded-xl border border-outline-variant/30 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-outline font-bold">
                    Pillar #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePhilosophy(idx)}
                    className="text-outline hover:text-error transition-colors p-1"
                    title="Delete Pillar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handlePhilosophyChange(idx, "title", e.target.value)}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-surface text-sm font-bold text-primary focus:border-primary focus:ring-0"
                  placeholder="Pillar Title"
                />

                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) =>
                    handlePhilosophyChange(idx, "description", e.target.value)
                  }
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-surface text-xs text-on-surface-variant focus:border-primary focus:ring-0 resize-none leading-relaxed"
                  placeholder="Pillar description..."
                ></textarea>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Core Values */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-display font-bold text-primary border-b border-outline-variant/20 pb-4">
          3. Core Values
        </h2>
        <p className="text-sm text-on-surface-variant">
          Click the badge or checkbox to toggle the highlighted Electric Lime accent on any value tag.
        </p>

        {/* Existing Values List */}
        <div className="flex flex-wrap gap-3">
          {data.values.map((val, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 pl-4 pr-2 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all ${
                val.featured
                  ? "bg-secondary-fixed text-primary border-transparent shadow-sm"
                  : "bg-surface text-primary border-outline-variant"
              }`}
            >
              <span>{val.name}</span>
              <button
                type="button"
                onClick={() => handleToggleValueFeatured(idx)}
                className="p-1 rounded-full hover:bg-black/10 transition-colors"
                title={val.featured ? "Remove Highlight" : "Highlight Value (Electric Lime)"}
              >
                {val.featured ? (
                  <CheckSquare className="w-3.5 h-3.5" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-outline" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteValue(idx)}
                className="p-1 rounded-full hover:bg-error-container hover:text-error transition-colors text-outline"
                title="Delete Value"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Value Form */}
        <form onSubmit={handleAddValue} className="flex items-center gap-3 max-w-md pt-4">
          <input
            type="text"
            value={newValueName}
            onChange={(e) => setNewValueName(e.target.value)}
            className="flex-1 border border-outline-variant rounded-xl px-4 py-2.5 bg-transparent text-xs uppercase tracking-wider focus:border-primary focus:ring-0"
            placeholder="Add new value (e.g. Authenticity)"
          />
          <button
            type="submit"
            className="bg-primary text-background px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-on-surface-variant transition-colors shrink-0"
          >
            Add Value
          </button>
        </form>
      </div>
    </div>
  );
}
