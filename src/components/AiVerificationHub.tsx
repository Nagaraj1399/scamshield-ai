import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSearch,
  MessageSquare,
  Landmark,
  PhoneCall,
  QrCode,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Shield,
  FileText,
  HelpCircle,
} from "lucide-react";
import { ContentVerificationResult } from "../types";

interface AiVerificationHubProps {
  initialText?: string;
}

export function AiVerificationHub({ initialText = "" }: AiVerificationHubProps) {
  const [contentInput, setContentInput] = useState(initialText);
  const [contentType, setContentType] = useState<"notice" | "sms" | "upi" | "job" | "call">("notice");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContentVerificationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const PRESETS = [
    {
      type: "notice" as const,
      label: "Narcotics / CBI Digital Arrest Notice",
      text: "SPECIAL CYBER CRIME CELL / NARCOTICS CONTROL BUREAU\nSEIZURE NOTICE & WARRANT OF DIGITAL ARREST #NCB/MUM/2026/8912\n\nTo the Aadhaar Card Holder:\nYour identity credentials have been intercepted with international parcel containing 140g MDMA and forged passports. You are placed under DIGITAL ARREST under PMLA Sec 4 and NDPS Act Sec 21. You are strictly prohibited from leaving your camera frame or contacting third parties. Join the secure Skype clearance video call within 15 minutes or local police will initiate a residential raid.",
    },
    {
      type: "sms" as const,
      label: "Electricity Smart Meter Blackout Threat",
      text: "Dear Consumer, your electricity power supply will be disconnected tonight at 9:30 PM from the main power grid due to unpaid previous month smart meter update. Pay ₹15 immediately to update your meter bill online via http://state-power-bill.cc/pay or call meter officer at +91-98112-98412.",
    },
    {
      type: "upi" as const,
      label: "Refund / Cash Prize QR Voucher",
      text: "Scan this GooglePay / PhonePe QR code and enter your 6-digit UPI PIN to receive ₹4,500 instant cashback reward credited directly to your bank account! UPI ID: merchant.cashback99@ybl",
    },
    {
      type: "job" as const,
      label: "Work-From-Home YouTube Like Task",
      text: "Congratulations! You are selected for Global Digital Media remote ratings job. Earn ₹3,500 - ₹8,000 per day from mobile. Complete trial: Like 3 YouTube videos, submit screenshot on Telegram @MediaTasksAdmin, and deposit ₹500 refundable security fee to unlock ₹1,500 instant payout.",
    },
    {
      type: "sms" as const,
      label: "Legitimate Bank Alert (For Comparison)",
      text: "Dear Customer, INR 450.00 spent on your HDFC Bank Card ending **8912 at RELIANCE RETAIL on 15-AUG-26. Avail Bal: INR 34,210.50. If not done by you, call 18002586161 or SMS BLOCK to 5676712. Do NOT share OTP.",
    },
  ];

  const handleVerify = async (textToVerify?: string) => {
    const text = textToVerify || contentInput;
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/verify-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, contentType }),
      });
      const data: ContentVerificationResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 rounded-full neural-glass px-4 py-1.5 text-xs font-semibold text-fuchsia-300 border border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.2)] mb-3">
          <Brain className="h-3.5 w-3.5 text-fuchsia-400" />
          <span className="font-mono uppercase tracking-wider text-fuchsia-200">AI VERIFICATION ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(217,70,239,0.3)]">
          AI Checks What's Real or Fake
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
          Verify suspect legal notices, arrest warrants, SMS urgent payment threats, UPI IDs, or job offers against official protocols and fraud signatures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Presets (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          
          {/* Content Type Selector */}
          <div className="rounded-2xl neural-glass-card p-4 shadow-xl hud-corner-tl border border-fuchsia-500/30">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-300 mb-2 block">
              1. Select Verification Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "notice", label: "Legal / Police Notice", icon: FileSearch },
                { id: "sms", label: "SMS / WhatsApp Text", icon: MessageSquare },
                { id: "upi", label: "UPI / QR Payment", icon: QrCode },
                { id: "job", label: "Job / Task Offer", icon: Landmark },
                { id: "call", label: "Caller / Audio Pretext", icon: PhoneCall },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = contentType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setContentType(tab.id as any)}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium font-mono transition-all ${
                      active
                        ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_12px_rgba(217,70,239,0.5)] font-bold border border-fuchsia-400/80"
                        : "bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-fuchsia-200 hover:border-fuchsia-500/40"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="rounded-2xl neural-glass-card p-4 shadow-xl border border-fuchsia-500/30">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-300 mb-2.5 block">
              Or Load a Known Threat Pattern:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setContentInput(preset.text);
                    setContentType(preset.type);
                    handleVerify(preset.text);
                  }}
                  className="rounded-lg bg-slate-950/80 border border-fuchsia-500/20 px-3 py-1.5 text-xs text-slate-300 hover:border-fuchsia-400 hover:text-fuchsia-200 hover:shadow-[0_0_8px_rgba(217,70,239,0.3)] transition-all flex items-center gap-1.5 font-mono"
                >
                  <Sparkles className="h-3 w-3 text-fuchsia-400" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Text Box */}
          <div className="rounded-2xl neural-glass-card p-4 shadow-xl flex-1 flex flex-col border border-fuchsia-500/30 hud-corner-tl">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="verify-input" className="text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-300">
                2. Paste Suspicious Content to Analyze:
              </label>
              {contentInput && (
                <button
                  onClick={() => setContentInput("")}
                  className="text-[11px] text-slate-400 hover:text-fuchsia-300 font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              id="verify-input"
              rows={7}
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="Paste suspect message, notice text, UPI ID, or phone number script here..."
              className="w-full rounded-xl border border-fuchsia-500/30 bg-slate-950/90 p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 font-sans leading-relaxed flex-1 backdrop-blur-md"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {contentInput.length} characters
              </span>
              <button
                id="run-ai-verify-btn"
                disabled={isLoading || !contentInput.trim()}
                onClick={() => handleVerify()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-400 hover:to-indigo-500 text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-[0_0_18px_rgba(217,70,239,0.4)] active:scale-95 disabled:opacity-50 font-mono uppercase"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>AI Verifying...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    <span>Run Authenticity Check</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Analysis Result (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col">
          {result ? (
            <div className="rounded-2xl neural-glass-card p-6 shadow-2xl backdrop-blur-md flex flex-col gap-5 border border-fuchsia-500/40 hud-corner-tl">
              
              {/* Verdict Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-fuchsia-500/20">
                <div className="flex items-center gap-3">
                  {result.authenticity === "FAKE_SCAM" && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                      <XCircle className="h-7 w-7" />
                    </div>
                  )}
                  {result.authenticity === "SUSPICIOUS" && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                      <AlertTriangle className="h-7 w-7" />
                    </div>
                  )}
                  {result.authenticity === "LIKELY_REAL" && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-fuchsia-300 uppercase">
                      AUTHENTICITY VERDICT
                    </span>
                    <h2
                      className={`text-xl font-black font-mono ${
                        result.authenticity === "FAKE_SCAM"
                          ? "text-red-400 drop-shadow-[0_0_8px_#ef4444]"
                          : result.authenticity === "SUSPICIOUS"
                          ? "text-amber-400 drop-shadow-[0_0_8px_#f59e0b]"
                          : "text-emerald-400 drop-shadow-[0_0_8px_#10b981]"
                      }`}
                    >
                      {result.authenticity.replace("_", " ")}
                    </h2>
                  </div>
                </div>

                {/* Confidence Meter */}
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Confidence</span>
                  <span className="font-mono text-lg font-bold text-white">
                    {result.confidenceScore}%
                  </span>
                </div>
              </div>

              {/* Threat Classification & Summary */}
              <div className="rounded-xl bg-slate-950/90 p-4 border border-fuchsia-500/20">
                <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-300 mb-1 font-mono uppercase">
                  <FileText className="h-3.5 w-3.5" /> Threat Classification: {result.threatType}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans mt-2">
                  {result.summary}
                </p>
              </div>

              {/* Detected Red Flags */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Fraud Indicators & Red Flags:
                </span>
                <div className="space-y-2">
                  {result.redFlags.map((flag, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-red-950/40 border border-red-500/40 p-2.5 text-xs text-red-200 font-sans flex items-start gap-2"
                    >
                      <span className="text-red-400 font-bold font-mono">🚩</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Procedure Breakdown */}
              <div className="rounded-xl bg-slate-950/80 p-3.5 border border-cyan-500/30 text-xs">
                <span className="text-cyan-400 font-mono font-bold uppercase block mb-1">
                  ⚖️ Real Official Procedure:
                </span>
                <p className="text-slate-200 leading-relaxed font-sans">
                  {result.officialProcedure}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="rounded-xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-slate-950/90 p-4 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                <span className="text-fuchsia-300 font-mono font-bold uppercase text-xs block mb-1">
                  🛡️ Immediate Recommended Action:
                </span>
                <p className="text-xs text-slate-100 font-medium leading-relaxed">
                  {result.recommendedAction}
                </p>
              </div>

            </div>
          ) : (
            <div className="h-full rounded-2xl border border-dashed border-fuchsia-500/30 neural-glass p-8 flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 mb-4 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-white">
                Awaiting Content to Analyze
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mt-2 leading-relaxed">
                Paste any suspect SMS, police arrest warrant, job offer, or payment QR details on the left and click <strong>Run Authenticity Check</strong> to generate a forensic breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
