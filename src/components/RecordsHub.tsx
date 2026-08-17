import React from "react";
import { UserStats } from "../types";
import {
  Award,
  BarChart3,
  ShieldCheck,
  Flame,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Lock,
} from "lucide-react";

interface RecordsHubProps {
  stats: UserStats;
  onResetStats: () => void;
}

const ALL_AVAILABLE_BADGES = [
  {
    id: "anti_otp_guardian",
    name: "Zero-OTP Guardian",
    desc: "Refused to share OTP under extreme psychological urgency",
    icon: "🛡️",
  },
  {
    id: "digital_arrest_buster",
    name: "Extortion Neutralizer",
    desc: "Busted fake CBI / police digital arrest extortion",
    icon: "⚖️",
  },
  {
    id: "phishing_hunter",
    name: "Phishing Hunter",
    desc: "Identified deceptive typo-squatted URLs in the sandbox",
    icon: "🔍",
  },
  {
    id: "task_fraud_immune",
    name: "Task Fraud Immune",
    desc: "Defeated part-time prepaid investment traps",
    icon: "💼",
  },
  {
    id: "perfect_defense_a",
    name: "Master Cyber Defender",
    desc: "Completed simulations with an unblemished 100/100 score",
    icon: "🏆",
  },
];

export function RecordsHub({ stats, onResetStats }: RecordsHubProps) {
  const winRate =
    stats.simulationsCompleted > 0
      ? Math.round((stats.scamsBusted / stats.simulationsCompleted) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 rounded-full neural-glass px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/40 mb-3 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
          <BarChart3 className="h-4 w-4 text-cyan-400" /> Defense Telemetry & Mastery Tracker
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          Your Cyber Reflex Records
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          Track your social engineering resilience, scam bust success rate, and earned cybersecurity defense honors.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl neural-glass-card border border-cyan-500/30 p-5 hud-corner-tl">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-mono">
            <span>Simulations Run</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]">
            {stats.simulationsCompleted}
          </div>
          <span className="text-[11px] text-cyan-400/70 font-mono">Total combat runs</span>
        </div>

        <div className="rounded-2xl neural-glass-card border border-emerald-500/30 p-5 hud-corner-tl">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-mono">
            <span>Scams Busted</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            {stats.scamsBusted}
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono">{winRate}% Neutralization</span>
        </div>

        <div className="rounded-2xl neural-glass-card border border-red-500/30 p-5 hud-corner-tl">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-mono">
            <span>Traps Triggered</span>
            <XCircle className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            {stats.trapsTriggered}
          </div>
          <span className="text-[11px] text-red-400/80 font-mono">Vulnerabilities hit</span>
        </div>

        <div className="rounded-2xl neural-glass-card border border-amber-500/30 p-5 hud-corner-tl">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-mono">
            <span>Avg Reflex Score</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">
            {stats.averageScore}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <span className="text-[11px] text-amber-400/80 font-mono">Peak: {stats.highestScore}</span>
        </div>
      </div>

      {/* Earned Badges Showcase */}
      <div className="rounded-2xl neural-glass-card border border-cyan-500/30 p-6 mb-8 shadow-xl hud-corner-tl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 mb-4 flex items-center gap-2 font-mono">
          <Award className="h-4 w-4 text-cyan-400" /> Defensive Reflex Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_AVAILABLE_BADGES.map((badge) => {
            const isUnlocked = stats.defenseBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? "neural-glass border-cyan-400/50 text-slate-100 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                    : "bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-50"
                }`}
              >
                <div className="text-2xl shrink-0">{badge.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                    {isUnlocked ? (
                      <span className="rounded bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 text-[10px] font-bold font-mono border border-cyan-500/40">
                        UNLOCKED
                      </span>
                    ) : (
                      <Lock className="h-3 w-3 text-slate-600" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300 leading-snug">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Stats Action */}
      <div className="flex justify-end">
        <button
          id="reset-user-records-btn"
          onClick={() => {
            if (confirm("Reset all local simulation metrics and defense badges?")) {
              onResetStats();
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 neural-glass px-4 py-2 text-xs font-semibold text-slate-300 hover:text-red-400 hover:border-red-500 transition-all font-mono"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defense Telemetry</span>
        </button>
      </div>
    </div>
  );
}
