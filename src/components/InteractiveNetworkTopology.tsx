import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Activity,
  Shield,
  Zap,
  Radio,
  Cpu,
  Lock,
  Layers,
  Server,
  Globe,
  RefreshCw,
  Eye,
  Crosshair,
} from "lucide-react";

export interface TopologyNode {
  id: string;
  label: string;
  role: "GATEWAY" | "FIREWALL" | "AI_ENGINE" | "ENDPOINT" | "HONEYPOT" | "DNS" | "VAULT" | "SIEM";
  baseX: number; // percentage 0 - 100
  baseY: number; // percentage 0 - 100
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  status: "OPTIMAL" | "INSPECTING" | "ALERT" | "SECURED";
  ip: string;
  latency: number;
  load: number;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  color?: string;
  speed: number;
  activePacket: number; // 0 to 1 progress
}

const INITIAL_NODES: Omit<TopologyNode, "x" | "y" | "vx" | "vy">[] = [
  { id: "node-gw", label: "GW-01 / BGP EDGE", role: "GATEWAY", baseX: 18, baseY: 22, radius: 10, color: "#00f3ff", status: "OPTIMAL", ip: "10.0.0.1", latency: 0.8, load: 42 },
  { id: "node-zt", label: "ZERO-TRUST BROKER", role: "FIREWALL", baseX: 35, baseY: 14, radius: 9, color: "#00f3ff", status: "OPTIMAL", ip: "10.0.1.5", latency: 1.2, load: 38 },
  { id: "node-ai", label: "NEURAL SCAM AI", role: "AI_ENGINE", baseX: 50, baseY: 30, radius: 14, color: "#a855f7", status: "INSPECTING", ip: "10.0.8.20", latency: 2.1, load: 85 },
  { id: "node-dns", label: "DNS SENTRY DOH", role: "DNS", baseX: 68, baseY: 16, radius: 8, color: "#10b981", status: "OPTIMAL", ip: "1.1.1.1", latency: 1.0, load: 24 },
  { id: "node-siem", label: "SOC SIEM MATRIX", role: "SIEM", baseX: 82, baseY: 28, radius: 11, color: "#00f3ff", status: "OPTIMAL", ip: "10.0.99.10", latency: 1.4, load: 60 },
  { id: "node-ep1", label: "ENDPOINT CLUSTER A", role: "ENDPOINT", baseX: 12, baseY: 58, radius: 7, color: "#10b981", status: "OPTIMAL", ip: "192.168.4.12", latency: 1.8, load: 31 },
  { id: "node-ep2", label: "CFO WORKSTATION", role: "ENDPOINT", baseX: 28, baseY: 75, radius: 8, color: "#f59e0b", status: "INSPECTING", ip: "192.168.4.88", latency: 2.4, load: 49 },
  { id: "node-hp", label: "HONEYPOT DECOY", role: "HONEYPOT", baseX: 48, baseY: 82, radius: 8, color: "#f43f5e", status: "ALERT", ip: "198.51.100.99", latency: 4.8, load: 92 },
  { id: "node-vlt", label: "KMS AUTH VAULT", role: "VAULT", baseX: 70, baseY: 72, radius: 10, color: "#10b981", status: "SECURED", ip: "10.0.12.4", latency: 0.9, load: 18 },
  { id: "node-ext", label: "GLOBAL CLOUD EGRESS", role: "GATEWAY", baseX: 88, baseY: 65, radius: 9, color: "#00f3ff", status: "OPTIMAL", ip: "172.16.0.1", latency: 1.1, load: 55 },
];

