export type ThreatLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL_BREACH";

export type SimulationStatus = "IN_PROGRESS" | "FAILED_TRAP" | "SUCCESS_BUSTED";

export type ScenarioCategoryId =
  | "digital_arrest"
  | "bank_kyc"
  | "task_fraud"
  | "it_sso_phish"
  | "utility_blackout"
  | "voice_clone"
  | "crypto_romance"
  | "courier_customs"
  | "lottery_fraud"
  | "custom";

export interface ScenarioDefinition {
  id: ScenarioCategoryId;
  title: string;
  categoryName: string;
  badgeColor: string;
  iconName: string;
  tagline: string;
  threatActor: string;
  realWorldImpact: string;
  keyPsychologicalTriggers: string[];
  sampleOpeningHook: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface SocAnalysis {
  psychological_exploit: string;
  red_flags_present: string[];
  immediate_remediation: string;
}

export interface SimulationTurnResponse {
  // Threat Matrix v3.0 Fields
  terminal_header: string;
  adversary_persona: string;
  attack_vector_type: "DIGITAL_ARREST" | "MFA_HIJACK" | "BANKING_HARVEST" | "TASK_PYRAMID" | "UTILITY_BLACKOUT" | "CUSTOM_VECTOR" | string;
  mitre_technique_id: string;
  adversary_transmission: string;
  detected_threat_level: ThreatLevel;
  compromise_detected: boolean;
  defense_successful: boolean;
  cyber_readiness_score: number;
  soc_analysis: SocAnalysis;

