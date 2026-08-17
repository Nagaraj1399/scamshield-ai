import React, { useState } from "react";
import {
  Shield,
  Zap,
  Check,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  Activity,
  Terminal,
  Cpu,
  Radio,
  FileText,
  BadgeCheck,
  Flame,
  Globe,
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  BillingAccountState,
  PlanTierId,
  PaymentTransaction,
} from "../types";
import { PaywallModal } from "./PaywallModal";

interface PricingBillingHubProps {
  billingState: BillingAccountState;
  onUpgradePlan: (planId: PlanTierId, billingCycle: "monthly" | "annual") => void;
  onUnlockProject: (projectId: string) => void;
  onRecordTransaction: (transaction: PaymentTransaction) => void;
  onResetUsageLogs?: () => void;
}

interface TierCardInfo {
  id: "free" | "pro" | "enterprise";
  title: "Starter" | "Pro" | "Enterprise";
  subtitle: string;
  badge: string;
  badgeColor: string;
  isFeatured?: boolean;
  features: string[];
  specs: { label: string; value: string }[];
  borderClass: string;
  glowClass: string;
  btnGradient: string;
}

const TIERS: TierCardInfo[] = [
  {
    id: "free",
    title: "Starter",
    subtitle: "Essential threat awareness training for individuals and casual users.",
    badge: "STARTER TIER",
    badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
    features: [
      "AI Threat Simulation rounds",
      "Live Voice Adversary calls",
      "Phishing Sandbox deep scans",
      "Standard Gemini response model",
      "Basic Defense Playbook access",
      "Community Incident Support",
    ],
    specs: [
      { label: "AI Scenarios", value: "Standard" },
      { label: "Voice Radar", value: "Enabled" },
      { label: "FIR Generator", value: "Included" },
    ],
    borderClass: "border-slate-800",
    glowClass: "shadow-[0_0_20px_rgba(30,41,59,0.5)]",
    btnGradient: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600",
  },
  {
    id: "pro",
    title: "Pro",
    subtitle: "Unlimited high-fidelity adversary simulations with priority AI roleplay & forensic auditing.",
    badge: "MOST POPULAR",
    badgeColor: "bg-cyan-950 text-[#00F2FE] border-cyan-500/50 shadow-[0_0_12px_rgba(0,242,254,0.3)]",
    isFeatured: true,
    features: [
      "Unlimited AI Threat Simulations",
      "Unlimited Voice Deepfake calls & audio synthesis",
      "Unlimited URL Sandbox & QR Deobfuscation",
      "Priority Gemini 2.5 Flash Adversary AI",
      "Instant 1930 FIR & Police Notice Generator",
      "Downloadable Forensic Audit Certificates",
      "Custom Scam Prompt Injection & Zero-Day Builder",
    ],
    specs: [
      { label: "AI Scenarios", value: "Unlimited" },
      { label: "Adversary AI", value: "Priority Gemini" },
      { label: "Zero-Day Lab", value: "Full Access" },
    ],
    borderClass: "border-cyan-400/80",
    glowClass: "shadow-[0_0_35px_rgba(0,242,254,0.25)]",
    btnGradient: "bg-[#00F2FE] hover:bg-[#38f9d7] text-[#050811] shadow-[0_0_20px_rgba(0,242,254,0.4)]",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    subtitle: "Institutional cyber defense command center for organizations, banks, and SOC security teams.",
    badge: "DEPARTMENTAL COMMAND",
    badgeColor: "bg-purple-950 text-purple-300 border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]",
    features: [
      "Everything in Pro Defender plan",
      "25 Organization Team Seats / Multi-User Roles",
      "MITRE ATT&CK Enterprise Matrix heatmaps",
      "Custom threat actor persona fine-tuning",
      "Automated Employee Phishing Stress-Tests",
      "Dedicated SOC Dispatch & Emergency API Webhooks",
      "24/7 Priority Forensic Specialist Support",
    ],
    specs: [
      { label: "Team Seats", value: "25 Operators" },
      { label: "MITRE Matrix", value: "Heatmaps" },
      { label: "SOC Dispatch", value: "Webhooks" },
    ],
    borderClass: "border-purple-500/60",
    glowClass: "shadow-[0_0_35px_rgba(168,85,247,0.2)]",
    btnGradient: "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]",
  },
];