const INITIAL_EDGES: TopologyEdge[] = [
  { id: "e1", source: "node-gw", target: "node-zt", color: "#00f3ff", speed: 0.008, activePacket: 0.2 },
  { id: "e2", source: "node-zt", target: "node-ai", color: "#a855f7", speed: 0.012, activePacket: 0.6 },
  { id: "e3", source: "node-ai", target: "node-dns", color: "#10b981", speed: 0.009, activePacket: 0.1 },
  { id: "e4", source: "node-dns", target: "node-siem", color: "#00f3ff", speed: 0.01, activePacket: 0.8 },
  { id: "e5", source: "node-gw", target: "node-ep1", color: "#10b981", speed: 0.007, activePacket: 0.4 },
  { id: "e6", source: "node-ep1", target: "node-ep2", color: "#00f3ff", speed: 0.008, activePacket: 0.7 },
  { id: "e7", source: "node-ep2", target: "node-hp", color: "#f43f5e", speed: 0.015, activePacket: 0.3 },
  { id: "e8", source: "node-ai", target: "node-hp", color: "#f43f5e", speed: 0.014, activePacket: 0.9 },
  { id: "e9", source: "node-ai", target: "node-vlt", color: "#10b981", speed: 0.006, activePacket: 0.5 },
  { id: "e10", source: "node-vlt", target: "node-siem", color: "#00f3ff", speed: 0.01, activePacket: 0.2 },
  { id: "e11", source: "node-siem", target: "node-ext", color: "#00f3ff", speed: 0.011, activePacket: 0.65 },
  { id: "e12", source: "node-vlt", target: "node-ext", color: "#10b981", speed: 0.008, activePacket: 0.35 },
];

