import React, { useState, useEffect } from "react";
import {
  Shield,
  Sparkles,
  CheckCircle2,
  X,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  Send,
  Zap,
} from "lucide-react";
import { cyberAudio } from "../utils/cyberAudio";

/**
 * PaywallModal Component (Closed Beta VIP Waitlist Application)
 * Lead-generation & closed beta onboarding model for hackathon submission.
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen=true] - Whether modal is visible
 * @param {Function} props.onClose - Callback when modal is dismissed
 * @param {Function} props.onUpgrade - Callback when VIP beta access is unlocked (changes state to PRO)
 */
export function PaywallModal({ isOpen = true, onClose, onUpgrade }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "verifying" | "success"

  // Handle ESC key to dismiss (unless verifying)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && status !== "verifying") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, status]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || status !== "idle") {
      return;
    }

    // Play tactile click sound
    cyberAudio?.playClick?.();

    // DATA SAVING: Save submitted data to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('hackathon_leads') || '[]');
      existing.push({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        date: new Date().toLocaleString(),
      });
      localStorage.setItem('hackathon_leads', JSON.stringify(existing));

      // Dispatch custom event to notify AdminViewModal or other listeners immediately
      window.dispatchEvent(new CustomEvent('hackathon_leads_updated'));
    } catch (err) {
      console.error("Error saving lead to localStorage:", err);
    }

    // 1. Change button text to "Verifying Details..." (simulate network request for 1.5 seconds)
    setStatus("verifying");

    setTimeout(() => {
      // 2. Show Success UI inside the modal
      setStatus("success");
      cyberAudio?.playThreatMitigated?.();

      // 3. Wait 1.5 seconds, then call onUpgrade() to change app state to PRO and close modal
      setTimeout(() => {
        if (typeof onUpgrade === "function") {
          onUpgrade();
        }
        if (typeof onClose === "function") {
          onClose();
        }
      }, 1500);
    }, 1500);
  };

  return (
    <div
      id="paywall-modal-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        onClick={() => {
          if (status !== "verifying") {
            onClose?.();
          }
        }}
      />

      {/* Cyberpunk SOC Modal Window (#050811 background, neon cyan glow) */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#050811] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,242,254,0.25)] overflow-hidden text-slate-100">
        
        {/* Glowing Top Cyber Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent shadow-[0_0_15px_#00F2FE]" />

        {/* Ambient Corner Highlights */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        {status !== "verifying" && (
          <button
            id="close-paywall-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-cyan-500/30 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-3 shadow-[0_0_10px_rgba(0,242,254,0.2)]">
            <Sparkles className="h-3.5 w-3.5 text-[#00F2FE]" />
            <span>VIP CLOSED BETA APPLICATION</span>
          </div>

          <h2
            id="paywall-modal-title"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2.5"
          >
            <span>🛡️ Join the ScamShield Closed Beta</span>
          </h2>

          <p
            id="paywall-modal-description"
            className="mt-2 text-sm text-slate-300 leading-relaxed font-sans"
          >
            We are onboarding our first 100 users. Enter your details to get instant free access to the Pro Cyber Defender tier.
          </p>
        </div>

        {/* Dynamic Content: Form vs Success State */}
        {status === "success" ? (
          <div
            id="vip-success-screen"
            className="py-8 px-5 rounded-xl bg-cyan-950/40 border border-cyan-500/50 text-center animate-fadeIn shadow-[0_0_30px_rgba(0,242,254,0.2)]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400 text-[#00F2FE] mb-4 shadow-[0_0_25px_rgba(0,242,254,0.5)]">
              <CheckCircle2 className="h-9 w-9 text-[#00F2FE]" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
              Welcome! You are added to the VIP Waitlist. Pro features unlocked.
            </h3>

            <p className="text-xs sm:text-sm text-cyan-200/80 max-w-sm mx-auto mb-4 font-mono">
              [SEC-OPS VIP CLEARED]: Initializing Pro tier defensive modules and live simulation engines...
            </p>

            <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
              <Loader2 className="h-4 w-4 animate-spin text-[#00F2FE]" />
              <span>Unlocking workspace...</span>
            </div>
          </div>
        ) : (
          <form id="vip-waitlist-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input 1: Full Name */}
            <div>
              <label
                htmlFor="waitlist-fullname"
                className="block text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold mb-1.5"
              >
                Full Name <span className="text-[#00F2FE]">*</span>
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4 text-cyan-400/80" />
                </div>
                <input
                  type="text"
                  id="waitlist-fullname"
                  name="fullName"
                  required
                  disabled={status === "verifying"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#080d1a] border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] focus:shadow-[0_0_15px_rgba(0,242,254,0.35)] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input 2: Email Address */}
            <div>
              <label
                htmlFor="waitlist-email"
                className="block text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold mb-1.5"
              >
                Email Address <span className="text-[#00F2FE]">*</span>
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4 text-cyan-400/80" />
                </div>
                <input
                  type="email"
                  id="waitlist-email"
                  name="email"
                  required
                  disabled={status === "verifying"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@cyber-defense.org"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#080d1a] border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] focus:shadow-[0_0_15px_rgba(0,242,254,0.35)] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input 3: Phone Number */}
            <div>
              <label
                htmlFor="waitlist-phone"
                className="block text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold mb-1.5"
              >
                Phone Number <span className="text-[#00F2FE]">*</span>
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4 text-cyan-400/80" />
                </div>
                <input
                  type="tel"
                  id="waitlist-phone"
                  name="phone"
                  required
                  disabled={status === "verifying"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#080d1a] border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] focus:shadow-[0_0_15px_rgba(0,242,254,0.35)] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Pro Features Unlocked List */}
            <div className="pt-2 pb-1">
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                <div className="font-mono font-semibold text-cyan-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#00F2FE]" />
                  <span>Pro Cyber Defender Tier (Included Free During Beta):</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 pl-5">
                  <div>✓ Unlimited AI Scenarios</div>
                  <div>✓ Live Voice Telephony</div>
                  <div>✓ Adversary CLI & SOC Tools</div>
                  <div>✓ Unlimited Deep URL Scans</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="submit-waitlist-btn"
                disabled={status === "verifying"}
                className="w-full py-3 px-4 rounded-xl bg-[#00F2FE] hover:bg-[#38f9d7] text-[#050811] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(0,242,254,0.5)] hover:shadow-[0_0_35px_rgba(0,242,254,0.8)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed uppercase font-mono"
              >
                {status === "verifying" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#050811]" />
                    <span>Verifying Details...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 text-[#050811]" />
                    <span>Request Access</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-500 font-mono pt-1">
              100% Free VIP Beta Access • No payment info required • Instant activation upon verification
            </p>
          </form>
        )}

      </div>
    </div>
  );
}

export default PaywallModal;