const SPECIALIZED_MODULES = [
  {
    id: "voice-radar",
    name: "Deepfake Voice Telephony Matrix",
    tag: "VOICE DEFENSE",
    desc: "Real-time acoustic analysis, pitch jitter variance detection, and spoofed telecom origin tracking.",
    specs: ["Sub-80ms Latency", "Neural Frequency Check", "Telecom CDR Spoof Scan"],
  },
  {
    id: "zeroday-lab",
    name: "Zero-Day Prompt Injection & Jailbreak Lab",
    tag: "RED TEAM",
    desc: "Simulate advanced linguistic evasion, token smuggling, and multi-turn social engineering traps.",
    specs: ["Custom Vector Injections", "Automated Payloads", "MITRE T1566 Alignment"],
  },
  {
    id: "fir-generator",
    name: "Automated 1930 Indian Cyber Crime FIR Engine",
    tag: "LEGAL DISPATCH",
    desc: "Format verifiable legal notices, transaction freeze requests, and digital evidence chains.",
    specs: ["IT Act Sec 66D Formatted", "SHA-256 Timestamps", "Instant PDF/Print Export"],
  },
  {
    id: "soc-terminal",
    name: "Adversary CLI & Interactive Terminal",
    tag: "SOC RUNBOOK",
    desc: "Command-line interface with interactive cyber drills, memory forensics, and IOC extraction.",
    specs: ["Interactive Shell", "Live Threat Feeds", "Real-time Telemetry"],
  },
];

