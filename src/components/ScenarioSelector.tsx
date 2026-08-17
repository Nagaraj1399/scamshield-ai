import React, { useState } from "react";
import { PRESET_SCENARIOS } from "../data/scenarios";
import { ScenarioDefinition } from "../types";
import {
  ShieldAlert,
  Landmark,
  Briefcase,
  Cpu,
  Zap,
  Mic,
  Coins,
  Package,
  Award,
  Sparkles,
  ArrowRight,
  Flame,
  UserCheck,
  AlertTriangle,
  PlusCircle,
  Radio,
  Activity,
  Clock,
  Lock,
  TrendingUp,
  FileCheck,
  KeyRound,
  Shield,
  Layers,
} from "lucide-react";

interface ScenarioSelectorProps {
  onSelectScenario: (scenario: ScenarioDefinition, customPrompt?: string, difficulty?: string) => void;
  isLoading: boolean;
}

export function ScenarioSelector({ onSelectScenario, isLoading }: ScenarioSelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [customScenarioText, setCustomScenarioText] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");

  const filteredScenarios = filterDifficulty === "All"
    ? PRESET_SCENARIOS
    : PRESET_SCENARIOS.filter((s) => s.difficulty === filterDifficulty);

  const handleLaunchCustom = () => {
    if (!customScenarioText.trim()) return;
    const customDef: ScenarioDefinition = {
      id: "custom",
      title: "Custom Attack Vector",
      categoryName: "User Defined Attack Vector",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      iconName: "ShieldAlert",
      tagline: customScenarioText.slice(0, 80) + "...",
      threatActor: "Adaptive Threat Actor",
      realWorldImpact: "Custom attack testing critical thinking and credential defense.",
      keyPsychologicalTriggers: ["Social Engineering", "Urgency", "Custom Pretext"],
      sampleOpeningHook: customScenarioText,
      difficulty: selectedDifficulty,
    };
    onSelectScenario(customDef, customScenarioText, selectedDifficulty);
  };

  // Render trending, customized visual UI for each distinct scenario
  const renderCustomScenarioCardUI = (scenario: ScenarioDefinition) => {
    switch (scenario.id) {
      // 1. Digital Arrest & CBI Coercion (Simulated Law Enforcement Video Call HUD)
      case "digital_arrest":
        return (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 border border-red-500/40 mb-4 shadow-lg group-hover:border-red-400/80 transition-all">
            {/* Top Bar with Live Video Stream Telemetry */}
            <div className="flex items-center justify-between text-[10px] font-mono text-red-400 border-b border-red-900/40 pb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span>● REC [00:14:28]</span>
              </span>
              <span className="bg-red-950/80 text-red-300 px-2 py-0.5 rounded border border-red-700 text-[9px] font-bold">
                CBI CYBER INTERROGATION
              </span>
            </div>

            {/* Video Feed Simulation Box */}
            <div className="relative mt-2.5 h-28 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-red-950/60 border border-slate-800 flex flex-col justify-between p-2.5 overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:8px_8px]" />
              
              <div className="relative flex items-center justify-between z-10">
                <span className="text-[9px] font-mono bg-black/70 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                  CAMERA: 1080P // HQ
                </span>
                <span className="text-[9px] font-mono bg-red-950 text-red-300 font-bold px-1.5 py-0.5 rounded border border-red-800">
                  SEC-66D NDPS WARRANT
                </span>
              </div>

              {/* Center Officer Badge Overlay */}
              <div className="relative flex items-center gap-2.5 z-10 my-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 border border-red-500/60 text-red-400 shadow-md">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <span>DCP Sanjeev Yadav</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Narcotics Intelligence Cell</div>
                </div>
              </div>

              {/* Bottom Threat Gauge */}
              <div className="relative flex items-center justify-between z-10 text-[9px] font-mono text-red-400 bg-black/60 px-2 py-0.5 rounded border border-red-900/40">
                <span>INTIMIDATION COERCION: HIGH</span>
                <span>MANDATORY VIDEO LOCK</span>
              </div>
            </div>
          </div>
        );

      // 2. Urgent Bank KYC & Account Freeze (Fintech Digital Debit Card & Countdown)
      case "bank_kyc":
        return (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 border border-amber-500/40 mb-4 shadow-lg group-hover:border-amber-400/80 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 border-b border-amber-900/40 pb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Clock className="h-3 w-3 animate-spin text-amber-400" />
                <span>EXPIRY: 00:29:45</span>
              </span>
              <span className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-700 text-[9px] font-bold">
                RBI COMPLIANCE NOTICE
              </span>
            </div>

            {/* Debit Card Graphic */}
            <div className="relative mt-2.5 h-28 rounded-xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/30 p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-6 rounded bg-amber-400/30 border border-amber-400/60" />
                  <span className="text-[10px] font-bold text-amber-200 font-mono">CENTRAL BANK</span>
                </div>
                <span className="text-[9px] font-bold font-mono text-red-400 bg-red-950/90 px-1.5 py-0.5 rounded border border-red-800">
                  CARD SUSPENDED
                </span>
              </div>

              <div className="font-mono text-xs text-slate-300 tracking-widest my-auto">
                •••• •••• •••• 8912
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span>HOLD: AADHAAR PAN UNLINKED</span>
                <span className="text-amber-400 font-bold">CLICK TO UNFREEZE ➔</span>
              </div>
            </div>
          </div>
        );

      // 3. Work-From-Home / YouTube Task Scam (Telegram Task Flow & Multiplier)
      case "task_fraud":
        return (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 border border-emerald-500/40 mb-4 shadow-lg group-hover:border-emerald-400/80 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 border-b border-emerald-900/40 pb-2">
              <span className="flex items-center gap-1 font-bold">
                <Sparkles className="h-3 w-3 text-emerald-300" />
                <span>TELEGRAM VIP CHANNEL</span>
              </span>
              <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 text-[9px] font-bold">
                DAILY +₹8,000
              </span>
            </div>

            {/* Task Multiplier Feed */}
            <div className="relative mt-2.5 h-28 rounded-xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-300">Trial Task 1 (Like Video):</span>
                <span className="text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-700">
                  +₹150 CREDITED
                </span>
              </div>

              <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono flex items-center justify-between">
                <span className="text-slate-400">VIP Task #2 (Prepaid):</span>
                <span className="text-amber-400 font-bold">Deposit ₹5,000 ➔ Get ₹18,000</span>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-emerald-300/80 bg-emerald-950/40 px-2 py-0.5 rounded">
                <span>PYRAMID TRAP</span>
                <span className="text-red-400 font-bold">SUNK COST LOCK</span>
              </div>
            </div>
          </div>
        );

      // 4. Corporate SSO & MFA Push Bombing (Azure AD Push Authenticator HUD)
      case "it_sso_phish":
        return (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 border border-blue-500/40 mb-4 shadow-lg group-hover:border-blue-400/80 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 border-b border-blue-900/40 pb-2">
              <span className="flex items-center gap-1 font-bold">
                <Cpu className="h-3 w-3 text-blue-300" />
                <span>MICROSOFT AUTHENTICATOR</span>
              </span>
              <span className="bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded border border-blue-700 text-[9px] font-bold">
                PUSH #72
              </span>
            </div>

            {/* Authenticator Notification Box */}
            <div className="relative mt-2.5 h-28 rounded-xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 border border-blue-500/30 p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-200">Approve Sign-in Request?</span>
                <span className="text-[9px] font-mono text-red-400 bg-red-950/80 px-1.5 rounded border border-red-800">
                  IP: 185.220.101.5
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 my-1">
                <span className="text-xs font-mono text-slate-400">Match Number:</span>
                <span className="flex h-7 w-9 items-center justify-center rounded-lg bg-blue-500/30 border border-blue-400 text-blue-200 font-mono font-bold text-sm">
                  72
                </span>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-red-400 font-bold bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  DENY SIGN-IN
                </span>
                <span className="text-slate-400">FATIGUE SPAM ATTACK</span>
              </div>
            </div>
          </div>
        );

      // 5. Electricity Smart Meter Blackout (High-Voltage Grid & APK Warning)
      case "utility_blackout":
        return (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 border border-purple-500/40 mb-4 shadow-lg group-hover:border-purple-400/80 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 border-b border-purple-900/40 pb-2">
              <span className="flex items-center gap-1 font-bold">
                <Zap className="h-3 w-3 text-purple-300 animate-pulse" />
                <span>STATE POWER GRID</span>
              </span>
              <span className="bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded border border-purple-700 text-[9px] font-bold">
                21:30 CUTOFF
              </span>
            </div>

            {/* Smart Meter Disconnect Panel */}
            <div className="relative mt-2.5 h-28 rounded-xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/30 p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-300">Meter #K-88190:</span>
                <span className="text-red-400 font-bold bg-red-950 px-1.5 py-0.2 rounded border border-red-800">
                  OVERDUE: ₹10
                </span>
              </div>

              <div className="p-1.5 rounded-lg bg-slate-950/80 border border-purple-900/50 text-[10px] font-mono flex items-center justify-between">
                <span className="text-purple-300">Payload: Meter_Update.apk</span>
                <span className="text-red-400 font-bold">Remote Access RAT</span>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded">
                <span>SMS PRETEXT</span>
                <span className="text-amber-400 font-bold">ANYDESK TROJAN</span>
              </div>
            </div>
          </div>
        );

      // 6. AI Voice Clone & Kidnap Extortion (Neural Audio Spectrogram & Voiceprint)
      case "voice_clone":
        return (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 border border-rose-500/40 mb-4 shadow-lg group-hover:border-rose-400/80 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono text-rose-400 border-b border-rose-900/40 pb-2">
              <span className="flex items-center gap-1 font-bold">
                <Radio className="h-3 w-3 text-rose-300 animate-ping" />
                <span>NEURAL VOICEPRINT ANALYSIS</span>
              </span>
              <span className="bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-700 text-[9px] font-bold">
                99.4% LIKENESS
              </span>
            </div>

            {/* Spectrogram Graphic */}
            <div className="relative mt-2.5 h-28 rounded-xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border border-rose-500/30 p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-300">Audio Source:</span>
                <span className="text-rose-400 font-bold">Instagram Reel Sample</span>
              </div>

              {/* Dynamic Spectrogram Equalizer */}
              <div className="flex items-center justify-center gap-1 h-8 my-1 bg-black/40 rounded p-1">
                {[30, 80, 50, 95, 40, 100, 75, 60, 90, 45, 85, 35, 70].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-rose-600 to-rose-300 animate-pulse"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-rose-300">
                <span className="bg-rose-950 px-1.5 py-0.2 rounded border border-rose-800">EXTORTION DEMAND: ₹2L</span>
                <span className="text-slate-400 font-bold">CALL BACK DIRECTLY</span>
              </div>
            </div>
          </div>
        );

      // 7. Crypto Romance 'Pig Butchering' (Web3 DEX Candlestick Chart & APY Pool)
      case "crypto_romance":
        return (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 border border-fuchsia-500/40 mb-4 shadow-lg group-hover:border-fuchsia-400/80 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono text-fuchsia-400 border-b border-fuchsia-900/40 pb-2">
              <span className="flex items-center gap-1 font-bold">
                <TrendingUp className="h-3 w-3 text-fuchsia-300" />
                <span>DEX ARBITRAGE POOL</span>
              </span>
              <span className="bg-fuchsia-950/80 text-fuchsia-300 px-2 py-0.5 rounded border border-fuchsia-700 text-[9px] font-bold">
                APY 340.8%
              </span>
            </div>

            {/* Crypto DApp Simulation */}
            <div className="relative mt-2.5 h-28 rounded-xl bg-gradient-to-br from-fuchsia-950/60 via-slate-900 to-slate-950 border border-fuchsia-500/30 p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-300">Simulated Balance:</span>
                <span className="text-emerald-400 font-bold">$42,850.00 USDT</span>
              </div>

              <div className="p-1 rounded-lg bg-black/60 border border-fuchsia-900/40 text-[10px] font-mono flex items-center justify-between">
                <span className="text-fuchsia-300">Smart Contract:</span>
                <span className="text-amber-400 font-bold">DRAIN_PERMISSION</span>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-fuchsia-300 bg-fuchsia-950/40 px-2 py-0.5 rounded">
                <span>ROMANCE GROOMING</span>
                <span className="text-red-400 font-bold">WITHDRAWAL LOCKED</span>
              </div>
            </div>
          </div>
        );

      // 8. Customs Narcotics Parcel Seizure (International Airway Cargo Scanner)
      case "courier_customs":
        return (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 border border-orange-500/40 mb-4 shadow-lg group-hover:border-orange-400/80 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono text-orange-400 border-b border-orange-900/40 pb-2">
              <span className="flex items-center gap-1 font-bold">
                <Package className="h-3 w-3 text-orange-300" />
                <span>FEDEX CARGO SCANNER</span>
              </span>
              <span className="bg-orange-950/80 text-orange-300 px-2 py-0.5 rounded border border-orange-700 text-[9px] font-bold">
                AWB #FX-88192
              </span>
            </div>

            {/* Cargo X-Ray Scanner Graphic */}
            <div className="relative mt-2.5 h-28 rounded-xl bg-gradient-to-br from-orange-950/60 via-slate-900 to-slate-950 border border-orange-500/30 p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-300">Location:</span>
                <span className="text-orange-400 font-bold">Mumbai Airport Terminal 2</span>
              </div>

              <div className="p-1 rounded bg-black/60 border border-orange-900/40 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Contraband Flag:</span>
                <span className="text-red-400 font-bold bg-red-950 px-1 rounded">140g MDMA / Narcotics</span>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-orange-300">
                <span className="bg-orange-950 px-1.5 py-0.2 rounded border border-orange-800">CUSTOMS PENALTY TRAP</span>
                <span className="text-red-400 font-bold">SEIZED HOLD</span>
              </div>
            </div>
          </div>
        );

      // 9. WhatsApp KBC / Tata Lucky Draw (Holographic Golden Voucher)
      case "lottery_fraud":
        return (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 border border-lime-500/40 mb-4 shadow-lg group-hover:border-lime-400/80 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono text-lime-400 border-b border-lime-900/40 pb-2">
              <span className="flex items-center gap-1 font-bold">
                <Award className="h-3 w-3 text-lime-300" />
                <span>KBC ALL-INDIA LOTTERY</span>
              </span>
              <span className="bg-lime-950/80 text-lime-300 px-2 py-0.5 rounded border border-lime-700 text-[9px] font-bold">
                ₹25,00,000
              </span>
            </div>

            {/* Lucky Draw Certificate Box */}
            <div className="relative mt-2.5 h-28 rounded-xl bg-gradient-to-br from-lime-950/60 via-slate-900 to-slate-950 border border-lime-500/30 p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-300">Prize Voucher:</span>
                <span className="text-lime-300 font-bold">Winner 2nd Prize</span>
              </div>

              <div className="p-1 rounded bg-black/60 border border-lime-900/40 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Upfront Fee Demand:</span>
                <span className="text-amber-400 font-bold">₹12,500 'GST Advance'</span>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-lime-300 bg-lime-950/40 px-2 py-0.5 rounded">
                <span>VIRAL AUDIO LETTERHEAD</span>
                <span className="text-red-400 font-bold">ADVANCE FEE FRAUD</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full neural-glass px-4 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-500/40 mb-4 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
          <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span className="font-mono uppercase tracking-wider text-cyan-200">CYBERSECURITY REFLEX TRAINING MATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          Master Social Engineering Defense in a Safe Dual-Agent Sandbox
        </h1>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          Face realistic AI adversaries roleplaying the top 9 high-pressure financial scams. Build instinctive reflexes, identify manipulation tactics, and test your resistance without risking real money or data.
        </p>

        {/* Global Filter & Difficulty Selectors */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          
          {/* Filter Scenarios */}
          <div className="inline-flex items-center gap-1.5 rounded-xl neural-glass p-1.5 border border-cyan-500/30 shadow-inner">
            <span className="px-2 text-xs font-medium text-cyan-400 font-mono">Filter:</span>
            {["All", "Beginner", "Intermediate", "Advanced"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterDifficulty(filter)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all font-mono ${
                  filterDifficulty === filter
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,243,255,0.6)] font-bold"
                    : "text-slate-400 hover:text-cyan-200 hover:bg-cyan-950/40"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Adversary Difficulty Level */}
          <div className="inline-flex items-center gap-1.5 rounded-xl neural-glass p-1.5 border border-purple-500/30 shadow-inner">
            <span className="px-2 text-xs font-medium text-purple-300 font-mono">Adversary AI:</span>
            {(["Beginner", "Intermediate", "Advanced"] as const).map((diff) => (
              <button
                key={diff}
                id={`difficulty-select-${diff.toLowerCase()}`}
                onClick={() => setSelectedDifficulty(diff)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all font-mono ${
                  selectedDifficulty === diff
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_0_12px_rgba(217,70,239,0.6)] font-bold"
                    : "text-slate-400 hover:text-purple-200 hover:bg-purple-950/40"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 9 Preset Scenarios + Custom Builder Grid (3x3+1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map((scenario) => (
          <div
            key={scenario.id}
            id={`scenario-card-${scenario.id}`}
            className="group relative flex flex-col justify-between rounded-3xl neural-glass-card p-5 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,243,255,0.25)] hover:-translate-y-1 hud-corner-tl"
          >
            <div>
              {/* Specialized Interactive Threat Graphic Interface */}
              {renderCustomScenarioCardUI(scenario)}

              {/* Title & Tagline */}
              <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {scenario.title}
              </h2>
              <p className="mt-1.5 text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed line-clamp-2">
                {scenario.tagline}
              </p>

              {/* Persona / Threat Actor Badge */}
              <div className="mt-3.5 rounded-xl bg-slate-950/80 p-2.5 border border-cyan-500/20">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                  <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-mono text-cyan-300">Threat Persona:</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-300 font-mono truncate">
                  {scenario.threatActor}
                </p>
              </div>

              {/* Psychological Triggers */}
              <div className="mt-3">
                <span className="text-[10px] font-semibold text-cyan-500 uppercase tracking-wider font-mono">
                  Psychological Levers:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {scenario.keyPsychologicalTriggers.map((trigger, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-cyan-950/40 px-2 py-0.5 text-[10px] font-medium text-cyan-300 border border-cyan-800/40 font-mono"
                    >
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Action Footer */}
            <div className="mt-5 pt-3.5 border-t border-cyan-500/20 flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-400">
                Difficulty: <span className="text-cyan-400 font-bold">{scenario.difficulty}</span>
              </span>
              <button
                id={`launch-btn-${scenario.id}`}
                disabled={isLoading}
                onClick={() => onSelectScenario(scenario, undefined, selectedDifficulty)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:scale-105 active:scale-95 disabled:opacity-50 font-mono uppercase"
              >
                <span>Engage Adversary</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* 10. Custom Attack Vector Laboratory Card */}
        <div
          id="custom-scenario-card"
          className="relative flex flex-col justify-between rounded-3xl border border-cyan-500/40 neural-glass-card p-5 transition-all hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] hud-corner-tl"
        >
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                <PlusCircle className="h-4 w-4" />
                <span>CUSTOM ATTACK LABORATORY</span>
              </div>
              <span className="bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded text-[9px] font-mono border border-cyan-700 shadow-[0_0_8px_rgba(0,243,255,0.3)]">
                AI ZERO-DAY
              </span>
            </div>

            <h2 className="text-lg font-bold text-white">Design Custom Attack Vector</h2>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Craft custom synthetic social engineering scenarios (e.g., Fake Tax Refund, SIM Swap Extortion, Hospital Medical Emergency Scam).
            </p>

            <div className="mt-3.5">
              <label htmlFor="custom-threat-input" className="block text-[11px] font-mono font-semibold text-cyan-300 mb-1">
                Describe the attack scenario or message prompt:
              </label>
              <textarea
                id="custom-threat-input"
                rows={3}
                value={customScenarioText}
                onChange={(e) => setCustomScenarioText(e.target.value)}
                placeholder="E.g., You receive an SMS from 'IncomeTax-Refund' stating ₹38,400 has been credited to your name, asking you to submit bank netbanking credentials to claim..."
                className="w-full rounded-xl border border-cyan-500/30 bg-slate-950/90 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans backdrop-blur-md"
              />
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-cyan-500/20">
            <button
              id="launch-custom-scenario-btn"
              disabled={isLoading || !customScenarioText.trim()}
              onClick={handleLaunchCustom}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 px-4 py-2 text-xs font-black transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] active:scale-95 disabled:opacity-40 font-mono uppercase hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Custom Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safe Sandboxing Notice */}
      <div className="mt-12 rounded-2xl neural-glass p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-[0_0_20px_rgba(0,243,255,0.1)] border border-cyan-500/30">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,243,255,0.3)]">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
            Safe Educational Sandboxing Policy & Ethics
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            This simulation uses synthetic personas and harmless dummy URLs. Never enter genuine passwords, bank PINs, or confidential government IDs. Practice proactive refusal, digital questioning, and official reporting reflexes.
          </p>
        </div>
      </div>

    </div>
  );
}
