import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Shield,
  Skull,
  Radio,
  Globe,
  Cpu,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  Server,
  Zap,
  RefreshCw,
  Download,
  Copy,
  Check,
  Search,
  Crosshair,
  Wifi,
  Activity,
  Layers,
  Volume2,
  VolumeX,
  Sliders,
  Send,
  Database,
  ArrowRight,
  Sparkles,
  PhoneCall,
  HardDrive,
  Users,
  Building,
  MonitorCheck,
  FileCode,
  Laptop,
} from "lucide-react";
import {
  ATTACK_PAYLOAD_ARSENAL,
  ACTIVE_C2_SESSIONS,
  LIVE_THREAT_INTEL_FEEDS,
  INCIDENT_TICKETS,
  VULNERABLE_ASSETS,
  INITIAL_SIEM_LOGS,
  ThreatActorPayload,
  C2Session,
  IncidentTicket,
  SiemLogEntry,
} from "../data/cyberSecurityData";
import { cyberAudio } from "../utils/cyberAudio";
import { AudioSettingsModal } from "./AudioSettingsModal";

export function CyberCommandCenter() {
  // Main Perspective: Red Team (Hacker) vs Blue Team (Defense/SOC)
  const [operationalPerspective, setOperationalPerspective] = useState<"red_team" | "blue_team">("red_team");

  // Red Team sub-tabs
  const [redSubTab, setRedSubTab] = useState<"terminal" | "payloads" | "c2_sessions" | "voice_clone" | "ransom_studio">("terminal");

  // Blue Team sub-tabs
  const [blueSubTab, setBlueSubTab] = useState<"threat_intel" | "incident_response" | "vuln_mgmt" | "secops_siem">("threat_intel");

  // Audio settings & modal state
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [audioSettings, setAudioSettings] = useState(() => cyberAudio.getSettings());

  useEffect(() => {
    const unsub = cyberAudio.subscribe((s) => setAudioSettings(s));
    setAudioSettings(cyberAudio.getSettings());
    return () => unsub();
  }, []);

  // CRT Scanlines visual effect toggle
  const [crtEffect, setCrtEffect] = useState<boolean>(false);

  // Red Team: Selected Payload
  const [selectedPayload, setSelectedPayload] = useState<ThreatActorPayload>(ATTACK_PAYLOAD_ARSENAL[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  // Red Team: Selected C2 Session
  const [activeSession, setActiveSession] = useState<C2Session>(ACTIVE_C2_SESSIONS[0]);

  // Red Team: Interactive Terminal CLI State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "================================================================================",
    "  CYBER ADVERSARY OFFENSIVE WORKBENCH v4.8 [KALI-METASPLOIT COBALT ENGINE]       ",
    "  Active Operator: ROOT_PHANTOM // Proxy: Tor Onion Route (Exit: 185.220.101.9) ",
    "  Target Infrastructure: ENTERPRISE FINANCIAL CORP & DOMAIN CONTROLLERS          ",
    "================================================================================",
    "[*] Type 'help' for available hacker commands, or click any Attack Macro below.",
    "[*] C2 Beacon Listener listening on 0.0.0.0:8443 [TLS_AES_256_GCM_SHA384]...",
    "[+] Active compromised victim sessions online: 4 hosts ready for tasking.",
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Blue Team: Incidents State
  const [incidents, setIncidents] = useState<IncidentTicket[]>(INCIDENT_TICKETS);
  const [selectedIncident, setSelectedIncident] = useState<IncidentTicket>(INCIDENT_TICKETS[0]);
  const [containmentAlert, setContainmentAlert] = useState<string | null>(null);

  // Blue Team: SIEM Logs Stream & EPS Meter
  const [siemLogs, setSiemLogs] = useState<SiemLogEntry[]>(INITIAL_SIEM_LOGS);
  const [eventsPerSec, setEventsPerSec] = useState<number>(1420);

  // Voice Clone Simulator State
  const [voiceTarget, setVoiceTarget] = useState("Chief Financial Officer (Anand Verma)");
  const [voicePitch, setVoicePitch] = useState(48);
  const [voiceJitter, setVoiceJitter] = useState(72);
  const [voiceText, setVoiceText] = useState("Rajesh, this is Anand. We need to release the ₹4.5Cr escrow transfer immediately before the RBI audit closes at 4 PM.");
  const [isSynthesizingVoice, setIsSynthesizingVoice] = useState(false);
  const [synthesizedReady, setSynthesizedReady] = useState(false);

  // Ransomware Cryptor Simulator State
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState("ChaCha20-Poly1305 + RSA-4096 Hybrid");
  const [ransomBtcAmount, setRansomBtcAmount] = useState(15.5);
  const [isEncryptingSim, setIsEncryptingSim] = useState(false);
  const [encryptedFilesCount, setEncryptedFilesCount] = useState(0);

  // Scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // Periodic SIEM log stream generator
  useEffect(() => {
    const interval = setInterval(() => {
      const sampleEvents = [
        {
          timestamp: new Date().toISOString().substring(11, 23),
          sourceIp: `192.168.1.${Math.floor(Math.random() * 100 + 10)}`,
          destinationIp: "10.0.4.15",
          protocol: "TCP / 445 (SMB)",
          eventAction: "KERBEROASTING_TGS_REQUEST",
          user: "svc_sql_admin",
          severity: "CRITICAL" as const,
          ruleMatched: "RULE-AD-901: Abnormal TGS Ticket Encryption Downgrade to RC4",
        },
        {
          timestamp: new Date().toISOString().substring(11, 23),
          sourceIp: "185.220.101.9",
          destinationIp: "172.16.2.90",
          protocol: "HTTPS / 8443",
          eventAction: "C2_BEACON_HEARTBEAT",
          user: "SYSTEM",
          severity: "ALERT" as const,
          ruleMatched: "RULE-C2-441: Periodic Jitter POST Request Matching CobaltStrike Beacon",
        },
        {
          timestamp: new Date().toISOString().substring(11, 23),
          sourceIp: "10.0.4.15",
          destinationIp: "20.190.159.0/24",
          protocol: "TCP / 389 (LDAP)",
          eventAction: "BLOODHOUND_GRAPH_RECON",
          user: "domain_user_guest",
          severity: "WARNING" as const,
          ruleMatched: "RULE-RECON-102: Mass LDAP Query Enumerating High-Value Domain Admins",
        },
      ];
      const randomEntry = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setSiemLogs((prev) => [randomEntry, ...prev.slice(0, 8)]);
      setEventsPerSec(1350 + Math.floor(Math.random() * 200));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Handle Terminal Command Submission
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    cyberAudio.playKeyTick();
    const cmd = terminalInput.trim();
    setTerminalInput("");

    executeTerminalCommand(cmd);
  };

  const executeTerminalCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    const newOutput = [`root@phantom-box:~# ${cmd}`];

    if (lower === "help") {
      newOutput.push(
        "Available Adversary Commands:",
        "  nmap -sV <target>       - Scan open ports and service versions",
        "  msfconsole              - Launch Metasploit exploitation framework",
        "  sessions -l             - List active compromised C2 botnet sessions",
        "  sessions -i <id>        - Interact with victim machine shell",
        "  whoami /priv            - Inspect elevated user privileges & token debug",
        "  dump_creds              - Exfiltrate LSASS memory & Active Directory NTDS hashes",
        "  voice_clone             - Launch AI acoustic voice cloning module",
        "  ransom_encrypt          - Execute multi-threaded ChaCha20 filesystem cryptor",
        "  exfil_db                - Stage and upload corporate databases to offshore C2",
        "  clear                   - Clear the terminal console buffer"
      );
    } else if (lower.startsWith("nmap")) {
      cyberAudio.playRadarPing();
      newOutput.push(
        "[*] Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-16 08:48 IST",
        "Nmap scan report for WIN-DC01.CORP.INTERNAL (10.0.4.15)",
        "Host is up (0.00042s latency).",
        "PORT     STATE SERVICE       VERSION",
        "53/tcp   open  domain        Microsoft DNS 6.1.7601",
        "88/tcp   open  kerberos-sec  Microsoft Windows Kerberos",
        "135/tcp  open  msrpc         Microsoft Windows RPC",
        "139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn",
        "389/tcp  open  ldap          Microsoft Windows Active Directory LDAP",
        "445/tcp  open  microsoft-ds  Windows Server 2025 (SMBv2/SMBv3 Vulnerable to RCE)",
        "3389/tcp open  ms-wbt-server Microsoft Terminal Services (NLA Enabled)",
        "[+] VULNERABILITY DETECTED: SMBv3 Remote Code Execution (CVE-2026-SambaCry)",
        "[+] Recommendation: Execute 'msfconsole' to deploy payload."
      );
    } else if (lower === "msfconsole" || lower.startsWith("exploit")) {
      cyberAudio.playExploitSuccess();
      newOutput.push(
        "               _                  _       _ _   ",
        "  _ __ ___  ___| |_ __ _ ___ _ __ | | ___ (_) |_ ",
        " | '_ ` _ \\/ __| __/ _` / __| '_ \\| |/ _ \\| | __|",
        " | | | | | \\__ \\ || (_| \\__ \\ |_) | | (_) | | |_ ",
        " |_| |_| |_|___/\\__\\__,_|___/ .__/|_|\\___/|_|\\__|",
        "                            |_|                  ",
        "=[ metasploit v6.4.22-dev                          ]",
        "+ -- --=[ 2412 exploits - 1289 auxiliary - 428 post       ]",
        "+ -- --=[ 982 payloads - 49 encoders - 14 nops            ]",
        "[*] Loading exploit/windows/smb/ms26_045_sambacry_rce ...",
        "[*] Target set: 10.0.4.15:445 (WIN-DC01)",
        "[*] Sending stage (3.4 MB encrypted shellcode) ...",
        "[+] Meterpreter session 5 opened (NT AUTHORITY\\SYSTEM) at 10.0.4.15:445 -> 185.220.101.9:8443",
        "[+] Gained Full Domain Controller Administrative Control!"
      );
    } else if (lower.startsWith("sessions")) {
      cyberAudio.playClick();
      newOutput.push(
        "Active C2 Meterpreter Sessions:",
        "===============================",
        "Id  Target Host               IP Address     Privilege            OS",
        "--  -----------               ----------     ---------            --",
        "1   WIN-DC01.CORP.INTERNAL    10.0.4.15      DOMAIN_ADMIN         Windows Server 2025",
        "2   MACBOOK-PRO-CFO.CORP      192.168.1.84   USER                 macOS Sequoia 15.3",
        "3   prod-eks-bastion-01       172.31.88.19   NT_AUTHORITY_SYSTEM  Ubuntu 24.04 LTS",
        "4   CORE-BANK-GATEWAY-09      10.12.8.201    LOCAL_ADMIN          RHEL 9.4",
        "[*] Use 'sessions -i <id>' or select from the C2 Botnet Sessions tab."
      );
    } else if (lower === "whoami" || lower === "whoami /priv") {
      cyberAudio.playClick();
      newOutput.push(
        "USER INFORMATION",
        "----------------",
        "User Name: NT AUTHORITY\\SYSTEM",
        "SID:       S-1-5-18",
        "",
        "PRIVILEGES INFORMATION",
        "----------------------",
        "Privilege Name                Description                          State",
        "============================= ==================================== ========",
        "SeDebugPrivilege              Debug programs                       Enabled",
        "SeTcbPrivilege                Act as part of operating system      Enabled",
        "SeImpersonatePrivilege        Impersonate a client after auth      Enabled",
        "SeBackupPrivilege             Back up files and directories        Enabled",
        "SeRestorePrivilege            Restore files and directories        Enabled",
        "SeShutdownPrivilege           Shut down the system                 Enabled"
      );
    } else if (lower === "dump_creds") {
      cyberAudio.playExploitSuccess();
      newOutput.push(
        "[*] Invoking Mimikatz / LSASS Memory Injection (sekurlsa::logonpasswords)...",
        "[+] Extracted Active Domain Controller Credentials:",
        "    Domain: CORP.INTERNAL",
        "    [1] User: Administrator | NTLM: aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0",
        "    [2] User: anand.cfo    | NTLM: e596f1831abb7443226a310b8d821326 [Cleartext Cached: M&APass2026!]",
        "    [3] User: svc_backup   | NTLM: 8846f7eaee8fb117ad06bdd830b7586c [Kerberos AES256 Hash Available]",
        "[+] Total 412 Domain User Hashes Staged to ./loot/ntds_dump.dit"
      );
    } else if (lower === "voice_clone") {
      cyberAudio.playRadarPing();
      setRedSubTab("voice_clone");
      newOutput.push("[*] Switching workspace to AI Neural Voice Clone Studio...");
    } else if (lower === "ransom_encrypt") {
      cyberAudio.playAlert();
      setRedSubTab("ransom_studio");
      newOutput.push("[*] Switching workspace to Multi-Threaded Cryptor Extortion Lab...");
    } else if (lower === "exfil_db") {
      cyberAudio.playExploitSuccess();
      newOutput.push(
        "[*] Compressing and encrypting corporate PostgreSQL database...",
        "[*] Packing 142.8 GB customer transaction records into AES-256 archive...",
        "[+] Transferring to Offshore Bulletproof Storage: sftp://185.220.101.9/incoming/corp_dump.tar.gz",
        "[+] Upload progress: 100% [142.8 GB / 142.8 GB] -> Exfiltration Complete."
      );
    } else if (lower === "clear") {
      setTerminalHistory([]);
      return;
    } else {
      newOutput.push(
        `[-] Command not recognized: '${cmd}'. Type 'help' to view available offensive tools.`
      );
    }

    setTerminalHistory((prev) => [...prev, ...newOutput]);
  };

  // Handle Red Team Attack Macro Button
  const runMacro = (macroCmd: string) => {
    executeTerminalCommand(macroCmd);
  };

  // Handle Copy Payload Code
  const handleCopyPayload = () => {
    navigator.clipboard.writeText(selectedPayload.payloadCodePreview);
    setCopiedCode(true);
    cyberAudio.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Handle Synthesizing Voice
  const handleSynthesizeVoice = () => {
    cyberAudio.playRadarPing();
    setIsSynthesizingVoice(true);
    setSynthesizedReady(false);

    setTimeout(() => {
      setIsSynthesizingVoice(false);
      setSynthesizedReady(true);
      cyberAudio.playExploitSuccess();
    }, 1800);
  };

  // Handle Simulating Ransomware Encryption
  const handleStartRansomware = () => {
    cyberAudio.playAlert();
    setIsEncryptingSim(true);
    setEncryptedFilesCount(0);

    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 450 + 200);
      setEncryptedFilesCount(count);
      if (count >= 14850) {
        clearInterval(interval);
        setIsEncryptingSim(false);
        cyberAudio.playExploitSuccess();
      }
    }, 100);
  };

  // Blue Team: Execute Incident Response Action
  const handleExecuteContainment = (actionName: string) => {
    cyberAudio.playExploitSuccess();
    setContainmentAlert(`Dispatched SOAR Action: '${actionName}' on ${selectedIncident.affectedAsset}`);

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === selectedIncident.id) {
          const executed = inc.executedActions.includes(actionName)
            ? inc.executedActions
            : [...inc.executedActions, actionName];
          const allDone = inc.recommendedActions.every((a) => executed.includes(a) || a === actionName);
          return {
            ...inc,
            executedActions: executed,
            status: allDone ? "ERADICATED" : "CONTAINMENT_TRIGGERED",
          };
        }
        return inc;
      })
    );

    setSelectedIncident((prev) => ({
      ...prev,
      executedActions: prev.executedActions.includes(actionName)
        ? prev.executedActions
        : [...prev.executedActions, actionName],
      status: "CONTAINMENT_TRIGGERED",
    }));

    setTimeout(() => setContainmentAlert(null), 4000);
  };

  return (
    <div
      className={`relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-slate-100 ${
        crtEffect ? "crt-scanline" : ""
      }`}
    >
      {/* Optional CRT Scanline CSS Inject */}
      <style>{`
        .crt-scanline::before {
          content: " ";
          display: block;
          position: fixed;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04));
          z-index: 999;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
          opacity: 0.7;
        }
      `}</style>

      {/* 1. TOP DUAL-PERSPECTIVE COMMAND BRIDGE */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        {/* Glow backdrop based on perspective */}
        <div
          className={`absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            operationalPerspective === "red_team"
              ? "bg-red-600/15"
              : "bg-cyan-600/15"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            operationalPerspective === "red_team"
              ? "bg-purple-600/10"
              : "bg-emerald-600/10"
          }`}
        />

        {/* Top Header Strip with Controls */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                operationalPerspective === "red_team"
                  ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                  : "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              }`}
            >
              {operationalPerspective === "red_team" ? (
                <Skull className="h-6 w-6 animate-pulse" />
              ) : (
                <Shield className="h-6 w-6 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold tracking-widest uppercase ${
                    operationalPerspective === "red_team"
                      ? "text-red-400"
                      : "text-cyan-400"
                  }`}
                >
                  {operationalPerspective === "red_team"
                    ? "ADVERSARY OPS // OFFENSIVE RED-TEAM TERMINAL"
                    : "ENTERPRISE SOC // DEFENSIVE COMMAND & INCIDENT RESPONSE"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-slate-300">
                  REAL-TIME TELEMETRY
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black font-mono tracking-tight text-white uppercase drop-shadow-md">
                {operationalPerspective === "red_team" ? (
                  <>
                    CYBERCRIME <span className="text-red-400">THREAT ACTOR</span> WORKBENCH
                  </>
                ) : (
                  <>
                    CORPORATE <span className="text-cyan-400">SECOPS & THREAT INTEL</span> MATRIX
                  </>
                )}
              </h1>
            </div>
          </div>

          {/* Quick HUD controls: Audio & CRT Scanline */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCrtEffect(!crtEffect);
                cyberAudio.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 ${
                crtEffect
                  ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>CRT Scanlines</span>
            </button>

            <button
              id="cyber-command-audio-btn"
              onClick={() => {
                setIsAudioModalOpen(true);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs border transition-all flex items-center gap-1.5 ${
                audioSettings.masterEnabled
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow hover:bg-cyan-500/30"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Configure Granular Audio Settings (Clicks, Threat Alerts, Voice Calls)"
            >
              {audioSettings.masterEnabled ? (
                <Volume2 className="h-4 w-4 text-cyan-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
              <span className="hidden sm:inline">
                {audioSettings.masterEnabled ? "Audio FX" : "Muted"}
              </span>
            </button>
          </div>
        </div>

        {/* PRIMARY PERSPECTIVE TOGGLE SWITCH */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 p-1.5 rounded-2xl bg-black/70 border border-slate-800">
          <button
            onClick={() => {
              setOperationalPerspective("red_team");
              cyberAudio.playAlert();
            }}
            className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-mono text-xs sm:text-sm font-black uppercase transition-all ${
              operationalPerspective === "red_team"
                ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] scale-[1.01]"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            }`}
          >
            <Skull className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Adversary Ops (The Cyber Hacker / Threat Actor)</span>
          </button>

          <button
            onClick={() => {
              setOperationalPerspective("blue_team");
              cyberAudio.playExploitSuccess();
            }}
            className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-mono text-xs sm:text-sm font-black uppercase transition-all ${
              operationalPerspective === "blue_team"
                ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white shadow-[0_0_25px_rgba(6,182,212,0.5)] scale-[1.01]"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            }`}
          >
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Defensive SOC (Threat Intel, IR & Corporate IT)</span>
          </button>
        </div>

        {/* SUB-TAB NAVIGATOR FOR RED TEAM */}
        {operationalPerspective === "red_team" && (
          <div className="relative z-10 mt-5 flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                setRedSubTab("terminal");
                cyberAudio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                redSubTab === "terminal"
                  ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40"
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>Interactive Hacker Terminal</span>
            </button>

            <button
              onClick={() => {
                setRedSubTab("payloads");
                cyberAudio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                redSubTab === "payloads"
                  ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40"
              }`}
            >
              <FileCode className="h-4 w-4" />
              <span>Payload Weaponizer ({ATTACK_PAYLOAD_ARSENAL.length})</span>
            </button>

            <button
              onClick={() => {
                setRedSubTab("c2_sessions");
                cyberAudio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                redSubTab === "c2_sessions"
                  ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40"
              }`}
            >
              <Laptop className="h-4 w-4" />
              <span>C2 Botnet Sessions ({ACTIVE_C2_SESSIONS.length})</span>
            </button>

            <button
              onClick={() => {
                setRedSubTab("voice_clone");
                cyberAudio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                redSubTab === "voice_clone"
                  ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40"
              }`}
            >
              <PhoneCall className="h-4 w-4" />
              <span>AI Voice Deepfake Clone</span>
            </button>

            <button
              onClick={() => {
                setRedSubTab("ransom_studio");
                cyberAudio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                redSubTab === "ransom_studio"
                  ? "bg-red-500 text-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-red-500/40"
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Ransomware Cryptor Studio</span>
            </button>
          </div>
        )}

        {/* SUB-TAB NAVIGATOR FOR BLUE TEAM */}
        {operationalPerspective === "blue_team" && (
          <div className="relative z-10 mt-5 flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                setBlueSubTab("threat_intel");
                cyberAudio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                blueSubTab === "threat_intel"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-cyan-500/40"
              }`}
            >
              <Radio className="h-4 w-4" />
              <span>Live Threat Intel & CVEs</span>
            </button>

            <button
              onClick={() => {
                setBlueSubTab("incident_response");
                cyberAudio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                blueSubTab === "incident_response"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-cyan-500/40"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Incident Response & SOAR</span>
            </button>

            <button
              onClick={() => {
                setBlueSubTab("vuln_mgmt");
                cyberAudio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                blueSubTab === "vuln_mgmt"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-cyan-500/40"
              }`}
            >
              <Crosshair className="h-4 w-4" />
              <span>Vulnerability & Asset Exposure</span>
            </button>

            <button
              onClick={() => {
                setBlueSubTab("secops_siem");
                cyberAudio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                blueSubTab === "secops_siem"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-cyan-500/40"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Corporate SecOps & SIEM Telemetry</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. PERSPECTIVE A: ADVERSARY OPS (THE CYBER HACKER WORKBENCH)              */}
      {/* ========================================================================= */}
      {operationalPerspective === "red_team" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* SUB-VIEW A.1: INTERACTIVE HACKER TERMINAL CLI */}
          {redSubTab === "terminal" && (
            <div className="space-y-4">
              
              {/* Quick Attack Macro Launch Bar */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-950/90 border border-red-500/30">
                <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5 px-2">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Attack Macros:</span>
                </span>

                <button
                  onClick={() => runMacro("nmap -sV 10.0.4.15")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500 font-mono text-xs text-slate-200 hover:text-red-300 transition-all"
                >
                  🔍 nmap Scan DC01
                </button>

                <button
                  onClick={() => runMacro("msfconsole")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500 font-mono text-xs text-slate-200 hover:text-red-300 transition-all"
                >
                  ⚡ Exploit SambaCry
                </button>

                <button
                  onClick={() => runMacro("whoami /priv")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500 font-mono text-xs text-slate-200 hover:text-red-300 transition-all"
                >
                  🛡️ whoami /priv
                </button>

                <button
                  onClick={() => runMacro("dump_creds")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500 font-mono text-xs text-slate-200 hover:text-red-300 transition-all"
                >
                  🔑 Dump NTDS Hashes
                </button>

                <button
                  onClick={() => runMacro("exfil_db")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500 font-mono text-xs text-slate-200 hover:text-red-300 transition-all"
                >
                  📤 Exfiltrate DB (142GB)
                </button>

                <button
                  onClick={() => runMacro("clear")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400 hover:text-white transition-all ml-auto"
                >
                  Clear Screen
                </button>
              </div>

              {/* Terminal Window */}
              <div className="rounded-3xl border border-red-500/40 bg-black/95 p-5 sm:p-6 shadow-[0_0_40px_rgba(239,68,68,0.2)] font-mono text-xs">
                
                {/* Terminal Title Bar */}
                <div className="flex items-center justify-between border-b border-red-500/30 pb-3 mb-4 text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-[11px] text-red-400 font-bold ml-2">
                      kali@phantom-c2:~ (bash / tty1) - PID 4102 [ROOT]
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 hidden sm:inline-block">
                    C2 JITTER: 25% | TLS 1.3 ENCRYPTED
                  </span>
                </div>

                {/* Console Log Area */}
                <div className="h-80 sm:h-96 overflow-y-auto space-y-1 pr-2 text-slate-300 leading-relaxed font-mono">
                  {terminalHistory.map((line, idx) => {
                    let lineClass = "text-slate-300";
                    if (line.startsWith("root@")) lineClass = "text-red-400 font-bold";
                    else if (line.startsWith("[+]")) lineClass = "text-emerald-400 font-bold";
                    else if (line.startsWith("[*]")) lineClass = "text-cyan-300";
                    else if (line.startsWith("[-]")) lineClass = "text-rose-400";
                    else if (line.includes("===")) lineClass = "text-red-500/60";

                    return (
                      <div key={idx} className={`${lineClass} whitespace-pre-wrap`}>
                        {line}
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>

                {/* Interactive CLI Input Line */}
                <form onSubmit={handleTerminalSubmit} className="mt-4 pt-3 border-t border-red-500/20 flex items-center gap-2">
                  <span className="text-red-400 font-bold font-mono">root@phantom-box:~#</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type hacker command (e.g. nmap -sV, msfconsole, dump_creds, whoami)..."
                    className="flex-1 bg-transparent border-none text-red-300 font-mono text-xs focus:outline-none focus:ring-0 placeholder:text-slate-600"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 font-bold text-xs hover:bg-red-500 hover:text-slate-950 transition-all flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    <span>Run</span>
                  </button>
                </form>
              </div>

              {/* MITRE ATT&CK Kill Chain Progress Bar */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-red-400 font-bold uppercase">
                    MITRE ATT&CK ADVERSARY KILL CHAIN STAGE
                  </span>
                  <span className="text-emerald-400 font-bold">STAGE 6/7: EXFILTRATION & IMPACT</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    1. Recon (DONE)
                  </div>
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    2. Weaponize (DONE)
                  </div>
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    3. Delivery (DONE)
                  </div>
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    4. Exploit (DONE)
                  </div>
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    5. Privilege (SYSTEM)
                  </div>
                  <div className="p-2 rounded bg-red-950/80 border border-red-500 text-red-300 font-bold animate-pulse">
                    6. Exfil / Ransom
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-500">
                    7. Destruction
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SUB-VIEW A.2: PAYLOAD WEAPONIZER & PHISHING FORGE */}
          {redSubTab === "payloads" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Arsenal Selector */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-red-400 uppercase flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span>Offensive Weaponry Arsenal</span>
                </h3>

                {ATTACK_PAYLOAD_ARSENAL.map((payload) => {
                  const isSelected = selectedPayload.id === payload.id;
                  return (
                    <div
                      key={payload.id}
                      onClick={() => {
                        setSelectedPayload(payload);
                        cyberAudio.playClick();
                      }}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        isSelected
                          ? "bg-slate-900 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                          : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-red-400">
                          {payload.category}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
                          {payload.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white font-mono leading-tight mb-2">
                        {payload.name}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Target: {payload.targetSystem.substring(0, 18)}...</span>
                        <span className="text-emerald-400 font-bold">{payload.successRate}% Success</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Payload Inspector & Code Generator */}
              <div className="lg:col-span-2 rounded-3xl border border-red-500/30 bg-slate-950/95 p-6 shadow-2xl space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-red-500/20 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
                      MITRE ATT&CK: {selectedPayload.mitreTechniqueId}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">
                      {selectedPayload.name}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Target Vector: {selectedPayload.targetSystem} | Delivery: {selectedPayload.deliveryMethod}
                    </p>
                  </div>

                  <button
                    onClick={handleCopyPayload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 font-mono text-xs font-bold hover:bg-red-500 hover:text-slate-950 transition-all shadow"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode ? "Copied to Clipboard" : "Copy Payload Stager"}</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800 font-mono text-xs text-slate-300">
                  <span className="text-[10px] text-red-400 font-bold uppercase block mb-1">
                    Weaponization Summary:
                  </span>
                  <p className="leading-relaxed">{selectedPayload.description}</p>
                </div>

                {/* Stager Code Preview */}
                <div className="space-y-2 font-mono">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>EXPLOIT STAGER CODE // CONFIGURATION:</span>
                    <span className="text-emerald-400 font-bold">READY TO DEPLOY</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-black border border-slate-800 text-red-300 text-xs overflow-x-auto leading-relaxed shadow-inner">
                    <code>{selectedPayload.payloadCodePreview}</code>
                  </pre>
                </div>

                {/* Execution Sequence Steps */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Sequential Attack Execution Vector:
                  </h4>
                  <div className="space-y-2 font-mono text-xs">
                    {selectedPayload.executionSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800"
                      >
                        <span className="h-5 w-5 rounded-full bg-red-950 border border-red-500/40 text-red-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-slate-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SUB-VIEW A.3: LIVE C2 BOTNET SESSIONS */}
          {redSubTab === "c2_sessions" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ACTIVE_C2_SESSIONS.map((sess) => {
                  const isSelected = activeSession.sessionId === sess.sessionId;
                  return (
                    <div
                      key={sess.sessionId}
                      onClick={() => {
                        setActiveSession(sess);
                        cyberAudio.playClick();
                      }}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        isSelected
                          ? "bg-slate-900 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                          : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[10px] font-mono text-red-400 font-bold">{sess.sessionId}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white font-mono truncate">{sess.targetHost}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">{sess.ipAddress} ({sess.os})</p>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-amber-400 font-bold">{sess.userPrivilege}</span>
                        <span className="text-slate-400">Beacon: {sess.lastBeaconSec}s ago</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Session Remote Shell Panel */}
              <div className="rounded-3xl border border-red-500/30 bg-slate-950/95 p-6 shadow-2xl space-y-4 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-500/20 pb-4">
                  <div>
                    <span className="text-[10px] text-red-400 font-bold uppercase">
                      ACTIVE REMOTE INTERACTIVE SHELL
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Target: {activeSession.targetHost} ({activeSession.ipAddress})
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Privilege: <strong className="text-red-400">{activeSession.userPrivilege}</strong> | Staged Loot: {activeSession.compromisedDataSize}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => runMacro("whoami /priv")}
                      className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500 hover:text-slate-950 font-bold transition-all"
                    >
                      Elevate Privileges
                    </button>
                    <button
                      onClick={() => runMacro("dump_creds")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold transition-all"
                    >
                      Dump SAM/LSASS
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black border border-slate-800 text-slate-300 space-y-2 leading-relaxed">
                  <div className="text-emerald-400 font-bold">
                    [+] Meterpreter Session 1 active (TLS 1.3 reverse TCP socket to {activeSession.ipAddress})
                  </div>
                  <div>meterpreter &gt; sysinfo</div>
                  <div className="text-slate-400">
                    Computer: {activeSession.targetHost}<br />
                    OS: {activeSession.os}<br />
                    Architecture: x64<br />
                    System Language: en_US<br />
                    Domain: CORP.INTERNAL<br />
                    Logged On Users: 3
                  </div>
                  <div>meterpreter &gt; getuid</div>
                  <div className="text-red-400 font-bold">Server username: {activeSession.userPrivilege === "DOMAIN_ADMIN" ? "CORP\\Administrator" : "NT AUTHORITY\\SYSTEM"}</div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW A.4: AI VOICE DEEPFAKE CLONE STUDIO */}
          {redSubTab === "voice_clone" && (
            <div className="max-w-4xl mx-auto rounded-3xl border border-red-500/30 bg-slate-950/95 p-6 sm:p-8 shadow-2xl space-y-6 font-mono">
              <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
                <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Neural Audio Ghost (Real-Time Voice Cloning Simulator)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Synthesize executive speech embeddings and spoof cellular caller IDs to perform authorized social engineering tests.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Target Profile</label>
                  <select
                    value={voiceTarget}
                    onChange={(e) => setVoiceTarget(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-red-500 focus:outline-none"
                  >
                    <option>Chief Financial Officer (Anand Verma)</option>
                    <option>Managing Director & CEO (Dr. Rajesh Rao)</option>
                    <option>Senior VP Information Security (R. Shetty)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Spoofed Caller ID Display</label>
                  <input
                    type="text"
                    defaultValue="+91 22 2262 0821 (Executive SIM)"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-red-300 font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Acoustic Pitch Modulation</span>
                    <span className="text-red-400 font-bold">{voicePitch} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Cellular Packet Jitter Simulation</span>
                    <span className="text-amber-400 font-bold">{voiceJitter}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceJitter}
                    onChange={(e) => setVoiceJitter(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Text Lure Input */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase block mb-1">Spoken Lure Script</label>
                <textarea
                  rows={3}
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSynthesizeVoice}
                disabled={isSynthesizingVoice}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono font-bold text-xs hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2"
              >
                {isSynthesizingVoice ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Synthesizing Acoustic Formants...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Synthesize & Inject Voice Stream</span>
                  </>
                )}
              </button>

              {synthesizedReady && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>99.4% Match Audio Stream Synthesized Successfully</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Acoustic harmonics matched reference voice print. Ready to bridge onto VoIP trunk +91 22 2262 0821.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW A.5: RANSOMWARE CRYPTOR STUDIO */}
          {redSubTab === "ransom_studio" && (
            <div className="max-w-4xl mx-auto rounded-3xl border border-red-500/30 bg-slate-950/95 p-6 sm:p-8 shadow-2xl space-y-6 font-mono text-xs">
              <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
                <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Multi-Threaded Hybrid Cryptor & Extortion Studio
                  </h3>
                  <p className="text-xs text-slate-400">
                    Preview how modern double-extortion ransomware encrypts corporate storage while exfiltrating databases.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase block">Encryption Algorithm</label>
                  <select
                    value={encryptionAlgorithm}
                    onChange={(e) => setEncryptionAlgorithm(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-red-500"
                  >
                    <option>ChaCha20-Poly1305 + RSA-4096 Hybrid</option>
                    <option>AES-256-GCM + Curve25519</option>
                    <option>Salsa20 + Dilithium Post-Quantum</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase block">Ransom Demanded (BTC / XMR)</label>
                  <input
                    type="number"
                    value={ransomBtcAmount}
                    onChange={(e) => setRansomBtcAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-red-400 font-bold font-mono text-xs focus:border-red-500"
                  />
                </div>
              </div>

              {/* Encryption Progress Gauge */}
              <div className="p-5 rounded-2xl bg-black border border-red-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-red-400 uppercase font-bold">
                    Files Encrypted (SYSVOL + SQL DB):
                  </span>
                  <span className="text-base font-black text-red-400">{encryptedFilesCount} / 14,850 Files</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-150"
                    style={{ width: `${Math.min((encryptedFilesCount / 14850) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleStartRansomware}
                disabled={isEncryptingSim}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono font-bold text-xs hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2"
              >
                {isEncryptingSim ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Encrypting File System Multi-Threaded...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Execute Cryptor & Drop README_RECOVER.txt</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PERSPECTIVE B: ENTERPRISE SOC & CORPORATE IT DEFENSE MATRIX            */}
      {/* ========================================================================= */}
      {operationalPerspective === "blue_team" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* SUB-VIEW B.1: LIVE THREAT INTEL & ZERO-DAY RADAR */}
          {blueSubTab === "threat_intel" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {LIVE_THREAT_INTEL_FEEDS.map((feed) => (
                  <div
                    key={feed.cveId}
                    className="rounded-2xl bg-slate-950/90 border border-cyan-500/30 p-4 space-y-3 font-mono shadow-lg hover:border-cyan-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-cyan-400">{feed.cveId}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                          feed.cvssScore >= 9.0
                            ? "bg-red-950 text-red-300 border border-red-500 animate-pulse"
                            : "bg-amber-950 text-amber-300 border border-amber-500"
                        }`}
                      >
                        CVSS {feed.cvssScore}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight">{feed.title}</h4>
                    <p className="text-[11px] text-slate-400">Software: {feed.affectedSoftware}</p>

                    <div className="pt-2 border-t border-slate-800 text-[10px] flex items-center justify-between">
                      <span className="text-red-400">Actor: {feed.threatActorExploiting}</span>
                      <span className="text-emerald-400 font-bold">EPSS {(feed.epssProbability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Threat Intel Deep Dive Banner */}
              <div className="rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 font-mono text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-cyan-400" />
                    <h3 className="font-bold text-white uppercase">
                      National Vulnerability Database & CISA KEV Exploitation Radar
                    </h3>
                  </div>
                  <span className="text-emerald-400 font-bold">● 4 Zero-Days Exploited in the Wild</span>
                </div>

                <div className="space-y-3 text-slate-300">
                  {LIVE_THREAT_INTEL_FEEDS.map((feed) => (
                    <div
                      key={feed.cveId}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-cyan-400 font-bold mr-2">{feed.cveId}:</span>
                        <span>{feed.remediationSummary}</span>
                      </div>
                      <button
                        onClick={() => {
                          setBlueSubTab("incident_response");
                          cyberAudio.playClick();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-bold text-[10px] shrink-0"
                      >
                        Deploy Patch Orchestration
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW B.2: INCIDENT RESPONSE & SOAR WORKFLOW */}
          {blueSubTab === "incident_response" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
              
              {/* Left Incident Ticket Queue */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Active Sev-1 Security Incidents</span>
                </h3>

                {incidents.map((inc) => {
                  const isSelected = selectedIncident.id === inc.id;
                  return (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncident(inc);
                        cyberAudio.playClick();
                      }}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        isSelected
                          ? "bg-slate-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                          : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-cyan-400 font-bold">{inc.id}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                            inc.status === "ERADICATED"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500"
                              : "bg-red-950 text-red-300 border border-red-500 animate-pulse"
                          }`}
                        >
                          {inc.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight mb-2">{inc.title}</h4>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Source: {inc.detectionSource}</span>
                        <span className="text-amber-400">{inc.severity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right SOAR Remediation Panel */}
              <div className="lg:col-span-2 rounded-3xl border border-cyan-500/30 bg-slate-950/95 p-6 shadow-2xl space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cyan-500/20 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">
                      INCIDENT TRIAGE // {selectedIncident.id}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      {selectedIncident.title}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Affected Asset: <strong className="text-white">{selectedIncident.affectedAsset}</strong> | MITRE: {selectedIncident.mitreTactic}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      selectedIncident.status === "ERADICATED"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500"
                        : "bg-red-950 text-red-300 border border-red-500"
                    }`}
                  >
                    {selectedIncident.status}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">Forensic Detection Details:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedIncident.summary}</p>
                </div>

                {/* 1-Click Automated Containment Actions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span>SOAR Automated Containment & Eradication Playbook:</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedIncident.recommendedActions.map((action, idx) => {
                      const isExecuted = selectedIncident.executedActions.includes(action);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            {isExecuted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                                {idx + 1}
                              </span>
                            )}
                            <span className={isExecuted ? "text-emerald-300 line-through" : "text-slate-200"}>
                              {action}
                            </span>
                          </div>

                          <button
                            onClick={() => handleExecuteContainment(action)}
                            disabled={isExecuted}
                            className={`px-3 py-1.5 rounded-lg font-bold text-[10px] shrink-0 transition-all ${
                              isExecuted
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 cursor-default"
                                : "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                            }`}
                          >
                            {isExecuted ? "CONTAINED" : "Execute 1-Click"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {containmentAlert && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{containmentAlert}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-VIEW B.3: VULNERABILITY & ASSET EXPOSURE */}
          {blueSubTab === "vuln_mgmt" && (
            <div className="rounded-3xl border border-cyan-500/30 bg-slate-950/95 p-6 shadow-2xl space-y-6 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-400">
                    <Crosshair className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Corporate Attack Surface & Crown Jewel Vulnerability Map
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time exposure auditing across Domain Controllers, Fintech APIs, VPN Gateways, and Kubernetes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Assets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Asset Hostname</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Open Ports</th>
                      <th className="p-3">Risk Score</th>
                      <th className="p-3">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950">
                    {VULNERABLE_ASSETS.map((asset) => (
                      <tr key={asset.assetId} className="hover:bg-slate-900/50">
                        <td className="p-3 text-white font-bold">{asset.hostname}</td>
                        <td className="p-3 text-cyan-400">{asset.ip}</td>
                        <td className="p-3 text-slate-400">{asset.department}</td>
                        <td className="p-3 text-amber-300">
                          {asset.openPorts.map((p) => `${p}`).join(", ")}
                        </td>
                        <td className="p-3">
                          <span
                            className={`font-black ${
                              asset.riskScore > 85
                                ? "text-red-400"
                                : asset.riskScore > 50
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {asset.riskScore}/100
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              asset.complianceStatus === "NON_COMPLIANT"
                                ? "bg-red-950 text-red-300 border border-red-500"
                                : asset.complianceStatus === "AT_RISK"
                                ? "bg-amber-950 text-amber-300 border border-amber-500"
                                : "bg-emerald-950 text-emerald-300 border border-emerald-500"
                            }`}
                          >
                            {asset.complianceStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW B.4: CORPORATE SECOPS & SIEM LOG STREAM */}
          {blueSubTab === "secops_siem" && (
            <div className="space-y-6 font-mono text-xs">
              
              {/* Top SecOps Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-slate-950 p-4 border border-cyan-500/30">
                  <span className="text-[10px] text-slate-400 uppercase block">SIEM Ingestion Rate</span>
                  <span className="text-xl font-black text-cyan-400">{eventsPerSec} EPS</span>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4 border border-emerald-500/30">
                  <span className="text-[10px] text-slate-400 uppercase block">EDR Fleet Health</span>
                  <span className="text-xl font-black text-emerald-400">99.8% (4,812 Hosts)</span>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4 border border-amber-500/30">
                  <span className="text-[10px] text-slate-400 uppercase block">Zero-Trust MFA Blocks</span>
                  <span className="text-xl font-black text-amber-400">14 Impossible Travel</span>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4 border border-red-500/30">
                  <span className="text-[10px] text-slate-400 uppercase block">Firewall Drops</span>
                  <span className="text-xl font-black text-red-400">82,410 / min</span>
                </div>
              </div>

              {/* SIEM Log Telemetry Stream */}
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <h3 className="font-bold text-white uppercase">
                      Live Corporate SIEM Event Stream (Splunk / CrowdStrike Telemetry)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500">Auto-streaming real-time packets</span>
                </div>

                <div className="space-y-2">
                  {siemLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:bg-slate-900 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                            log.severity === "CRITICAL"
                              ? "bg-red-950 text-red-300 border border-red-500 animate-pulse"
                              : log.severity === "ALERT"
                              ? "bg-amber-950 text-amber-300 border border-amber-500"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {log.severity}
                        </span>
                        <span className="text-cyan-300 font-bold">{log.protocol}</span>
                        <span className="text-slate-300">{log.ruleMatched}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 shrink-0">
                        {log.sourceIp} ➔ {log.destinationIp} ({log.user})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />
    </div>
  );
}
