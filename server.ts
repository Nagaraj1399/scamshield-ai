import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ScamShield Threat Matrix Engine (v3.0-ZeroTrust) System Prompt
const SYSTEM_INSTRUCTION = `You are "ScamShield Threat Matrix Engine (v3.0-ZeroTrust)", an elite adversarial red-team simulation intelligence. You power a live cybersecurity defense simulator under the "Education & Human Potential" track.

Your objective is to execute highly realistic, high-pressure social engineering attacks, credential harvesting vectors, and zero-day psychological manipulation while functioning simultaneously as a real-time SOC (Security Operations Center) defense analyst.

# ADVERSARY VECTOR ENGINE (THE ATTACK MATRIX)
You dynamically adapt into specialized threat actor personas matching current global attack trends:

1. [VECTOR-01: DIGITAL ARREST & STATE EXTORTION]
   - Persona: Narcotics Control Bureau / CBI Cyber Cell Cyber Forensic Officer.
   - Mechanism: Intimidation, forged seizure orders, mandatory instant Skype/Video KYC, freezing bank assets.
   - Red Flags: Demanding private funds transfer to a "clearance escrow", artificial urgency, legal threats.
   - MITRE: T1566.002 (Spearphishing Link) / T1598 (Phishing for Information) / T1204 (User Execution).

2. [VECTOR-02: ENTERPRISE ZERO-TRUST & MFA FATIGUE]
   - Persona: Tier-3 Cloud Security / Okta-SSO Global Admin.
   - Mechanism: Simulated MFA prompt bombing, session token hijacking, urgent OAuth consent phishing.
   - Red Flags: Urgent login verification through non-whitelisted reverse-proxy URLs.
   - MITRE: T1621 (Multi-Factor Authentication Request Generation) / T1539 (Steal Web Session Cookie).

3. [VECTOR-03: CRITICAL BANKING & FINANCIAL API SPOOF]
   - Persona: Central Banking Anti-Fraud Intervention Unit.
   - Mechanism: Instant debit card deactivation scare, automated voice OTP extraction.
   - Red Flags: Demanding OTP/CVV under the guise of "blocking a fraudulent transaction".
   - MITRE: T1566.001 (Spearphishing Attachment) / T1656 (Impersonation).

4. [VECTOR-04: TASK PYRAMID & PREPAID WORK TRAP]
   - Persona: Global E-Commerce Merchant Task Verification Manager.
   - Mechanism: High-yield fake investment tasks, upfront security deposits.
   - Red Flags: Guaranteeing unrealistic returns, demanding deposit for task tier upgrades.
   - MITRE: T1589 (Gather Victim Identity Information).

# SOC GUARDIAN & REAL-TIME BEHAVIORAL TELEMETRY
Continuously inspect user responses for human vulnerabilities:
- CRITICAL EXPLOIT EXECUTED (compromise_detected: true, detected_threat_level: "CRITICAL_BREACH"): User shares OTP, PIN, Session Token, Password, clicks fake link, or surrenders money.
- THREAT COUNTERED / BUSTED (defense_successful: true, detected_threat_level: "LOW"): User asks for official PGP signature, requests ticketing reference, refuses OTP sharing, or verifies out-of-band domain authenticity.
- ACTIVE PROBING (compromise_detected: false, defense_successful: false): User asks questions or hesitates; tighten pressure and deploy cognitive bias exploits (Urgency, Authority, Reciprocity).

# SCORING ALGORITHM (0 - 100):
- Leak credentials (OTP, Password, Token): -40 pts
- Execute unverified URL / APK: -30 pts
- Compliance under panic: -15 pts
- Explicit OTP Refusal: +20 pts
- Out-of-band PGP / Ticket ID / Cyber Helpline 1930 reference: +15 pts
- Detecting psychological lever: +15 pts

# OUTPUT FORMAT (STRICT CYBER JSON ONLY)
You must ALWAYS respond in valid JSON conforming strictly to the requested schema.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    terminal_header: {
      type: Type.STRING,
      description: "Terminal header string, e.g. '[THREAT-ACTOR] >> CONNECTED TO TARGET ENDPOINT: 192.168.1.104'",
    },
    adversary_persona: {
      type: Type.STRING,
      description: "Persona name, e.g. 'DCP Sanjeev Yadav - Cyber & Narcotics Wing'",
    },
    attack_vector_type: {
      type: Type.STRING,
      enum: ["DIGITAL_ARREST", "MFA_HIJACK", "BANKING_HARVEST", "TASK_PYRAMID", "UTILITY_BLACKOUT", "CUSTOM_VECTOR"],
      description: "Attack vector category.",
    },
    mitre_technique_id: {
      type: Type.STRING,
      description: "MITRE ATT&CK technique, e.g. 'T1566.002 - Spearphishing Link / T1204.001 - Malicious Link'",
    },
    adversary_transmission: {
      type: Type.STRING,
      description: "The realistic, high-pressure dialogue directed at the victim/user.",
    },
    detected_threat_level: {
      type: Type.STRING,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL_BREACH"],
      description: "Current calculated threat level.",
    },
    compromise_detected: {
      type: Type.BOOLEAN,
      description: "True if user fell into a critical trap / compromised.",
    },
    defense_successful: {
      type: Type.BOOLEAN,
      description: "True if user executed defensive reflex and neutralized the adversary.",
    },
    cyber_readiness_score: {
      type: Type.NUMBER,
      description: "Score from 0 to 100.",
    },
    soc_analysis: {
      type: Type.OBJECT,
      properties: {
        psychological_exploit: {
          type: Type.STRING,
          description: "e.g. 'Authority Bias + Artificial Scarcity'",
        },
        red_flags_present: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of cognitive and tactical red flags.",
        },
        immediate_remediation: {
          type: Type.STRING,
          description: "Exact defensive command or reflex required to mitigate this threat.",
        },
      },
      required: ["psychological_exploit", "red_flags_present", "immediate_remediation"],
    },
  },
  required: [
    "terminal_header",
    "adversary_persona",
    "attack_vector_type",
    "mitre_technique_id",
    "adversary_transmission",
    "detected_threat_level",
    "compromise_detected",
    "defense_successful",
    "cyber_readiness_score",
    "soc_analysis",
  ],
};

function normalizeTurnResponse(raw: any, scenarioCategory: string = "Digital Threat"): any {
  const terminal_header = raw.terminal_header || `[THREAT-ACTOR] >> INGRESS LINK ESTABLISHED // TARGET: 10.0.4.12`;
  const adversary_persona = raw.adversary_persona || raw.scammer_persona || "Adversary Threat Actor";
  const attack_vector_type = raw.attack_vector_type || "BANKING_HARVEST";
  const mitre_technique_id = raw.mitre_technique_id || "T1566.002 - Spearphishing Link / T1204 - User Execution";
  const adversary_transmission = raw.adversary_transmission || raw.scammer_dialogue || "Transmission pending...";
  const detected_threat_level = raw.detected_threat_level || (raw.threat_level === "CRITICAL" ? "CRITICAL_BREACH" : raw.threat_level) || "HIGH";
  const compromise_detected = Boolean(raw.compromise_detected ?? raw.is_trap_triggered);
  const defense_successful = Boolean(raw.defense_successful ?? raw.is_scam_busted);
  const cyber_readiness_score = typeof raw.cyber_readiness_score === "number" ? raw.cyber_readiness_score : (typeof raw.security_score === "number" ? raw.security_score : 100);

  const soc_analysis = raw.soc_analysis || {
    psychological_exploit: "Artificial Urgency & Fear Induction",
    red_flags_present: raw.red_flags_present || ["Urgent Action Demanded", "Unverified Channel"],
    immediate_remediation: raw.educational_feedback || "Do not share OTP or sensitive credentials under any circumstances.",
  };

  const simulation_status = defense_successful ? "SUCCESS_BUSTED" : (compromise_detected ? "FAILED_TRAP" : "IN_PROGRESS");

  return {
    terminal_header,
    adversary_persona,
    attack_vector_type,
    mitre_technique_id,
    adversary_transmission,
    detected_threat_level,
    compromise_detected,
    defense_successful,
    cyber_readiness_score,
    soc_analysis,

    // Aliases for compatibility
    scenario_title: scenarioCategory,
    scammer_persona: adversary_persona,
    scammer_dialogue: adversary_transmission,
    detected_user_action: raw.detected_user_action || "Processed user telemetry",
    threat_level: detected_threat_level === "CRITICAL_BREACH" ? "CRITICAL" : detected_threat_level,
    is_trap_triggered: compromise_detected,
    is_scam_busted: defense_successful,
    simulation_status,
    red_flags_present: soc_analysis.red_flags_present,
    educational_feedback: soc_analysis.immediate_remediation,
    security_score: cyber_readiness_score,
  };
}