export function InteractiveNetworkTopology() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 420 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [pinnedNodeId, setPinnedNodeId] = useState<string | null>(null);
  const [pingRipples, setPingRipples] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [edges, setEdges] = useState<TopologyEdge[]>(INITIAL_EDGES);

  // Nodes state with dynamic offset
  const [nodes, setNodes] = useState<TopologyNode[]>(() =>
    INITIAL_NODES.map((n) => ({
      ...n,
      x: (n.baseX / 100) * 1200,
      y: (n.baseY / 100) * 420,
      vx: 0,
      vy: 0,
    }))
  );

  // Resize observer
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const w = clientWidth || 1200;
        const h = clientHeight || 420;
        setDimensions({ width: w, height: h });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Update base node positions when dimensions change
  useEffect(() => {
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        x: (node.baseX / 100) * dimensions.width,
        y: (node.baseY / 100) * dimensions.height,
      }))
    );
  }, [dimensions.width, dimensions.height]);

  // Handle Mouse Move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos((prev) => ({ ...prev, active: false }));
    setHoveredNodeId(null);
  }, []);

  // Ping ripple trigger
  const triggerPing = (node: TopologyNode) => {
    setPingRipples((prev) => [
      ...prev.slice(-6),
      { id: Date.now() + Math.random(), x: node.x, y: node.y, color: node.color },
    ]);
    setPinnedNodeId(node.id === pinnedNodeId ? null : node.id);
  };

  // Physics animation loop: Mouse repulsion/magnetic spring & packet animation
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Update Node positions with spring towards base & mouse repulsion/attraction
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          const targetX = (node.baseX / 100) * dimensions.width;
          const targetY = (node.baseY / 100) * dimensions.height;

          // Spring force to home position
          const kSpring = 2.8;
          const damping = 0.85;

          let fx = (targetX - node.x) * kSpring;
          let fy = (targetY - node.y) * kSpring;

          // Mouse interaction force (Repulsion & slight gravitational drag)
          if (mousePos.active) {
            const dx = node.x - mousePos.x;
            const dy = node.y - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const maxRadius = 180;

            if (dist < maxRadius) {
              const force = (1 - dist / maxRadius) * 45;
              // Repulse away from cursor with elastic cushion
              fx += (dx / dist) * force * 3.5;
              fy += (dy / dist) * force * 3.5;
            }
          }

          // Gentle ambient drift
          const t = time * 0.001;
          const ambientX = Math.sin(t + node.baseX) * 2;
          const ambientY = Math.cos(t + node.baseY) * 2;

          const vx = (node.vx + fx * delta + ambientX * delta) * damping;
          const vy = (node.vy + fy * delta + ambientY * delta) * damping;

          return {
            ...node,
            x: node.x + vx,
            y: node.y + vy,
            vx,
            vy,
          };
        })
      );

      // Advance packet progress along edges
      setEdges((currentEdges) =>
        currentEdges.map((edge) => {
          let nextP = edge.activePacket + edge.speed;
          if (nextP > 1) nextP = 0;
          return { ...edge, activePacket: nextP };
        })
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [dimensions.width, dimensions.height, mousePos]);

  // Quick lookup for node coordinates
  const nodeMap = useMemo(() => {
    const map = new Map<string, TopologyNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Find neighbors of hovered node
  const activeNeighborIds = useMemo(() => {
    if (!hoveredNodeId && !pinnedNodeId) return new Set<string>();
    const activeId = hoveredNodeId || pinnedNodeId;
    const set = new Set<string>();
    edges.forEach((e) => {
      if (e.source === activeId) set.add(e.target);
      if (e.target === activeId) set.add(e.source);
    });
    return set;
  }, [hoveredNodeId, pinnedNodeId, edges]);

  // Nearest nodes to mouse cursor for interactive dynamic tether lines
  const mouseTetherNodes = useMemo(() => {
    if (!mousePos.active) return [];
    return nodes
      .map((node) => {
        const dx = node.x - mousePos.x;
        const dy = node.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return { node, dist };
      })
      .filter((item) => item.dist < 150)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);
  }, [mousePos, nodes]);

  const activeNode = nodes.find((n) => n.id === (hoveredNodeId || pinnedNodeId));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 pointer-events-auto overflow-hidden select-none z-0"
      style={{ minHeight: "100%" }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 12px rgba(0, 243, 255, 0.15))" }}
      >
        <defs>
          {/* Gradient for Connections */}
          <linearGradient id="edgeGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00f3ff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="edgeGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00f3ff" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="edgeGradRose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="coreGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Network Edges & Connecting Lines */}
        {edges.map((edge) => {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) return null;

          const isConnectedToActive =
            s.id === (hoveredNodeId || pinnedNodeId) ||
            t.id === (hoveredNodeId || pinnedNodeId);

          // Calculate current packet position
          const px = s.x + (t.x - s.x) * edge.activePacket;
          const py = s.y + (t.y - s.y) * edge.activePacket;

          return (
            <g key={edge.id}>
              {/* Background Edge Line */}
              <line
                x1={s.x}
                y1={s.y}
                x2={t.x}
                y2={t.y}
                stroke={
                  isConnectedToActive
                    ? edge.color || "#00f3ff"
                    : "rgba(0, 243, 255, 0.12)"
                }
                strokeWidth={isConnectedToActive ? 2 : 1}
                strokeDasharray={isConnectedToActive ? "4 2" : "none"}
                className="transition-colors duration-300"
              />

              {/* Glowing Active Trace Line if Connected */}
              {isConnectedToActive && (
                <line
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={edge.color || "#00f3ff"}
                  strokeWidth={3}
                  opacity={0.35}
                  filter="url(#nodeGlow)"
                />
              )}

              {/* Data Packet Pulse Traveling on Line */}
              <circle
                cx={px}
                cy={py}
                r={isConnectedToActive ? 3.5 : 2}
                fill={edge.color || "#00f3ff"}
                opacity={isConnectedToActive ? 0.95 : 0.6}
                filter={isConnectedToActive ? "url(#nodeGlow)" : undefined}
              />
            </g>
          );
        })}

        {/* 2. Interactive Dynamic Tether to Mouse Cursor */}
        {mousePos.active &&
          mouseTetherNodes.map(({ node, dist }) => {
            const alpha = Math.max(0, 1 - dist / 150) * 0.45;
            return (
              <g key={`tether-${node.id}`}>
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={mousePos.x}
                  y2={mousePos.y}
                  stroke="#00f3ff"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={alpha}
                />
                <circle
                  cx={mousePos.x}
                  cy={mousePos.y}
                  r={3}
                  fill="#00f3ff"
                  opacity={0.7}
                  filter="url(#nodeGlow)"
                />
              </g>
            );
          })}

        {/* 3. Ripple Waves from Clicked Pings */}
        {pingRipples.map((ripple) => (
          <circle
            key={ripple.id}
            cx={ripple.x}
            cy={ripple.y}
            r={15}
            fill="none"
            stroke={ripple.color}
            strokeWidth={2}
            className="animate-ping opacity-60"
          />
        ))}

        {/* 4. Network Topology Nodes */}
        {nodes.map((node) => {
          const isHovered = hoveredNodeId === node.id;
          const isPinned = pinnedNodeId === node.id;
          const isNeighbor = activeNeighborIds.has(node.id);
          const isHighlighted = isHovered || isPinned || isNeighbor;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onClick={() => triggerPing(node)}
              className="cursor-pointer group"
            >
              {/* Outer Halo on Hover or Alert */}
              <circle
                r={node.radius + (isHighlighted ? 12 : 5)}
                fill="none"
                stroke={node.color}
                strokeWidth={isHighlighted ? 1.5 : 0.6}
                strokeDasharray={isHighlighted ? "3 3" : "none"}
                opacity={isHighlighted ? 0.8 : 0.25}
                className={isHighlighted ? "animate-spin" : ""}
                style={{ animationDuration: "12s" }}
              />

              {/* Pulsing Core Aura */}
              <circle
                r={node.radius + 3}
                fill={node.color}
                opacity={isHighlighted ? 0.25 : 0.08}
                filter="url(#nodeGlow)"
              />

              {/* Solid Node Body */}
              <circle
                r={node.radius}
                fill="#030712"
                stroke={node.color}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                filter={isHighlighted ? "url(#nodeGlow)" : undefined}
                className="transition-all duration-200"
              />

              {/* Inner Node Center Jewel */}
              <circle
                r={node.radius * 0.4}
                fill={node.color}
                opacity={isHighlighted ? 1 : 0.75}
              />

              {/* Node Code/Label Text */}
              <text
                y={node.radius + 14}
                textAnchor="middle"
                className="font-mono text-[9px] font-bold select-none pointer-events-none fill-slate-300"
                style={{
                  fill: isHighlighted ? "#00f3ff" : "rgba(203, 213, 225, 0.7)",
                  textShadow: isHighlighted ? "0 0 6px rgba(0, 243, 255, 0.6)" : "none",
                }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Topology Node Tooltip & Telemetry Banner */}
      {activeNode && (
        <div
          className="absolute z-30 pointer-events-none rounded-xl neural-glass border border-cyan-500/50 p-3 shadow-[0_0_30px_rgba(0,243,255,0.25)] text-xs font-mono backdrop-blur-md animate-fadeIn"
          style={{
            left: Math.min(Math.max(16, activeNode.x - 110), dimensions.width - 240),
            top: Math.min(Math.max(16, activeNode.y + 25), dimensions.height - 120),
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-cyan-500/20 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: activeNode.color }} />
              <span className="font-bold text-white text-[11px]">{activeNode.label}</span>
            </div>
            <span
              className="px-1.5 py-0.2 rounded text-[9px] font-bold"
              style={{
                backgroundColor: `${activeNode.color}22`,
                color: activeNode.color,
                border: `1px solid ${activeNode.color}66`,
              }}
            >
              {activeNode.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-300">
            <div>
              <span className="text-slate-500 block text-[9px]">IP ADDRESS</span>
              <span className="font-mono text-cyan-300">{activeNode.ip}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">LATENCY</span>
              <span className="font-mono text-emerald-300">{activeNode.latency} ms</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">NODE ROLE</span>
              <span className="font-mono text-slate-200">{activeNode.role}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">LOAD CAPACITY</span>
              <span className="font-mono text-purple-300">{activeNode.load}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Topology Legend & Status Chip */}
      <div className="absolute bottom-2 right-4 z-10 hidden sm:flex items-center gap-3 px-3 py-1 rounded-lg neural-glass border border-cyan-500/20 text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-cyan-400">
          <Radio className="h-3 w-3 animate-pulse" />
          <span>Interactive Topology Grid</span>
        </span>
        <span className="text-slate-600">|</span>
        <span>Hover nodes & move cursor to tether</span>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400">10 Active Nodes</span>
      </div>
    </div>
  );
}
