import React, { useState } from "react";
import {
  Shield,
  MessageSquare,
  Link2,
  Brain,
  ShieldCheck,
  Search,
  AlertTriangle,
  Terminal,
  Activity,
  PhoneCall,
  Siren,
  Award,
  FileText,
  Radar,
  ChevronRight,
  ArrowRight,
  Crosshair,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { HolographicRadarChart } from "./HolographicRadarChart";
import { ActiveTabType } from "./Navbar";

interface AntiScamShieldHeroProps {
  onNavigateTab: (tab: ActiveTabType) => void;
  onQuickScan: (text: string, type: "url" | "content") => void;
}

export function AntiScamShieldHero({ onNavigateTab, onQuickScan }: AntiScamShieldHeroProps) {
  const [quickInput, setQuickInput] = useState("");
  const [activeDeptTab, setActiveDeptTab] = useState<"all" | "intel" | "incident" | "vuln" | "soc">("all");

  const handleRunQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    const isUrl =
      /^https?:\/\//i.test(quickInput.trim()) ||
      /\.(com|in|org|net|cc|xyz|top|site|app|gov|io)(\/|$)/i.test(quickInput.trim());
    if (isUrl) {
      onQuickScan(quickInput.trim(), "url");
      onNavigateTab("sandbox");
    } else {
      onQuickScan(quickInput.trim(), "content");
      onNavigateTab("verification");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] px-3 sm:px-6 lg:px-8 py-6 flex flex-col justify-between max-w-7xl mx-auto w-full">
      
      {/* Top Main Command Bar */}
      <div className="relative z-10 w-full mb-8">
        
        {/* Top Header & Search Area */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-1 text-xs font-medium text-slate-300 border border-slate-800 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Zero-Trust Threat Defense System</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">4 Operational Sectors</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-100 tracking-tight">
            Threat Intelligence & <span className="text-sky-400">Incident Response</span>
          </h1>

          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Protecting individuals and organizations against digital arrest extortion, voice clone fraud, algorithmic phishing, and cyber financial crime.
          </p>

          {/* Quick Omnisearch Input */}
          <form onSubmit={handleRunQuickScan} className="relative mt-6 max-w-2xl mx-auto">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              id="hero-omni-input"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Paste suspicious URL, SMS text, UPI handle, or fake police notice to analyze..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-28 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 disabled:hover:bg-sky-600"
            >
              Analyze
            </button>
          </form>

          {/* Department Quick Filter Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            <button
              onClick={() => setActiveDeptTab("all")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeDeptTab === "all"
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              All Sectors (4)
            </button>
            <button
              onClick={() => setActiveDeptTab("intel")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeDeptTab === "intel"
                  ? "bg-slate-800 text-emerald-300 border border-slate-700"
                  : "bg-slate-900/60 text-slate-400 hover:text-emerald-300 border border-slate-800"
              }`}
            >
              <Terminal className="h-3 w-3 text-emerald-400" />
              Threat Intel
            </button>
            <button
              onClick={() => setActiveDeptTab("incident")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeDeptTab === "incident"
                  ? "bg-slate-800 text-rose-300 border border-slate-700"
                  : "bg-slate-900/60 text-slate-400 hover:text-rose-300 border border-slate-800"
              }`}
            >
              <Siren className="h-3 w-3 text-rose-400" />
              Incident Response
            </button>
            <button
              onClick={() => setActiveDeptTab("vuln")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeDeptTab === "vuln"
                  ? "bg-slate-800 text-purple-300 border border-slate-700"
                  : "bg-slate-900/60 text-slate-400 hover:text-purple-300 border border-slate-800"
              }`}
            >
              <Radar className="h-3 w-3 text-purple-400" />
              Vulnerability Mgmt
            </button>
            <button
              onClick={() => setActiveDeptTab("soc")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeDeptTab === "soc"
                  ? "bg-slate-800 text-sky-300 border border-slate-700"
                  : "bg-slate-900/60 text-slate-400 hover:text-sky-300 border border-slate-800"
              }`}
            >
              <Activity className="h-3 w-3 text-sky-400" />
              Security Operations
            </button>
          </div>
        </div>

        {/* Dual Primary Operational Cards: Red/Blue Team & War Room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Card 1: Adversary CLI & SOC Matrix */}
          <div
            onClick={() => onNavigateTab("cyber_command")}
            className="cursor-pointer rounded-xl border border-slate-800 bg-[#0b1120] p-5 hover:border-slate-700 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-sky-400 uppercase tracking-wider">
                      Red & Blue Team Simulation
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                      Adversary Terminal & Enterprise SOC Matrix
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Interactive CLI
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test offensive scam tactics (Phishing generator, C2 mock shells, AI voice clone) and run enterprise SOC defensive countermeasures.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500 font-mono">Dual Cyber Simulator</span>
              <span className="text-xs font-medium text-sky-400 group-hover:text-sky-300 flex items-center gap-1">
                <span>Launch Console</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>

          {/* Card 2: Incident War Room */}
          <div
            onClick={() => onNavigateTab("cybercrime")}
            className="cursor-pointer rounded-xl border border-slate-800 bg-[#0b1120] p-5 hover:border-slate-700 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <Crosshair className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-rose-400 uppercase tracking-wider">
                      Live Incident Docket
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-rose-300 transition-colors">
                      Cyber Crime War Room & Threat Radar
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60">
                  Defcon 2
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor live fraud syndicates, track active police complaints, trace frozen mule bank accounts, and review dark web leak exposures.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500 font-mono">₹18.42 Cr Golden Hour Recoveries</span>
              <span className="text-xs font-medium text-rose-400 group-hover:text-rose-300 flex items-center gap-1">
                <span>Open War Room</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>

        </div>

        {/* 4 DEPARTMENT SECTORS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* 1. THREAT INTELLIGENCE */}
          {(activeDeptTab === "all" || activeDeptTab === "intel") && (
            <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Sector 01</span>
                      <h3 className="text-sm font-semibold text-slate-100">Threat Intelligence</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    MITRE ATT&CK Sync
                  </span>
                </div>

                <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3 mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-200">Active Threat Vector</span>
                    <span className="text-[10px] font-mono text-slate-500">T1566 Phishing / T1534 Extortion</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Digital arrest intimidation & voice clone fraud attempting unauthorized UPI transactions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    id="intel-launch-arena-btn"
                    onClick={() => onNavigateTab("simulation")}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors group/btn"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium text-xs mb-0.5">
                      <span>Combat Arena</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-slate-300" />
                    </div>
                    <p className="text-[11px] text-slate-500">Practice defending against 9 live scam patterns</p>
                  </button>

                  <button
                    id="intel-launch-voice-btn"
                    onClick={() => onNavigateTab("voice")}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors group/btn"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium text-xs mb-0.5">
                      <span>Voice Simulator</span>
                      <PhoneCall className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-slate-300" />
                    </div>
                    <p className="text-[11px] text-slate-500">Simulate and detect high-pressure calls</p>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">9 Interactive Scenarios</span>
                <button
                  onClick={() => onNavigateTab("simulation")}
                  className="font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <span>Launch Arena</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 2. INCIDENT RESPONSE */}
          {(activeDeptTab === "all" || activeDeptTab === "incident") && (
            <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <Siren className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">Sector 02</span>
                      <h3 className="text-sm font-semibold text-slate-100">Incident Response</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/60">
                    Emergency Ready
                  </span>
                </div>

                <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-xs text-slate-200 block">Golden-Hour Containment Protocol</span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Freeze compromised UPI and bank accounts within 60 minutes to stop ledger dispersal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    id="incident-launch-recovery-btn"
                    onClick={() => onNavigateTab("recovery")}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors group/btn"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium text-xs mb-0.5">
                      <span>Account Freeze</span>
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-slate-300" />
                    </div>
                    <p className="text-[11px] text-slate-500">Step-by-step 1930 Helpline guide</p>
                  </button>

                  <button
                    id="incident-launch-fir-btn"
                    onClick={() => onNavigateTab("recovery")}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors group/btn"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium text-xs mb-0.5">
                      <span>Generate Police FIR</span>
                      <FileText className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-slate-300" />
                    </div>
                    <p className="text-[11px] text-slate-500">Automated cyber complaint draft</p>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">Helpline: 1930 / cybercrime.gov.in</span>
                <button
                  onClick={() => onNavigateTab("recovery")}
                  className="font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <span>Execute Playbook</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 3. VULNERABILITY MANAGEMENT */}
          {(activeDeptTab === "all" || activeDeptTab === "vuln") && (
            <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Radar className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">Sector 03</span>
                      <h3 className="text-sm font-semibold text-slate-100">Vulnerability Management</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Heuristic Analysis
                  </span>
                </div>

                <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5 mb-3 flex flex-col items-center">
                  <HolographicRadarChart score={88} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    id="vuln-launch-sandbox-btn"
                    onClick={() => onNavigateTab("sandbox")}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors group/btn"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium text-xs mb-0.5">
                      <span>Phishing Sandbox</span>
                      <Link2 className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-slate-300" />
                    </div>
                    <p className="text-[11px] text-slate-500">Analyze spoofed URLs & domain certificates</p>
                  </button>

                  <button
                    id="vuln-launch-verification-btn"
                    onClick={() => onNavigateTab("verification")}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors group/btn"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium text-xs mb-0.5">
                      <span>AI Verification</span>
                      <Brain className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-slate-300" />
                    </div>
                    <p className="text-[11px] text-slate-500">Authenticate notices and arrest warrants</p>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">Continuous Risk Assessment</span>
                <button
                  onClick={() => onNavigateTab("sandbox")}
                  className="font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <span>Open Sandbox</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 4. SECURITY OPERATIONS (SOC) */}
          {(activeDeptTab === "all" || activeDeptTab === "soc") && (
            <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">Sector 04</span>
                      <h3 className="text-sm font-semibold text-slate-100">Security Operations</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    SOC Grid Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Reflex</span>
                    <span className="text-base sm:text-lg font-bold text-slate-100 font-mono">100%</span>
                  </div>
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Mitigations</span>
                    <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">14 Active</span>
                  </div>
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Simulations</span>
                    <span className="text-base sm:text-lg font-bold text-sky-400 font-mono">9 Armed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    id="soc-launch-playbooks-btn"
                    onClick={() => onNavigateTab("playbook")}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors group/btn"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium text-xs mb-0.5">
                      <span>Defense Playbooks</span>
                      <FileText className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-slate-300" />
                    </div>
                    <p className="text-[11px] text-slate-500">Standard operating procedures & checklists</p>
                  </button>

                  <button
                    id="soc-launch-records-btn"
                    onClick={() => onNavigateTab("stats")}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors group/btn"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium text-xs mb-0.5">
                      <span>Telemetry & Badges</span>
                      <Award className="h-3.5 w-3.5 text-slate-500 group-hover/btn:text-slate-300" />
                    </div>
                    <p className="text-[11px] text-slate-500">Track readiness score and verification history</p>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">SOC Telemetry Stream</span>
                <button
                  onClick={() => onNavigateTab("stats")}
                  className="font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <span>View Telemetry</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Clean Enterprise Footer */}
      <footer className="relative z-20 w-full pt-6 pb-2 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>AntiScam Shield Security Platform</span>
          </div>

          <div className="text-[11px] text-slate-500">
            For authorized defensive simulation & cyber awareness training
          </div>
        </div>
      </footer>

    </div>
  );
}
