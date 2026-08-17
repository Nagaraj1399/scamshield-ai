import React, { useState, useEffect, useRef } from "react";
import {
  ScenarioDefinition,
  SimulationTurnResponse,
  ChatMessage,
  ThreatLevel,
} from "../types";
import { QUICK_DEFENSIVE_REFLEXES } from "../data/scenarios";
import { PacketInspectionTerminal } from "./PacketInspectionTerminal";
import { cyberAudio } from "../utils/cyberAudio";
import { AudioSettingsModal } from "./AudioSettingsModal";
import {
  ShieldAlert,
  ShieldCheck,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  AlertTriangle,
  Radio,
  ExternalLink,
  Lock,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Cpu,
  Mic,
  MicOff,
  Sparkles,
  ArrowLeft,
  Eye,
  Info,
} from "lucide-react";

interface SimulationArenaProps {
  scenario: ScenarioDefinition;
  messages: ChatMessage[];
  currentTurn: SimulationTurnResponse | null;
  securityScore: number;
  isLoading: boolean;
  onSendMessage: (actionText: string) => void;
  onResetSimulation: () => void;
  onExitSimulation: () => void;
  audioEnabled?: boolean;
  setAudioEnabled?: (enabled: boolean) => void;
  onInspectUrl?: (url: string) => void;
}

