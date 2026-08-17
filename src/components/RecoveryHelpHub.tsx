import React, { useState } from "react";
import {
  ShieldCheck,
  PhoneCall,
  Lock,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Clock,
  Landmark,
  Shield,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { FIRGenerationResult } from "../types";

export function RecoveryHelpHub() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedFIR, setCopiedFIR] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [firData, setFirData] = useState<FIRGenerationResult | null>(null);

  // Form State for FIR generation
  const [victimName, setVictimName] = useState("");
  const [scamType, setScamType] = useState("Digital Arrest / Cyber Extortion");
  const [lossAmount, setLossAmount] = useState("");
  const [suspectInfo, setSuspectInfo] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [incidentDetails, setIncidentDetails] = useState("");

  const handleGenerateFIR = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate-fir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          victimName,
          scamType,
          lossAmount,
          suspectInfo,
          transactionId,
          incidentDetails,
        }),
      });
      const data: FIRGenerationResult = await res.json();
      setFirData(data);
      setActiveStep(3); // Jump to FIR view
    } catch (err) {
      console.error("Failed to generate FIR:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: "fir" | "bank") => {
    navigator.clipboard.writeText(text);
    if (type === "fir") {
      setCopiedFIR(true);
      setTimeout(() => setCopiedFIR(false), 2000);
    } else {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 rounded-full neural-glass px-4 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-3">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono uppercase tracking-wider">INCIDENT RESPONSE & RECOVERY PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          Step-by-Step Help If You've Been Scammed
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
          Act swiftly within the Golden 1-Hour window to freeze transactions, dial emergency hotlines, and generate formal FIR drafts.
        </p>
      </div>

      {/* Emergency Golden Hour Banner */}
      <div className="rounded-2xl border border-red-500/50 neural-glass p-5 shadow-[0_0_25px_rgba(239,68,68,0.2)] backdrop-blur-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4 hud-corner-tl">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            <Clock className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-red-400 uppercase tracking-wider font-mono drop-shadow-[0_0_8px_#ef4444]">
                THE 1-HOUR "GOLDEN WINDOW"
              </span>
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300 border border-red-500/40 font-mono">
                CRITICAL ASSET RECOVERY
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              If money was transferred in the last 60 minutes, immediately calling <strong className="text-white font-mono">1930</strong> or lodging a freeze request gives up to an 80% chance of freezing the funds in the mule account before withdrawal.
            </p>
          </div>
        </div>

        <a
          href="tel:1930"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-3 text-xs sm:text-sm font-bold font-mono transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] active:scale-95 border border-red-400/50"
        >
          <PhoneCall className="h-4 w-4" />
          <span>DIAL 1930 HELPLINE</span>
        </a>
      </div>

      {/* Step Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {[
          { num: 1, title: "1. Lock Banking & UPI", icon: Lock },
          { num: 2, title: "2. Dial 1930 Portal", icon: PhoneCall },
          { num: 3, title: "3. Generate FIR & Letters", icon: FileText },
          { num: 4, title: "4. Device & ID Isolation", icon: Shield },
        ].map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.num;
          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold font-mono transition-all ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] font-bold border border-emerald-300"
                  : "neural-glass border border-emerald-500/20 text-slate-400 hover:text-emerald-200 hover:border-emerald-500/40"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Immediate Financial Lock */}
      {activeStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl neural-glass-card p-6 shadow-xl hud-corner-tl border border-emerald-500/30">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-emerald-400" /> Immediate Bank Card & UPI Freeze
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold font-mono text-sm">01</span>
                <div>
                  <strong className="text-white block">Disable NetBanking & Card Online Transactions</strong>
                  <p className="text-xs text-slate-400 mt-0.5">Open your bank app &gt; Card Controls &gt; Turn OFF International & Online POS transactions immediately.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold font-mono text-sm">02</span>
                <div>
                  <strong className="text-white block">Deregister Compromised UPI Apps</strong>
                  <p className="text-xs text-slate-400 mt-0.5">If you shared screen or approved unknown collect requests, deregister your bank account from GPay, PhonePe, and Paytm.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold font-mono text-sm">03</span>
                <div>
                  <strong className="text-white block">Call Bank 24x7 Emergency Block Number</strong>
                  <p className="text-xs text-slate-400 mt-0.5">State: "I want to report an unauthorized fraud transaction and request a temporary debit freeze on my account."</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl neural-glass-card p-6 shadow-xl flex flex-col justify-between border border-cyan-500/30">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Landmark className="h-5 w-5 text-cyan-400" /> Major Bank Fraud Hotlines
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { bank: "SBI (State Bank of India)", num: "1800 1234 / 1800 2100", sms: "SMS 'BLOCK <card_last4>' to 567676" },
                  { bank: "HDFC Bank", num: "1800 202 6161 / 1800 258 6161", sms: "NetBanking > Cards > Hotlist" },
                  { bank: "ICICI Bank", num: "1800 1080", sms: "SMS 'BLOCK <acc_num>' to 9215676766" },
                  { bank: "Axis Bank", num: "1860 419 5555 / 1860 500 5555", sms: "SMS 'BLOCKBAR' to 5676782" },
                ].map((b, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{b.bank}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{b.sms}</span>
                    </div>
                    <span className="text-cyan-300 font-mono font-bold text-xs">{b.num}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveStep(2)}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs py-2.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.4)] font-mono"
            >
              <span>Next: Dial 1930 & Lodge Portal Complaint</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 1930 Cyber Crime Portal Guide */}
      {activeStep === 2 && (
        <div className="rounded-2xl neural-glass-card p-6 shadow-xl border border-cyan-500/30 hud-corner-tl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-cyan-500/20 mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-cyan-400" /> National Cyber Crime Helpline (1930) Protocol
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                The Indian Ministry of Home Affairs operates the Citizen Financial Cyber Fraud Reporting System.
              </p>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-4 py-2 text-xs font-bold font-mono hover:bg-cyan-500/30 hover:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-950/80 p-4 border border-cyan-500/20">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase block mb-1">
                1. Information to Keep Ready
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Your Bank Account & Debit Card Number</li>
                <li>Exact Date & Time of Debit</li>
                <li>Transaction Reference (UTR / UPI Txn ID)</li>
                <li>Suspect Beneficiary UPI / Account number</li>
                <li>Threat Actor Phone number / Telegram handle</li>
              </ul>
            </div>

            <div className="rounded-xl bg-slate-950/80 p-4 border border-amber-500/20">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase block mb-1">
                2. What the 1930 Officer Does
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                The officer creates an instant ticket in the National Cyber Crime Reporting Portal and transmits an electronic alert to the nodal bank officers of both your bank and the suspect's bank to freeze the recipient wallet/account.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/80 p-4 border border-emerald-500/20">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase block mb-1">
                3. Mandatory Follow-up
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Within 24 hours of lodging the 1930 ticket, you will receive an SMS with an Acknowledgement Number. Log in to cybercrime.gov.in and complete the full formal complaint with transaction screenshots.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setActiveStep(3)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-5 py-2.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.4)] font-mono"
            >
              <span>Next: Auto-Generate Official FIR & Bank Notice</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Interactive FIR & Bank Dispute Letter Generator */}
      {activeStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl neural-glass-card p-5 shadow-xl border border-emerald-500/30 hud-corner-tl">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-emerald-400" /> Incident Details for FIR
            </h3>

            <form onSubmit={handleGenerateFIR} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-mono mb-1">Your Full Legal Name:</label>
                <input
                  type="text"
                  required
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full rounded-xl border border-emerald-500/30 bg-slate-950/90 p-2.5 text-slate-100 placeholder-slate-600 focus:border-emerald-400 focus:outline-none backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Scam Type:</label>
                <select
                  value={scamType}
                  onChange={(e) => setScamType(e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/30 bg-slate-950/90 p-2.5 text-slate-100 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="Digital Arrest Extortion (Fake CBI / Police)">Digital Arrest Extortion (Fake CBI / Police)</option>
                  <option value="Banking Phishing / KYC Fraud">Banking Phishing / KYC Fraud</option>
                  <option value="Part-time YouTube / Telegram Task Scam">Part-time YouTube / Telegram Task Scam</option>
                  <option value="Electricity / Smart Meter Threat">Electricity / Smart Meter Threat</option>
                  <option value="Fake Investment / Crypto Trading App">Fake Investment / Crypto Trading App</option>
                  <option value="Unauthorized Remote Access (AnyDesk / TeamViewer)">Unauthorized Remote Access (AnyDesk / TeamViewer)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Financial Loss (₹ / $):</label>
                  <input
                    type="text"
                    value={lossAmount}
                    onChange={(e) => setLossAmount(e.target.value)}
                    placeholder="e.g. ₹45,000"
                    className="w-full rounded-xl border border-emerald-500/30 bg-slate-950/90 p-2.5 text-slate-100 placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Txn / UTR Reference:</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. UPI/4089128912"
                    className="w-full rounded-xl border border-emerald-500/30 bg-slate-950/90 p-2.5 text-slate-100 placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Suspect Phone / UPI / Link / Handle:</label>
                <input
                  type="text"
                  value={suspectInfo}
                  onChange={(e) => setSuspectInfo(e.target.value)}
                  placeholder="e.g. +91-98765-43210 / scammer@ybl"
                  className="w-full rounded-xl border border-emerald-500/30 bg-slate-950/90 p-2.5 text-slate-100 placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Brief Description of What Happened:</label>
                <textarea
                  rows={3}
                  value={incidentDetails}
                  onChange={(e) => setIncidentDetails(e.target.value)}
                  placeholder="Received high-pressure call claiming parcel held at customs with narcotics, demanded payment to escrow..."
                  className="w-full rounded-xl border border-emerald-500/30 bg-slate-950/90 p-2.5 text-slate-100 placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                id="generate-fir-btn"
                disabled={isGenerating || !victimName.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold py-2.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 disabled:opacity-50 font-mono uppercase"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isGenerating ? "AI Formatting Legal Draft..." : "Generate Formal FIR & Notice"}</span>
              </button>
            </form>
          </div>

          {/* Generated Documents View (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {firData ? (
              <div className="rounded-2xl neural-glass-card p-5 shadow-2xl space-y-4 border border-emerald-500/40 hud-corner-tl">
                
                {/* FIR Draft Box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-emerald-400" /> {firData.firSubject}
                    </span>
                    <button
                      onClick={() => copyToClipboard(firData.formattedReport, "fir")}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-slate-950/80 px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-950/40 font-mono"
                    >
                      {copiedFIR ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedFIR ? "Copied" : "Copy FIR Draft"}</span>
                    </button>
                  </div>
                  <pre className="rounded-xl bg-slate-950/90 p-3.5 text-xs text-slate-200 font-mono whitespace-pre-wrap max-h-56 overflow-y-auto border border-emerald-500/20">
                    {firData.formattedReport}
                  </pre>
                </div>

                {/* Bank Freeze Notice Box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                      <Landmark className="h-4 w-4 text-cyan-400" /> Bank Account Freeze Notice (Sec 91 CrPC)
                    </span>
                    <button
                      onClick={() => copyToClipboard(firData.bankNoticeDraft, "bank")}
                      className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-slate-950/80 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-950/40 font-mono"
                    >
                      {copiedBank ? <Check className="h-3.5 w-3.5 text-cyan-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedBank ? "Copied" : "Copy Bank Notice"}</span>
                    </button>
                  </div>
                  <pre className="rounded-xl bg-slate-950/90 p-3.5 text-xs text-slate-200 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto border border-cyan-500/20">
                    {firData.bankNoticeDraft}
                  </pre>
                </div>

                {/* Next Steps Checklist */}
                <div className="rounded-xl bg-slate-950/80 p-3.5 border border-emerald-500/20 text-xs">
                  <span className="font-bold text-amber-400 uppercase font-mono block mb-1">
                    ⚡ Mandatory Next Steps:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {firData.criticalNextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="h-full rounded-2xl border border-dashed border-emerald-500/30 neural-glass p-8 flex flex-col items-center justify-center text-center">
                <FileText className="h-12 w-12 text-emerald-500/40 mb-3" />
                <h4 className="text-sm font-bold text-white font-mono">Ready to Generate Legal Incident Report</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-sm">
                  Fill in your incident details on the left and click Generate to produce formal drafts ready for the police and bank manager.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Step 4: Digital Identity & Device Isolation */}
      {activeStep === 4 && (
        <div className="rounded-2xl neural-glass-card p-6 shadow-xl border border-emerald-500/30 hud-corner-tl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-emerald-400" /> Digital Identity & Device Isolation Protocol
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20">
              <strong className="text-cyan-300 block mb-1 font-mono">1. Uninstall Malicious Remote Support APKs</strong>
              <p className="text-slate-300 text-xs leading-relaxed">
                If the scammer instructed you to download apps like <em>AnyDesk, TeamViewer QuickSupport, RustDesk, or customized APK files</em>, disconnect Wi-Fi/Mobile Data immediately and uninstall these apps.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-fuchsia-500/20">
              <strong className="text-fuchsia-300 block mb-1 font-mono">2. Revoke Google & Apple Active Sessions</strong>
              <p className="text-slate-300 text-xs leading-relaxed">
                Go to <code>myaccount.google.com/device-activity</code>, click "Sign out on all unknown devices", and reset your master password + enable Hardware/FIDO2 2FA.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20">
              <strong className="text-amber-300 block mb-1 font-mono">3. Check Call Forwarding Settings</strong>
              <p className="text-slate-300 text-xs leading-relaxed">
                Dial <code>*#21#</code> or <code>*#62#</code> on your phone keypad to ensure scammers have not surreptitiously forwarded your incoming calls and SMS OTPs to their private numbers. Dial <code>##002#</code> to erase all forwarders.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20">
              <strong className="text-emerald-300 block mb-1 font-mono">4. Secure Aadhaar Biometrics</strong>
              <p className="text-slate-300 text-xs leading-relaxed">
                Log into the mAadhaar app / UIDAI portal and click <strong>"Lock Biometrics"</strong> to prevent unauthorized authentication or SIM swap fraud under your national identity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
