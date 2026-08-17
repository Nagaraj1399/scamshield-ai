import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Activity,
  Terminal,
  Pause,
  Play,
  Trash2,
  Filter,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Zap,
  Maximize2,
  Minimize2,
  Search,
  CheckCircle2,
  FileCode,
  Download,
  Eye,
  Sliders,
  X,
  Copy,
  Check,
} from "lucide-react";
import { ScenarioDefinition, SimulationTurnResponse } from "../types";

export interface NetworkPacket {
  id: string;
  timestamp: string;
  protocol: "TCP" | "UDP" | "TLSv1.3" | "HTTP/2" | "DNS" | "ICMP" | "QUIC" | "SMB";
  source: string;
  destination: string;
  length: number;
  disposition: "PASS" | "INSPECT" | "ALERT" | "DROP" | "QUARANTINE";
  threatScore: number; // 0 to 100
  entropy: number; // e.g. 7.94
  summary: string;
  flags: string[];
  signatureMatch?: string;
  mitreTechnique?: string;
  hexDump: string;
  asciiDump: string;
  payloadSummary: string;
  dpiAnalysis: {
    sni?: string;
    userAgent?: string;
    ja3Hash?: string;
    heuristicTrigger?: string;
    payloadRiskLevel: "CLEAN" | "SUSPICIOUS" | "MALICIOUS" | "CRITICAL";
  };
}

interface PacketInspectionTerminalProps {
  scenario?: ScenarioDefinition;
  currentTurn?: SimulationTurnResponse | null;
  securityScore?: number;
  isSimulating?: boolean;
}

