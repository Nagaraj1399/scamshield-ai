import React, { useEffect, useRef } from "react";

interface MatrixCodeRainProps {
  opacity?: number;
  colorScheme?: "cyan-green" | "emerald" | "cyan";
  className?: string;
}

export function MatrixCodeRain({
  opacity = 0.25,
  colorScheme = "cyan-green",
  className = "",
}: MatrixCodeRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const characters =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}/*+=~$_#@!";
    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50;
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = "rgba(2, 4, 10, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of stream has bright glowing cyan/white, tail has emerald/cyan fade
        if (Math.random() > 0.9) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#00f3ff";
          ctx.shadowBlur = 8;
        } else if (colorScheme === "cyan-green") {
          ctx.fillStyle = i % 2 === 0 ? "#00f3ff" : "#00ff88";
          ctx.shadowColor = "#00f3ff";
          ctx.shadowBlur = 4;
        } else if (colorScheme === "emerald") {
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = "#00f3ff";
          ctx.shadowColor = "#00f3ff";
          ctx.shadowBlur = 4;
        }

        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [colorScheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
    />
  );
}
