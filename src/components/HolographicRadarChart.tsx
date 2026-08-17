import React, { useState } from "react";
import { Activity, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

interface HolographicRadarChartProps {
  score?: number;
}

interface AxisMetric {
  name: string;
  value: number; // 0 - 100
  threat: string;
  detail: string;
}

const AXIS_DATA: AxisMetric[] = [
  { name: "Phishing Heuristics", value: 88, threat: "LOW", detail: "Zero typosquatting hits detected on verified domains" },
  { name: "Social Engineering", value: 72, threat: "MED", detail: "High-pressure urgency resistance rated B+" },
  { name: "Deepfake Voice ID", value: 94, threat: "LOW", detail: "Synthetic cadence & frequency anomaly detector active" },
  { name: "Credential Shield", value: 91, threat: "LOW", detail: "100% strict refusal on OTP / PIN sharing prompts" },
  { name: "Payment Integrity", value: 82, threat: "MED", detail: "UPI handle format verification & freeze readiness" },
];

export function HolographicRadarChart({ score = 85 }: HolographicRadarChartProps) {
  const [hoveredAxis, setHoveredAxis] = useState<AxisMetric | null>(null);

  // Math for 5-axis radar chart
  const size = 220;
  const center = size / 2;
  const radius = 80;
  const numAxes = AXIS_DATA.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Compute radar points
  const points = AXIS_DATA.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (item.value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle, ...item };
  });

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative flex flex-col items-center">
      {/* Holographic Radar Canvas Container */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        
        {/* Holographic Glowing Sweep / Pulse */}
        <div className="absolute inset-2 rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(0,243,255,0.2)] animate-pulse pointer-events-none" />
        <div className="absolute inset-8 rounded-full border border-dashed border-purple-400/30 animate-[spin_40s_linear_infinite] pointer-events-none" />
        <div className="absolute inset-16 rounded-full border border-pink-400/20 pointer-events-none" />

        <svg viewBox={`0 0 ${size} ${size}`} className="w-56 h-56 overflow-visible">
          <defs>
            <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f3ff" stopOpacity="0.6" />
            </linearGradient>

            <linearGradient id="holoStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#00f3ff" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid web rings */}
          {[0.25, 0.5, 0.75, 1].map((scale, i) => {
            const ringPoints = AXIS_DATA.map((_, idx) => {
              const angle = idx * angleStep - Math.PI / 2;
              const r = radius * scale;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(" ");

            return (
              <polygon
                key={i}
                points={ringPoints}
                fill="none"
                stroke="rgba(168, 85, 247, 0.2)"
                strokeWidth="1"
                strokeDasharray={i % 2 === 1 ? "2,2" : undefined}
              />
            );
          })}

          {/* Axis spoke lines */}
          {AXIS_DATA.map((_, idx) => {
            const angle = idx * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(0, 243, 255, 0.25)"
                strokeWidth="1"
              />
            );
          })}

          {/* Radar Polygon Surface with Holographic Glow */}
          <polygon
            points={polygonPath}
            fill="url(#holoGradient)"
            stroke="url(#holoStroke)"
            strokeWidth="2.5"
            filter="url(#glowFilter)"
            className="transition-all duration-300 cursor-pointer"
          />

          {/* Glowing Vertex Nodes */}
          {points.map((p, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredAxis(p)}
              onMouseLeave={() => setHoveredAxis(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#ffffff"
                stroke="#00f3ff"
                strokeWidth="2"
                className="drop-shadow-[0_0_8px_#00f3ff] transition-transform hover:scale-150"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Axis Info Pill */}
      <div className="mt-2 min-h-[44px] w-full text-center">
        {hoveredAxis ? (
          <div className="rounded-xl bg-purple-950/80 border border-purple-500/40 px-3 py-1.5 text-xs text-purple-200 animate-fade-in shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <span className="font-bold text-white">{hoveredAxis.name}:</span>{" "}
            <span className="text-cyan-300 font-mono font-black">{hoveredAxis.value}% Safe</span>
            <p className="text-[10px] text-slate-300 font-mono truncate">{hoveredAxis.detail}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-purple-300/80">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span>Hover vertices for heuristic vulnerability breakdown</span>
          </div>
        )}
      </div>
    </div>
  );
}
