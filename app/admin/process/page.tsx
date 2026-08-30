"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface ProcessStep {
  number: string;
  title: string;
  objectives: string;
  activities: string[];
  deliverables: string[];
}

export default function AdminProcess() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/process")
      .then((res) => res.json())
      .then((data) => {
        setSteps(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStepChange = (index: number, field: keyof ProcessStep, value: any) => {
    setSteps((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleListChange = (index: number, field: "activities" | "deliverables", valueStr: string) => {
    const list = valueStr.split(",").map(item => item.trim()).filter(Boolean);
    handleStepChange(index, field, list);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/process", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(steps),
      });

      if (res.ok) {
        alert("Process timeline updated successfully!");
      } else {
        alert("Failed to save changes to timeline.");
      }
    } catch (e) {
      alert("Error occurred while saving process data.");
    }
  };

  if (loading) {
    return <div className="text-center py-12 font-sans text-on-surface-variant">Loading process workflow...</div>;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary tracking-tighter">Edit Process Timeline</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-2">
            Configure objectives, activities, and deliverables for each step of your timeline.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest hover:bg-on-surface-variant transition-colors shadow-md"
        >
          <Save className="w-4 h-4" />
          Save Timeline
        </button>
      </div>

      <div className="space-y-8">
        {steps.map((step, idx) => (
          <div 
            key={step.number}
            className="bg-surface rounded-xl border border-outline-variant/30 p-8 shadow-sm space-y-6"
          >
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
              <span className="text-lg font-display font-bold text-primary">Step {step.number}</span>
              <input
                type="text"
                value={step.title}
                onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                className="border-0 border-b border-transparent focus:border-primary focus:ring-0 bg-transparent text-lg font-bold text-right p-0 max-w-xs text-primary"
                placeholder="Step Title"
              />
            </div>

            {/* Objectives */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold tracking-widest text-outline">Objectives</label>
              <textarea
                rows={2}
                value={step.objectives}
                onChange={(e) => handleStepChange(idx, "objectives", e.target.value)}
                className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Activities */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest text-outline font-bold">
                  Activities (Comma separated)
                </label>
                <textarea
                  rows={3}
                  value={step.activities.join(", ")}
                  onChange={(e) => handleListChange(idx, "activities", e.target.value)}
                  className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 resize-none"
                  placeholder="e.g. Market Research, Audience Analysis"
                ></textarea>
              </div>

              {/* Deliverables */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest text-outline font-bold">
                  Deliverables (Comma separated)
                </label>
                <textarea
                  rows={3}
                  value={step.deliverables.join(", ")}
                  onChange={(e) => handleListChange(idx, "deliverables", e.target.value)}
                  className="border border-outline-variant rounded-xl px-4 py-3 bg-transparent text-sm focus:border-primary focus:ring-0 resize-none"
                  placeholder="e.g. Sitemap, Lo-Fi Wires"
                ></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
