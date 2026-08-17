import React, { useState } from "react";
import { EDUCATIONAL_RULES } from "../data/scenarios";
import {
  BookOpen,
  PhoneCall,
  ShieldCheck,
  AlertOctagon,
  Scale,
  KeyRound,
  BadgeAlert,
  Globe,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface FAQItem {
  question: string;
  category: string;
  answer: string;
  goldenRule: string;
}

const RED_FLAG_TAXONOMY: FAQItem[] = [
  {
    question: "What is a 'Digital Arrest' and why is it a 100% fake scam?",
    category: "Digital Arrest",
    answer:
      "A 'Digital Arrest' is a fabricated extortion scheme where cybercriminals impersonate police officers, CBI agents, Customs, or ED officials over Skype/WhatsApp video calls. They claim your Aadhaar or passport was linked to a seized narcotics parcel, money laundering, or illegal sim card. They force victims to remain on video camera for days, isolate them from family, and demand all savings be transferred to 'Supreme Court/RBI Government Clearing Accounts' for verification.",
    goldenRule: "Under Indian Criminal Procedure (CrPC/BNSS), NO law enforcement agency ever conducts interrogations, trials, or arrests through WhatsApp/Skype video calls or demands money transfers.",
  },
  {
    question: "How do Part-Time / YouTube Like & Telegram Task Scams work?",
    category: "Task Fraud",
    answer:
      "Victims receive unsolicited WhatsApp/Telegram messages offering ₹3,000–₹8,000 per day to like YouTube videos, subscribe to channels, or rate hotels. To gain trust, scammers pay ₹150–₹500 initially. Once hooked, victims are added to a Telegram group and asked to deposit 'refundable investment security fees' (e.g. ₹5,000 to get ₹7,500). When larger amounts are deposited (₹50,000+), the withdrawal is frozen and scammers demand more money under 'crypto tax clearance'.",
    goldenRule: "Any job or task that requires YOU to deposit money upfront to receive a salary is a scam.",
  },
  {
    question: "Why do scammers ask to install AnyDesk, TeamViewer, or unknown APKs?",
    category: "Remote Access & Malware",
    answer:
      "Scammers claim you need to install an 'official update APK' or a 'quick support tool' (such as AnyDesk, RustDesk, TeamViewer) to update your electricity meter or unblock your SIM card. Once installed, they view your phone screen, capture your OTPs as they arrive via SMS, and drain your bank account in real-time.",
    goldenRule: "Never install remote desktop apps or third-party APK files at the request of an unknown caller.",
  },
  {
    question: "Can someone receive money by entering a UPI PIN or scanning a QR code?",
    category: "UPI / Payment Fraud",
    answer:
      "NO. A UPI PIN is ONLY entered to DEBIT (deduct) money from your bank account. You NEVER need to enter your UPI PIN, click 'Pay', or scan a QR code to receive money.",
    goldenRule: "Entering your UPI PIN always sends money out of your account, never into it.",
  },
  {
    question: "What should you do in the 'Golden Hour' if you fall victim to financial cyber fraud?",
    category: "Emergency Response",
    answer:
      "The first 2–3 hours after fraudulent debit is known as the 'Golden Hour'. Dial 1930 immediately in India. The Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) coordinates with banks to immediately freeze the stolen funds in the scammer's beneficiary account before they can withdraw it at an ATM.",
    goldenRule: "Call 1930 or file a report at cybercrime.gov.in within the first hour of fraudulent transactions.",
  },
];

export function PlaybookHub() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const getRuleIcon = (iconName: string) => {
    switch (iconName) {
      case "Scale":
        return <Scale className="h-5 w-5 text-red-400" />;
      case "KeyRound":
        return <KeyRound className="h-5 w-5 text-amber-400" />;
      case "BadgeAlert":
        return <BadgeAlert className="h-5 w-5 text-emerald-400" />;
      case "Globe":
        return <Globe className="h-5 w-5 text-blue-400" />;
      case "PhoneCall":
        return <PhoneCall className="h-5 w-5 text-cyan-400" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-cyan-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full neural-glass px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/40 mb-3 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
          <BookOpen className="h-4 w-4 text-cyan-400" /> Cyber Defense Curriculum & Knowledge Base
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          Social Engineering Defense Playbook
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          The ultimate field manual on digital fraud anatomy, psychological coercion mechanisms, and defensive reflexes.
        </p>
      </div>

      {/* 5 Golden Rules Grid */}
      <div className="mb-12">
        <h3 className="text-base font-bold text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
          <ShieldCheck className="h-5 w-5 text-cyan-400" /> The 5 Golden Rules of Digital Defense
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EDUCATIONAL_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="rounded-2xl neural-glass-card p-5 border border-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(0,243,255,0.25)] transition-all hud-corner-tl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/80 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                  {getRuleIcon(rule.icon)}
                </div>
                <h4 className="text-sm font-bold text-white">{rule.rule}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Red Flag Encyclopedia / Threat Anatomy Accordion */}
      <div className="mb-12">
        <h3 className="text-base font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono drop-shadow-[0_0_8px_#ef4444]">
          <AlertOctagon className="h-5 w-5 text-red-400" /> Threat Anatomy & Manipulation Breakdown
        </h3>
        <div className="space-y-3">
          {RED_FLAG_TAXONOMY.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl neural-glass-card border border-cyan-500/20 overflow-hidden transition-all"
            >
              <button
                type="button"
                id={`playbook-faq-${idx}`}
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-cyan-950/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 font-mono shadow-[0_0_8px_rgba(0,243,255,0.2)]">
                    {item.category}
                  </span>
                  <span className="text-sm font-bold text-white">{item.question}</span>
                </div>
                {expandedIndex === idx ? (
                  <ChevronUp className="h-5 w-5 text-cyan-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {expandedIndex === idx && (
                <div className="p-5 pt-0 border-t border-cyan-500/20 bg-slate-950/60 text-xs sm:text-sm text-slate-300 space-y-3">
                  <p className="leading-relaxed text-slate-200 mt-3">{item.answer}</p>
                  <div className="rounded-xl neural-glass border border-cyan-500/40 p-3 flex items-start gap-2.5 text-xs shadow-[0_0_12px_rgba(0,243,255,0.15)]">
                    <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-cyan-300 font-mono">Golden Countermeasure:</strong> {item.goldenRule}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Cyber Helplines Directory */}
      <div className="rounded-2xl neural-glass-card border border-cyan-500/30 p-6 sm:p-8 hud-corner-tl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-emerald-400" /> Official Global Cybercrime Helplines
        </h3>
        <p className="text-xs text-slate-300 mb-6">
          Save these verified national incident response helplines and cyber defense reporting portals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-950/80 border border-emerald-500/30 p-4 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">🇮🇳 India (CFCFRMS)</span>
            <div className="text-lg font-extrabold text-emerald-400 font-mono mt-1 drop-shadow-[0_0_8px_#10b981]">1930</div>
            <p className="text-[11px] text-slate-300 mt-1">
              National Cyber Crime Portal: <strong className="text-white">cybercrime.gov.in</strong>
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/80 border border-cyan-500/30 p-4 shadow-[0_0_12px_rgba(0,243,255,0.15)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">🇺🇸 United States (IC3 / FBI)</span>
            <div className="text-lg font-extrabold text-cyan-400 font-mono mt-1 drop-shadow-[0_0_8px_#00f3ff]">1-800-CALL-FBI</div>
            <p className="text-[11px] text-slate-300 mt-1">
              Internet Crime Complaint Center: <strong className="text-white">ic3.gov</strong> & <strong className="text-white">reportfraud.ftc.gov</strong>
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/80 border border-blue-500/30 p-4 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">🇬🇧 United Kingdom</span>
            <div className="text-lg font-extrabold text-blue-400 font-mono mt-1 drop-shadow-[0_0_8px_#3b82f6]">0300 123 2040</div>
            <p className="text-[11px] text-slate-300 mt-1">
              Action Fraud National Fraud & Cyber Crime: <strong className="text-white">actionfraud.police.uk</strong>
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/80 border border-fuchsia-500/30 p-4 shadow-[0_0_12px_rgba(217,70,239,0.15)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">🇦🇺 Australia</span>
            <div className="text-lg font-extrabold text-fuchsia-400 font-mono mt-1 drop-shadow-[0_0_8px_#d946ef]">1300 CYBER1</div>
            <p className="text-[11px] text-slate-300 mt-1">
              Australian Cyber Security Centre: <strong className="text-white">cyber.gov.au</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
