import { useEffect, useRef, RefObject } from "react";
import { ParticleConfig, ParticleThemeColors } from "@/config/particleConfig";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function initParticles(w: number, h: number, config: ParticleConfig): Particle[] {
  const count =
    config.count ?? Math.floor(((w * h) / 10000) * config.densityFactor);
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = rand(config.speedMin, config.speedMax);
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: rand(config.sizeMin, config.sizeMax),
      opacity: rand(0.4, 1) * config.particleOpacity,
    });
  }
  return particles;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  config: ParticleConfig,
  colors: ParticleThemeColors,
  mouseX: number,
  mouseY: number,
  w: number,
  h: number
) {
  ctx.clearRect(0, 0, w, h);

  // Update positions and apply mouse repel
  for (const p of particles) {
    if (config.mouseRepel && mouseX >= 0 && mouseY >= 0) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < config.mouseRepelRadius && dist > 0) {
        const force =
          (1 - dist / config.mouseRepelRadius) * config.mouseRepelStrength;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        // Clamp velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > config.speedMax) {
          p.vx = (p.vx / speed) * config.speedMax;
          p.vy = (p.vy / speed) * config.speedMax;
        }
      }
    }

    p.x += p.vx;
    p.y += p.vy;

    // Edge wrap
    if (p.x < -p.radius) p.x = w + p.radius;
    if (p.x > w + p.radius) p.x = -p.radius;
    if (p.y < -p.radius) p.y = h + p.radius;
    if (p.y > h + p.radius) p.y = -p.radius;
  }

  // Draw connection lines
  if (config.connectLines) {
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.connectionDistance) {
          const alpha =
            (1 - dist / config.connectionDistance) * config.lineOpacityFactor;
          ctx.strokeStyle = `rgba(${colors.lineColor}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Draw particles
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${colors.particleColor}, ${p.opacity})`;
    ctx.fill();
  }
}

export function useParticleAnimation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  config: ParticleConfig,
  isDark: boolean
) {
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = isDark ? config.dark : config.light;
    let particles: Particle[] = [];
    let rafId = 0;
    let lastFrameTime = 0;
    const frameDuration = 1000 / config.maxFps;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = initParticles(canvas.width, canvas.height, config);
    }

    function loop(timestamp: number) {
      if (!canvas || !ctx) return;
      if (timestamp - lastFrameTime < frameDuration) {
        rafId = requestAnimationFrame(loop);
        return;
      }
      lastFrameTime = timestamp;
      drawFrame(
        ctx,
        particles,
        config,
        colors,
        mouseRef.current.x,
        mouseRef.current.y,
        canvas.width,
        canvas.height
      );
      rafId = requestAnimationFrame(loop);
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        lastFrameTime = 0;
        rafId = requestAnimationFrame(loop);
      }
    }

    function handleMouse(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    resize();
    rafId = requestAnimationFrame(loop);

    if (config.pauseOnHidden) {
      document.addEventListener("visibilitychange", handleVisibility);
    }
    window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [canvasRef, config, isDark]);
}