export function PricingBillingHub({
  billingState,
  onUpgradePlan,
  onUnlockProject,
  onRecordTransaction,
  onResetUsageLogs,
}: PricingBillingHubProps) {
  const [showVipModal, setShowVipModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"tiers" | "modules" | "telemetry">("tiers");

  const isProUnlocked = billingState.currentPlan === "pro" || billingState.currentPlan === "enterprise";

  const handleOpenWaitlist = () => {
    setShowVipModal(true);
  };

  const handleUpgradeSuccess = () => {
    // Elevate the user to the Pro Cyber Defender plan
    onUpgradePlan("pro", "monthly");
  };

  return (
    <div
      id="pricing-billing-hub"
      className="min-h-screen bg-[#050811] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden"
    >
      {/* Background Cyber Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* 1. Header */}
        <div className="text-center sm:text-left space-y-2 border-b border-slate-800/80 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2 shadow-[0_0_10px_rgba(0,242,254,0.15)]">
                <Shield className="h-3.5 w-3.5 text-[#00F2FE]" />
                <span>CYBER DEFENSE ALLOCATION MATRIX</span>
              </div>
              <h1
                id="billing-main-heading"
                className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-mono"
              >
                PLANS, PROJECT LICENSES & USAGE METERING
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                Deploy state-of-the-art adversary simulation pipelines, neural deepfake analyzers, and institutional threat intelligence.
              </p>
            </div>

            {/* Current Active Plan Badge */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs shadow-inner">
              <div className="h-2.5 w-2.5 rounded-full bg-[#00F2FE] animate-pulse" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Current Clearance:</span>
                <span className="text-white font-bold uppercase tracking-wider">
                  {isProUnlocked ? "PRO CYBER DEFENDER [VIP BETA]" : "CADET STARTER"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Glowing Closed Beta Banner */}
        <div
          id="closed-beta-banner"
          className="relative rounded-2xl border border-cyan-400/60 bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-cyan-950/80 p-4 sm:p-5 shadow-[0_0_35px_rgba(0,242,254,0.25)] overflow-hidden"
        >
          {/* Animated cyber pulse line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent shadow-[0_0_15px_#00F2FE]" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.4)]">
                <Sparkles className="h-5 w-5 animate-spin text-[#00F2FE]" style={{ animationDuration: "6s" }} />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                  🚀 SCAMSHIELD CLOSED BETA: All premium modules are 100% free for the first 100 VIP users.
                </p>
                <p className="text-xs text-cyan-300/80 font-mono mt-0.5">
                  Early access grants zero-cost access to Gemini 2.5 Flash Adversary AI, Voice Telephony, and FIR Generator.
                </p>
              </div>
            </div>

            <button
              id="banner-join-waitlist-btn"
              type="button"
              onClick={handleOpenWaitlist}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-[#00F2FE] hover:bg-[#38f9d7] text-[#050811] font-bold text-xs uppercase font-mono tracking-wider shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:shadow-[0_0_30px_rgba(0,242,254,0.7)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>JOIN VIP WAITLIST</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("tiers")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === "tiers"
                ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            🛡️ DEFENSE TIERS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("modules")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === "modules"
                ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            ⚡ SPECIALIZED MODULES
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("telemetry")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === "telemetry"
                ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            📊 USAGE METERING & QUOTAS
          </button>
        </div>

        {/* TAB 1: UI CARDS (Starter, Pro, Enterprise) */}
        {activeTab === "tiers" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {TIERS.map((tier) => {
                const isCurrentActive =
                  (tier.id === "free" && billingState.currentPlan === "free") ||
                  (tier.id === "pro" && billingState.currentPlan === "pro") ||
                  (tier.id === "enterprise" && billingState.currentPlan === "enterprise");

                return (
                  <div
                    key={tier.id}
                    id={`tier-card-${tier.id}`}
                    className={`relative rounded-2xl bg-[#080d1a] border ${tier.borderClass} ${tier.glowClass} p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px]`}
                  >
                    {/* Featured Ribbon */}
                    {tier.isFeatured && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00F2FE] text-[#050811] text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(0,242,254,0.6)]">
                        RECOMMENDED DEFENDER TIER
                      </div>
                    )}

                    {/* Card Header */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${tier.badgeColor}`}>
                          {tier.badge}
                        </span>
                        {isCurrentActive && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                            <BadgeCheck className="h-3 w-3 text-emerald-400" />
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-white font-mono">{tier.title}</h2>
                      <p className="text-xs text-slate-400 mt-1 min-h-[36px] leading-relaxed">
                        {tier.subtitle}
                      </p>

                      {/* 4. Price Tag: Purely "BETA ACCESS: FREE" (No $ symbols) */}
                      <div className="my-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">Licensing Model</span>
                          <span className="text-lg sm:text-xl font-extrabold text-[#00F2FE] font-mono tracking-tight">
                            BETA ACCESS: FREE
                          </span>
                        </div>
                        <div className="px-2 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                          100% OFF
                        </div>
                      </div>

                      {/* Quick Specs */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/60 my-4 text-center">
                        {tier.specs.map((spec, i) => (
                          <div key={i} className="p-1.5 rounded bg-slate-900/40">
                            <span className="text-[9px] text-slate-400 font-mono block">{spec.label}</span>
                            <span className="text-xs font-semibold text-slate-200 font-mono">{spec.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-2.5 my-4">
                        <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider block">
                          Included Capabilities:
                        </span>
                        {tier.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="h-3.5 w-3.5 text-[#00F2FE] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 5. Button: "JOIN VIP WAITLIST" for all tiers */}
                    <div className="pt-5 mt-auto border-t border-slate-800/80">
                      <button
                        type="button"
                        id={`join-waitlist-btn-${tier.id}`}
                        onClick={handleOpenWaitlist}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${tier.btnGradient}`}
                      >
                        <Zap className="h-3.5 w-3.5" />
                        <span>JOIN VIP WAITLIST</span>
                      </button>
                      <p className="text-[10px] text-center text-slate-400 font-mono mt-2">
                        Instant unlock upon verification • Zero fees
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SPECIALIZED DEFENSIVE MODULES */}
        {activeTab === "modules" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SPECIALIZED_MODULES.map((mod) => (
                <div
                  key={mod.id}
                  id={`module-card-${mod.id}`}
                  className="p-6 rounded-2xl bg-[#080d1a] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-[#00F2FE] border border-cyan-500/40">
                      {mod.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#00F2FE]">
                      BETA ACCESS: FREE
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white font-mono">{mod.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{mod.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                    {mod.specs.map((sp, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-slate-900 text-[10px] font-mono text-slate-300 border border-slate-800">
                        {sp}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenWaitlist}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-[#050811] text-cyan-300 font-bold text-xs uppercase font-mono tracking-wider border border-cyan-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>JOIN VIP WAITLIST</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USAGE METERING & QUOTAS */}
        {activeTab === "telemetry" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Simulations Metered</span>
                <p className="text-xl font-bold font-mono text-[#00F2FE]">
                  {billingState.usageThisMonth?.simulationsUsed || 0} / {isProUnlocked ? "∞" : "5"}
                </p>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: isProUnlocked ? "100%" : "40%" }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Voice Telephony Minutes</span>
                <p className="text-xl font-bold font-mono text-[#00F2FE]">
                  {billingState.usageThisMonth?.voiceCallsUsed || 0} / {isProUnlocked ? "∞" : "2"}
                </p>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: isProUnlocked ? "100%" : "50%" }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Sandbox Deep Scans</span>
                <p className="text-xl font-bold font-mono text-[#00F2FE]">
                  {billingState.usageThisMonth?.urlScansUsed || 0} / {isProUnlocked ? "∞" : "10"}
                </p>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: isProUnlocked ? "100%" : "30%" }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">1930 Legal FIRs</span>
                <p className="text-xl font-bold font-mono text-[#00F2FE]">
                  {billingState.usageThisMonth?.firReportsUsed || 0} / {isProUnlocked ? "∞" : "1"}
                </p>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: isProUnlocked ? "100%" : "100%" }} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold uppercase text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#00F2FE]" />
                  <span>Real-Time Incident & Defense Telemetry</span>
                </h3>
                {onResetUsageLogs && (
                  <button
                    type="button"
                    onClick={onResetUsageLogs}
                    className="text-xs font-mono text-slate-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    Reset Usage History
                  </button>
                )}
              </div>

              {billingState.usageLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-mono bg-slate-900/40 rounded-xl border border-slate-800/60">
                  No incident logs recorded in current session. Run a simulation or URL scan to trigger metering.
                </div>
              ) : (
                <div className="space-y-2">
                  {billingState.usageLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px]">
                          {log.actionType}
                        </span>
                        <span className="text-slate-300">{log.targetVector || "Execution recorded"}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Closed Beta FAQ / Info Box */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1">
            <h4 className="font-bold text-white font-mono flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#00F2FE]" />
              <span>What is the VIP Closed Beta?</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              We are onboarding our first 100 cybersecurity operators and community defenders for free beta testing.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white font-mono flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#00F2FE]" />
              <span>Are there any hidden fees?</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Zero payment information is requested. Access is 100% free with priority Gemini AI capabilities during the trial period.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white font-mono flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#00F2FE]" />
              <span>How do I unlock Pro features?</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Click &quot;JOIN VIP WAITLIST&quot;, enter your contact details, and your clearance level will be elevated to Pro instantly.
            </p>
          </div>
        </div>

      </div>

      {/* 6. Paywall / Waitlist Modal */}
      {showVipModal && (
        <PaywallModal
          isOpen={showVipModal}
          onClose={() => setShowVipModal(false)}
          onUpgrade={handleUpgradeSuccess}
        />
      )}
    </div>
  );
}

export default PricingBillingHub;
