import React, { useState, useEffect } from "react";
import { Navbar, ActiveTabType } from "./components/Navbar";
import { AntiScamShieldHero } from "./components/AntiScamShieldHero";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { SimulationArena } from "./components/SimulationArena";
import { VoiceAgentCallHub } from "./components/VoiceAgentCallHub";
import { PhishingSandbox } from "./components/PhishingSandbox";
import { AiVerificationHub } from "./components/AiVerificationHub";
import { RecoveryHelpHub } from "./components/RecoveryHelpHub";
import { PlaybookHub } from "./components/PlaybookHub";
import { RecordsHub } from "./components/RecordsHub";
import { DebriefModal } from "./components/DebriefModal";
import { PricingBillingHub } from "./components/PricingBillingHub";
import { CyberCrimeWarRoomHub } from "./components/CyberCrimeWarRoomHub";
import { CyberCommandCenter } from "./components/CyberCommandCenter";
import { AdminViewModal } from "./components/AdminViewModal";
import { Lock } from "lucide-react";
import {
  ScenarioDefinition,
  SimulationTurnResponse,
  ChatMessage,
  UserStats,
  BillingAccountState,
  PaymentTransaction,
  PlanTierId,
  UsageRecord,
} from "./types";
import { PRESET_SCENARIOS } from "./data/scenarios";
import { INITIAL_BILLING_STATE, SUBSCRIPTION_PLANS, PROJECT_PACKAGES } from "./data/plans";

