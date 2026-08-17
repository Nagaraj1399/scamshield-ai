import { AudioSettings } from "../types";

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterEnabled: true,
  terminalClicks: true,
  threatAlerts: true,
  voiceCalls: true,
  volume: 80,
};

// High-tech Cyber Web Audio Synthesizer with granular channel control
class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  private settings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS };
  private listeners: Set<(settings: AudioSettings) => void> = new Set();

  constructor() {
    // Load persisted settings from localStorage if available
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("scamshield_audio_settings");
        if (saved) {
          this.settings = { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.warn("Error loading audio settings:", e);
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  public setSettings(newSettings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("scamshield_audio_settings", JSON.stringify(this.settings));
      } catch (e) {
        console.warn("Error persisting audio settings:", e);
      }
    }
    this.notifyListeners();
  }

  public setMasterMuted(muted: boolean) {
    this.setSettings({ masterEnabled: !muted });
  }

  public subscribe(callback: (settings: AudioSettings) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.getSettings()));
  }

  private getVolumeMultiplier(): number {
    return Math.max(0, Math.min(1, this.settings.volume / 100));
  }

  // ----------------------------------------------------
  // CHANNEL 1: TERMINAL & UI CLICKS
  // ----------------------------------------------------
  public isTerminalClicksEnabled(): boolean {
    return this.settings.masterEnabled && this.settings.terminalClicks;
  }

  // Subtle tactical UI click
  public playClick() {
    if (!this.isTerminalClicksEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const vol = this.getVolumeMultiplier() * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  // Terminal keystroke tick
  public playKeyTick() {
    if (!this.isTerminalClicksEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const vol = this.getVolumeMultiplier() * 0.025;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(750 + Math.random() * 450, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {}
  }

  // Terminal Enter Command confirmation sound
  public playTerminalEnter() {
    if (!this.isTerminalClicksEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.getVolumeMultiplier() * 0.04;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.04);
      
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // ----------------------------------------------------
  // CHANNEL 2: THREAT DETECTION ALERTS
  // ----------------------------------------------------
  public isThreatAlertsEnabled(): boolean {
    return this.settings.masterEnabled && this.settings.threatAlerts;
  }

  // Exploit / Payload Trigger Whoosh & Lock
  public playExploitSuccess() {
    if (!this.isThreatAlertsEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.getVolumeMultiplier() * 0.08;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.setValueAtTime(1760, now + 0.16);
      
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Tactical Alert Alarm (Red Team / Incident Response / Fraud Alert)
  public playAlert() {
    if (!this.isThreatAlertsEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.getVolumeMultiplier() * 0.06;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "square";
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.setValueAtTime(620, now + 0.08);
      osc.frequency.setValueAtTime(920, now + 0.16);
      osc.frequency.setValueAtTime(620, now + 0.24);
      
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // Radar sonar ping / Threat scan ping
  public playRadarPing() {
    if (!this.isThreatAlertsEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.getVolumeMultiplier() * 0.05;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1480, now);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.35);
      
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // Threat detected chime (positive mitigation or dangerous trap caught)
  public playThreatMitigated() {
    if (!this.isThreatAlertsEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.getVolumeMultiplier() * 0.07;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.08);
      osc.frequency.setValueAtTime(659.25, now + 0.16);
      osc.frequency.setValueAtTime(880, now + 0.24);
      
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // ----------------------------------------------------
  // CHANNEL 3: VOICE CALLS & ADVERSARY SPEECH
  // ----------------------------------------------------
  public isVoiceCallsEnabled(): boolean {
    return this.settings.masterEnabled && this.settings.voiceCalls;
  }

  // Phone Call Ringing Tone (telephony dual-frequency simulation)
  public playCallRing() {
    if (!this.isVoiceCallsEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.getVolumeMultiplier() * 0.05;

      // Telephony standard 440Hz + 480Hz
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(440, now);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(480, now);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.setValueAtTime(vol, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch {}
  }

  // Call connection beep
  public playCallConnected() {
    if (!this.isVoiceCallsEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.getVolumeMultiplier() * 0.05;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(1000, now + 0.07);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // Call disconnected tone
  public playCallEnd() {
    if (!this.isVoiceCallsEnabled()) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.getVolumeMultiplier() * 0.05;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.setValueAtTime(320, now + 0.12);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  // ----------------------------------------------------
  // TEST PREVIEW TRIGGERS (FOR SETTINGS PANEL)
  // ----------------------------------------------------
  public testSound(channel: "terminal" | "alert" | "voice") {
    // Force sound playback for test preview regardless of channel mute (if master enabled)
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.getVolumeMultiplier() * 0.07;

      if (channel === "terminal") {
        // Play rapid 2-stroke terminal click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1100, now + 0.04);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (channel === "alert") {
        // Play alert warble
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.setValueAtTime(650, now + 0.07);
        osc.frequency.setValueAtTime(900, now + 0.14);
        gain.gain.setValueAtTime(vol * 0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (channel === "voice") {
        // Play dual telephony ring chirp
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(440, now);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(480, now);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.2);
        osc2.stop(now + 0.2);
      }
    } catch {}
  }
}

export const cyberAudio = new CyberAudioEngine();
