import React, { useState, useEffect } from "react";
import {
  Shield,
  MessageSquare,
  Link2,
  Brain,
  ShieldCheck,
  BookOpen,
  BarChart3,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  LayoutGrid,
  PhoneCall,
  Crosshair,
  Terminal,
} from "lucide-react";
import { cyberAudio } from "../utils/cyberAudio";
import { AudioSettings } from "../types";
import { AudioSettingsModal } from "./AudioSettingsModal";

export type ActiveTabType =
  | "hero"
  | "cyber_command"
  | "cybercrime"
  | "simulation"
  | "voice"
  | "sandbox"
  | "verification"
  | "recovery"
  | "playbook"
  | "stats"
  | "billing";

interface NavbarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  securityScore: number;
  audioEnabled?: boolean;
  setAudioEnabled?: (enabled: boolean) => void;
  isInActiveSimulation: boolean;
  currentPlan?: string;
}

export function Navbar({
  activeTab,
  setActiveTab,
  securityScore,
  isInActiveSimulation,
  currentPlan = "free",
}: NavbarProps) {
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => cyberAudio.getSettings());

  useEffect(() => {
    const unsub = cyberAudio.subscribe((s) => setAudioSettings(s));
    setAudioSettings(cyberAudio.getSettings());
    return () => unsub();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
          
          {/* Brand Logo & Tag */}
          <button
            onClick={() => setActiveTab("hero")}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 transition-colors group-hover:bg-sky-500/20 group-hover:border-sky-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm sm:text-base tracking-tight">
                  AntiScam <span className="text-sky-400 font-semibold">Shield</span>
                </span>
                <span className="hidden xl:inline-flex items-center rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/60 font-mono">
                  Enterprise SEC-OPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Threat Intelligence & Incident Response Platform
              </p>
            </div>
          </button>

          {/* Navigation Tabs Matching the 4 Departments & Features */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 overflow-x-auto max-w-[50vw] sm:max-w-none">
            {/* 1. Command HUD */}
            <button
              id="nav-tab-hero"
              onClick={() => setActiveTab("hero")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "hero"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 text-sky-400" />
              <span>Dashboard</span>
            </button>

            {/* 2. Real-Time Cyber Ops (Hacker & SOC) */}
            <button
              id="nav-tab-cyber-command"
              onClick={() => setActiveTab("cyber_command")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "cyber_command"
                  ? "bg-slate-800 text-sky-300 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Terminal className="h-3.5 w-3.5 text-sky-400" />
              <span>Adversary CLI & SOC</span>
            </button>

            {/* 3. Real Cyber Crime War Room */}
            <button
              id="nav-tab-cybercrime"
              onClick={() => setActiveTab("cybercrime")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "cybercrime"
                  ? "bg-rose-950/80 text-rose-200 shadow-sm border border-rose-800/60"
                  : "text-slate-400 hover:text-rose-300 hover:bg-slate-800/50"
              }`}
            >
              <Crosshair className="h-3.5 w-3.5 text-rose-400" />
              <span>Incident War Room</span>
              <span className="text-[9px] bg-rose-900/60 text-rose-300 px-1 py-0.2 rounded font-mono font-semibold">
                LIVE
              </span>
            </button>

            {/* 4. Threat Intel (Simulation Arena) */}
            <button
              id="nav-tab-simulation"
              onClick={() => setActiveTab("simulation")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "simulation"
                  ? "bg-slate-800 text-emerald-300 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span>Threat Intel</span>
              {isInActiveSimulation && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* 5. Live Voice Simulator */}
            <button
              id="nav-tab-voice"
              onClick={() => setActiveTab("voice")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "voice"
                  ? "bg-slate-800 text-sky-300 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <PhoneCall className="h-3.5 w-3.5 text-sky-400" />
              <span>Voice Defense</span>
            </button>

            {/* 6. Vulnerability (Sandbox) */}
            <button
              id="nav-tab-sandbox"
              onClick={() => setActiveTab("sandbox")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "sandbox"
                  ? "bg-slate-800 text-purple-300 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Link2 className="h-3.5 w-3.5 text-purple-400" />
              <span>Vuln Sandbox</span>
            </button>

            {/* 7. AI Verification */}
            <button
              id="nav-tab-verification"
              onClick={() => setActiveTab("verification")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "verification"
                  ? "bg-slate-800 text-indigo-300 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Brain className="h-3.5 w-3.5 text-indigo-400" />
              <span>Verification</span>
            </button>

            {/* 8. Incident Response (Recovery) */}
            <button
              id="nav-tab-recovery"
              onClick={() => setActiveTab("recovery")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "recovery"
                  ? "bg-slate-800 text-amber-300 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>Recovery</span>
            </button>

            {/* 9. SOC Playbook */}
            <button
              id="nav-tab-playbook"
              onClick={() => setActiveTab("playbook")}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "playbook"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
              <span>Playbook</span>
            </button>

            {/* 10. SOC Records */}
            <button
              id="nav-tab-stats"
              onClick={() => setActiveTab("stats")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "stats"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Telemetry</span>
            </button>

            {/* 11. Billing & Plans */}
            <button
              id="nav-tab-billing"
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                activeTab === "billing"
                  ? "bg-amber-950/70 text-amber-200 shadow-sm border border-amber-800/50"
                  : "text-slate-400 hover:text-amber-300 hover:bg-slate-800/50"
              }`}
            >
              <span>Plans</span>
            </button>
          </nav>

          {/* Right Tools (Score & Granular Audio Settings & Plan Pill) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="nav-plan-badge"
              onClick={() => setActiveTab("billing")}
              className="hidden lg:flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors font-mono text-xs"
            >
              <span className="text-[10px] text-slate-500 uppercase">Tier</span>
              <span className="font-semibold uppercase text-slate-200">{currentPlan}</span>
            </button>

            {/* Granular Audio Settings Trigger Button */}
            <button
              id="open-audio-settings-btn"
              onClick={() => setIsAudioModalOpen(true)}
              title="Open Audio Settings (Terminal clicks, Threat alerts, Voice calls)"
              className={`p-1.5 rounded-md border flex items-center gap-1.5 transition-colors ${
                audioSettings.masterEnabled
                  ? "bg-sky-500/10 text-sky-300 border-sky-500/30 hover:bg-sky-500/20"
                  : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300 hover:bg-slate-800"
              }`}
            >
              {audioSettings.masterEnabled ? (
                <Volume2 className="h-4 w-4 text-sky-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
              <Sliders className="h-3 w-3 text-slate-400 hidden sm:inline" />
            </button>

            <div className="flex items-center gap-2 rounded-md bg-slate-900 px-2.5 py-1 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-medium font-mono hidden sm:inline">
                Readiness
              </span>
              <span
                className={`font-mono text-xs font-semibold ${
                  securityScore >= 80
                    ? "text-emerald-400"
                    : securityScore >= 50
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {securityScore}/100
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />
    </>
  );
}

