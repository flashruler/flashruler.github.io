import { useRef } from "react";
import { particleConfig } from "@/config/particleConfig";
import { useIsDark } from "@/hooks/useIsDark";
import { useParticleAnimation } from "@/hooks/useParticleAnimation";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();
  useParticleAnimation(canvasRef, particleConfig, isDark);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