  // Compatibility aliases
  scenario_title?: string;
  scammer_persona?: string;
  scammer_dialogue?: string;
  detected_user_action?: string;
  threat_level?: ThreatLevel;
  is_trap_triggered?: boolean;
  is_scam_busted?: boolean;
  simulation_status?: SimulationStatus;
  red_flags_present?: string[];
  educational_feedback?: string;
  security_score?: number;
}

export interface ChatMessage {
  id: string;
  sender: "scammer" | "user" | "guardian_system";
  text: string;
  timestamp: string;
  threatLevel?: ThreatLevel;
  mitreTechniqueId?: string;
  terminalHeader?: string;
  redFlags?: string[];
  feedback?: string;
  scoreChange?: number;
  isTrap?: boolean;
  isBusted?: boolean;
  socAnalysis?: SocAnalysis;
}

export interface UserStats {
  simulationsCompleted: number;
  scamsBusted: number;
  trapsTriggered: number;
  averageScore: number;
  highestScore: number;
  streakDays: number;
  defenseBadges: string[];
}


export interface URLAnalysisResult {
  url: string;
  riskScore: number;
  verdict: "MALICIOUS / PHISHING" | "SUSPICIOUS" | "LIKELY SAFE";
  flags: string[];
  recommendation: string;
}

export interface ContentVerificationResult {
  authenticity: "FAKE_SCAM" | "SUSPICIOUS" | "LIKELY_REAL";
  confidenceScore: number;
  threatType: string;
  summary: string;
  redFlags: string[];
  officialProcedure: string;
  recommendedAction: string;
}

export interface FIRGenerationResult {
  complaintTitle: string;
  firSubject: string;
  formattedReport: string;
  bankNoticeDraft: string;
  keyEvidenceList: string[];
  criticalNextSteps: string[];
}

export type PlanTierId = "free" | "pro" | "enterprise";

export interface PlanDefinition {
  id: PlanTierId;
  name: string;
  badge: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  isPopular?: boolean;
  limits: {
    simulationsPerMonth: number | "unlimited";
    voiceCallsPerMonth: number | "unlimited";
    urlSandboxScans: number | "unlimited";
    aiVerifications: number | "unlimited";
    firReports: number | "unlimited";
    customScenarios: boolean;
    priorityAiEngine: boolean;
    forensicCertificates: boolean;
    teamSeats: number;
  };
  features: string[];
  colorScheme: {
    border: string;
    glow: string;
    badgeBg: string;
    buttonBg: string;
  };
}

export interface ProjectPackageDefinition {
  id: string;
  title: string;
  codeName: string;
  category: string;
  price: number;
  description: string;
  includedScenarios: string[];
  features: string[];
  difficulty: "Tactical" | "Advanced" | "Critical";
  badgeColor: string;
}

export interface UsageRecord {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  actionType: "SIMULATION" | "VOICE_CALL" | "URL_SCAN" | "AI_VERIFY" | "FIR_REPORT" | "PROJECT_ACCESS";
  targetVector: string;
  planAtExecution: PlanTierId;
  costIncurred: number;
  status: "COMPLETED" | "BLOCKED_QUOTA" | "UNLOCKED";
}

export interface PaymentTransaction {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  itemType: "SUBSCRIPTION" | "PROJECT_PACKAGE";
  itemId: string;
  itemName: string;
  amount: number;
  currency: string;
  paymentMethod: "CREDIT_CARD" | "UPI" | "CYBER_TOKEN" | "FREE_CLAIM";
  status: "SUCCESS" | "REFUNDED";
  receiptNumber: string;
}

export interface BillingAccountState {
  userId: string;
  userEmail: string;
  currentPlan: PlanTierId;
  planBillingCycle: "monthly" | "annual";
  planExpiresAt: string;
  unlockedProjectIds: string[];
  creditsBalance: number;
  usageThisMonth: {
    simulationsUsed: number;
    voiceCallsUsed: number;
    urlScansUsed: number;
    aiVerifiesUsed: number;
    firReportsUsed: number;
  };
  transactions: PaymentTransaction[];
  usageLogs: UsageRecord[];
}

export interface CyberCrimeCaseDocket {
  id: string;
  caseNumber: string;
  title: string;
  category: "DIGITAL_ARREST" | "DEEPFAKE_VOICE" | "UPI_MULE_RING" | "LOAN_APK_EXTORTION" | "CORPORATE_BEC" | "CRYPTO_PIG_BUTCHERING";
  threatLevel: "SEV-1 CRITICAL" | "SEV-2 HIGH" | "SEV-3 ELEVATED";
  status: "ACTIVE_INVESTIGATION" | "FROZEN_NODAL_DISPATCH" | "ARREST_WARRANT_ISSUED" | "RESOLVED_FUNDS_RECOVERED";
  jurisdiction: string;
  reportedDate: string;
  goldenHourRemainingMinutes: number;
  financialImpact: {
    totalSiphoned: number;
    amountFrozen: number;
    currency: string;
  };
  syndicateProfile: {
    origin: string;
    alias: string;
    c2Infrastructure: string;
    modusOperandi: string;
    suspectsCount: number;
  };
  evidentiaryChain: {
    sha256EvidenceHash: string;
    seizedMuleAccounts: {
      bank: string;
      accountNumberMasked: string;
      ifsc: string;
      vpaHandle: string;
      freezeStatus: "FROZEN_100%" | "PARTIALLY_TRACED" | "ESCALATED_RBI";
      holdingAmount: number;
    }[];
    telecomIntercepts: {
      spoofedCallerId: string;
      originatingTower: string;
      imeiCluster: string;
      callPlatform: string;
    };
    digitalArtifacts: string[];
  };
  legalSectionsInvoked: string[];
  actionMilestones: {
    timestamp: string;
    title: string;
    description: string;
    officer: string;
    badgeStatus: "DONE" | "PENDING" | "ALERT";
  }[];
}

export interface GlobalThreatMapNode {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  vector: string;
  targetRegion: string;
  activeAttacksCount: number;
  threatSeverity: "CRITICAL" | "HIGH" | "MEDIUM";
  originSyndicate: string;
}

export interface DarknetBreachRecord {
  id: string;
  queryMatched: string;
  leakSource: string;
  breachDate: string;
  compromisedData: string[];
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  threatActor: string;
  exposedCredentialsPreview: string;
}

export interface AudioSettings {
  masterEnabled: boolean;
  terminalClicks: boolean;
  threatAlerts: boolean;
  voiceCalls: boolean;
  volume: number; // 0 to 100
}
