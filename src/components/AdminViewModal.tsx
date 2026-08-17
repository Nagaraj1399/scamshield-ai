import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  X,
  Database,
  Trash2,
  Download,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  RefreshCw,
} from "lucide-react";

export interface HackathonLead {
  name: string;
  email: string;
  phone: string;
  date: string;
}

interface AdminViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminViewModal({ isOpen, onClose }: AdminViewModalProps) {
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [leads, setLeads] = useState<HackathonLead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const HARDCODED_PASSCODE = "ADMIN-2026";

  useEffect(() => {
    if (isOpen) {
      // Reload leads when opened
      loadLeads();

      // 1. Custom event listener for same-window updates
      const handleLeadsUpdated = () => {
        loadLeads();
      };
      window.addEventListener("hackathon_leads_updated", handleLeadsUpdated);

      // 2. Storage event listener for cross-tab updates
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "hackathon_leads") {
          loadLeads();
        }
      };
      window.addEventListener("storage", handleStorageChange);

      // 3. Periodic polling fallback (every 2 seconds while modal is open)
      const pollInterval = window.setInterval(() => {
        loadLeads();
      }, 2000);

      return () => {
        window.removeEventListener("hackathon_leads_updated", handleLeadsUpdated);
        window.removeEventListener("storage", handleStorageChange);
        window.clearInterval(pollInterval);
      };
    } else {
      // Reset sensitive view state on modal close
      setPasscode("");
      setIsUnlocked(false);
      setErrorMsg("");
      setSearchTerm("");
    }
  }, [isOpen]);

  const loadLeads = () => {
    try {
      const stored = localStorage.getItem("hackathon_leads");
      if (stored) {
        const parsed = JSON.parse(stored);
        setLeads(Array.isArray(parsed) ? parsed : []);
      } else {
        setLeads([]);
      }
    } catch {
      setLeads([]);
    }
  };

  if (!isOpen) return null;

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === HARDCODED_PASSCODE) {
      setIsUnlocked(true);
      setErrorMsg("");
      loadLeads();
    } else {
      setErrorMsg("Access Denied: Invalid Admin Passcode.");
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all stored waitlist leads?")) {
      localStorage.removeItem("hackathon_leads");
      setLeads([]);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `scamshield_leads_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLeads = leads.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.phone?.toLowerCase().includes(q) ||
      item.date?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="admin-view-modal-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-sans"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-cyan-500/40 bg-[#050811] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,242,254,0.25)] overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Top Cyber Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent shadow-[0_0_15px_#00F2FE]" />

        {/* Close Button */}
        <button
          id="close-admin-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-cyan-500/30 transition-colors cursor-pointer"
          title="Close Admin Panel"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2 shadow-[0_0_10px_rgba(0,242,254,0.2)]">
            <Lock className="h-3.5 w-3.5 text-[#00F2FE]" />
            <span>CONFIDENTIAL ADMIN CONSOLE</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <span>🔒 Closed Beta Waitlist Lead Viewer</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Access secure client submissions stored in local storage for hackathon demonstration.
          </p>
        </div>

        {/* SECURITY STATE: Passcode Prompt */}
        {!isUnlocked ? (
          <div className="py-8 max-w-md mx-auto w-full text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              <KeyRound className="h-8 w-8 text-[#00F2FE]" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-mono">Enter Admin Passcode</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the master hackathon passcode to view collected leads.
              </p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono uppercase text-cyan-300 font-semibold mb-1">
                  Passcode
                </label>
                <input
                  type="password"
                  id="admin-passcode-input"
                  required
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Enter passcode (e.g. ADMIN-2026)"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#080d1a] border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] font-mono shadow-inner"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                id="admin-unlock-btn"
                className="w-full py-3 px-4 rounded-xl bg-[#00F2FE] hover:bg-[#38f9d7] text-[#050811] font-bold text-xs uppercase font-mono tracking-wider shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="h-4 w-4" />
                <span>Verify & Unlock</span>
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED STATE: Dark Themed Table with Name, Email, Phone, Date */
          <div className="flex-1 flex flex-col min-h-0 space-y-4">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-[#00F2FE]" />
                  <span>Total Leads: {leads.length}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search leads..."
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-[#080d1a] border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Refresh */}
                <button
                  type="button"
                  onClick={loadLeads}
                  title="Reload Leads"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>

                {/* Export JSON */}
                <button
                  type="button"
                  onClick={handleExportJSON}
                  disabled={leads.length === 0}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 text-[#00F2FE] border border-cyan-500/40 hover:bg-cyan-900 text-xs font-mono flex items-center gap-1.5 disabled:opacity-40 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export JSON</span>
                </button>

                {/* Clear Leads */}
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={leads.length === 0}
                  className="px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-500/40 hover:bg-red-900/80 text-xs font-mono flex items-center gap-1.5 disabled:opacity-40 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-[#080d1a]">
              {filteredLeads.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-mono space-y-2">
                  <ShieldCheck className="h-8 w-8 mx-auto text-slate-600" />
                  <p>No waitlist applications found matching your filter.</p>
                  <p className="text-[10px] text-slate-600">Submit a form in the VIP Waitlist modal to generate entries.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead className="sticky top-0 bg-[#050811] border-b border-slate-800 text-[11px] font-mono text-cyan-300 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredLeads.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-900/60 transition-colors text-slate-300"
                      >
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-cyan-400" />
                          <span>{item.name || "N/A"}</span>
                        </td>
                        <td className="py-3 px-4 text-cyan-200">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {item.email || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {item.phone || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            {item.date || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
              <span>Local Storage Key: <code className="text-cyan-400">hackathon_leads</code></span>
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="text-slate-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Lock Console
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminViewModal;
