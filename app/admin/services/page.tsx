"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

interface Capability {
  id: string;
  title: string;
  number: string;
  description: string;
  approach: string;
  deliverables: string[];
  icon: string;
}

interface ChecklistItem {
  feature: string;
  aaromi: string;
  templates: string;
}

interface ServicesData {
  capabilities: Capability[];
  standardChecklist: ChecklistItem[];
}

export default function AdminServices() {
  const [data, setData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"capabilities" | "checklist">("capabilities");

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;

    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Services updated successfully!");
      } else {
        alert("Failed to update services data.");
      }
    } catch (err) {
      alert("Error saving service details.");
    }
  };

  const handleCapabilityChange = (index: number, field: keyof Capability, value: any) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return null;
      const capabilities = [...prev.capabilities];
      capabilities[index] = { ...capabilities[index], [field]: value };
      return { ...prev, capabilities };
    });
  };

  const handleDeliverablesChange = (index: number, valueStr: string) => {
    // Deliverables are parsed from comma separated list
    const deliverables = valueStr.split(",").map(d => d.trim()).filter(Boolean);
    handleCapabilityChange(index, "deliverables", deliverables);
  };

  const handleChecklistChange = (index: number, field: keyof ChecklistItem, value: string) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return null;
      const checklist = [...prev.standardChecklist];
      checklist[index] = { ...checklist[index], [field]: value };
      return { ...prev, standardChecklist: checklist };
    });
  };

  if (loading) {
    return <div className="text-center py-12 font-sans text-on-surface-variant">Loading services data...</div>;
  }

  if (!data) {
    return <div className="text-center py-12 font-sans text-on-surface-variant">Failed to load services database.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary tracking-tighter">Edit Services</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-2">
            Configure your core capabilities, deliverables, and standard checklists.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest hover:bg-on-surface-variant transition-colors shadow-md"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant/20 font-sans">
        <button
          onClick={() => setActiveTab("capabilities")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 uppercase tracking-wider ${
            activeTab === "capabilities"
              ? "text-primary border-primary"
              : "text-on-surface-variant border-transparent hover:text-primary"
          }`}
        >
          Core Capabilities
        </button>
        <button
          onClick={() => setActiveTab("checklist")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 uppercase tracking-wider ${
            activeTab === "checklist"
              ? "text-primary border-primary"
              : "text-on-surface-variant border-transparent hover:text-primary"
          }`}
        >
          The Aaromi Standard Checklist
        </button>
      </div>

      {activeTab === "capabilities" ? (
        <div className="space-y-8 font-sans">
          {data.capabilities.map((cap, idx) => (
            <div 
              key={cap.id}
              className="bg-surface rounded-xl border border-outline-variant/30 p-8 shadow-sm space-y-6"
            >
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                <span className="text-lg font-display font-bold text-primary">Capability {cap.number}</span>
                <span className="text-xs font-mono text-outline">{cap.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline">Service Title</label>
                  <input
                    type="text"
                    value={cap.title}
                    onChange={(e) => handleCapabilityChange(idx, "title", e.target.value)}
                    className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                  />
                </div>

                {/* Icon identifier */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline">Icon Name</label>
                  <select
                    value={cap.icon}
                    onChange={(e) => handleCapabilityChange(idx, "icon", e.target.value)}
                    className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 cursor-pointer"
                  >
                    <option value="web">Web Layout (web)</option>
                    <option value="brush">Design Brush (brush)</option>
                    <option value="code">Development Code (code)</option>
                    <option value="storefront">E-commerce Store (storefront)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest text-outline">Service Description</label>
                <textarea
                  rows={2}
                  value={cap.description}
                  onChange={(e) => handleCapabilityChange(idx, "description", e.target.value)}
                  className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Approach */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline">Methodological Approach</label>
                  <input
                    type="text"
                    value={cap.approach}
                    onChange={(e) => handleCapabilityChange(idx, "approach", e.target.value)}
                    className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                  />
                </div>

                {/* Deliverables */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline">
                    Deliverables (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={cap.deliverables.join(", ")}
                    onChange={(e) => handleDeliverablesChange(idx, e.target.value)}
                    className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0"
                    placeholder="e.g. Wireframes, Mockups, Prototypes"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container/50">
                <th className="p-4 text-xs uppercase font-bold tracking-widest text-primary w-[25%]">Feature Name</th>
                <th className="p-4 text-xs uppercase font-bold tracking-widest text-secondary-fixed-dim w-[40%]">Aaromi Standard Value</th>
                <th className="p-4 text-xs uppercase font-bold tracking-widest text-on-surface-variant w-[35%]">Generic Template Value</th>
              </tr>
            </thead>
            <tbody>
              {data.standardChecklist.map((item, idx) => (
                <tr key={idx} className="border-b border-outline-variant/20">
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.feature}
                      onChange={(e) => handleChecklistChange(idx, "feature", e.target.value)}
                      className="w-full border-0 border-b border-transparent focus:border-primary bg-transparent text-sm font-bold text-primary py-1 focus:ring-0"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.aaromi}
                      onChange={(e) => handleChecklistChange(idx, "aaromi", e.target.value)}
                      className="w-full border-0 border-b border-transparent focus:border-primary bg-transparent text-sm py-1 focus:ring-0 text-on-surface font-semibold"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.templates}
                      onChange={(e) => handleChecklistChange(idx, "templates", e.target.value)}
                      className="w-full border-0 border-b border-transparent focus:border-primary bg-transparent text-sm py-1 focus:ring-0 text-on-surface-variant"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