// Helper to normalize simulation request inputs
async function handleSimulationRequest(req: express.Request, res: express.Response) {
  const body = req.body || {};
  const scenarioCategory =
    body.scenarioCategory ||
    body.scenario?.title ||
    body.scenario?.categoryName ||
    "Banking / KYC Scam";

  const customScenario =
    body.customScenario ||
    body.scenario?.tagline ||
    body.scenario?.scenario ||
    "Standard realistic financial threat";

  const difficulty =
    body.difficulty ||
    body.scenario?.difficulty ||
    "Intermediate";

  // Normalize user action text
  const userAction =
    body.userAction ||
    body.actionText ||
    "Start simulation";

  // Normalize conversation history
  let history: Array<{ role: string; content: string }> = [];
  if (Array.isArray(body.history)) {
    history = body.history.map((h: any) => ({
      role: h.role || (h.sender === "user" ? "user" : "assistant"),
      content: h.content || h.text || "",
    }));
  } else if (Array.isArray(body.previousMessages)) {
    history = body.previousMessages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text || m.content || "",
    }));
  }

  const currentScore = typeof body.currentScore === "number" ? body.currentScore : 100;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback offline mock generator for reliable experience if key is pending
    const fallbackResponse = generateMockSimulationTurn(
      scenarioCategory,
      userAction,
      currentScore,
      history.length,
      customScenario
    );
    return res.json(normalizeTurnResponse(fallbackResponse, scenarioCategory));
  }

  const promptContext = `
SCENARIO CONFIGURATION:
- Category: ${scenarioCategory}
- Custom Details: ${customScenario}
- Difficulty Level: ${difficulty} (Adjust sophistication, urgency, and subtle manipulation accordingly)
- Current User Score: ${currentScore}

CONVERSATION HISTORY:
${history.map((h: any) => `[${h.role.toUpperCase()}]: ${h.content}`).join("\n")}

LATEST USER MOVE:
"${userAction}"

Evaluate this move as THE GUARDIAN, calculate the new security_score (adjusted from ${currentScore} within range 0-100), determine is_trap_triggered, is_scam_busted, simulation_status, and continue dialogue as THE ADVERSARY (or deliver final reaction if busted/failed).
`;

  // Candidate models to try in order of resilience and speed (modern supported Gemini models)
  const modelsToTry = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastError: any = null;

  try {
    for (const modelName of modelsToTry) {
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptContext,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.7,
          },
        });

        const text = response.text;
        if (text) {
          const parsedData = JSON.parse(text);
          return res.json(normalizeTurnResponse(parsedData, scenarioCategory));
        }
      } catch (error: any) {
        lastError = error;
        const isTransient =
          error?.status === 503 ||
          error?.code === 503 ||
          error?.message?.includes("503") ||
          error?.message?.includes("high demand") ||
          error?.status === 429 ||
          error?.code === 429;
        if (isTransient) {
          console.warn(`Model ${modelName} is experiencing high demand (${error?.code || error?.status || 503}), trying next model...`);
        } else {
          console.warn(`Model ${modelName} call issue:`, error?.message || error);
        }
      }
    }

    // Graceful smart fallback if all external models are busy
    console.info("Using smart local defense engine fallback response.");
    const fallback = generateMockSimulationTurn(
      scenarioCategory,
      userAction,
      currentScore,
      history.length,
      customScenario
    );
    return res.json(normalizeTurnResponse(fallback, scenarioCategory));
  } catch (globalErr: any) {
    console.error("Global simulate route error:", globalErr);
    const emergencyFallback = generateMockSimulationTurn(
      scenarioCategory,
      userAction || "Start simulation",
      currentScore || 100,
      (history || []).length,
      customScenario
    );
    return res.json(normalizeTurnResponse(emergencyFallback, scenarioCategory || "Digital Threat"));
  }
}

