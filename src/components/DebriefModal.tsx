import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { SimulationTurnResponse, ScenarioDefinition } from "../types";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface DebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ScenarioDefinition;
  lastTurn: SimulationTurnResponse;
  finalScore: number;
  onPlayAgain: () => void;
  onSelectAnotherScenario: () => void;
}

export function DebriefModal({
  isOpen,
  onClose,
  scenario,
  lastTurn,
  finalScore,
  onPlayAgain,
  onSelectAnotherScenario,
}: DebriefModalProps) {
  const isSuccess = lastTurn.simulation_status === "SUCCESS_BUSTED";

  useEffect(() => {
    if (isOpen && isSuccess) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#3b82f6", "#10b981", "#fbbf24"],
      });
    }
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const getGrade = (score: number) => {
    if (score >= 95) return { grade: "A+", title: "Master Cyber Defender", color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" };
    if (score >= 80) return { grade: "A", title: "Vigilant Operator", color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" };
    if (score >= 60) return { grade: "B", title: "Cautious User", color: "text-amber-400 border-amber-500/40 bg-amber-500/10" };
    if (score >= 40) return { grade: "C", title: "High Susceptibility", color: "text-orange-400 border-orange-500/40 bg-orange-500/10" };
    return { grade: "F", title: "Critical Vulnerability", color: "text-red-400 border-red-500/40 bg-red-500/10" };
  };

  const gradeInfo = getGrade(finalScore);

  const handleDownloadReport = () => {
    const reportText = `=====================================================
SCAMSHIELD ENGINE - FORENSIC DEFENSE REPORT
=====================================================
Scenario: ${scenario.title}
Threat Actor: ${lastTurn.scammer_persona}
Outcome: ${isSuccess ? "THREAT NEUTRALIZED / SCAM BUSTED" : "SECURITY BREACH / TRAP TRIGGERED"}
Final Security Score: ${finalScore}/100
Reflex Grade: ${gradeInfo.grade} (${gradeInfo.title})

Detected User Move:
"${lastTurn.detected_user_action}"

Psychological Levers Identified:
${lastTurn.red_flags_present.map((f) => `- ${f}`).join("\n")}

Guardian Forensic Feedback:
${lastTurn.educational_feedback}

Golden Rule Checklist:
1. Never share OTP / PIN with anyone.
2. Official authorities never arrest via video calls or demand funds.
3. Report suspicious financial cyber threats to Cyber Helpline 1930 / cybercrime.gov.in.
=====================================================`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ScamShield-Forensic-Report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-cyan-500/40 neural-glass p-6 sm:p-8 shadow-[0_0_40px_rgba(0,243,255,0.2)] overflow-hidden max-h-[90vh] overflow-y-auto hud-corner-tl">
        {/* Ambient Top Glow */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
            isSuccess ? "from-emerald-400 via-cyan-400 to-blue-500 shadow-[0_0_12px_#10b981]" : "from-red-500 via-orange-500 to-amber-500 shadow-[0_0_12px_#ef4444]"
          }`}
        />

        {/* Modal Header */}
        <div className="text-center pt-2">
          <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl border shadow-inner mb-4 ${
            isSuccess ? "bg-emerald-950/80 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-red-950/80 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          }`}>
            {isSuccess ? (
              <ShieldCheck className="h-9 w-9 text-emerald-400 animate-pulse" />
            ) : (
              <AlertTriangle className="h-9 w-9 text-red-400 animate-pulse" />
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {isSuccess ? "Scam Successfully Busted!" : "Security Trap Triggered!"}
          </h2>
          <p className="mt-1 text-xs text-cyan-300 font-mono">
            Forensic Debrief: {scenario.title}
          </p>
        </div>

        {/* Score & Grade Display Card */}
        <div className="mt-6 rounded-2xl bg-slate-950/90 p-5 border border-cyan-500/30 text-center shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <div className="flex items-center justify-center gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Defensive Reflex Score</span>
              <div className="text-3xl font-extrabold font-mono text-white mt-0.5 drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">
                {finalScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-cyan-500/20" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Evaluated Rank</span>
              <div className="mt-0.5">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold font-mono border ${gradeInfo.color}`}>
                  <Award className="h-3.5 w-3.5" /> Grade {gradeInfo.grade}: {gradeInfo.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Guardian Debrief Notes */}
        <div className="mt-5 space-y-3">
          <div className="rounded-xl bg-slate-950/80 p-4 border border-cyan-500/20">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
              <Sparkles className="h-3.5 w-3.5" /> Guardian Tactical Debrief:
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {lastTurn.educational_feedback}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-4 border border-red-500/20">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 font-mono">
              Psychological Manipulation Levers Used by Adversary:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {lastTurn.red_flags_present.map((flag, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-red-950/60 border border-red-500/40 px-2.5 py-1 text-[11px] font-mono font-medium text-red-300"
                >
                  🚩 {flag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="download-forensic-report-btn"
            onClick={handleDownloadReport}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-950 px-4 py-2.5 text-xs font-semibold font-mono text-cyan-300 hover:text-white hover:bg-cyan-950/50 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Report (.txt)</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              id="debrief-play-again-btn"
              onClick={onPlayAgain}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all font-mono"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>

            <button
              id="debrief-next-scenario-btn"
              onClick={onSelectAnotherScenario}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 px-5 py-2.5 text-xs font-bold font-mono transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            >
              <span>Explore Scenarios</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
