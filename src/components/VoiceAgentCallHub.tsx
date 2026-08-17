import React, { useState, useEffect, useRef } from "react";
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Sparkles,
  RefreshCw,
  User,
  Bot,
  Activity,
  Flame,
  Clock,
  Layers,
  ChevronRight,
  Headphones,
  Sliders,
} from "lucide-react";
import { PRESET_SCENARIOS } from "../data/scenarios";
import { SimulationTurnResponse, ThreatLevel } from "../types";
import { cyberAudio } from "../utils/cyberAudio";
import { AudioSettingsModal } from "./AudioSettingsModal";

interface VoiceAgentCallHubProps {
  onInspectUrl?: (url: string) => void;
  securityScore: number;
}

interface CallLogEntry {
  sender: "caller" | "defender" | "system";
  text: string;
  timestamp: string;
  threatLevel?: ThreatLevel;
  psychExploit?: string;
}

export function VoiceAgentCallHub({ securityScore }: VoiceAgentCallHubProps) {
  const [selectedVector, setSelectedVector] = useState(PRESET_SCENARIOS[0].id);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([]);
  const [voiceInputText, setVoiceInputText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentScore, setCurrentScore] = useState(securityScore);
  const [selectedVoiceType, setSelectedVoiceType] = useState<"authority_male" | "urgent_female" | "tech_admin">("authority_male");
  const [autoSpeechResponse, setAutoSpeechResponse] = useState(true);

  const activeScenario = PRESET_SCENARIOS.find((s) => s.id === selectedVector) || PRESET_SCENARIOS[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [callLogs]);

  // Call timer effect
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive]);

  // Format call duration
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Text-To-Speech engine configured per voice personality
  const speakText = (text: string) => {
    if (!autoSpeechResponse || !("speechSynthesis" in window)) return;
    if (!cyberAudio.isVoiceCallsEnabled()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoiceType === "authority_male") {
      utterance.pitch = 0.85;
      utterance.rate = 1.0;
    } else if (selectedVoiceType === "urgent_female") {
      utterance.pitch = 1.15;
      utterance.rate = 1.1;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 1.05;
    }

    const settings = cyberAudio.getSettings();
    utterance.volume = settings.masterEnabled && settings.voiceCalls ? settings.volume / 100 : 0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Start live inbound call simulation
  const handleStartCall = async () => {
    setIsConnecting(true);
    setCallLogs([]);
    setCurrentScore(100);

    // Audio Ringing tone effect using CyberAudioEngine
    cyberAudio.playCallRing();

    try {
      const res = await fetch("/api/simulate-threat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionText: "INITIATE_CALL",
          scenario: activeScenario,
          previousMessages: [],
          currentScore: 100,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const turn: SimulationTurnResponse = await res.json();
      setIsConnecting(false);
      setIsCallActive(true);
      cyberAudio.playCallConnected();

      if (turn.threat_level === "CRITICAL_BREACH" || turn.threat_level === "HIGH") {
        cyberAudio.playAlert();
      }

      const openingText = turn.adversary_transmission || turn.scammer_dialogue || "Connecting to line...";
      
      const newEntry: CallLogEntry = {
        sender: "caller",
        text: openingText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        threatLevel: turn.threat_level || "HIGH",
        psychExploit: turn.soc_analysis?.psychological_exploit || "Authority Intimidation",
      };

      setCallLogs([
        {
          sender: "system",
          text: `[VOICE-LINK ESTABLISHED] Incoming encrypted audio feed from: ${turn.adversary_persona || activeScenario.threatActor}`,
          timestamp: new Date().toLocaleTimeString(),
        },
        newEntry,
      ]);

      speakText(openingText);
    } catch (e) {
      console.error("Failed to start voice simulation:", e);
      setIsConnecting(false);
      setIsCallActive(true);
      cyberAudio.playCallConnected();
      const fallbackText = "Attention Citizen: This is Deputy Commissioner Cyber Crime Bureau. Your Aadhaar identity has been linked to a seized narcotics parcel. Confirm your identity immediately.";
      setCallLogs([
        {
          sender: "system",
          text: "[VOICE-LINK ESTABLISHED] Offline Voice Fallback Active",
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          sender: "caller",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString(),
          threatLevel: "HIGH",
          psychExploit: "Authority Bias + Urgency",
        },
      ]);
      speakText(fallbackText);
    }
  };

  // Hang up the call
  const handleEndCall = () => {
    cyberAudio.playCallEnd();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsSpeaking(false);
    setIsTranscribing(false);
    setIsCallActive(false);
    setCallLogs((prev) => [
      ...prev,
      {
        sender: "system",
        text: "[CALL TERMINATED] Audio link severed by defender.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Respond via defender voice / speech
  const handleSendDefenderResponse = async (spokenText: string) => {
    if (!spokenText.trim() || !isCallActive) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const defenderEntry: CallLogEntry = {
      sender: "defender",
      text: spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };

    setCallLogs((prev) => [...prev, defenderEntry]);
    setVoiceInputText("");

    const prevChatHistory = callLogs
      .filter((l) => l.sender !== "system")
      .map((l) => ({
        sender: l.sender === "caller" ? "scammer" : "user",
        text: l.text,
        timestamp: l.timestamp,
      }));

    try {
      const res = await fetch("/api/simulate-threat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionText: spokenText,
          scenario: activeScenario,
          previousMessages: [
            ...prevChatHistory,
            { sender: "user", text: spokenText, timestamp: defenderEntry.timestamp },
          ],
          currentScore,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const turn: SimulationTurnResponse = await res.json();
      const nextDialogue = turn.adversary_transmission || turn.scammer_dialogue || "...";
      if (turn.security_score !== undefined) {
        setCurrentScore(turn.security_score);
      }

      const callerEntry: CallLogEntry = {
        sender: "caller",
        text: nextDialogue,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        threatLevel: turn.threat_level || "HIGH",
        psychExploit: turn.soc_analysis?.psychological_exploit,
      };

      setCallLogs((prev) => [...prev, callerEntry]);
      speakText(nextDialogue);
    } catch (e) {
      console.error("Voice response error:", e);
      const fallbackDialogue = "Do not try to stall this investigation. If you do not follow our verification protocol immediately, a warrant execution team will be dispatched.";
      const fallbackEntry: CallLogEntry = {
        sender: "caller",
        text: fallbackDialogue,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        threatLevel: "HIGH",
        psychExploit: "Coercion & Intimidation",
      };
      setCallLogs((prev) => [...prev, fallbackEntry]);
      speakText(fallbackDialogue);
    }
  };

  // Real-time Mic Recognition
  const toggleMicrophone = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Microphone voice input is not supported in this browser. You can use the quick response buttons or keyboard input below.");
      return;
    }

    if (isTranscribing) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsTranscribing(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsTranscribing(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceInputText(transcript);
        setIsTranscribing(false);
        handleSendDefenderResponse(transcript);
      };
      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsTranscribing(false);
      };
      recognition.onend = () => setIsTranscribing(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsTranscribing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 rounded-full neural-glass px-4 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,243,255,0.2)] mb-3">
          <Headphones className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-mono uppercase tracking-wider">VOICE ADVERSARY AGENT ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          Live Inbound Voice Scam Simulation
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
          Simulate real-time voice calls from scammers, deepfake extortionists, and fake law enforcement officers. Speak with your microphone and train verbal defense reflexes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Call Interface & Phone Hardware HUD (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Cyber Phone HUD Card */}
          <div className="rounded-3xl border border-cyan-500/40 neural-glass p-6 shadow-[0_0_30px_rgba(0,243,255,0.15)] relative overflow-hidden flex flex-col items-center justify-between min-h-[460px] hud-corner-tl">
            
            {/* Ambient Hologram Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Call Status Bar */}
            <div className="w-full flex items-center justify-between text-xs font-mono border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${isCallActive ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`} />
                <span className="text-slate-300 font-bold uppercase tracking-wider">
                  {isConnecting ? "CONNECTING ENCRYPTED LINE..." : isCallActive ? "CALL IN PROGRESS" : "STANDBY"}
                </span>
              </div>
              <span className="text-cyan-400 font-bold font-mono drop-shadow-[0_0_6px_#00f3ff]">
                {isCallActive ? formatTime(callDuration) : "00:00"}
              </span>
            </div>

            {/* Caller Holographic Avatar & Info */}
            <div className="my-auto flex flex-col items-center text-center py-4">
              
              {/* Radial Pulsing Avatar Ring */}
              <div className="relative flex items-center justify-center mb-4">
                {isSpeaking && (
                  <span className="absolute -inset-3 rounded-full bg-cyan-500/30 animate-ping" />
                )}
                {isCallActive && (
                  <span className="absolute -inset-1.5 rounded-full border border-cyan-400/60 animate-[spin_10s_linear_infinite]" />
                )}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                  {isCallActive ? (
                    <Bot className={`h-12 w-12 ${isSpeaking ? "text-cyan-300 scale-110 drop-shadow-[0_0_10px_#00f3ff]" : "text-cyan-400"} transition-all`} />
                  ) : (
                    <User className="h-12 w-12 text-slate-500" />
                  )}
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-sans">
                {activeScenario.threatActor}
              </h2>
              <span className="text-xs text-red-400 font-mono font-semibold mt-1 drop-shadow-[0_0_6px_#ef4444]">
                {activeScenario.categoryName} // {activeScenario.difficulty}
              </span>

              {/* Audio Equalizer Visualizer Bars */}
              {isCallActive && (
                <div className="flex items-center justify-center gap-1.5 mt-4 h-6">
                  {[40, 75, 95, 60, 85, 30, 90, 50, 70].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        height: isSpeaking ? `${h}%` : "15%",
                        transition: "height 0.15s ease-in-out",
                      }}
                      className="w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f3ff]"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* In-Call Controls Bottom Bar */}
            <div className="w-full pt-4 border-t border-cyan-500/20 flex flex-col gap-3">
              
              {!isCallActive ? (
                <button
                  id="start-voice-call-btn"
                  disabled={isConnecting}
                  onClick={handleStartCall}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black py-4 text-sm tracking-wider uppercase font-mono shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all border border-emerald-300"
                >
                  <PhoneCall className="h-5 w-5" />
                  <span>{isConnecting ? "Establishing Line..." : "Simulate Incoming Voice Call"}</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  {/* Microphone Speak Button */}
                  <button
                    id="mic-voice-toggle-btn"
                    onClick={toggleMicrophone}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all ${
                      isTranscribing
                        ? "bg-red-500 border-red-400 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)]"
                        : "neural-glass border-cyan-500/40 text-cyan-300 hover:border-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                    }`}
                    title={isTranscribing ? "Listening... Speak now" : "Click to Speak"}
                  >
                    {isTranscribing ? <Mic className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </button>

                  {/* Audio Mute Output Button */}
                  <button
                    onClick={() => {
                      setAutoSpeechResponse(!autoSpeechResponse);
                      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                    }}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all ${
                      autoSpeechResponse
                        ? "neural-glass border-slate-700 text-slate-200"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                    }`}
                    title={autoSpeechResponse ? "Mute Scammer Voice" : "Unmute Voice"}
                  >
                    {autoSpeechResponse ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                  </button>

                  {/* Hang Up Button */}
                  <button
                    id="hang-up-call-btn"
                    onClick={handleEndCall}
                    className="flex h-14 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] active:scale-95 border border-red-400"
                    title="Disconnect / Hang Up Call"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </button>
                </div>
              )}

              {/* Status Hint */}
              <p className="text-[11px] text-center text-slate-300 font-mono">
                {isCallActive
                  ? isTranscribing
                    ? "🔴 Listening to your voice... Speak your response clearly."
                    : "Tap the Mic or choose a quick reflex response below."
                  : "Choose an attack vector below and simulate the live voice call."}
              </p>
            </div>

          </div>

          {/* Persona & Voice Style Settings */}
          <div className="rounded-2xl neural-glass-card border border-cyan-500/20 p-4 text-xs space-y-3 hud-corner-tl">
            <span className="font-mono font-bold uppercase tracking-wider text-cyan-400 block">
              1. Select Attack Scenario Vector:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  disabled={isCallActive}
                  onClick={() => setSelectedVector(s.id)}
                  className={`p-2 rounded-xl text-left font-medium transition-all ${
                    selectedVector === s.id
                      ? "bg-cyan-500/25 border border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                      : "bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="block truncate font-mono text-[11px]">{s.categoryName}</span>
                  <span className="text-[10px] text-slate-500">{s.difficulty}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Audio Transcripts & Real-Time Psychological Telemetry (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Transcript Log Box */}
          <div className="rounded-3xl neural-glass-card border border-cyan-500/30 p-5 shadow-xl flex-1 flex flex-col justify-between min-h-[460px] hud-corner-tl">
            
            {/* Log Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span className="text-white font-bold uppercase">LIVE AUDIO TRANSCRIPT // SOC TELEMETRY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Readiness:</span>
                <span className={`font-bold ${currentScore >= 80 ? "text-emerald-400 drop-shadow-[0_0_6px_#10b981]" : "text-amber-400 drop-shadow-[0_0_6px_#f59e0b]"}`}>
                  {currentScore} pts
                </span>
              </div>
            </div>

            {/* Chat Transcript Area */}
            <div className="my-3 flex-1 overflow-y-auto space-y-3.5 pr-2 max-h-[380px]">
              {callLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <Headphones className="h-12 w-12 text-slate-600 mb-2" />
                  <p className="text-xs font-mono">Click 'Simulate Incoming Voice Call' to engage with the live voice agent.</p>
                </div>
              ) : (
                callLogs.map((log, index) => {
                  if (log.sender === "system") {
                    return (
                      <div key={index} className="rounded-lg bg-slate-950/90 px-3 py-1.5 text-[11px] font-mono text-cyan-400 border border-cyan-500/30 text-center shadow-[0_0_8px_rgba(0,243,255,0.15)]">
                        {log.text}
                      </div>
                    );
                  }

                  const isCaller = log.sender === "caller";
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isCaller ? "items-start" : "items-end"}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-1">
                        <span className="text-slate-300">{isCaller ? activeScenario.threatActor : "You (Defender)"}</span>
                        <span>• {log.timestamp}</span>
                        {log.psychExploit && (
                          <span className="rounded bg-red-950/80 px-1.5 py-0.5 text-[9px] text-red-300 border border-red-500/40 font-mono">
                            {log.psychExploit}
                          </span>
                        )}
                      </div>

                      <div
                        className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                          isCaller
                            ? "bg-slate-950/90 border border-red-500/40 text-slate-100 shadow-[0_0_10px_rgba(239,68,68,0.2)] font-sans"
                            : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-[0_0_12px_rgba(0,243,255,0.3)] font-sans"
                        }`}
                      >
                        {log.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={logsEndRef} />
            </div>

            {/* Quick Verbal Reflex Buttons (1-Tap Responses) */}
            {isCallActive && (
              <div className="pt-3 border-t border-cyan-500/20 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-cyan-400 block">
                  Quick Verbal Defense Tactics:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-medium">
                  <button
                    onClick={() => handleSendDefenderResponse("I will not share any OTP or personal information. I will verify your identity directly through the official national helpline.")}
                    className="p-2 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60 text-left transition-colors truncate shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                  >
                    🛡️ Refuse & Demand Official Helpline
                  </button>
                  <button
                    onClick={() => handleSendDefenderResponse("Please provide your official employee ID number and station jurisdiction so I can file a formal verification query.")}
                    className="p-2 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/60 text-left transition-colors truncate shadow-[0_0_8px_rgba(0,243,255,0.15)]"
                  >
                    🪪 Challenge with Official Badge ID
                  </button>
                  <button
                    onClick={() => handleSendDefenderResponse("Official law enforcement does not conduct video calls or digital arrests. I am disconnecting and reporting this call to 1930.")}
                    className="p-2 rounded-xl bg-slate-950/80 border border-purple-500/40 text-purple-300 hover:bg-purple-950/60 text-left transition-colors truncate shadow-[0_0_8px_rgba(168,85,247,0.15)]"
                  >
                    ⚖️ Expose Digital Arrest Hoax
                  </button>
                  <button
                    onClick={() => handleSendDefenderResponse("Here is my OTP code: 981240. Please don't block my bank account.")}
                    className="p-2 rounded-xl bg-slate-950/80 border border-red-500/40 text-red-300 hover:bg-red-950/60 text-left transition-colors truncate shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                  >
                    ⚠️ Yield OTP (Simulate Breach)
                  </button>
                </div>
              </div>
            )}

            {/* Text Input Fallback if Mic is Unavailable */}
            {isCallActive && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendDefenderResponse(voiceInputText);
                }}
                className="mt-2 flex gap-2"
              >
                <input
                  type="text"
                  value={voiceInputText}
                  onChange={(e) => setVoiceInputText(e.target.value)}
                  placeholder="Or type what you would say to the caller..."
                  className="flex-1 rounded-xl border border-cyan-500/30 bg-slate-950/90 px-3 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!voiceInputText.trim()}
                  className="rounded-xl bg-cyan-400 text-slate-950 font-bold px-4 py-2 text-xs hover:bg-cyan-300 disabled:opacity-40 font-mono"
                >
                  Send
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