// POST /api/simulate
app.post("/api/simulate", handleSimulationRequest);

// POST /api/simulate-threat (Alias for Voice Simulation & Threat Testing)
app.post("/api/simulate-threat", handleSimulationRequest);

// Fallback intelligent turn handler
function generateMockSimulationTurn(
  category: string = "Bank KYC",
  userAction: string,
  currentScore: number,
  turnCount: number,
  customDetails?: string
) {
  const isStart = turnCount === 0 || userAction.toLowerCase().includes("start");
  const lowerAction = userAction.toLowerCase();

  // Check for critical traps
  const hasOTP = /otp|\b\d{4,6}\b|password|pin|cvv|credentials/i.test(lowerAction) && !/refuse|don't|never|not sharing|fake/i.test(lowerAction);
  const clickedLink = /click|opened link|transferred|downloaded|installed|sent money|paid/i.test(lowerAction);

  // Check for bust actions
  const isRefusal = /refuse|never share otp|1930|cybercell|police station|official branch|calling bank|badge id|report|fake|scam|law enforcement/i.test(lowerAction);

  let newScore = currentScore;
  let isTrap = false;
  let isBusted = false;
  let status = "IN_PROGRESS";
  let threatLevel = "HIGH";
  let feedback = "";
  let scammerDialogue = "";
  let persona = "Inspector Vikram Rathore, Cyber Crime Investigation Cell";
  let redFlags = ["Artificial Urgency", "Legal Intimidation", "Channel Isolation"];

  if (category.includes("Bank") || category.includes("KYC")) {
    persona = "Ramesh Verma, Chief Security Officer, Central Bank Fraud Desk";
    if (isStart) {
      scammerDialogue = "URGENT ALERT: Your savings account [Ending **4821] has been suspended due to pending mandatory KYC guidelines. To avoid permanent freezing of your assets within 30 minutes, update your PAN immediately via http://secure-centralbank-kyc.in or share the 6-digit verification code sent to your phone!";
      feedback = "The scammer is using high artificial urgency (30 min deadline) and an unofficial phishing link to induce panic.";
    }
  } else if (category.includes("Arrest") || category.includes("Law")) {
    persona = "DCP Sanjeev Yadav, CBI Narcotics & Financial Intelligence";
    if (isStart) {
      scammerDialogue = "This is DCP Sanjeev Yadav from CBI Head Office. A DHL parcel with your Aadhaar number containing 140g MDMA and forged passports was intercepted at Mumbai Airport. A non-bailable arrest warrant has been issued under PMLA Section 4. You are on immediate Digital Arrest. Join the secure Skype link immediately for confidential clearance or local police will raid your premises.";
      feedback = "Digital Arrest is completely fake! Indian law enforcement never issues arrest warrants over Skype/WhatsApp or conducts virtual arrests.";
    }
  } else if (category.includes("Job") || category.includes("HR")) {
    persona = "Priya Sharma, Lead Talent Partner, Global Media Marketing";
    if (isStart) {
      scammerDialogue = "Hello! Congratulations! You have been shortlisted for our YouTube video rating remote job. Earn ₹3,500 - ₹8,000 daily from home. Complete trial task 1: Subscribe to 3 channels and deposit a refundable ₹500 task security fee to our merchant UPI ID to unlock your ₹2,000 payout.";
      feedback = "Legitimate employers never ask candidates to pay money or deposit security fees to receive a salary.";
    }
  } else if (category.includes("IT") || category.includes("Cloud")) {
    persona = "Global IT Helpdesk / Microsoft Identity Security";
    if (isStart) {
      scammerDialogue = "ACTION REQUIRED: Your corporate single-sign-on (SSO) session has been flagged for abnormal location login. Your access will be revoked in 15 minutes. Please approve the Microsoft Authenticator number prompt #84 or reply with your session verification PIN immediately.";
      feedback = "MFA Fatigue and fake admin impersonation are classic social engineering tactics. Never approve random MFA pushes.";
    }
  } else if (category.includes("Custom") || (customDetails && customDetails.length > 10)) {
    persona = "Special Operations Officer, Cyber Threat Simulation Unit";
    if (isStart) {
      scammerDialogue = customDetails
        ? `ALERT: ${customDetails} Please take immediate action or verify credentials now!`
        : "URGENT NOTIFICATION: Suspicious activity detected on your account. Provide immediate confirmation to prevent termination.";
      feedback = "Custom attack vector: Scammers use tailored pretexts to induce compliance. Look for artificial pressure, unusual payment channels, and unverified credentials.";
    }
  } else {
    persona = "Smart Meter Support, State Electricity Transmission";
    if (isStart) {
      scammerDialogue = "URGENT NOTICE: Your electricity connection will be disconnected tonight at 9:30 PM by the substation due to unpaid previous month smart meter update. Pay ₹15 immediately via our bill officer link or call officer at +91-98112-XXXXX.";
      feedback = "Electricity boards never send individual WhatsApp/SMS messages threatening immediate same-day shutoff with private phone numbers.";
    }
  }

  if (!isStart) {
    if (hasOTP || clickedLink) {
      isTrap = true;
      status = "FAILED_TRAP";
      threatLevel = "CRITICAL";
      newScore = Math.max(0, currentScore - 40);
      scammerDialogue = "Thank you for the verification details. (System Alert: Unauthorized funds transfer of ₹45,000 initiated from your account!)";
      feedback = "CRITICAL SECURITY BREACH: You shared sensitive credentials / clicked a dangerous link. In real life, banks and police NEVER request OTPs, PINs, or urgent payments.";
    } else if (isRefusal) {
      isBusted = true;
      status = "SUCCESS_BUSTED";
      threatLevel = "LOW";
      newScore = Math.min(100, currentScore + 20);
      scammerDialogue = "...Wait, you cannot do that! (The caller quickly disconnects the line upon realizing you know the official protocols!)";
      feedback = "OUTSTANDING DEFENSE! You verified through official channels, refused OTP, and stood firm against psychological pressure. Threat neutralized!";
    } else {
      newScore = Math.max(10, currentScore - 10);
      threatLevel = "MEDIUM";
      scammerDialogue = "Do not waste time arguing! The clock is ticking. If you don't cooperate within 5 minutes, our legal/enforcement team will take irrevocable punitive action against you!";
      feedback = "The adversary is doubling down on fear and urgency. Demand their official ID and state you will call the official helpline directly.";
    }
  }

  return {
    scenario_title: `${category} Simulation`,
    scammer_persona: persona,
    scammer_dialogue: scammerDialogue,
    detected_user_action: userAction,
    threat_level: threatLevel,
    is_trap_triggered: isTrap,
    is_scam_busted: isBusted,
    simulation_status: status,
    red_flags_present: redFlags,
    educational_feedback: feedback,
    security_score: newScore,
  };
}

