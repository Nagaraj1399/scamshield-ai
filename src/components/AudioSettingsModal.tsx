import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Volume1,
  Terminal,
  AlertTriangle,
  PhoneCall,
  X,
  Play,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Bell,
  Headphones,
} from "lucide-react";
import { cyberAudio, DEFAULT_AUDIO_SETTINGS } from "../utils/cyberAudio";
import { AudioSettings } from "../types";

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AudioSettingsModal({ isOpen, onClose }: AudioSettingsModalProps) {
  const [settings, setSettings] = useState<AudioSettings>(() => cyberAudio.getSettings());
  const [testingChannel, setTestingChannel] = useState<"terminal" | "alert" | "voice" | null>(null);

  useEffect(() => {
    const unsubscribe = cyberAudio.subscribe((newSettings) => {
      setSettings(newSettings);
    });
    setSettings(cyberAudio.getSettings());
    return () => unsubscribe();
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleMaster = () => {
    const nextVal = !settings.masterEnabled;
    cyberAudio.setSettings({ masterEnabled: nextVal });
    if (nextVal) {
      cyberAudio.playClick();
    }
  };

  const handleToggleChannel = (key: keyof Pick<AudioSettings, "terminalClicks" | "threatAlerts" | "voiceCalls">) => {
    const nextVal = !settings[key];
    cyberAudio.setSettings({ [key]: nextVal });
    if (nextVal) {
      cyberAudio.playClick();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(e.target.value, 10);
    cyberAudio.setSettings({ volume });
  };

  const handleTestSound = (channel: "terminal" | "alert" | "voice") => {
    setTestingChannel(channel);
    cyberAudio.testSound(channel);
    setTimeout(() => {
      setTestingChannel(null);
    }, 400);
  };

  const handleApplyPreset = (preset: "default" | "alerts_only" | "silent") => {
    if (preset === "default") {
      cyberAudio.setSettings({
        masterEnabled: true,
        terminalClicks: true,
        threatAlerts: true,
        voiceCalls: true,
        volume: 80,
      });
      cyberAudio.playClick();
    } else if (preset === "alerts_only") {
      cyberAudio.setSettings({
        masterEnabled: true,
        terminalClicks: false,
        threatAlerts: true,
        voiceCalls: false,
        volume: 80,
      });
      cyberAudio.playAlert();
    } else if (preset === "silent") {
      cyberAudio.setSettings({
        masterEnabled: false,
      });
    }
  };

  const handleResetToDefault = () => {
    cyberAudio.setSettings(DEFAULT_AUDIO_SETTINGS);
    cyberAudio.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-slate-800 bg-[#0b1120] p-5 sm:p-6 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                Audio & Sound Settings
              </h2>
              <p className="text-xs text-slate-400">
                Granular control over interactive sounds and alerts
              </p>
            </div>
          </div>

          <button
            id="close-audio-settings-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Master Sound Switch */}
        <div className="mt-4 p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${settings.masterEnabled ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-slate-800 text-slate-500'}`}>
              {settings.masterEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Master Audio System
              </span>
              <span className="text-[11px] text-slate-400">
                {settings.masterEnabled ? "All selected sound effects enabled" : "All audio completely muted"}
              </span>
            </div>
          </div>

          <button
            id="toggle-master-audio-btn"
            onClick={handleToggleMaster}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.masterEnabled ? "bg-sky-500" : "bg-slate-800"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.masterEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="mt-4 px-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-slate-400" />
              Master Volume
            </span>
            <span className="font-mono text-slate-400 text-[11px]">{settings.volume}%</span>
          </div>
          <div className="flex items-center gap-3">
            <Volume1 className="h-4 w-4 text-slate-500" />
            <input
              type="range"
              id="audio-volume-slider"
              min="0"
              max="100"
              value={settings.volume}
              disabled={!settings.masterEnabled}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 disabled:opacity-40"
            />
            <Volume2 className="h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* 3 Granular Channels */}
        <div className="mt-5 space-y-2.5">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-1">
            Sound Channels ({settings.masterEnabled ? "Active" : "Master Muted"})
          </div>

          {/* Channel 1: Terminal Clicks */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              settings.masterEnabled && settings.terminalClicks
                ? "bg-slate-900/90 border-slate-700/80"
                : "bg-slate-900/40 border-slate-800/60 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 border border-slate-700 text-sky-400">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200">Terminal & UI Clicks</span>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.2 rounded">
                      CLI & Tactility
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Keystroke ticks, command submissions, and button feedback
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="test-sound-terminal-btn"
                  onClick={() => handleTestSound("terminal")}
                  title="Test Terminal Click Sound"
                  className={`p-1.5 rounded-md text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 ${
                    testingChannel === "terminal" ? "ring-1 ring-sky-400 text-sky-300" : ""
                  }`}
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span className="text-[10px] hidden sm:inline">Test</span>
                </button>

                <button
                  type="button"
                  id="toggle-sound-terminal-btn"
                  disabled={!settings.masterEnabled}
                  onClick={() => handleToggleChannel("terminalClicks")}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${
                    settings.masterEnabled && settings.terminalClicks ? "bg-sky-500" : "bg-slate-800"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      settings.masterEnabled && settings.terminalClicks ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Channel 2: Threat Detection Alerts */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              settings.masterEnabled && settings.threatAlerts
                ? "bg-slate-900/90 border-slate-700/80"
                : "bg-slate-900/40 border-slate-800/60 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 border border-slate-700 text-rose-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200">Threat Detection Alerts</span>
                    <span className="text-[9px] font-mono text-rose-300 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-900/50">
                      High Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Alarms, high-risk detection chimes, radar sweeps, and scam warnings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="test-sound-alert-btn"
                  onClick={() => handleTestSound("alert")}
                  title="Test Threat Alert Sound"
                  className={`p-1.5 rounded-md text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 ${
                    testingChannel === "alert" ? "ring-1 ring-rose-400 text-rose-300" : ""
                  }`}
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span className="text-[10px] hidden sm:inline">Test</span>
                </button>

                <button
                  type="button"
                  id="toggle-sound-alert-btn"
                  disabled={!settings.masterEnabled}
                  onClick={() => handleToggleChannel("threatAlerts")}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${
                    settings.masterEnabled && settings.threatAlerts ? "bg-rose-500" : "bg-slate-800"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      settings.masterEnabled && settings.threatAlerts ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Channel 3: Voice Calls */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              settings.masterEnabled && settings.voiceCalls
                ? "bg-slate-900/90 border-slate-700/80"
                : "bg-slate-900/40 border-slate-800/60 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 border border-slate-700 text-emerald-400">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200">Voice Calls & Synthesis</span>
                    <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-900/50">
                      Telephony
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Incoming call ringtones, dial tones, and synthesized caller speech audio
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="test-sound-voice-btn"
                  onClick={() => handleTestSound("voice")}
                  title="Test Voice Call Ring Tone"
                  className={`p-1.5 rounded-md text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 ${
                    testingChannel === "voice" ? "ring-1 ring-emerald-400 text-emerald-300" : ""
                  }`}
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span className="text-[10px] hidden sm:inline">Test</span>
                </button>

                <button
                  type="button"
                  id="toggle-sound-voice-btn"
                  disabled={!settings.masterEnabled}
                  onClick={() => handleToggleChannel("voiceCalls")}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${
                    settings.masterEnabled && settings.voiceCalls ? "bg-emerald-500" : "bg-slate-800"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      settings.masterEnabled && settings.voiceCalls ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-mono">Presets:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset("default")}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              All Active
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("alerts_only")}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 transition-colors"
            >
              SOC (Alerts Only)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("silent")}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors"
            >
              Silent
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Close button at bottom */}
        <div className="mt-5">
          <button
            type="button"
            id="done-audio-settings-btn"
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
