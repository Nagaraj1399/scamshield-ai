import React, { useState } from "react";
import { URLAnalysisResult } from "../types";
import {
  SearchCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Globe,
  ExternalLink,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

const SAMPLE_SUSPICIOUS_URLS = [
  "http://secure-centralbank-kyc.in",
  "https://cbi-investigation-court.cc/case-clearance",
  "http://sbi-netbanking-update.xyz/login.html",
  "https://power-bill-substation.top/pay10",
  "https://onlinesbi.sbi.co.in", // Legitimate
];

export function PhishingSandbox({ initialUrl = "" }: { initialUrl?: string }) {
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [analysis, setAnalysis] = useState<URLAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (targetUrl?: string) => {
    const urlToTest = targetUrl || urlInput;
    if (!urlToTest.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToTest }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error("URL Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 rounded-full neural-glass px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/40 mb-3 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
          <SearchCode className="h-4 w-4 text-cyan-400" /> Domain Inspection & Heuristic Sandbox
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          Phishing Link & Domain Analyzer
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          Paste any suspicious SMS link or web address into this safe offline sandbox to deconstruct typosquatting, malicious TLDs, and deception patterns.
        </p>
      </div>

      {/* Input Box */}
      <div className="rounded-2xl neural-glass-card p-6 shadow-2xl hud-corner-tl border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-cyan-400">
              <Globe className="h-4 w-4" />
            </div>
            <input
              id="phishing-url-input"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste suspicious URL (e.g., http://secure-centralbank-kyc.in)..."
              className="w-full rounded-xl border border-cyan-500/30 bg-slate-950/90 pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 backdrop-blur-md"
            />
          </div>
          <button
            id="analyze-url-btn"
            disabled={isAnalyzing || !urlInput.trim()}
            onClick={() => handleAnalyze()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 px-6 py-3 text-xs sm:text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] disabled:opacity-40 font-mono uppercase"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isAnalyzing ? "Scanning..." : "Inspect Link"}</span>
          </button>
        </div>

        {/* Sample URLs quick chips */}
        <div className="mt-4 pt-4 border-t border-cyan-500/20">
          <span className="text-[11px] font-medium text-cyan-300 uppercase tracking-wider font-mono">
            Or test a sample threat address:
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLE_SUSPICIOUS_URLS.map((sample, i) => (
              <button
                key={i}
                id={`sample-url-btn-${i}`}
                onClick={() => {
                  setUrlInput(sample);
                  handleAnalyze(sample);
                }}
                className="rounded-lg border border-cyan-500/20 bg-slate-950/80 px-2.5 py-1 text-[11px] font-mono text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/40 hover:shadow-[0_0_8px_rgba(0,243,255,0.3)] transition-all"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Result Card */}
      {analysis && (
        <div className="mt-8 rounded-2xl neural-glass-card p-6 shadow-2xl hud-corner-tl border border-cyan-500/30 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase">Inspected Target</span>
              <h3 className="text-base sm:text-lg font-mono font-bold text-white break-all">
                {analysis.url}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border flex items-center gap-1.5 font-mono ${
                  analysis.verdict === "MALICIOUS / PHISHING"
                    ? "bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                    : analysis.verdict === "SUSPICIOUS"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                }`}
              >
                {analysis.verdict === "MALICIOUS / PHISHING" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <span>{analysis.verdict}</span>
              </div>
            </div>
          </div>

          {/* Risk Score Progress */}
          <div className="mt-6 rounded-xl bg-slate-950/90 p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Heuristic Phishing Risk Index</span>
              <span
                className={`font-mono text-sm font-bold ${
                  analysis.riskScore >= 60
                    ? "text-red-400"
                    : analysis.riskScore >= 35
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {analysis.riskScore} / 100 Risk Score
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  analysis.riskScore >= 60
                    ? "bg-red-500 shadow-[0_0_10px_#ef4444]"
                    : analysis.riskScore >= 35
                    ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                    : "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                }`}
                style={{ width: `${analysis.riskScore}%` }}
              />
            </div>
          </div>

          {/* Detected Anomaly Flags */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5 font-mono">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Behavioral & DNS Flags:
            </h4>
            <div className="space-y-2">
              {analysis.flags.map((flag, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-slate-950/80 p-3 border border-red-900/40 text-xs text-slate-200 font-mono"
                >
                  <span className="text-red-400 font-bold">⚠️</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Action Recommendation */}
          <div className="mt-6 rounded-xl neural-glass border border-cyan-500/40 p-4 flex items-start gap-3 shadow-[0_0_15px_rgba(0,243,255,0.15)]">
            <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-cyan-300 font-mono">Defense Action Recommendation:</h5>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed">{analysis.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