// POST /api/analyze-url (Link Protection URL analyzer)
app.post("/api/analyze-url", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const clean = url.trim().toLowerCase();
  const flags: string[] = [];
  let riskScore = 15; // baseline safe

  if (/\.cc|\.tk|\.top|\.xyz|\.click|\.gq|\.ga|\.work|\.vip/i.test(clean)) {
    flags.push("High-risk / free malicious TLD (.cc, .xyz, .top, .tk)");
    riskScore += 35;
  }
  if (/sbi|hdfc|icici|cbi|police|bank|kyc|support|update|login|verification|bill/i.test(clean) && !clean.includes("onlinesbi.sbi") && !clean.includes("hdfcbank.com") && !clean.includes("icicibank.com")) {
    flags.push("Brand keyword spoofing / Typosquatting (impersonating a legitimate institution)");
    riskScore += 40;
  }
  if (/http:\/\//i.test(clean)) {
    flags.push("Insecure unencrypted HTTP connection (no SSL)");
    riskScore += 20;
  }
  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(clean)) {
    flags.push("Direct IP address used instead of legitimate domain");
    riskScore += 30;
  }
  if (clean.includes("-") && (clean.includes("bank") || clean.includes("kyc") || clean.includes("secure"))) {
    flags.push("Deceptive hyphenated subdomain structure (e.g., secure-bank-update)");
    riskScore += 25;
  }

  riskScore = Math.min(100, Math.max(5, riskScore));
  const verdict = riskScore >= 60 ? "MALICIOUS / PHISHING" : riskScore >= 35 ? "SUSPICIOUS" : "LIKELY SAFE";

  return res.json({
    url,
    riskScore,
    verdict,
    flags: flags.length > 0 ? flags : ["No glaring typosquatting indicators found, but always verify domain certificates"],
    recommendation: riskScore >= 50 ? "DO NOT CLICK or enter credentials. Report to cybercrime.gov.in." : "Inspect SSL padlock and check the official domain registry.",
  });
});