const INITIAL_STATS: UserStats = {
  simulationsCompleted: 0,
  scamsBusted: 0,
  trapsTriggered: 0,
  averageScore: 100,
  highestScore: 100,
  streakDays: 1,
  defenseBadges: [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("hero");
  const [activeScenario, setActiveScenario] = useState<ScenarioDefinition | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTurn, setCurrentTurn] = useState<SimulationTurnResponse | null>(null);
  const [securityScore, setSecurityScore] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [sandboxInspectUrl, setSandboxInspectUrl] = useState<string>("");
  const [verificationInitialText, setVerificationInitialText] = useState<string>("");
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [quotaExceededNotice, setQuotaExceededNotice] = useState<string | null>(null);

  // Billing Account State with persistence
  const [billingState, setBillingState] = useState<BillingAccountState>(() => {
    try {
      const saved = localStorage.getItem("scamshield_billing_account");
      return saved ? JSON.parse(saved) : INITIAL_BILLING_STATE;
    } catch {
      return INITIAL_BILLING_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("scamshield_billing_account", JSON.stringify(billingState));
    } catch (e) {
      console.warn("Could not persist billing state:", e);
    }
  }, [billingState]);

  // Local Storage Stats
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem("scamshield_stats");
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("scamshield_stats", JSON.stringify(stats));
    } catch (e) {
      console.warn("Could not persist stats:", e);
    }
  }, [stats]);

  // Track Usage & Check Limits
  const trackUsage = (
    actionType: "SIMULATION" | "VOICE_CALL" | "URL_SCAN" | "AI_VERIFY" | "FIR_REPORT" | "PROJECT_ACCESS",
    targetVector: string
  ): boolean => {
    const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === billingState.currentPlan) || SUBSCRIPTION_PLANS[0];

    // Check limit
    let limit: number | "unlimited" = "unlimited";
    let used = 0;

    if (actionType === "SIMULATION") {
      limit = currentPlan.limits.simulationsPerMonth;
      used = billingState.usageThisMonth.simulationsUsed;
    } else if (actionType === "VOICE_CALL") {
      limit = currentPlan.limits.voiceCallsPerMonth;
      used = billingState.usageThisMonth.voiceCallsUsed;
    } else if (actionType === "URL_SCAN") {
      limit = currentPlan.limits.urlSandboxScans;
      used = billingState.usageThisMonth.urlScansUsed;
    } else if (actionType === "AI_VERIFY") {
      limit = currentPlan.limits.aiVerifications;
      used = billingState.usageThisMonth.aiVerifiesUsed;
    } else if (actionType === "FIR_REPORT") {
      limit = currentPlan.limits.firReports;
      used = billingState.usageThisMonth.firReportsUsed;
    }

    if (limit !== "unlimited" && used >= limit) {
      setQuotaExceededNotice(
        `Monthly ${actionType.replace("_", " ")} quota reached (${used}/${limit}) on Cadet Free Tier. Upgrade to Pro Cyber Defender for unlimited access.`
      );
      return false;
    }

    // Log the usage record
    const newLog: UsageRecord = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      userId: billingState.userId,
      userEmail: billingState.userEmail,
      actionType,
      targetVector,
      planAtExecution: billingState.currentPlan,
      costIncurred: billingState.currentPlan === "free" ? 0 : 0,
      status: "COMPLETED",
    };

    setBillingState((prev) => ({
      ...prev,
      usageThisMonth: {
        ...prev.usageThisMonth,
        simulationsUsed: actionType === "SIMULATION" ? prev.usageThisMonth.simulationsUsed + 1 : prev.usageThisMonth.simulationsUsed,
        voiceCallsUsed: actionType === "VOICE_CALL" ? prev.usageThisMonth.voiceCallsUsed + 1 : prev.usageThisMonth.voiceCallsUsed,
        urlScansUsed: actionType === "URL_SCAN" ? prev.usageThisMonth.urlScansUsed + 1 : prev.usageThisMonth.urlScansUsed,
        aiVerifiesUsed: actionType === "AI_VERIFY" ? prev.usageThisMonth.aiVerifiesUsed + 1 : prev.usageThisMonth.aiVerifiesUsed,
        firReportsUsed: actionType === "FIR_REPORT" ? prev.usageThisMonth.firReportsUsed + 1 : prev.usageThisMonth.firReportsUsed,
      },
      usageLogs: [newLog, ...prev.usageLogs],
    }));

    return true;
  };

  // Plan & Project upgrades
  const handleUpgradePlan = (planId: PlanTierId, billingCycle: "monthly" | "annual") => {
    setBillingState((prev) => ({
      ...prev,
      currentPlan: planId,
      planBillingCycle: billingCycle,
    }));
    setQuotaExceededNotice(null);
  };

  const handleUnlockProject = (projectId: string) => {
    setBillingState((prev) => ({
      ...prev,
      unlockedProjectIds: [...new Set([...prev.unlockedProjectIds, projectId])],
    }));
  };

  const handleRecordTransaction = (txn: PaymentTransaction) => {
    setBillingState((prev) => ({
      ...prev,
      transactions: [txn, ...prev.transactions],
    }));
  };

  // Quick scanner callback from Hero
  const handleQuickScan = (text: string, type: "url" | "content") => {
    if (type === "url") {
      setSandboxInspectUrl(text);
      setActiveTab("sandbox");
    } else {
      setVerificationInitialText(text);
      setActiveTab("verification");
    }
  };

  // Start a new scenario simulation (Turn 1)
  const handleSelectScenario = async (
    scenario: ScenarioDefinition,
    customText?: string,
    difficulty: string = "Intermediate"
  ) => {
    const isAllowed = trackUsage("SIMULATION", scenario.title);
    if (!isAllowed) {
      setActiveTab("billing");
      return;
    }

    setActiveScenario(scenario);
    setCustomPrompt(customText || "");
    setSecurityScore(100);
    setMessages([]);
    setCurrentTurn(null);
    setShowDebriefModal(false);
    setIsLoading(true);
    setActiveTab("simulation");

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioCategory: scenario.title,
          customScenario: customText || scenario.tagline,
          difficulty,
          history: [],
          userAction: "Start simulation",
          currentScore: 100,
        }),
      });

      const turnData: SimulationTurnResponse = await response.json();
      setCurrentTurn(turnData);
      setSecurityScore(turnData.security_score);

      const initialScammerMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "scammer",
        text: turnData.adversary_transmission || turnData.scammer_dialogue || "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        threatLevel: turnData.detected_threat_level || turnData.threat_level,
        mitreTechniqueId: turnData.mitre_technique_id,
        terminalHeader: turnData.terminal_header,
        redFlags: turnData.soc_analysis?.red_flags_present || turnData.red_flags_present,
        feedback: turnData.soc_analysis?.immediate_remediation || turnData.educational_feedback,
        socAnalysis: turnData.soc_analysis,
      };

      setMessages([initialScammerMsg]);
    } catch (err) {
      console.error("Failed to start simulation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a user response / reflex to the simulation
  const handleSendMessage = async (userText: string) => {
    if (!activeScenario || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build conversation history for the API
      const historyPayload = updatedMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioCategory: activeScenario.title,
          customScenario: customPrompt || activeScenario.tagline,
          difficulty: activeScenario.difficulty,
          history: historyPayload,
          userAction: userText,
          currentScore: securityScore,
        }),
      });

      const turnData: SimulationTurnResponse = await response.json();
      setCurrentTurn(turnData);
      setSecurityScore(turnData.cyber_readiness_score ?? turnData.security_score ?? 100);

      const scammerMsg: ChatMessage = {
        id: `scam-${Date.now()}`,
        sender: "scammer",
        text: turnData.adversary_transmission || turnData.scammer_dialogue || "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        threatLevel: turnData.detected_threat_level || turnData.threat_level,
        mitreTechniqueId: turnData.mitre_technique_id,
        terminalHeader: turnData.terminal_header,
        redFlags: turnData.soc_analysis?.red_flags_present || turnData.red_flags_present,
        feedback: turnData.soc_analysis?.immediate_remediation || turnData.educational_feedback,
        isTrap: turnData.compromise_detected ?? turnData.is_trap_triggered,
        isBusted: turnData.defense_successful ?? turnData.is_scam_busted,
        socAnalysis: turnData.soc_analysis,
      };

      setMessages((prev) => [...prev, scammerMsg]);

      // Check if simulation concluded
      const isEnded = (turnData.compromise_detected ?? turnData.is_trap_triggered) || (turnData.defense_successful ?? turnData.is_scam_busted);
      if (isEnded) {
        updateStatsOnCompletion(turnData, turnData.cyber_readiness_score ?? turnData.security_score ?? 100);
        setTimeout(() => {
          setShowDebriefModal(true);
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to process simulation turn:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update stats & unlock badges
  const updateStatsOnCompletion = (turnData: SimulationTurnResponse, finalScore: number) => {
    setStats((prev) => {
      const completed = prev.simulationsCompleted + 1;
      const busted = turnData.is_scam_busted ? prev.scamsBusted + 1 : prev.scamsBusted;
      const traps = turnData.is_trap_triggered ? prev.trapsTriggered + 1 : prev.trapsTriggered;
      const newAvg = Math.round((prev.averageScore * prev.simulationsCompleted + finalScore) / completed);
      const newHigh = Math.max(prev.highestScore, finalScore);

      const badges = [...prev.defenseBadges];
      if (turnData.is_scam_busted && !badges.includes("anti_otp_guardian")) {
        badges.push("anti_otp_guardian");
      }
      if (activeScenario?.id === "digital_arrest" && turnData.is_scam_busted && !badges.includes("digital_arrest_buster")) {
        badges.push("digital_arrest_buster");
      }
      if (activeScenario?.id === "task_fraud" && turnData.is_scam_busted && !badges.includes("task_fraud_immune")) {
        badges.push("task_fraud_immune");
      }
      if (finalScore >= 95 && !badges.includes("perfect_defense_a")) {
        badges.push("perfect_defense_a");
      }

      return {
        simulationsCompleted: completed,
        scamsBusted: busted,
        trapsTriggered: traps,
        averageScore: newAvg,
        highestScore: newHigh,
        streakDays: prev.streakDays,
        defenseBadges: badges,
      };
    });
  };

  const handleInspectUrlFromArena = (url: string) => {
    setSandboxInspectUrl(url);
    setActiveTab("sandbox");
  };

  const handleResetSimulation = () => {
    if (activeScenario) {
      handleSelectScenario(activeScenario, customPrompt, activeScenario.difficulty);
    }
  };

  const handleExitSimulation = () => {
    setActiveScenario(null);
    setMessages([]);
    setCurrentTurn(null);
    setShowDebriefModal(false);
  };

  const handleResetStats = () => {
    setStats(INITIAL_STATS);
  };

  return (
    <div className="relative min-h-screen neural-grid-bg text-slate-100 font-sans selection:bg-cyan-400 selection:text-slate-950">
      {/* Neural Cyber Ambient Flare Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Neon Cyan Orb */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        {/* Neon Magenta Orb */}
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] bg-fuchsia-600/8 rounded-full blur-[140px] pointer-events-none" />
        {/* Neon Emerald Orb */}
        <div className="absolute bottom-10 -left-48 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Global CRT Scanlines & Cyber Matrix HUD Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Subtle Horizontal Scanlines */}
        <div className="absolute inset-0 crt-scanlines opacity-35 mix-blend-overlay" />
        
        {/* Traveling CRT Electron Beam Glow */}
        <div className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-400/[0.05] to-transparent crt-beam" />
        
        {/* Subtle CRT Vignette / Screen curvature shadow */}
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.7)]" />
      </div>

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        securityScore={securityScore}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        isInActiveSimulation={Boolean(activeScenario && !currentTurn?.is_scam_busted && !currentTurn?.is_trap_triggered)}
        currentPlan={billingState.currentPlan}
      />

      {/* Quota Exceeded Top Alert Banner */}
      {quotaExceededNotice && (
        <div className="relative z-30 mx-auto max-w-7xl px-4 pt-3 animate-fade-in">
          <div className="rounded-2xl bg-amber-950/80 border border-amber-500/50 p-4 font-mono text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>{quotaExceededNotice}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setQuotaExceededNotice(null);
                  setActiveTab("billing");
                }}
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold hover:scale-105 transition-all shadow"
              >
                Upgrade to Pro Plan
              </button>
              <button
                onClick={() => setQuotaExceededNotice(null)}
                className="text-slate-400 hover:text-white px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="relative z-10 pb-16">
        {/* 1. Shield HUD (Hero with Biometric 3D Shield & 4 Pillars) */}
        {activeTab === "hero" && (
          <AntiScamShieldHero
            onNavigateTab={(tab) => setActiveTab(tab)}
            onQuickScan={handleQuickScan}
          />
        )}

        {/* 2. Real-Time Cyber Operations (Adversary Hacker Terminal & Enterprise SOC Matrix) */}
        {activeTab === "cyber_command" && <CyberCommandCenter />}

        {/* 3. Real Cyber Crime Intelligence & Tactical War Room */}
        {activeTab === "cybercrime" && <CyberCrimeWarRoomHub />}

        {/* 3. Scam Detection & Combat Arena */}
        {activeTab === "simulation" && (
          <>
            {!activeScenario ? (
              <ScenarioSelector
                onSelectScenario={handleSelectScenario}
                isLoading={isLoading}
              />
            ) : (
              <SimulationArena
                scenario={activeScenario}
                messages={messages}
                currentTurn={currentTurn}
                securityScore={securityScore}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onResetSimulation={handleResetSimulation}
                onExitSimulation={handleExitSimulation}
                audioEnabled={audioEnabled}
                setAudioEnabled={setAudioEnabled}
                onInspectUrl={handleInspectUrlFromArena}
              />
            )}
          </>
        )}

        {/* 3. Live Voice Agents Inbound Scam Call Simulator */}
        {activeTab === "voice" && (
          <VoiceAgentCallHub
            securityScore={securityScore}
            onInspectUrl={handleInspectUrlFromArena}
          />
        )}

        {/* 4. Link Protection Phishing Sandbox */}
        {activeTab === "sandbox" && (
          <PhishingSandbox initialUrl={sandboxInspectUrl} />
        )}

        {/* 5. AI Verification Hub (Check Real vs Fake) */}
        {activeTab === "verification" && (
          <AiVerificationHub initialText={verificationInitialText} />
        )}

        {/* 6. Recovery Help Hub (Step-by-Step Help & FIR) */}
        {activeTab === "recovery" && <RecoveryHelpHub />}

        {/* 7. SOC Playbook */}
        {activeTab === "playbook" && <PlaybookHub />}

        {/* 8. Records & Badges */}
        {activeTab === "stats" && (
          <RecordsHub stats={stats} onResetStats={handleResetStats} />
        )}

        {/* 9. Business Payment & Usage Hub (Free -> Pro -> Per-Project Options & Usage Tracking) */}
        {activeTab === "billing" && (
          <PricingBillingHub
            billingState={billingState}
            onUpgradePlan={handleUpgradePlan}
            onUnlockProject={handleUnlockProject}
            onRecordTransaction={handleRecordTransaction}
          />
        )}
      </main>

      {/* Post Simulation Forensic Debrief Modal */}
      {showDebriefModal && activeScenario && currentTurn && (
        <DebriefModal
          isOpen={showDebriefModal}
          onClose={() => setShowDebriefModal(false)}
          scenario={activeScenario}
          lastTurn={currentTurn}
          finalScore={securityScore}
          onPlayAgain={handleResetSimulation}
          onSelectAnotherScenario={handleExitSimulation}
        />
      )}

      {/* Floating Admin Button (Secret VIP Waitlist Lead Viewer) */}
      <button
        id="floating-admin-btn"
        type="button"
        onClick={() => setShowAdminModal(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-gray-300 hover:text-cyan-300 hover:bg-slate-900 border border-slate-700 hover:border-cyan-500/50 py-2 px-3.5 rounded-full z-50 shadow-2xl flex items-center gap-1.5 font-mono text-xs cursor-pointer transition-all hover:scale-105"
        title="Admin Leads Viewer (Secret)"
      >
        <Lock className="h-3.5 w-3.5 text-cyan-400" />
        <span>🔒 Admin</span>
      </button>

      {/* Secret Admin View Modal */}
      {showAdminModal && (
        <AdminViewModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
        />
      )}
    </div>
  );
}