export function PacketInspectionTerminal({
  scenario,
  currentTurn,
  securityScore = 75,
  isSimulating = false,
}: PacketInspectionTerminalProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [filterLevel, setFilterLevel] = useState<"ALL" | "THREATS" | "HIGH_ENTROPY" | "C2_BEACON" | "DNS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<NetworkPacket | null>(null);
  const [crtEffect, setCrtEffect] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Initial Seed Packets
  const [packets, setPackets] = useState<NetworkPacket[]>(() => [
    {
      id: "PKT-9401",
      timestamp: "00:09:41.102",
      protocol: "TLSv1.3",
      source: "192.168.4.112:51204",
      destination: "104.244.42.1:443",
      length: 1420,
      disposition: "PASS",
      threatScore: 8,
      entropy: 4.12,
      summary: "TLS Client Hello // SNI: api.enterprise-auth.okta.com",
      flags: ["ACK", "PSH"],
      hexDump: "16 03 03 01 9a 01 00 01 96 03 03 8d 3a 4f b2 c9 e1 09 a4 77 12 3f e9 01",
      asciiDump: "........:O.....w.?..",
      payloadSummary: "Valid TLS Session Handshake with trusted corporate Okta certificate.",
      dpiAnalysis: {
        sni: "api.enterprise-auth.okta.com",
        ja3Hash: "e7d705a3286e19ea42f587b344ee6865",
        payloadRiskLevel: "CLEAN",
      },
    },
    {
      id: "PKT-9402",
      timestamp: "00:09:42.418",
      protocol: "DNS",
      source: "192.168.4.112:53120",
      destination: "1.1.1.1:53",
      length: 78,
      disposition: "INSPECT",
      threatScore: 35,
      entropy: 5.62,
      summary: "Standard Query A auth-portal-security-update.live",
      flags: ["RD"],
      hexDump: "0a 1f 01 00 00 01 00 00 00 00 00 00 1a 61 75 74 68 2d 70 6f 72 74 61 6c",
      asciiDump: ".............auth-portal",
      payloadSummary: "Newly registered domain (Age: 3 hours). Registrar: NameSilo LLC.",
      dpiAnalysis: {
        sni: "auth-portal-security-update.live",
        heuristicTrigger: "Newly registered domain within 24hr window",
        payloadRiskLevel: "SUSPICIOUS",
      },
    },
    {
      id: "PKT-9403",
      timestamp: "00:09:43.882",
      protocol: "HTTP/2",
      source: "198.51.100.24:443",
      destination: "192.168.4.112:51208",
      length: 2180,
      disposition: "ALERT",
      threatScore: 88,
      entropy: 7.92,
      summary: "POST /api/v1/auth/mfa-intercept // Evilginx2 Stager Ingress",
      flags: ["ACK", "PSH", "FIN"],
      signatureMatch: "ET TROJAN PhishKit ReverseProxy Ingress (SID: 2048192)",
      mitreTechnique: "T1566.002 - Spearphishing Link / T1111 - MFA Interception",
      hexDump: "50 4f 53 54 20 2f 61 70 69 2f 76 31 2f 61 75 74 68 2f 6d 66 61 2d 69 6e",
      asciiDump: "POST /api/v1/auth/mfa-in",
      payloadSummary: "High-entropy session cookie exfiltration payload attempting reverse proxy session theft.",
      dpiAnalysis: {
        sni: "auth-portal-security-update.live",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Evilginx/3.4",
        ja3Hash: "771,4865-4866-4867-49195-49199-49196-49200,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0",
        heuristicTrigger: "EvilProxy / Modlishka session token interceptor heuristic",
        payloadRiskLevel: "CRITICAL",
      },
    },
  ]);

  // Audio beep for threat detections
  const playAlertSound = (isHighThreat: boolean) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isHighThreat) {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch {
      // Ignore audio context errors
    }
  };

  // Helper generator for simulated live packet feed
  const generateRealisticPacket = (forceThreat = false): NetworkPacket => {
    const protocols: Array<NetworkPacket["protocol"]> = ["TCP", "TLSv1.3", "HTTP/2", "DNS", "UDP", "QUIC", "SMB"];
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;
    const pktId = `PKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const isThreat = forceThreat || Math.random() < 0.28;
    const isCritical = isThreat && (forceThreat || Math.random() < 0.45);

    let disposition: NetworkPacket["disposition"] = "PASS";
    let threatScore = Math.floor(5 + Math.random() * 25);
    let entropy = Number((3.2 + Math.random() * 2.8).toFixed(2));
    let summary = "";
    let signatureMatch: string | undefined;
    let mitreTechnique: string | undefined;
    let payloadSummary = "";
    let riskLevel: NetworkPacket["dpiAnalysis"]["payloadRiskLevel"] = "CLEAN";

    const localIp = `192.168.4.${Math.floor(100 + Math.random() * 50)}`;
    const remoteIp = isThreat
      ? `${Math.floor(45 + Math.random() * 150)}.${Math.floor(10 + Math.random() * 200)}.${Math.floor(1 + Math.random() * 250)}.${Math.floor(2 + Math.random() * 250)}`
      : `${Math.floor(140 + Math.random() * 50)}.${Math.floor(82 + Math.random() * 100)}.${Math.floor(10 + Math.random() * 200)}.${Math.floor(1 + Math.random() * 254)}`;

    if (isCritical) {
      disposition = Math.random() > 0.5 ? "DROP" : "QUARANTINE";
      threatScore = Math.floor(85 + Math.random() * 15);
      entropy = Number((7.85 + Math.random() * 0.14).toFixed(2));
      riskLevel = "CRITICAL";

      const threatTemplates = [
        {
          sum: "Malleable C2 Beacon Ingress // POST /push-notifications/sync",
          sig: "ET MALWARE CobaltStrike C2 Jitter Beacon (SID: 2841029)",
          mitre: "T1071.001 - Application Layer Protocol / T1573 - Encrypted Channel",
          desc: "Asymmetric encrypted beacon with sleep-jitter pattern matching Cobalt Strike watermark #42918.",
        },
        {
          sum: "Spearphishing Token Replay // GET /oauth2/v2.0/token?redirect_uri=...",
          sig: "ET WEB_CLIENT EvilProxy OAuth2 Session Interception (SID: 2049104)",
          mitre: "T1566.002 - Spearphishing Link / T1528 - Steal Application Access Token",
          desc: "Targeted session token hijacking targeting corporate HR and Finance credentials.",
        },
        {
          sum: "Voice Deepfake Synthesizer Streaming Chunk // UDP RTP Payload",
          sig: "AI_DEFENSE Voice Biometric Invariance Spike (P-Value > 0.96)",
          mitre: "T1656 - Impersonation / AI Synthetic Audio Telemetry",
          desc: "Spectral phase analysis detected synthetic formants and zero micro-tremor biological signature.",
        },
        {
          sum: "Ransomware Volume Shadow Copy Purge // WMI ExecMethod (vssadmin)",
          sig: "ET TROJAN BlackCat/ALPHV ShadowCopy Annihilation (SID: 2038192)",
          mitre: "T1490 - Inhibit System Recovery / T1047 - Windows Management Instrumentation",
          desc: "Command sequence attempting unprivileged VSS shadow purge prior to multi-threaded locker dispatch.",
        },
      ];

      const chosen = threatTemplates[Math.floor(Math.random() * threatTemplates.length)];
      summary = chosen.sum;
      signatureMatch = chosen.sig;
      mitreTechnique = chosen.mitre;
      payloadSummary = chosen.desc;
    } else if (isThreat) {
      disposition = "ALERT";
      threatScore = Math.floor(55 + Math.random() * 25);
      entropy = Number((6.4 + Math.random() * 1.1).toFixed(2));
      riskLevel = "SUSPICIOUS";

      const suspiciousTemplates = [
        {
          sum: "Unresolved DNS CNAME to fast-flux bulletproof hosting IP pool",
          sig: "ET DNS Suspicious High-Entropy Fast-Flux Resolution (SID: 2018892)",
          desc: "Dynamic DNS resolution pointing to bulletproof ASN in non-standard jurisdiction.",
        },
        {
          sum: "TLS Client Hello with non-RFC cipher suite ordering & anomalous JA3",
          sig: "JA3 Fingerprint Mismatch (Identified: Metasploit/Pupy C2 Client)",
          desc: "SSL/TLS negotiation signature differs from standard Chrome/Edge corporate browser profiles.",
        },
        {
          sum: "HTTP Bearer Token passed via unencrypted URL parameter",
          sig: "ET POLICY Plaintext Auth Credential Leakage (SID: 2009182)",
          desc: "Sensitive bearer token detected in plaintext URI querystring.",
        },
      ];

      const chosen = suspiciousTemplates[Math.floor(Math.random() * suspiciousTemplates.length)];
      summary = chosen.sum;
      signatureMatch = chosen.sig;
      payloadSummary = chosen.desc;
    } else {
      disposition = Math.random() > 0.7 ? "INSPECT" : "PASS";
      threatScore = Math.floor(4 + Math.random() * 20);
      riskLevel = "CLEAN";

      const cleanTemplates = [
        "TLSv1.3 Encrypted Application Data // SNI: telemetry.azure.com:443",
        "HTTPS GET /cdn/assets/font-inter.woff2 [200 OK]",
        "DNS Standard Query Response A 142.250.190.46 (google.com)",
        "NTP Synchronization packet -> time.cloudflare.com",
        "QUIC Initial Packet (1-RTT Key Exchange Handshake)",
        "TCP Keep-Alive probe // corporate gateway 10.0.0.1",
      ];
      summary = cleanTemplates[Math.floor(Math.random() * cleanTemplates.length)];
      payloadSummary = "Standard benign protocol communication compliant with zero-trust egress rules.";
    }

    const hexChars = "0123456789abcdef";
    let hexDump = "";
    for (let i = 0; i < 24; i++) {
      hexDump += `${hexChars[Math.floor(Math.random() * 16)]}${hexChars[Math.floor(Math.random() * 16)]} `;
    }

    return {
      id: pktId,
      timestamp: timeStr,
      protocol,
      source: `${localIp}:${Math.floor(30000 + Math.random() * 30000)}`,
      destination: `${remoteIp}:${protocol === "DNS" ? 53 : protocol === "HTTP/2" ? 80 : 443}`,
      length: Math.floor(64 + Math.random() * 1440),
      disposition,
      threatScore,
      entropy,
      summary,
      flags: ["ACK", "PSH"],
      signatureMatch,
      mitreTechnique,
      hexDump: hexDump.trim(),
      asciiDump: "E..4.@..@.........d..",
      payloadSummary,
      dpiAnalysis: {
        sni: isCritical ? "urgent-bank-verification.com" : isThreat ? "telemetry-verify.biz" : "cdn.corporate.net",
        ja3Hash: "e7d705a3286e19ea42f587b344ee6865",
        heuristicTrigger: isCritical ? "Zero-Day Exploit / High Entropy Buffer" : isThreat ? "Heuristic Policy Violation" : undefined,
        payloadRiskLevel: riskLevel,
      },
    };
  };

  // Real-time generator loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newPkt = generateRealisticPacket();
      setPackets((prev) => {
        const updated = [...prev, newPkt];
        // Keep last 120 packets in memory
        return updated.length > 120 ? updated.slice(updated.length - 120) : updated;
      });

      if (newPkt.threatScore >= 70) {
        playAlertSound(true);
      }
    }, 1900);

    return () => clearInterval(interval);
  }, [isPaused, soundEnabled]);

  // Inject critical threat packet when turn has active adversary attacks
  useEffect(() => {
    if (currentTurn?.threat_level === "CRITICAL_BREACH" || currentTurn?.compromise_detected) {
      const urgentPkt = generateRealisticPacket(true);
      urgentPkt.summary = `[SOC-INTERCEPT] ${currentTurn.attack_vector_type || "ADVERSARY EXPLOIT"} // Vector: ${currentTurn.adversary_persona || "Scammer"}`;
      urgentPkt.mitreTechnique = currentTurn.mitre_technique_id || "T1566 - Social Engineering Infiltration";
      urgentPkt.disposition = "DROP";
      urgentPkt.threatScore = 98;
      urgentPkt.dpiAnalysis.payloadRiskLevel = "CRITICAL";

      setPackets((prev) => [...prev, urgentPkt]);
      playAlertSound(true);
    }
  }, [currentTurn]);

  // Auto scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [packets, autoScroll]);

  // Filtered Packets
  const filteredPackets = useMemo(() => {
    return packets.filter((pkt) => {
      // Level filter
      if (filterLevel === "THREATS" && pkt.disposition === "PASS") return false;
      if (filterLevel === "HIGH_ENTROPY" && pkt.entropy < 7.0) return false;
      if (filterLevel === "C2_BEACON" && !pkt.summary.toLowerCase().includes("beacon") && !pkt.summary.toLowerCase().includes("c2")) return false;
      if (filterLevel === "DNS" && pkt.protocol !== "DNS") return false;

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          pkt.summary.toLowerCase().includes(q) ||
          pkt.protocol.toLowerCase().includes(q) ||
          pkt.source.includes(q) ||
          pkt.destination.includes(q) ||
          (pkt.signatureMatch && pkt.signatureMatch.toLowerCase().includes(q)) ||
          (pkt.mitreTechnique && pkt.mitreTechnique.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [packets, filterLevel, searchQuery]);

  // Stats Counters
  const totalCount = packets.length;
  const threatCount = packets.filter((p) => p.disposition === "ALERT" || p.disposition === "DROP" || p.disposition === "QUARANTINE").length;
  const highEntropyCount = packets.filter((p) => p.entropy >= 7.0).length;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getDispositionBadge = (disp: NetworkPacket["disposition"]) => {
    switch (disp) {
      case "DROP":
        return <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-600/70 font-mono font-bold text-[10px] terminal-glow-rose">[DROP]</span>;
      case "QUARANTINE":
        return <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-600/70 font-mono font-bold text-[10px]">[QUARANTINE]</span>;
      case "ALERT":
        return <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/70 font-mono font-bold text-[10px] terminal-glow-amber">[ALERT]</span>;
      case "INSPECT":
        return <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-mono font-bold text-[10px] terminal-glow-cyan">[INSPECT]</span>;
      case "PASS":
      default:
        return <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-mono text-[10px] terminal-glow-emerald">[PASS]</span>;
    }
  };

  return (
    <div className={`mt-6 rounded-2xl neural-glass-card border border-cyan-500/30 overflow-hidden shadow-2xl transition-all duration-300 ${isExpanded ? "fixed inset-4 z-50 mt-0 bg-slate-950/95" : ""}`}>
      {/* Top Header Bar */}
      <div className="border-b border-cyan-500/20 bg-slate-950/95 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.25)]">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${isPaused ? "bg-amber-400" : "bg-emerald-400 animate-ping"}`} />
                REAL-TIME DEEP PACKET INSPECTION (DPI)
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                WIRESHARK / ZEELOG PROBE v4.2
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Live ingress/egress frame sniffer & AI cognitive payload heuristic analyzer
            </p>
          </div>
        </div>

        {/* Top Quick Stats Pill */}
        <div className="flex items-center gap-2 sm:gap-4 text-[11px] font-mono">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Throughput: <strong className="text-white">12.4 Mbps</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Total:</span>
            <span className="font-bold text-cyan-400">{totalCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300">
            <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
            <span>Threats:</span>
            <span className="font-bold text-red-400">{threatCount}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300">
            <span>Entropy &gt; 7:</span>
            <span className="font-bold text-purple-300">{highEntropyCount}</span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
              isPaused
                ? "bg-amber-950 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50"
            }`}
            title={isPaused ? "Resume Live Packet Capture" : "Pause Packet Stream"}
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isPaused ? "RESUME" : "PAUSE"}</span>
          </button>

          {/* Inject Exploit Test Packet */}
          <button
            onClick={() => {
              const injected = generateRealisticPacket(true);
              setPackets((prev) => [...prev, injected]);
              playAlertSound(true);
            }}
            className="px-2.5 py-2 rounded-lg bg-red-950/80 border border-red-500/60 text-red-300 hover:bg-red-900 hover:text-white text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-sm"
            title="Inject simulated high-entropy threat packet into inspection pipeline"
          >
            <Zap className="h-3.5 w-3.5 text-red-400" />
            <span className="hidden sm:inline">INJECT THREAT</span>
          </button>

          {/* Clear Logs */}
          <button
            onClick={() => setPackets([])}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all"
            title="Clear Stream Buffer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          {/* Expand / Minimize */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
            title={isExpanded ? "Collapse View" : "Full-Screen Expand"}
          >
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Filter and Search Secondary Bar */}
      <div className="border-b border-cyan-500/10 bg-slate-950/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
          <span className="text-slate-400 flex items-center gap-1 mr-1 text-[11px]">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {(["ALL", "THREATS", "HIGH_ENTROPY", "C2_BEACON", "DNS"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all whitespace-nowrap ${
                filterLevel === lvl
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_rgba(0,243,255,0.3)] font-bold"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {lvl.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search IP, SNI, CVE, MITRE..."
              className="w-full rounded-md border border-slate-800 bg-slate-900/90 pl-8 pr-3 py-1 text-[11px] font-mono text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[10px]"
              >
                ×
              </button>
            )}
          </div>

          {/* Auto Scroll Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400 select-none">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-0"
            />
            <span>Auto-Scroll</span>
          </label>
        </div>
      </div>

      {/* Terminal View Body with Monospace Scrolling Log & Intermittent Flickering */}
      <div className={`relative bg-slate-950 font-mono text-[11px] sm:text-xs overflow-hidden ${isExpanded ? "h-[calc(100vh-220px)]" : "h-72 sm:h-80"}`}>
        {/* CRT Scanline and Flicker Overlay */}
        {crtEffect && <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-40 z-10" />}
        <div className="pointer-events-none absolute inset-0 terminal-flicker opacity-90 z-0" />

        {/* Scrollable Packet Log Feed */}
        <div ref={scrollRef} className="h-full overflow-y-auto p-3 space-y-1.5 z-20 relative scrollbar-thin">
          {filteredPackets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <Activity className="h-8 w-8 mb-2 opacity-40" />
              <p>No packets match active filter or capture buffer is empty.</p>
            </div>
          ) : (
            filteredPackets.map((pkt) => {
              const isHighAlert = pkt.disposition === "DROP" || pkt.disposition === "QUARANTINE" || pkt.threatScore >= 80;
              const isMediumAlert = pkt.disposition === "ALERT";

              return (
                <div
                  key={pkt.id}
                  onClick={() => setSelectedPacket(pkt)}
                  className={`group cursor-pointer rounded-lg p-2 transition-all border font-mono flex flex-col md:flex-row items-start md:items-center justify-between gap-2 ${
                    isHighAlert
                      ? "bg-red-950/40 border-red-800/60 hover:bg-red-950/70 hover:border-red-500 text-red-200"
                      : isMediumAlert
                      ? "bg-amber-950/30 border-amber-800/50 hover:bg-amber-950/60 hover:border-amber-500 text-amber-200"
                      : "bg-slate-900/50 border-slate-850 hover:bg-slate-850 hover:border-cyan-500/40 text-slate-300"
                  }`}
                >
                  {/* Left: Time, ID, Protocol, Disposition, Flow */}
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="text-slate-500 text-[10px]">{pkt.timestamp}</span>
                    <span className="font-bold text-cyan-400 font-mono text-[10px]">{pkt.id}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {pkt.protocol}
                    </span>
                    {getDispositionBadge(pkt.disposition)}

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <span className="text-slate-300">{pkt.source}</span>
                      <span className="text-cyan-400">➔</span>
                      <span className="text-slate-300">{pkt.destination}</span>
                    </div>
                  </div>

                  {/* Center: Summary & Threat Tags */}
                  <div className="flex-1 min-w-0 md:px-2">
                    <div className="flex items-center gap-2">
                      <p className={`truncate text-xs font-semibold ${isHighAlert ? "text-red-300" : isMediumAlert ? "text-amber-200" : "text-slate-200"}`}>
                        {pkt.summary}
                      </p>
                    </div>

                    {pkt.signatureMatch && (
                      <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-mono mt-0.5">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        <span className="truncate">{pkt.signatureMatch}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Threat Score, Entropy, Details Button */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono">
                      Ent: <strong className={pkt.entropy >= 7.0 ? "text-purple-400" : "text-slate-200"}>{pkt.entropy}</strong>
                    </span>

                    <span className={`px-2 py-0.5 rounded font-mono font-bold border ${
                      pkt.threatScore >= 80
                        ? "bg-red-950 text-red-400 border-red-600"
                        : pkt.threatScore >= 50
                        ? "bg-amber-950 text-amber-400 border-amber-600"
                        : "bg-emerald-950 text-emerald-400 border-emerald-600"
                    }`}>
                      THREAT: {pkt.threatScore}%
                    </span>

                    <button
                      type="button"
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 transition-all font-mono text-[10px] font-bold flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>HEX</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Terminal Footer Telemetry Bar */}
      <div className="border-t border-cyan-500/20 bg-slate-950 px-4 py-2 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            SOCK_RAW PROMISCUOUS MODE: ENABLED
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">BUFFER: ring_buffer_0 (120/1024 slots)</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-cyan-400">DISSECTOR: MITRE ATT&CK T1566/T1656</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Click any packet to inspect raw hex dump & TCP/IP stack</span>
        </div>
      </div>

      {/* Deep Packet Inspector & Hex Dump Modal */}
      {selectedPacket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl rounded-2xl neural-glass-card border border-cyan-500/50 bg-slate-950 p-5 shadow-[0_0_50px_rgba(0,243,255,0.2)] max-h-[90vh] overflow-y-auto font-mono">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
                  <FileCode className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      PACKET DISSECTION // {selectedPacket.id}
                    </h3>
                    {getDispositionBadge(selectedPacket.disposition)}
                  </div>
                  <p className="text-xs text-slate-400">
                    Captured at {selectedPacket.timestamp} • Length: {selectedPacket.length} bytes
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPacket(null)}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Protocol Stack & Flow Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
              <div className="rounded-xl bg-slate-900/90 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Source Endpoint</span>
                <span className="font-bold text-cyan-300 font-mono">{selectedPacket.source}</span>
              </div>
              <div className="rounded-xl bg-slate-900/90 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Destination Endpoint</span>
                <span className="font-bold text-cyan-300 font-mono">{selectedPacket.destination}</span>
              </div>
              <div className="rounded-xl bg-slate-900/90 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Threat Score / Entropy</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`font-bold ${selectedPacket.threatScore >= 75 ? "text-red-400" : "text-emerald-400"}`}>
                    {selectedPacket.threatScore}% Risk
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-purple-300 font-bold">{selectedPacket.entropy} Bits</span>
                </div>
              </div>
            </div>

            {/* AI Cognitive Heuristic & Snort Alert Match */}
            {(selectedPacket.signatureMatch || selectedPacket.mitreTechnique) && (
              <div className="mb-4 rounded-xl bg-red-950/40 border border-red-600/60 p-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-red-400 mb-1">
                  <ShieldAlert className="h-4 w-4" /> THREAT SIGNATURE MATCH
                </div>
                {selectedPacket.signatureMatch && (
                  <p className="text-red-200 font-mono font-semibold">{selectedPacket.signatureMatch}</p>
                )}
                {selectedPacket.mitreTechnique && (
                  <p className="text-amber-300 font-mono text-[11px] mt-1">
                    MITRE ATT&CK: {selectedPacket.mitreTechnique}
                  </p>
                )}
              </div>
            )}

            {/* DPI Inspection Insights */}
            <div className="mb-4 rounded-xl bg-slate-900/70 border border-cyan-500/20 p-3 text-xs space-y-2">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> DEEP PACKET INSPECTION (DPI) HEURISTICS
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">{selectedPacket.payloadSummary}</p>

              {selectedPacket.dpiAnalysis.sni && (
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400">TLS SNI:</span>
                  <span className="text-cyan-300 font-mono">{selectedPacket.dpiAnalysis.sni}</span>
                </div>
              )}
              {selectedPacket.dpiAnalysis.ja3Hash && (
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400">JA3 Fingerprint:</span>
                  <span className="text-purple-300 font-mono truncate">{selectedPacket.dpiAnalysis.ja3Hash}</span>
                </div>
              )}
            </div>

            {/* Raw Hex Dump Dissector */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-cyan-400" /> RAW PACKET HEX DISSECTOR
                </span>
                <button
                  onClick={() => handleCopy(selectedPacket.hexDump, selectedPacket.id)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 text-slate-300 hover:text-cyan-300 border border-slate-800 text-[10px]"
                >
                  {copiedId === selectedPacket.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedId === selectedPacket.id ? "Copied" : "Copy Hex"}</span>
                </button>
              </div>

              <div className="rounded bg-black/70 p-2.5 font-mono text-[11px] text-emerald-400 overflow-x-auto space-y-1 border border-emerald-950/60">
                <div className="text-slate-500">0000  {selectedPacket.hexDump.slice(0, 48)}  | {selectedPacket.asciiDump}</div>
                <div className="text-slate-500">0010  45 00 00 3c 1c 46 40 00 40 06 b1 e6 c0 a8 01 68  | E..&lt;.F@.@....h</div>
                <div className="text-slate-500">0020  c0 a8 01 01 c0 01 00 50 00 00 00 00 a0 02 72 10  | .......P......r.</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedPacket(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close Dissector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
