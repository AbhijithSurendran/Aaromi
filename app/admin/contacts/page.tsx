"use client";

import { useEffect, useState } from "react";
import { Mail, Calendar, User, Building, DollarSign, Clock, MessageSquare, Search } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  company: string;
  project_types: string[];
  budget: string;
  timeline: string;
  details: string;
  date: string;
}

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredSubmissions = submissions.filter((sub) => {
    const term = search.toLowerCase();
    return (
      sub.name.toLowerCase().includes(term) ||
      sub.email.toLowerCase().includes(term) ||
      sub.company.toLowerCase().includes(term) ||
      sub.details.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return <div className="text-center py-12 font-sans text-on-surface-variant">Loading submissions database...</div>;
  }

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-4xl font-display font-bold text-primary tracking-tighter">Form Submissions</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2">
          Review and audit all project project request inquiries submitted through your contact form.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Submissions List */}
        <div className="lg:col-span-6 space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, company, content..."
              className="w-full border border-outline-variant/60 rounded-xl pl-11 pr-4 py-3 bg-surface text-sm focus:border-primary focus:ring-0"
            />
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {filteredSubmissions.length === 0 ? (
              <div className="bg-surface rounded-xl border border-outline-variant/30 p-8 text-center text-on-surface-variant text-sm">
                No submissions match your query.
              </div>
            ) : (
              filteredSubmissions.map((sub) => {
                const isSelected = selectedSub?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className={`w-full text-left p-5 rounded-xl border transition-all flex flex-col gap-3 ${
                      isSelected 
                        ? "bg-secondary-fixed/5 border-secondary shadow-sm" 
                        : "bg-surface border-outline-variant/20 hover:border-outline-variant/50"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <div className="font-bold text-sm text-primary flex items-center gap-1.5">
                          {sub.name}
                        </div>
                        <div className="text-xs text-on-surface-variant mt-1">{sub.email}</div>
                      </div>
                      <div className="text-[10px] text-outline flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(sub.date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {sub.project_types.map((type) => (
                        <span 
                          key={type}
                          className="bg-surface-container text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detailed View */}
        <div className="lg:col-span-6 bg-surface border border-outline-variant/30 rounded-xl p-8 shadow-sm h-full min-h-[50vh]">
          {selectedSub ? (
            <div className="space-y-8">
              <div className="border-b border-outline-variant/20 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-display font-bold text-primary">{selectedSub.name}</h2>
                  <a 
                    href={`mailto:${selectedSub.email}`}
                    className="text-xs font-semibold text-secondary-fixed-dim hover:text-primary transition-colors mt-1 block"
                  >
                    {selectedSub.email}
                  </a>
                </div>
                <div className="text-xs text-outline font-semibold">
                  {new Date(selectedSub.date).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-surface-container rounded-lg">
                    <Building className="w-4 h-4 text-outline" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-outline">Company</div>
                    <div className="text-sm font-semibold text-primary">{selectedSub.company || "N/A"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-surface-container rounded-lg">
                    <DollarSign className="w-4 h-4 text-outline" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-outline">Budget Range</div>
                    <div className="text-sm font-semibold text-primary">{selectedSub.budget || "Not Specified"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-surface-container rounded-lg">
                    <Clock className="w-4 h-4 text-outline" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-outline">Timeline</div>
                    <div className="text-sm font-semibold text-primary">{selectedSub.timeline || "Not Specified"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-surface-container rounded-lg">
                    <Mail className="w-4 h-4 text-outline" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-outline">Project Types</div>
                    <div className="text-xs font-bold text-primary flex gap-1.5 flex-wrap mt-0.5">
                      {selectedSub.project_types.length === 0 
                        ? "None specified" 
                        : selectedSub.project_types.map((type) => (
                            <span key={type} className="bg-secondary-fixed/20 text-secondary-fixed-dim px-2 py-0.5 rounded-full uppercase tracking-wider text-[9px]">
                              {type}
                            </span>
                          ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-3 pt-6 border-t border-outline-variant/20">
                <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-outline">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Project Description</span>
                </div>
                <div className="p-6 bg-surface-container-low rounded-xl text-sm leading-relaxed text-on-surface-variant font-sans whitespace-pre-wrap">
                  {selectedSub.details}
                </div>
              </div>

              {/* Action reply button */}
              <a 
                href={`mailto:${selectedSub.email}?subject=Re: Project inquiry from Aaromi Studio`}
                className="w-full bg-primary text-background font-sans font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-on-surface-variant transition-colors flex items-center justify-center gap-2"
              >
                Reply via Email ↗
              </a>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant py-12">
              <Mail className="w-12 h-12 text-outline-variant mb-4" />
              <h3 className="text-lg font-bold text-primary mb-2">No submission selected</h3>
              <p className="text-sm font-sans max-w-xs leading-relaxed">
                Select an inquiry from the left sidebar to view budget range, timeline, company, and message details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
