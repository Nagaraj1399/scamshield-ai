import React, { useState, useEffect } from "react";
import {
  Shield,
  Radio,
  Globe,
  FileText,
  Search,
  Lock,
  Download,
  CheckCircle2,
  Phone,
  Landmark,
  KeyRound,
  Eye,
  Crosshair,
  Server,
  Zap,
  Flame,
  ArrowRight,
  Clock,
  ShieldCheck,
  Building,
  RefreshCw,
  Cpu,
  Share2,
} from "lucide-react";
import {
  GLOBAL_THREAT_NODES,
  CYBER_CRIME_CASE_DOCKETS,
  KNOWN_MULE_VPAS,
  DARKNET_BREACH_DB,
} from "../data/cyberCrimeIntel";
import { CyberCrimeCaseDocket, GlobalThreatMapNode } from "../types";

export function CyberCrimeWarRoomHub() {
  const [activeSubView, setActiveSubView] = useState<
    "war_map" | "case_dockets" | "mule_tracer" | "darknet_radar" | "fir_builder"
  >("war_map");

  // Selected threat node on map
  const [selectedNode, setSelectedNode] = useState<GlobalThreatMapNode>(
    GLOBAL_THREAT_NODES[0]
  );

  // Selected active case docket
  const [selectedDocket, setSelectedDocket] = useState<CyberCrimeCaseDocket>(
    CYBER_CRIME_CASE_DOCKETS[0]
  );

  // Mule Search State
  const [muleQuery, setMuleQuery] = useState("");
  const [muleSearchResult, setMuleSearchResult] = useState<any | null>(null);
  const [isSearchingMule, setIsSearchingMule] = useState(false);
  const [freezeActionSuccess, setFreezeActionSuccess] = useState<string | null>(null);

  // Darknet Search State
  const [darknetQuery, setDarknetQuery] = useState("nagarajan1320@gmail.com");
  const [darknetResults, setDarknetResults] = useState(DARKNET_BREACH_DB);
  const [isScanningDarknet, setIsScanningDarknet] = useState(false);

  // Real-time Cyber Stream Logs
  const [liveStreamLogs, setLiveStreamLogs] = useState<string[]>([
    "08:47:12 [I4C-INTERCEPT] 1930 Alert: ₹12.5L frozen in ICICI mule account (VPA: rbi.nodal.auth@icici)",
    "08:46:58 [MOCK-SANDBOX] Malicious APK 'SBI_Yono_KYC_v4.apk' hash c29fa91 detected forwarding SMS OTPs to 185.220.101.4",
    "08:46:21 [POLICE-RAID] Cyber Cell Delhi seized 48 SIM boxes in tri-border Mewat extortion cluster",
    "08:45:49 [DEEPFAKE-RADAR] Synthesized audio call imitating CFO blocked via Voice Formant Discontinuity filter",
    "08:45:02 [DEFCON-2] Golden Triangle Cambodia C2 server IP 194.87.145.22 reported to Interpol Cybercrime Directorate",
  ]);

  // Periodic log streamer
  useEffect(() => {
    const interval = setInterval(() => {
      const sampleEvents = [
        `08:${Math.floor(Math.random() * 50 + 10)}:${Math.floor(Math.random() * 50 + 10)} [GOLDEN-HOUR] SBI Nodal Officer acknowledged ₹4.8L hold on UTR: 4891029104`,
        `08:${Math.floor(Math.random() * 50 + 10)}:${Math.floor(Math.random() * 50 + 10)} [NPCI-FEED] 14 Mule UPI VPAs marked as BLOCKED under Section 66D IT Act`,
        `08:${Math.floor(Math.random() * 50 + 10)}:${Math.floor(Math.random() * 50 + 10)} [TELCO-SEVER] DoT Sanchar Saathi deactivated 89 counterfeit SIM cards linked to Jamtara cell`,
        `08:${Math.floor(Math.random() * 50 + 10)}:${Math.floor(Math.random() * 50 + 10)} [DARKNET-SCAN] Stolen KYC breach dump identified on BreachForums #882`,
      ];
      const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setLiveStreamLogs((prev) => [randomEvent, ...prev.slice(0, 7)]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Handle Mule Trace
  const handleTraceMule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!muleQuery.trim()) return;
    setIsSearchingMule(true);
    setFreezeActionSuccess(null);

    setTimeout(() => {
      const match = KNOWN_MULE_VPAS.find(
        (m) =>
          m.vpa.toLowerCase().includes(muleQuery.toLowerCase()) ||
          muleQuery.toLowerCase().includes(m.vpa.toLowerCase())
      );

      if (match) {
        setMuleSearchResult(match);
      } else {
        setMuleSearchResult({
          vpa: muleQuery,
          bank: "Unknown Commercial Bank / P2P Wallet",
          flaggedCategory: "Unregistered High-Velocity VPA",
          riskScore: 78,
          activeFIRs: 1,
          status: "SUSPICIOUS_HEURISTIC",
          firstSeen: "2026-08-15 (New Entity)",
        });
      }
      setIsSearchingMule(false);
    }, 600);
  };

  // Handle Darknet Scan
  const handleDarknetScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!darknetQuery.trim()) return;
    setIsScanningDarknet(true);

    setTimeout(() => {
      const results = DARKNET_BREACH_DB.filter(
        (b) =>
          b.queryMatched.toLowerCase().includes(darknetQuery.toLowerCase()) ||
          darknetQuery.toLowerCase().includes(b.queryMatched.toLowerCase())
      );
      setDarknetResults(
        results.length > 0
          ? results
          : [
              {
                id: "BREACH-SIM-09",
                queryMatched: darknetQuery,
                leakSource: "Global Credential Stuffing List 2026",
                breachDate: "2026-05-11",
                compromisedData: ["Hashed Password", "Associated IP", "Email Metadata"],
                severity: "HIGH",
                threatActor: "Lazarus Nexus Clone",
                exposedCredentialsPreview: `${darknetQuery} | Hash: $2a$12$e8... | Last Seen: DarkWeb Relay`,
              },
            ]
      );
      setIsScanningDarknet(false);
    }, 700);
  };

  // Export Case Docket as Official TXT / Legal Brief
  const handleExportCaseDocket = () => {
    const content = `========================================================================
NATIONAL CYBER CRIME INVESTIGATION DOCKET - OFFICIAL RECORD
COMMAND: I4C / SPECIAL CELL CYBER CRIME WING
========================================================================
CASE NUMBER       : ${selectedDocket.caseNumber}
TITLE             : ${selectedDocket.title}
CATEGORY          : ${selectedDocket.category}
THREAT SEVERITY   : ${selectedDocket.threatLevel}
STATUS            : ${selectedDocket.status}
JURISDICTION      : ${selectedDocket.jurisdiction}
TIMESTAMP         : ${selectedDocket.reportedDate}
EVIDENTIARY HASH  : SHA-256 [${selectedDocket.evidentiaryChain.sha256EvidenceHash}]

------------------------------------------------------------------------
1. FINANCIAL DAMAGE & GOLDEN HOUR FREEZE LEDGER
------------------------------------------------------------------------
TOTAL SIPHONED    : INR ${selectedDocket.financialImpact.totalSiphoned.toLocaleString()}
AMOUNT FROZEN     : INR ${selectedDocket.financialImpact.amountFrozen.toLocaleString()} (${Math.round((selectedDocket.financialImpact.amountFrozen / selectedDocket.financialImpact.totalSiphoned) * 100)}% RECOVERY)
REMAINING WINDOW  : ${selectedDocket.goldenHourRemainingMinutes} Minutes

SEIZED MULE ACCOUNTS:
${selectedDocket.evidentiaryChain.seizedMuleAccounts
  .map(
    (m, i) =>
      `[${i + 1}] Bank: ${m.bank} | A/C: ${m.accountNumberMasked} | IFSC: ${m.ifsc} | VPA: ${m.vpaHandle} | Status: ${m.freezeStatus} | Amount: INR ${m.holdingAmount.toLocaleString()}`
  )
  .join("\n")}

------------------------------------------------------------------------
2. SYNDICATE PROFILE & MODUS OPERANDI (M.O.)
------------------------------------------------------------------------
ORIGIN / HUB      : ${selectedDocket.syndicateProfile.origin}
SYNDICATE ALIAS   : ${selectedDocket.syndicateProfile.alias}
C2 INFRASTRUCTURE : ${selectedDocket.syndicateProfile.c2Infrastructure}
M.O. SUMMARY      : ${selectedDocket.syndicateProfile.modusOperandi}

------------------------------------------------------------------------
3. TELECOM & DIGITAL ARTIFACTS INTERCEPT
------------------------------------------------------------------------
SPOOFED CALLER ID : ${selectedDocket.evidentiaryChain.telecomIntercepts.spoofedCallerId}
CELL TOWER / GEO  : ${selectedDocket.evidentiaryChain.telecomIntercepts.originatingTower}
IMEI CLUSTER      : ${selectedDocket.evidentiaryChain.telecomIntercepts.imeiCluster}
PLATFORM / TRUNK  : ${selectedDocket.evidentiaryChain.telecomIntercepts.callPlatform}

ATTACHED FORENSIC ARTIFACTS:
${selectedDocket.evidentiaryChain.digitalArtifacts.map((a) => `- ${a}`).join("\n")}

------------------------------------------------------------------------
4. STATUTORY LEGAL SECTIONS INVOKED
------------------------------------------------------------------------
${selectedDocket.legalSectionsInvoked.map((s) => `[SECTION] ${s}`).join("\n")}

------------------------------------------------------------------------
5. INVESTIGATION MILESTONES & DISPATCH LOG
------------------------------------------------------------------------
${selectedDocket.actionMilestones
  .map((m) => `[${m.timestamp}] ${m.title} - Officer: ${m.officer}\n  Details: ${m.description}`)
  .join("\n\n")}

========================================================================
DIGITALLY CERTIFIED BY SCAMSHIELD CYBER DEFENSE ENGINE
CHAIN OF CUSTODY VERIFIED // TAMPER-PROOF DISPATCH
========================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedDocket.caseNumber}_FORENSIC_DOSSIER.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-slate-100">
      
      {/* 1. Tactical Command Header & National Cyber Defense Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-b from-slate-950 via-slate-900 to-red-950/20 p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

        {/* Top Operational Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-500/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <Crosshair className="h-6 w-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                  NATIONAL CYBERCRIME WAR ROOM // I4C-1930 MATRIX
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-500 text-[10px] font-mono font-bold text-red-300 animate-pulse">
                  DEFCON 2 CRITICAL
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black font-mono tracking-tight text-white uppercase drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                REAL CYBER CRIME <span className="text-red-400">INTELLIGENCE</span> PORTAL
              </h1>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="rounded-xl bg-slate-900/90 border border-red-500/30 px-3 py-2 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Golden Hour Recovered</span>
              <span className="text-sm font-black text-emerald-400">₹18.42 Cr</span>
            </div>
            <div className="rounded-xl bg-slate-900/90 border border-cyan-500/30 px-3 py-2 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Active Mule VPAs Frozen</span>
              <span className="text-sm font-black text-cyan-400">4,921</span>
            </div>
            <div className="rounded-xl bg-slate-900/90 border border-amber-500/30 px-3 py-2 text-center hidden sm:block">
              <span className="text-[10px] text-slate-400 uppercase block">Severed SIMs</span>
              <span className="text-sm font-black text-amber-400">12,840</span>
            </div>
          </div>
        </div>

        {/* Live Intercept Ticker */}
        <div className="rounded-2xl bg-black/60 border border-red-500/30 p-3 font-mono text-xs text-red-300 flex items-center gap-3 overflow-hidden shadow-inner">
          <div className="flex items-center gap-1.5 shrink-0 text-red-400 font-bold bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/40">
            <Radio className="h-3.5 w-3.5 animate-spin" />
            <span>LIVE INTERCEPT FEED:</span>
          </div>
          <div className="truncate text-slate-300 font-mono">
            {liveStreamLogs[0]}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveSubView("war_map")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
              activeSubView === "war_map"
                ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40 hover:text-red-400"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Global Threat War Map</span>
          </button>

          <button
            onClick={() => setActiveSubView("case_dockets")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
              activeSubView === "case_dockets"
                ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40 hover:text-red-400"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Active Case Dockets ({CYBER_CRIME_CASE_DOCKETS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubView("mule_tracer")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
              activeSubView === "mule_tracer"
                ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40 hover:text-red-400"
            }`}
          >
            <Landmark className="h-4 w-4" />
            <span>Mule Account & UPI Tracer</span>
          </button>

          <button
            onClick={() => setActiveSubView("darknet_radar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
              activeSubView === "darknet_radar"
                ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40 hover:text-red-400"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            <span>Darknet Breach Radar</span>
          </button>

          <button
            onClick={() => setActiveSubView("fir_builder")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
              activeSubView === "fir_builder"
                ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40 hover:text-red-400"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Instant Emergency FIR Generator</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-VIEW 1: GLOBAL THREAT WAR MAP & SYNDICATE RADAR */}
      {activeSubView === "war_map" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* World Cyber Map Canvas / Interactive Grid */}
            <div className="lg:col-span-2 rounded-3xl border border-red-500/30 bg-slate-950/90 p-6 shadow-2xl relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-red-400 animate-spin" style={{ animationDuration: "12s" }} />
                    <h2 className="text-base sm:text-lg font-bold font-mono text-white uppercase">
                      Global Cyber Threat Syndicate Map (2026 Telemetry)
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-red-950/80 border border-red-500/40 text-red-300">
                    LIVE RADAR
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mb-4">
                  Click any active threat node below to trace offshore cyber fraud compound syndicates, C2 infrastructure, and active attack volumes targeting citizens and enterprises.
                </p>
              </div>

              {/* Graphic Cyber Map Representation */}
              <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.4) 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* SVG Stylized World Map Contour */}
                <svg
                  viewBox="0 0 1000 500"
                  className="w-full h-full object-contain opacity-40 stroke-cyan-500/40 fill-cyan-950/20"
                >
                  {/* Stylized Continents Outlines */}
                  <path d="M150,120 Q200,80 320,130 Q300,240 240,260 Q170,220 150,120 Z" /> {/* North America */}
                  <path d="M250,280 Q320,300 300,420 Q250,440 230,340 Z" /> {/* South America */}
                  <path d="M450,100 Q560,90 580,180 Q520,240 460,200 Z" /> {/* Europe */}
                  <path d="M460,220 Q560,230 540,380 Q460,400 440,280 Z" /> {/* Africa */}
                  <path d="M600,100 Q820,110 880,240 Q750,300 620,240 Z" /> {/* Asia */}
                  <path d="M680,250 Q750,260 760,330 Q700,340 670,290 Z" /> {/* India & South Asia */}
                  <path d="M780,260 Q840,270 850,320 Q800,340 770,300 Z" /> {/* SE Asia */}
                  <path d="M800,360 Q900,360 880,440 Q800,440 790,390 Z" /> {/* Australia */}
                </svg>

                {/* Placed Interactive Hotspot Nodes */}
                {GLOBAL_THREAT_NODES.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  // Map lat/lng roughly to percentage positions for UI display
                  const xPct = ((node.lng + 180) / 360) * 100;
                  const yPct = ((90 - node.lat) / 180) * 100;

                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{ left: `${Math.min(Math.max(xPct, 10), 90)}%`, top: `${Math.min(Math.max(yPct, 15), 85)}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-all"
                    >
                      <div className="relative flex items-center justify-center">
                        <span
                          className={`absolute h-8 w-8 rounded-full animate-ping ${
                            node.threatSeverity === "CRITICAL"
                              ? "bg-red-500/40"
                              : "bg-amber-500/40"
                          }`}
                        />
                        <div
                          className={`relative h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-red-500 border-white shadow-[0_0_20px_#ef4444] scale-125"
                              : "bg-slate-950 border-red-400 hover:scale-110"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                      <span className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono font-bold bg-slate-950/90 text-red-300 border border-red-500/40 px-2 py-0.5 rounded shadow-lg group-hover:scale-105">
                        {node.city}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Node selection strip */}
              <div className="mt-4 flex flex-wrap gap-2">
                {GLOBAL_THREAT_NODES.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      selectedNode.id === n.id
                        ? "bg-red-500 text-slate-950 font-bold shadow"
                        : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {n.city}, {n.country}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Syndicate Dossier Panel */}
            <div className="rounded-3xl border border-red-500/30 bg-slate-950/90 p-6 shadow-2xl flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-red-500/20 pb-3 mb-4">
                  <span className="text-[10px] font-mono text-red-400 uppercase font-bold tracking-wider">
                    SYNDICATE DOSSIER // {selectedNode.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      selectedNode.threatSeverity === "CRITICAL"
                        ? "bg-red-950 text-red-300 border border-red-500 animate-pulse"
                        : "bg-amber-950 text-amber-300 border border-amber-500"
                    }`}
                  >
                    {selectedNode.threatSeverity} SEV
                  </span>
                </div>

                <h3 className="text-xl font-bold font-mono text-white mb-1">
                  {selectedNode.city}, {selectedNode.country}
                </h3>
                <p className="text-xs text-red-400 font-mono font-bold mb-4">
                  {selectedNode.originSyndicate}
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Primary Vector / Modus Operandi</span>
                    <span className="text-slate-200 font-semibold">{selectedNode.vector}</span>
                  </div>

                  <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Target Geographies</span>
                    <span className="text-cyan-300 font-semibold">{selectedNode.targetRegion}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block mb-1">Live Intercepts</span>
                      <span className="text-lg font-black text-red-400">{selectedNode.activeAttacksCount} /hr</span>
                    </div>
                    <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block mb-1">C2 Infrastructure</span>
                      <span className="text-sm font-bold text-amber-400">Bulletproof VPS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Button */}
              <button
                onClick={() => {
                  setActiveSubView("case_dockets");
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white font-mono font-bold text-xs hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <span>Inspect Active Case Dockets</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Real-time Intercept Console Stream */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-cyan-400" />
                <h3 className="font-mono text-sm font-bold text-white uppercase">
                  National Cyber Crime Intercept Ledger (Real-Time Terminal Telemetry)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">Auto-refreshing via I4C Gateway</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {liveStreamLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:bg-slate-900 transition-colors"
                >
                  <span className="text-red-400 font-bold shrink-0">⮞</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-VIEW 2: ACTIVE CYBER CRIME CASE DOCKETS & FORENSIC DOSSIERS */}
      {activeSubView === "case_dockets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Case Docket Selector */}
            <div className="space-y-3">
              <h2 className="text-sm font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-400" />
                <span>Active NCRB Investigation Dockets</span>
              </h2>

              {CYBER_CRIME_CASE_DOCKETS.map((docket) => {
                const isSelected = selectedDocket.id === docket.id;
                return (
                  <div
                    key={docket.id}
                    onClick={() => setSelectedDocket(docket)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? "bg-slate-900 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                        : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-red-400 font-bold">
                        {docket.caseNumber}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          docket.status === "FROZEN_NODAL_DISPATCH"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500"
                            : "bg-red-950 text-red-300 border border-red-500"
                        }`}
                      >
                        {docket.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white font-mono leading-tight mb-2">
                      {docket.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Loss: ₹{(docket.financialImpact.totalSiphoned / 100000).toFixed(1)}L</span>
                      <span className="text-emerald-400 font-bold">
                        Frozen: ₹{(docket.financialImpact.amountFrozen / 100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Detailed Case File & Evidentiary Chain */}
            <div className="lg:col-span-2 rounded-3xl border border-red-500/30 bg-slate-950/90 p-6 shadow-2xl space-y-6">
              
              {/* Docket Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-red-500/20 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-black text-red-400 uppercase">
                      OFFICIAL NCRB / I4C INCIDENT DOSSIER
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
                      {selectedDocket.threatLevel}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black font-mono text-white">
                    {selectedDocket.title}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Jurisdiction: {selectedDocket.jurisdiction}
                  </p>
                </div>

                <button
                  onClick={handleExportCaseDocket}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 font-mono text-xs font-bold hover:bg-red-500 hover:text-slate-950 transition-all shadow"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Signed Docket</span>
                </button>
              </div>

              {/* Financial & Golden Hour Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-900/80 p-4 border border-red-500/30">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Siphoned</span>
                  <span className="text-xl font-black font-mono text-red-400">
                    ₹{selectedDocket.financialImpact.totalSiphoned.toLocaleString()}
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-4 border border-emerald-500/30">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Amount Frozen (1930)</span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    ₹{selectedDocket.financialImpact.amountFrozen.toLocaleString()}
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-4 border border-amber-500/30">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Golden Hour Remaining</span>
                  <span className="text-xl font-black font-mono text-amber-400">
                    {selectedDocket.goldenHourRemainingMinutes > 0 ? `${selectedDocket.goldenHourRemainingMinutes} Mins` : "CLOSED / SECURED"}
                  </span>
                </div>
              </div>

              {/* Modus Operandi & Syndicate Background */}
              <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <Cpu className="h-4 w-4" />
                  <span>MODUS OPERANDI (M.O.) & C2 INFRASTRUCTURE</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedDocket.syndicateProfile.modusOperandi}
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-4">
                  <span>Origin: <strong className="text-white">{selectedDocket.syndicateProfile.origin}</strong></span>
                  <span>C2 Server: <strong className="text-amber-400">{selectedDocket.syndicateProfile.c2Infrastructure}</strong></span>
                </div>
              </div>

              {/* Seized Mule Accounts Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-cyan-400" />
                  <span>Seized Mule Accounts & Real-Time Freeze Ledger</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-slate-800 rounded-xl overflow-hidden">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Bank & Branch</th>
                        <th className="p-2.5">Account / VPA</th>
                        <th className="p-2.5">IFSC</th>
                        <th className="p-2.5">Held Amount</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950">
                      {selectedDocket.evidentiaryChain.seizedMuleAccounts.map((mule, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="p-2.5 text-white font-semibold">{mule.bank}</td>
                          <td className="p-2.5 text-cyan-300">{mule.vpaHandle}</td>
                          <td className="p-2.5 text-slate-400">{mule.ifsc}</td>
                          <td className="p-2.5 text-emerald-400 font-bold">₹{mule.holdingAmount.toLocaleString()}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500">
                              {mule.freezeStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Statutory Legal Sections Invoked */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  <span>Statutory Legal Sections Invoked (IT Act & BNS)</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDocket.legalSectionsInvoked.map((section, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-[11px]"
                    >
                      ⚖️ {section}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Milestones Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Golden Hour Response Chain of Events</span>
                </h4>
                <div className="space-y-2">
                  {selectedDocket.actionMilestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs font-mono"
                    >
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-bold shrink-0">
                        {milestone.timestamp}
                      </span>
                      <div>
                        <div className="font-bold text-white">{milestone.title}</div>
                        <div className="text-slate-400 mt-0.5">{milestone.description}</div>
                        <div className="text-[10px] text-cyan-400 mt-1">Officer: {milestone.officer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-VIEW 3: MULE ACCOUNT & UPI TRACER */}
      {activeSubView === "mule_tracer" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-3xl border border-cyan-500/30 bg-slate-950/90 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-4 mb-6">
              <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-400">
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-mono text-white">
                  Mule Account & Fraudulent UPI VPA De-Anonymizer
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Cross-examine suspicious UPI IDs, bank account numbers, or mobile numbers against the National Cybercrime Database & NPCI blacklist.
                </p>
              </div>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleTraceMule} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={muleQuery}
                  onChange={(e) => setMuleQuery(e.target.value)}
                  placeholder="Enter UPI VPA (e.g. cbi.verification.sec@sbi), Account No, or Mobile..."
                  className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-slate-900 border border-cyan-500/40 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isSearchingMule}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5"
                >
                  {isSearchingMule ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Crosshair className="h-3.5 w-3.5" />}
                  <span>De-Anonymize</span>
                </button>
              </div>

              {/* Sample Quick Queries */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                <span>Quick Test Records:</span>
                {KNOWN_MULE_VPAS.slice(0, 3).map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setMuleQuery(v.vpa);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:border-cyan-500 text-[11px]"
                  >
                    {v.vpa}
                  </button>
                ))}
              </div>
            </form>

            {/* Results Display */}
            {muleSearchResult && (
              <div className="mt-6 rounded-2xl border border-red-500/40 bg-slate-900/90 p-6 space-y-4 font-mono animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400 font-bold">INTELLIGENCE MATCH:</span>
                    <span className="text-sm font-black text-white">{muleSearchResult.vpa}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      muleSearchResult.riskScore > 90
                        ? "bg-red-950 text-red-300 border border-red-500 animate-pulse"
                        : "bg-amber-950 text-amber-300 border border-amber-500"
                    }`}
                  >
                    RISK SCORE: {muleSearchResult.riskScore}/100 (CRITICAL)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Issuing Bank</span>
                    <span className="text-slate-200 font-bold">{muleSearchResult.bank}</span>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Syndicate Category</span>
                    <span className="text-red-300 font-bold">{muleSearchResult.flaggedCategory}</span>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Active FIR Linkages</span>
                    <span className="text-amber-400 font-black">{muleSearchResult.activeFIRs} Cases Registered</span>
                  </div>
                </div>

                {/* Emergency Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setFreezeActionSuccess(`Dispatched 1930 Nodal Alert: Freeze hold placed on ${muleSearchResult.vpa} across NPCI UPI switch.`)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Trigger Golden Hour Freeze Dispatch</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubView("fir_builder");
                    }}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Auto-Populate in FIR Complaint</span>
                  </button>
                </div>

                {freezeActionSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{freezeActionSuccess}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. SUB-VIEW 4: DARKNET BREACH RADAR */}
      {activeSubView === "darknet_radar" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-3xl border border-purple-500/30 bg-slate-950/90 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-purple-500/20 pb-4 mb-6">
              <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/50 text-purple-400">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-mono text-white">
                  Darknet Identity Exposure & Data Leak Scanner
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Scan 2026 Dark Web breach dumps (Telegram KYC markets, BreachForums, Combolists) to inspect if threat actors possess your phone, email, or identity records.
                </p>
              </div>
            </div>

            <form onSubmit={handleDarknetScan} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={darknetQuery}
                  onChange={(e) => setDarknetQuery(e.target.value)}
                  placeholder="Enter email address or mobile number to audit..."
                  className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-slate-900 border border-purple-500/40 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isScanningDarknet}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-purple-500 text-white font-mono font-bold text-xs hover:bg-purple-400 transition-all flex items-center gap-1.5"
                >
                  {isScanningDarknet ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>Scan Darknet</span>
                </button>
              </div>
            </form>

            {/* Breach Results Cards */}
            <div className="mt-6 space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>FOUND {darknetResults.length} BREACH EXPOSURES FOR: <strong className="text-white">{darknetQuery}</strong></span>
                <span className="text-red-400 font-bold">IDENTITY COMPROMISE RISK: ELEVATED</span>
              </div>

              {darknetResults.map((breach) => (
                <div
                  key={breach.id}
                  className="rounded-2xl border border-red-500/30 bg-slate-900/80 p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-red-400">{breach.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
                          {breach.severity} IMPACT
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{breach.leakSource}</h4>
                    </div>
                    <span className="text-xs text-slate-400">{breach.breachDate}</span>
                  </div>

                  {/* Leaked fields badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {breach.compromisedData.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[10px]"
                      >
                        ⚠️ {item}
                      </span>
                    ))}
                  </div>

                  {/* Exposed snippet preview */}
                  <div className="rounded-xl bg-black/60 p-3 border border-slate-800 text-xs text-amber-300 truncate">
                    <span className="text-slate-500 mr-2">Exposed Record Preview:</span>
                    {breach.exposedCredentialsPreview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SUB-VIEW 5: EMERGENCY STATUTORY FIR COMPLAINT GENERATOR */}
      {activeSubView === "fir_builder" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-3xl border border-emerald-500/30 bg-slate-950/90 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-mono text-white">
                  Instant Statutory FIR & 1930 Police Complaint Generator
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Generates an official, legally structured cyber crime complaint compliant with Information Technology Act (Sections 66C, 66D, 43) and Bharatiya Nyaya Sanhita (Section 318, 319, 308).
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Complainant Full Legal Name</label>
                <input
                  type="text"
                  defaultValue="Nagarajan S."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Complainant Contact Mobile & Email</label>
                <input
                  type="text"
                  defaultValue="+91 98401 29104 | nagarajan1320@gmail.com"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Total Defrauded Amount (INR)</label>
                <input
                  type="text"
                  defaultValue="₹4,85,000"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-red-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Suspect Mule UPI / Account / Mobile</label>
                <input
                  type="text"
                  defaultValue="cbi.verification.sec@sbi (Txn UTR: 4892019482)"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-cyan-400"
                />
              </div>
            </div>

            {/* Generated Official FIR Template Preview */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
              <div className="text-center font-bold text-white border-b border-slate-800 pb-2">
                FORMAL COMPLAINT UNDER SECTION 154 CrPC / SECTIONS 66C & 66D IT ACT 2000
                <br />
                <span className="text-[11px] text-red-400">TO: THE OFFICER-IN-CHARGE, CYBER CRIME POLICE STATION // 1930 DESK</span>
              </div>
              <p>
                <strong>SUBJECT:</strong> Urgent registration of FIR against unknown cyber fraudsters for digital arrest extortion, impersonation of law enforcement officers, and financial fraud of ₹4,85,000.
              </p>
              <p>
                <strong>1. INCIDENT DETAILS:</strong> On 15-Aug-2026, the complainant received threatening communications from individuals impersonating CBI and Mumbai Police officers via Skype/VoIP and was coerced under psychological duress into transferring funds into mule bank accounts.
              </p>
              <p>
                <strong>2. SUSPECT BENEFICIARY ACCOUNT:</strong> UPI Handle: <span className="text-cyan-300">cbi.verification.sec@sbi</span> | UTR Reference: <span className="text-amber-300">4892019482</span>.
              </p>
              <p>
                <strong>3. PRAYER FOR RELIEF:</strong> Kindly issue an immediate Section 91 CrPC notice to the intermediary bank and NPCI to freeze the beneficiary account in accordance with the Golden Hour protocol and register an FIR under IT Act Sec 66C, 66D and BNS Sec 318(4).
              </p>
            </div>

            {/* Action Download */}
            <button
              onClick={() => {
                const text = `FORMAL POLICE COMPLAINT FOR CYBER CRIME
TO: THE NODAL OFFICER / SHO, CYBER CRIME POLICE STATION

SUBJECT: Urgent Registration of FIR for Cyber Extortion & Immediate Account Freezing Under IT Act 2000

COMPLAINANT: Nagarajan S. (+91 98401 29104 | nagarajan1320@gmail.com)
DATE OF INCIDENT: 15-Aug-2026
AMOUNT LOST: INR 4,85,000
SUSPECT BENEFICIARY VPA: cbi.verification.sec@sbi
BANK TXN UTR: 4892019482

SECTIONS INVOKED:
- Information Technology Act 2000: Sections 66C, 66D, 43
- Bharatiya Nyaya Sanhita (BNS): Sections 318(4), 319, 308

I request you to immediately register this FIR and issue an emergency freeze notice to the bank.

Digitally Signed via ScamShield Cyber Engine`;
                const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "OFFICIAL_CYBER_CRIME_FIR_COMPLAINT.txt";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-mono font-black text-xs sm:text-sm hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Watermarked Formal FIR Letter (.txt)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