// POST /api/verify-content (AI Verification: Real vs Fake Checker)
app.post("/api/verify-content", async (req, res) => {
  const { content, contentType } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  const prompt = `You are the Anti-Scam Shield AI Verification Engine. Analyze the following suspicious content (${contentType || "message/notice/ID"}) to determine if it is REAL, SUSPICIOUS, or FAKE/SCAM.
Content:
"""
${content}
"""

Evaluate for:
1. Impersonation of law enforcement, banks, tax agencies, telecom, or employers
2. Urgency, threats of arrest/penalties, demands for money transfer, OTP, gift cards, crypto
3. Fake UPI IDs, spoofed phone numbers, non-official domains, forged stamp/signature indicators
4. Grammar oddities, non-standard procedures (e.g. video arrest, paying clearance fee)

Return a valid JSON object with:
{
  "authenticity": "FAKE_SCAM | SUSPICIOUS | LIKELY_REAL",
  "confidenceScore": number (0-100),
  "threatType": string (e.g., "Digital Arrest Extortion", "Fake KYC Banking Phishing", "Job Task Pyramid", "Legitimate Notice"),
  "summary": string (Concise 2-sentence summary of the verdict),
  "redFlags": [string] (List of specific red flags detected),
  "officialProcedure": string (What legitimate agencies actually do instead),
  "recommendedAction": string (Immediate step for the user)
}`;

  const modelsToTry = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  for (const model of modelsToTry) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });
      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (e: any) {
      console.warn(`Model ${model} error in verify-content:`, e?.message || e);
    }
  }

  // Fallback verification heuristic engine
  const lower = content.toLowerCase();
  const isFake = /arrest|narcotics|cbi|customs|mdma|digital arrest|suspend|kyc|otp|pan card|electricity disconnect|lottery|prize|refund|task|earn \d+|telegram/i.test(lower);
  return res.json({
    authenticity: isFake ? "FAKE_SCAM" : "SUSPICIOUS",
    confidenceScore: isFake ? 95 : 70,
    threatType: isFake ? "High-Pressure Social Engineering Extortion" : "Unverified Communication",
    summary: isFake
      ? "This message exhibits hallmark signatures of predatory social engineering and unauthorized impersonation."
      : "The message contains indicators requiring independent verification through official public directories.",
    redFlags: [
      "Unofficial communication channel for sensitive official/financial matters",
      "Artificial time pressure designed to prevent independent verification",
      "Demand for remote action, credential sharing, or urgent compliance",
    ],
    officialProcedure: "Government departments and banks issue physical notices by registered post and never demand immediate payment or virtual arrest over calls/chats.",
    recommendedAction: "Do not respond or click links. Block the sender and report to Cyber Crime Helpline (1930 / cybercrime.gov.in).",
  });
});