export function SimulationArena({
  scenario,
  messages,
  currentTurn,
  securityScore,
  isLoading,
  onSendMessage,
  onResetSimulation,
  onExitSimulation,
  onInspectUrl,
}: SimulationArenaProps) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [audioSettings, setAudioSettings] = useState(() => cyberAudio.getSettings());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = cyberAudio.subscribe((s) => setAudioSettings(s));
    setAudioSettings(cyberAudio.getSettings());
    return () => unsub();
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Sound effects and TTS on turn response
  useEffect(() => {
    if (!currentTurn) return;

    // Play Alert or Mitigation sound based on threat feedback
    if (currentTurn.is_scam_busted || currentTurn.is_trap_triggered) {
      cyberAudio.playThreatMitigated();
    } else if (currentTurn.threat_level === "CRITICAL_BREACH" || currentTurn.threat_level === "HIGH") {
      cyberAudio.playAlert();
    }

    // Scammer Voice synthesis (TTS) if voiceCalls is enabled
    if (cyberAudio.isVoiceCallsEnabled() && currentTurn.scammer_dialogue) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentTurn.scammer_dialogue);
        utterance.rate = 1.05;
        utterance.pitch = 0.95;
        utterance.volume = audioSettings.masterEnabled && audioSettings.voiceCalls ? audioSettings.volume / 100 : 0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [currentTurn]);

  // Speech to Text (Web Speech API)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error("Speech recognition error:", e);
      setIsListening(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    cyberAudio.playTerminalEnter();
    const textToSend = inputText.trim();
    setInputText("");
    onSendMessage(textToSend);
  };

  const getThreatColor = (level: ThreatLevel = "HIGH") => {
    switch (level) {
      case "LOW":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "MEDIUM":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "HIGH":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "CRITICAL_BREACH":
      default:
        return "text-red-400 bg-red-500/10 border-red-500/30";
    }
  };

  // Helper to highlight potential trap links inside scammer message
  const renderMessageContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <span key={index} className="inline-flex flex-wrap items-center gap-1.5 my-1">
            <span className="font-mono text-xs underline text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              {part}
            </span>
            <button
              type="button"
              onClick={() => onSendMessage(`I clicked the link: ${part}`)}
              className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-600/80 hover:bg-red-500 text-white px-2 py-0.5 rounded transition-all shadow-sm"
              title="Clicking this simulates falling for the phishing trap"
            >
              <ExternalLink className="h-3 w-3" /> Simulate Click (Trap)
            </button>
            {onInspectUrl && (
              <button
                type="button"
                onClick={() => onInspectUrl(part)}
                className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30"
                title="Inspect in Phishing Sandbox"
              >
                <Eye className="h-3 w-3" /> Sandbox Inspect
              </button>
            )}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const isTerminal =
    currentTurn?.simulation_status === "FAILED_TRAP" ||
    currentTurn?.simulation_status === "SUCCESS_BUSTED" ||
    currentTurn?.compromise_detected ||
    currentTurn?.defense_successful;

  const currentVector = currentTurn?.attack_vector_type || "SECURITY_PROBE";
  const currentMitre = currentTurn?.mitre_technique_id || "T1566 - Phishing / T1656 - Impersonation";
  const currentTerminalHeader = currentTurn?.terminal_header || "[THREAT-ACTOR] >> INGRESS LINK ESTABLISHED // TARGET: 10.0.4.12";
  const socPsychExploit = currentTurn?.soc_analysis?.psychological_exploit || "Artificial Urgency + Authority Conditioning";
  const socRemediation = currentTurn?.soc_analysis?.immediate_remediation || currentTurn?.educational_feedback || "Refuse unverified out-of-band requests; cross-verify using official channels.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      {/* Top Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl neural-glass p-4 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,243,255,0.15)]">
        <div className="flex items-center gap-3">
          <button
            id="exit-simulation-btn"
            onClick={onExitSimulation}
            className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-2 text-cyan-400 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,243,255,0.4)] transition-all"
            title="Exit to Scenario Selector"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base sm:text-lg">
                {scenario.title}
              </h2>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-mono border ${scenario.badgeColor}`}>
                {scenario.difficulty}
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-red-950/80 border border-red-500/50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]">
                VECTOR: {currentVector}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-ping shadow-[0_0_8px_#ef4444]" />
              Adversary: <span className="text-cyan-300 font-semibold">{currentTurn?.adversary_persona || currentTurn?.scammer_persona || scenario.threatActor}</span>
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2">
          <button
            id="reset-simulation-btn"
            onClick={onResetSimulation}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition-all font-mono"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restart Scenario</span>
          </button>

          <button
            id="arena-audio-settings-btn"
            onClick={() => setIsAudioModalOpen(true)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold font-mono transition-all ${
              audioSettings.masterEnabled
                ? "border-cyan-400/80 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(0,243,255,0.3)] hover:bg-cyan-500/30"
                : "border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200"
            }`}
            title="Open Granular Audio & Sound Effect Controls"
          >
            {audioSettings.masterEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline">
              {audioSettings.masterEnabled ? "Audio Settings" : "Audio Muted"}
            </span>
            <Sliders className="h-3 w-3 text-slate-400 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Communication Screen, Right Guardian Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Communication Thread (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[680px] rounded-2xl neural-glass-card shadow-2xl overflow-hidden hud-corner-tl border border-cyan-500/30">
          {/* Terminal Ingress Stream Banner */}
          <div className="border-b border-cyan-500/20 bg-slate-950/90 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-2 text-cyan-400 truncate">
              <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse shrink-0" />
              <span className="truncate">{currentTerminalHeader}</span>
            </span>
            <span className="shrink-0 text-cyan-400 font-bold ml-2">ZERO-TRUST AUDIT</span>
          </div>

          {/* Simulated Mobile/Call Bar */}
          <div className="border-b border-cyan-500/20 bg-slate-950/70 px-4 py-3 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-950 border border-red-500/60 text-red-400 font-bold text-xs shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  ⚠️
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-900 animate-pulse shadow-[0_0_8px_#ef4444]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {currentTurn?.adversary_persona || currentTurn?.scammer_persona || "Adversary Transmitter"}
                  </span>
                  <span className="text-[10px] text-red-400 font-mono bg-red-950/80 px-1.5 py-0.5 rounded border border-red-600/60">
                    UNVERIFIED SENDER
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="text-cyan-400">MITRE:</span>
                  <span className="text-amber-300 font-semibold truncate max-w-[220px]">{currentMitre}</span>
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono text-slate-400">Red-Team Engine v3.0</span>
              <div className="text-[10px] text-cyan-400 font-semibold">Active Infiltration Probe</div>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user"
                    ? "items-end"
                    : msg.sender === "scammer"
                    ? "items-start"
                    : "items-center"
                }`}
              >
                {msg.sender === "scammer" && (
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-slate-900 border border-red-900/40 p-4 text-slate-100 shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/80 text-[11px]">
                      <span className="font-bold text-red-400 flex items-center gap-1.5 font-mono">
                        <Flame className="h-3.5 w-3.5" /> Adversary Transmission
                      </span>
                      {msg.mitreTechniqueId && (
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {msg.mitreTechniqueId}
                        </span>
                      )}
                      <span className="text-slate-500 font-mono text-[10px]">{msg.timestamp}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {renderMessageContent(msg.text)}
                    </div>
                  </div>
                )}

                {msg.sender === "user" && (
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-cyan-600/90 text-slate-950 p-3.5 shadow-md">
                    <div className="flex items-center justify-between gap-2 mb-1 text-[11px] font-bold text-cyan-950">
                      <span>Your Defensive Reflex</span>
                      <span className="font-mono opacity-80">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-950 font-medium leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                )}

                {msg.sender === "guardian_system" && (
                  <div className="w-full my-2 rounded-xl bg-slate-900/90 border border-slate-700/60 p-3 text-center text-xs text-slate-300">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-cyan-400 mb-1">
                      <Sparkles className="h-4 w-4" /> Guardian SOC Update
                    </div>
                    <p>{msg.text}</p>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="rounded-2xl rounded-tl-sm bg-slate-900/90 border border-slate-800 p-4 text-slate-300 shadow-md">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Adversary engine executing vector payload...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Defensive Reflex Bar */}
          {!isTerminal && (
            <div className="border-t border-slate-800/80 bg-slate-900/60 p-2.5">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" /> Quick Defensive Reflexes:
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">1-Click Pro Countermoves</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {QUICK_DEFENSIVE_REFLEXES.map((reflex, idx) => (
                  <button
                    key={idx}
                    id={`reflex-btn-${idx}`}
                    disabled={isLoading}
                    onClick={() => onSendMessage(reflex.text)}
                    className="flex flex-col text-left rounded-xl border border-slate-800 bg-slate-950/90 p-2 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800/80 hover:text-white transition-all disabled:opacity-40"
                  >
                    <span className="text-xs font-semibold text-slate-100 flex items-center justify-between">
                      {reflex.label}
                      <span className="text-[10px] text-emerald-400 font-mono">{reflex.tag}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                      "{reflex.text}"
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Formulation Bar */}
          <div className="border-t border-slate-800 bg-slate-950 p-3">
            {isTerminal ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  {currentTurn?.defense_successful || currentTurn?.simulation_status === "SUCCESS_BUSTED" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-200">
                    {currentTurn?.defense_successful || currentTurn?.simulation_status === "SUCCESS_BUSTED"
                      ? "Threat Neutralized! Social engineering exploit thwarted."
                      : "Security Breach Detected! Sensitive credentials or unauthorized action performed."}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    id="arena-restart-btn"
                    onClick={onResetSimulation}
                    className="flex-1 sm:flex-initial rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 text-xs font-bold transition-all shadow-md"
                  >
                    Play Again
                  </button>
                  <button
                    id="arena-exit-btn"
                    onClick={onExitSimulation}
                    className="flex-1 sm:flex-initial rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    All Scenarios
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button
                  type="button"
                  id="mic-input-btn"
                  onClick={toggleSpeechRecognition}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isListening
                      ? "bg-red-500 text-white border-red-400 animate-pulse"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                  title="Voice dictation"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                <input
                  id="simulation-user-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your defensive counter (e.g., 'What is your official incident ticket number?')"
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                />

                <button
                  id="send-user-action-btn"
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2.5 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                  title="Send response"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: THE GUARDIAN (Real-time Evaluation Engine HUD) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Guardian Engine Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">SOC GUARDIAN HUD</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Real-Time Behavioral Scanner</span>
                </div>
              </div>

              {/* Threat Level Badge */}
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${getThreatColor(currentTurn?.detected_threat_level || currentTurn?.threat_level)}`}>
                <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                <span>{currentTurn?.detected_threat_level || currentTurn?.threat_level || "HIGH"}</span>
              </div>
            </div>

            {/* Score Visual Meter */}
            <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                <span>Cyber Readiness Score</span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {securityScore} / 100
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    securityScore >= 80
                      ? "bg-emerald-500"
                      : securityScore >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${Math.max(5, securityScore)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>0 (Exploit Compromise)</span>
                <span>100 (Hardened Reflex)</span>
              </div>
            </div>

            {/* Psychological Exploit Insight */}
            <div className="mt-4 rounded-xl bg-slate-950/60 p-3.5 border border-slate-800">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Lock className="h-3.5 w-3.5 text-amber-400" /> Adversary Cognitive Vector:
              </div>
              <p className="text-xs text-slate-200 font-mono">
                {socPsychExploit}
              </p>
            </div>

            {/* Detected Red Flags */}
            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Active Manipulation Indicators:
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(currentTurn?.soc_analysis?.red_flags_present || currentTurn?.red_flags_present || scenario.keyPsychologicalTriggers).map((flag, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-red-950/50 border border-red-800/60 px-2.5 py-1 text-xs font-medium text-red-300 font-mono"
                  >
                    🚩 {flag}
                  </span>
                ))}
              </div>
            </div>

            {/* Immediate SOC Remediation */}
            <div className="mt-4 rounded-xl bg-slate-950/80 p-4 border border-cyan-900/40">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2 font-mono">
                <Sparkles className="h-3.5 w-3.5" /> SOC DEFENSIVE DIRECTIVE:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {socRemediation}
              </p>
            </div>
          </div>

          {/* Real-World Golden Defense Card */}
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
              <Info className="h-4 w-4" /> Zero-Trust Golden Directives
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">01.</span>
                <span><strong className="text-white">Never assume trust on inbound calls</strong> — disconnect and initiate contact through official published portals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">02.</span>
                <span><strong className="text-white">Zero OTP Policy</strong> — OTPs are one-way authorization keys, not identity validation credentials.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">03.</span>
                <span><strong className="text-white">Escalate promptly</strong> — Report fraud incidents to Cyber Helpline 1930 / cybercrime.gov.in.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Real-Time Deep Packet Inspection (DPI) Scrolling Terminal */}
      <PacketInspectionTerminal
        scenario={scenario}
        currentTurn={currentTurn}
        securityScore={securityScore}
        isSimulating={isLoading}
      />

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />
    </div>
  );
}