// POST /api/generate-fir (Recovery Help: Emergency FIR & Bank Incident Form Builder)
app.post("/api/generate-fir", async (req, res) => {
  const { incidentDetails, victimName, lossAmount, scamType, suspectInfo, transactionId } = req.body;

  const prompt = `Generate a formal, legally structured Cyber Crime Incident Report / FIR Complaint Draft for a scam victim.
Details:
- Victim Name: ${victimName || "Victim"}
- Scam Type: ${scamType || "Cyber Financial Fraud"}
- Loss Amount: ${lossAmount || "Pending computation"}
- Suspect Details / UPI / Phone / URL: ${suspectInfo || "Unknown Threat Actor"}
- Transaction ID / Reference: ${transactionId || "N/A"}
- Description: ${incidentDetails || "Social engineering scam"}

Output JSON format:
{
  "complaintTitle": string,
  "firSubject": string,
  "formattedReport": string (Comprehensive, formal legal draft ready to copy-paste into cybercrime.gov.in or submit to Cyber Cell police station),
  "bankNoticeDraft": string (Formal request letter to bank manager to freeze beneficiary accounts under Section 91 CrPC / IT Act),
  "keyEvidenceList": [string] (Screenshots, bank statements, call logs, SMS headers needed),
  "criticalNextSteps": [string] (Numbered emergency steps to maximize asset recovery within the 1-hour golden window)
}`;

  const modelsToTry = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  for (const model of modelsToTry) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });
      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (e: any) {
      console.warn(`Model ${model} error in generate-fir:`, e?.message || e);
    }
  }

  // Fallback FIR builder
  return res.json({
    complaintTitle: "CYBER CRIME INCIDENT REPORT - FORMAL COMPLAINT",
    firSubject: `Complaint regarding Cyber Financial Fraud & Impersonation amounting to ${lossAmount || "financial loss"}`,
    formattedReport: `TO:\nThe Officer-in-Charge, Cyber Crime Police Station / National Cyber Crime Reporting Portal (1930)\n\nSUBJECT: Formal Complaint regarding Cyber Crime / Financial Extortion\n\nRespected Sir/Madam,\n\nI, ${victimName || "The Complainant"}, wish to report an incident of cyber fraud.\n\nINCIDENT SUMMARY:\nOn ${new Date().toLocaleDateString()}, I was targeted through ${scamType || "a digital scam vector"}.\n\nDETAILS OF SUSPECT:\n- Suspect Identifiers / Phone / UPI / Link: ${suspectInfo || "Provided in attachments"}\n- Transaction Reference ID: ${transactionId || "Pending bank confirmation"}\n- Financial Loss Incurred: ${lossAmount || "Under verification"}\n\nNARRATIVE:\n${incidentDetails || "The threat actor induced panic and manipulated credentials under false pretenses."}\n\nI request your immediate intervention to register this complaint under Section 66D of Information Technology Act and relevant sections of BNS / IPC, and issue an immediate lien/freeze request to the beneficiary bank.\n\nYours sincerely,\n${victimName || "Victim"}\nDate: ${new Date().toLocaleDateString()}`,
    bankNoticeDraft: `TO:\nThe Branch Manager,\n[Your Bank Name]\n\nSUBJECT: URGENT: Request to freeze fraudulent beneficiary account & reverse unauthorized transaction\n\nDear Sir/Madam,\n\nI am writing to report an unauthorized fraudulent transaction of ${lossAmount || "amount"} (Txn ID: ${transactionId || "[TXN-ID]"}) on my account on ${new Date().toLocaleDateString()}.\n\nKindly mark this transaction as disputed fraud and immediately coordinate with the beneficiary bank nodal officer to place a debit freeze on the beneficiary account in accordance with RBI Circular on Customer Protection in Unauthorized Electronic Banking Transactions.\n\nCyber Crime Ack No: [Generated on 1930 / portal]\n\nThanking you,\n${victimName || "Account Holder"}`,
    keyEvidenceList: [
      "Original unedited screenshots of chat/SMS/email communications with timestamps",
      "Official Bank Account Statement showing debit transaction ID & beneficiary IFSC/UPI",
      "Audio recordings or call log records showing caller telephone numbers",
      "Copy of government ID proof of complainant",
    ],
    criticalNextSteps: [
      "Immediately dial 1930 (National Cyber Crime Helpline) within the 1-hour golden window to freeze funds in transit.",
      "Submit official dispute with your bank card/account manager within 24 hours to claim zero-liability protection.",
      "Upload full complaint and transaction logs on https://cybercrime.gov.in.",
      "Revoke active logins, change internet banking passwords, and format compromised devices if any remote APK was installed.",
    ],
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ScamShield Engine server running on http://localhost:${PORT}`);
  });
}

startServer();
