"use client";

import { Montserrat } from "next/font/google";
import { useEffect, useRef } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600"],
});

const WORD = "CONVERENT";
const TAG = "clarity in systems and software";

type Swell = {
  y: number;
  amp: number;
  freq: number;
  speed: number;
  alpha: number;
  band: number;
};

type Column = {
  x: number;
  y: number;
  speed: number;
  fontSize: number;
  spacing: number;
  trail: number;
  chars: string[];
  tone: number;
  flip: number;
};

type Spark = {
  x: number;
  y: number;
  vy: number;
  vx: number;
  char: string;
  life: number;
  size: number;
};

type Layout = {
  wordSize: number;
  tagSize: number;
  gap: number;
  widths: number[];
  wordWidth: number;
  waveW: number;
  waveAmp: number;
  wordY: number;
  waveY: number;
  tagY: number;
};

const swells: Swell[] = [
  { y: 0.66, amp: 0.042, freq: 0.85, speed: 0.055, alpha: 1, band: 16 },
  { y: 0.86, amp: 0.034, freq: 1.2, speed: -0.04, alpha: 0.82, band: 14 },
];

function clamp(v: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export default function HomeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<HTMLCanvasElement>(null);
  const replayRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const stage = canvasRef.current;
    const waveStage = waveRef.current;
    if (!stage || !waveStage) return;
    const canvas: HTMLCanvasElement = stage;
    const waveCanvas: HTMLCanvasElement = waveStage;
    const ctx = canvas.getContext("2d", { alpha: true });
    const waveCtx = waveCanvas.getContext("2d", { alpha: true });
    if (!ctx || !waveCtx) return;

    const family = montserrat.style.fontFamily;
    const compact = window.matchMedia("(max-width: 800px)").matches;
    let cancelled = false;
    let raf = 0;
    let dpr = 1;
    let w = 0;
    let h = 0;
    let ww = 0;
    let wh = 0;
    let columns: Column[] = [];
    let sparks: Spark[] = [];
    let origin = 0;
    let waveStart: number | null = null;
    let wordStart: number | null = null;
    let tagStart: number | null = null;
    let prevTime = 0;

    function logoPhase(t: number) {
      return Math.PI / 2 + ((t - 0.188) / 0.417) * Math.PI * 2;
    }

    function logoEnv(t: number) {
      if (t < 0.68) return 1;
      if (t >= 0.92) return 0;
      return Math.cos(clamp((t - 0.68) / 0.24) * Math.PI / 2);
    }

    function logoSample(t: number, which: number) {
      let y = which * Math.sin(logoPhase(t)) * logoEnv(t);
      if (which === 1 && t < 0.12) {
        const k = smoothstep(0.04, 0.12, t);
        y = 0.04 * (1 - k) + y * k;
      }
      return y;
    }

    function layout(): Layout {
      const wordSize = clamp(Math.min(w, h) * 0.05, 28, 72);
      const tagSize = wordSize * 0.36;
      const gap = wordSize * 0.22;
      ctx!.font = `600 ${wordSize}px ${family}`;
      const widths = WORD.split("").map((ch) => ctx!.measureText(ch).width);
      const wordWidth = widths.reduce((s, n) => s + n, 0) + gap * (WORD.length - 1);
      const waveW = wordWidth * 0.86;
      const waveAmp = waveW * 0.255;
      const wordY = h * 0.45;
      const waveY = wordY - waveAmp - wordSize * 1.28;
      const tagY = wordY + wordSize * 0.92;
      return { wordSize, tagSize, gap, widths, wordWidth, waveW, waveAmp, wordY, waveY, tagY };
    }

    function buildColumns(resetY: boolean) {
      const fontSize = clamp(w / 70, 16, 22);
      const colW = fontSize * 1.28;
      const streamW = clamp(w * 0.26, 280, 460);
      const count = Math.max(14, Math.floor(streamW / colW));
      const left = w * 0.5 - (count * colW) * 0.5;
      const next: Column[] = [];
      for (let i = 0; i < count; i++) {
        const prev = columns[i];
        const trail = Math.max(18, Math.round(h / (fontSize * 0.88)));
        const spacing = h / trail;
        const chars: string[] = [];
        for (let k = 0; k < trail; k++) chars.push(Math.random() < 0.5 ? "0" : "1");
        const u = (i + 0.5) / count - 0.5;
        const bell = Math.exp(-u * u * 7);
        next.push({
          x: left + i * colW + colW * 0.5,
          y: resetY || !prev ? Math.random() * h : prev.y,
          speed: 78 + Math.random() * 56,
          fontSize,
          spacing,
          trail,
          chars,
          tone: 0.22 + bell * 0.78,
          flip: Math.random() * 0.035,
        });
      }
      columns = next;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, compact ? 1 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const layer = waveCanvas.parentElement;
      if (layer) {
        layer.style.top = "0px";
        layer.style.height = `${window.innerHeight}px`;
        layer.style.bottom = "auto";
      }
      const waveRect = waveCanvas.getBoundingClientRect();
      ww = Math.max(1, waveRect.width);
      wh = Math.max(1, waveRect.height);
      const waveDpr = Math.min(window.devicePixelRatio || 1, compact ? 1 : 2);
      waveCanvas.width = Math.round(ww * waveDpr);
      waveCanvas.height = Math.round(wh * waveDpr);
      waveCtx!.setTransform(waveDpr, 0, 0, waveDpr, 0, 0);
      buildColumns(false);
    }

    function wavePoint(t: number, L: Layout) {
      return {
        x: w * 0.5 - L.waveW * 0.5 + t * L.waveW,
        y: L.waveY - logoSample(t, 1) * L.waveAmp,
      };
    }

    function traceLogo(L: Layout, progress: number, which: number) {
      const t0 = which === 1 ? 0 : 0.15;
      const t1 = which === 1 ? clamp(progress) : Math.min(clamp(progress), 0.92);
      if (t1 <= t0) return false;
      const count = Math.max(2, Math.ceil(200 * (t1 - t0)));
      ctx!.beginPath();
      for (let i = 0; i <= count; i++) {
        const t = t0 + (t1 - t0) * (i / count);
        const x = w * 0.5 - L.waveW * 0.5 + t * L.waveW;
        const y = L.waveY - logoSample(t, which) * L.waveAmp;
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      return true;
    }

    function streamFront(now: number) {
      const t = Math.max(0, (now - origin) / 1000);
      return -30 + Math.min(1, t / 3.6) * (h + 60);
    }

    function update(dt: number, now: number) {
      const L = layout();
      for (const c of columns) {
        c.y += c.speed * dt;
        if (Math.random() < c.flip) {
          const i = Math.floor(Math.random() * c.chars.length);
          c.chars[i] = c.chars[i] === "0" ? "1" : "0";
        }
        if (c.y > h) c.y -= h;
      }
      const front = streamFront(now);
      if (waveStart == null && front > L.waveY - L.waveAmp) waveStart = now;
      if (wordStart == null && waveStart != null && now - waveStart > 700) wordStart = now;
      if (tagStart == null && wordStart != null && now - wordStart > 980) tagStart = now;

      const waveP = waveStart ? clamp((now - waveStart) / 2100) : 0;
      if (waveP > 0.02 && waveP < 0.94 && Math.random() < 0.45) {
        const head = wavePoint(clamp(waveP), L);
        sparks.push({
          x: head.x + (Math.random() - 0.5) * 8,
          y: head.y + 4,
          vy: 90 + Math.random() * 150,
          vx: (Math.random() - 0.5) * 18,
          char: Math.random() < 0.5 ? "0" : "1",
          life: 0.55,
          size: 11 + Math.random() * 4,
        });
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.y += s.vy * dt;
        s.x += s.vx * dt;
        s.life -= dt * 1.6;
        if (s.life <= 0) sparks.splice(i, 1);
      }
    }

    function drawBackground(time: number) {
      ctx!.clearRect(0, 0, w, h);
      const g = ctx!.createRadialGradient(w * 0.5, h * 0.42, h * 0.05, w * 0.5, h * 0.48, Math.max(w, h) * 0.72);
      g.addColorStop(0, "#0a1c38");
      g.addColorStop(0.42, "#06101f");
      g.addColorStop(1, "#02060e");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);

      const glow = ctx!.createRadialGradient(w * 0.5, h * 1.02, 0, w * 0.5, h * 0.92, h * 0.55);
      glow.addColorStop(0, "rgba(18, 78, 170, 0.28)");
      glow.addColorStop(1, "rgba(2, 6, 14, 0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, w, h);

      ctx!.save();
      ctx!.strokeStyle = "rgba(90, 150, 210, 0.07)";
      ctx!.lineWidth = 1;
      const ax = w * 0.78;
      const ay = h * 0.08;
      for (let i = 0; i < 7; i++) {
        ctx!.beginPath();
        ctx!.arc(ax, ay, 120 + i * 54, 0.35 + Math.sin(time * 0.05 + i) * 0.02, 1.35);
        ctx!.stroke();
      }
      ctx!.restore();

      ctx!.save();
      ctx!.globalCompositeOperation = "destination-out";
      const veil = ctx!.createLinearGradient(0, h * 0.5, 0, h * 0.74);
      veil.addColorStop(0, "rgba(0, 0, 0, 0)");
      veil.addColorStop(1, "rgba(0, 0, 0, 1)");
      ctx!.fillStyle = veil;
      ctx!.fillRect(0, h * 0.5, w, h);
      ctx!.restore();
    }

    function swellY(swell: Swell, x: number, time: number, width: number, height: number) {
      const u = x / Math.max(width, 1);
      const phase = time * swell.speed;
      const a = Math.sin(u * swell.freq * Math.PI * 2 + phase);
      const b = Math.sin(u * swell.freq * 2.2 * Math.PI * 2 - phase * 0.7 + 1.4);
      return height * swell.y + (a * 0.8 + b * 0.2) * height * swell.amp;
    }

    function drawWaves(time: number, light = false) {
      waveCtx!.clearRect(0, 0, ww, wh);
      waveCtx!.save();
      waveCtx!.globalCompositeOperation = "lighter";
      const step = light ? 5 : 2;
      for (const swell of swells) {
        for (let r = 0; r < swell.band; r += light ? 2 : 1) {
          const along = 1 - r / swell.band;
          const spread = (r - swell.band * 0.12) * (wh * 0.0042);
          const bright = r < 2;
          const alpha = swell.alpha * along * along * (bright ? 0.95 : 0.62);
          waveCtx!.fillStyle = bright
            ? `rgba(176, 224, 255, ${alpha})`
            : `rgba(64, 156, 230, ${alpha})`;
          for (let x = 0; x <= ww; x += step) {
            const y = swellY(swell, x, time, ww, wh) + spread;
            const fade = smoothstep(wh * 0.52, wh * 0.62, y);
            if (fade < 0.04) continue;
            const grain = 0.72 + 0.28 * Math.sin(x * 0.31 + r * 1.6);
            waveCtx!.globalAlpha = fade * grain;
            waveCtx!.fillRect(x, y, bright ? 1.7 : 1.45, bright ? 1.7 : 1.45);
          }
        }
        waveCtx!.globalAlpha = 1;
        waveCtx!.beginPath();
        for (let x = 0; x <= ww; x += 3) {
          const y = swellY(swell, x, time, ww, wh);
          if (x === 0) waveCtx!.moveTo(x, y);
          else waveCtx!.lineTo(x, y);
        }
        waveCtx!.lineWidth = 1.4;
        waveCtx!.strokeStyle = `rgba(186, 228, 255, ${0.18 + swell.alpha * 0.28})`;
        if (!light) {
          waveCtx!.shadowColor = "rgba(70, 170, 255, 0.9)";
          waveCtx!.shadowBlur = 18;
        }
        waveCtx!.stroke();
        waveCtx!.shadowBlur = 0;
      }
      waveCtx!.restore();
    }

    function rainDim(x: number, y: number, L: Layout, presence: number) {
      if (presence <= 0.001) return 1;
      const padX = L.wordWidth * 0.16;
      const left = w * 0.5 - L.wordWidth * 0.5 - padX;
      const right = w * 0.5 + L.wordWidth * 0.5 + padX;
      const top = L.waveY - L.waveAmp - L.wordSize * 0.12;
      const bottom = L.tagY + L.tagSize * 0.85;
      const dx = Math.max(left - x, 0, x - right);
      const dy = Math.max(top - y, 0, y - bottom);
      const dist = Math.hypot(dx, dy);
      const inside = 1 - smoothstep(0, L.wordSize * 1.45, dist);
      return 1 - presence * inside * 0.98;
    }

    function drawRain(L: Layout, presence: number, now: number) {
      const front = streamFront(now);
      ctx!.save();
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      const half = Math.max(40, columns.length ? (columns[columns.length - 1].x - columns[0].x) * 0.5 : 40);
      for (const c of columns) {
        const head = ((c.y % h) + h) % h;
        for (let i = 0; i < c.trail; i++) {
          let y = head - i * c.spacing;
          y = ((y % h) + h) % h;
          if (y > front + 8) continue;
          const dy = Math.min(Math.abs(y - head), h - Math.abs(y - head));
          const lead = dy < c.spacing * 0.65;
          const across = Math.abs(c.x - w * 0.5) / half;
          let alpha = (lead ? 0.98 : 0.62) * c.tone * (1 - smoothstep(0.2, 1, across));
          const edge = front - y;
          if (edge < 90) alpha *= smoothstep(0, 90, edge);
          if (y > h * 0.6) alpha *= clamp(1 - (y - h * 0.6) / (h * 0.18));
          alpha *= rainDim(c.x, y, L, presence);
          if (alpha < 0.02) continue;
          ctx!.font = `500 ${c.fontSize}px Consolas, "Cascadia Mono", ui-monospace, monospace`;
          ctx!.fillStyle = lead
            ? `rgba(236, 247, 255, ${alpha})`
            : `rgba(126, 198, 245, ${alpha})`;
          ctx!.fillText(c.chars[i], c.x, y);
        }
      }
      ctx!.restore();
    }

    function drawSparks() {
      ctx!.save();
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      for (const s of sparks) {
        ctx!.font = `500 ${s.size}px Consolas, ui-monospace, monospace`;
        ctx!.fillStyle = `rgba(186, 224, 255, ${s.life * 0.85})`;
        ctx!.fillText(s.char, s.x, s.y);
      }
      ctx!.restore();
    }

    function drawMark(now: number, L: Layout) {
      const waveP = waveStart ? clamp((now - waveStart) / 2100) : 0;
      const eased = 1 - Math.pow(1 - waveP, 3);
      if (eased > 0.01) {
        ctx!.save();
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        const lw = Math.max(2.4, L.waveW * 0.028);
        const strokeBoth = () => {
          traceLogo(L, eased, 1);
          ctx!.stroke();
          if (traceLogo(L, eased, -1)) ctx!.stroke();
        };
        ctx!.shadowColor = "rgba(0, 176, 255, 0.9)";
        ctx!.shadowBlur = 20;
        ctx!.strokeStyle = "rgba(56, 186, 255, 0.5)";
        ctx!.lineWidth = lw + 6;
        strokeBoth();
        ctx!.shadowBlur = 8;
        ctx!.strokeStyle = "#4ec8ff";
        ctx!.lineWidth = lw + 1;
        strokeBoth();
        ctx!.shadowBlur = 0;
        ctx!.strokeStyle = "#7ad7ff";
        ctx!.lineWidth = Math.max(1.2, lw * 0.45);
        strokeBoth();
        ctx!.restore();
      }

      if (wordStart != null) {
        const elapsed = (now - wordStart) / 1000;
        ctx!.save();
        ctx!.textBaseline = "middle";
        ctx!.textAlign = "left";
        ctx!.font = `600 ${L.wordSize}px ${family}`;
        let x = w * 0.5 - L.wordWidth * 0.5;
        const letters = WORD.split("");
        for (let i = 0; i < letters.length; i++) {
          const local = clamp((elapsed - i * 0.075) / 0.42);
          if (local > 0) {
            const flicker = local < 0.72 && Math.random() > local;
            const ch = flicker ? (Math.random() < 0.5 ? "0" : "1") : letters[i];
            ctx!.globalAlpha = clamp(local * 1.35);
            ctx!.fillStyle = flicker ? "rgba(170, 214, 255, 0.95)" : "#f4f8fc";
            ctx!.fillText(ch, x, L.wordY);
          }
          x += L.widths[i] + L.gap;
        }
        ctx!.restore();
      }

      if (tagStart != null) {
        const p = clamp((now - tagStart) / 1100);
        ctx!.save();
        ctx!.globalAlpha = smoothstep(0, 1, p);
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.font = `small-caps 500 ${L.tagSize}px ${family}`;
        ctx!.fillStyle = "#d5deea";
        ctx!.letterSpacing = `${L.tagSize * 0.14}px`;
        const showFlicker = p < 0.45 && Math.random() > p + 0.25;
        ctx!.fillText(
          showFlicker ? TAG.replace(/[A-Za-z]/g, () => (Math.random() < 0.5 ? "0" : "1")) : TAG,
          w * 0.5,
          L.tagY,
        );
        ctx!.restore();
      }
    }

    function presenceNow(now: number) {
      const waveP = waveStart ? clamp((now - waveStart) / 2100) : 0;
      const wordP = wordStart ? clamp((now - wordStart) / 1400) : 0;
      return Math.max(waveP * 0.35, wordP);
    }

    function frame(now: number) {
      const time = (now - origin) / 1000;
      if (compact) {
        drawWaves(time, true);
        return;
      }
      const L = layout();
      drawBackground(time);
      drawWaves(time);
      drawRain(L, presenceNow(now), now);
      drawSparks();
      drawMark(now, L);
    }

    let revealed = false;

    function revealContent() {
      if (revealed || cancelled) return;
      revealed = true;
      document.body.classList.add("homeHeroSettled");
    }

    function concealContent() {
      revealed = false;
      document.body.classList.remove("homeHeroSettled");
    }

    function loop(now: number) {
      if (cancelled) return;
      const dt = Math.min(0.033, Math.max(0, (now - (prevTime || now)) / 1000));
      prevTime = now;
      try {
        if (!compact) update(dt, now);
        const tagShown = tagStart != null && now - tagStart > 1100 + 1800;
        const failSafe = origin > 0 && now - origin > 9000;
        if (compact || tagShown || failSafe) revealContent();
        frame(now);
      } catch {
        revealContent();
      }
      raf = requestAnimationFrame(loop);
    }

    function reset() {
      waveStart = null;
      wordStart = null;
      tagStart = null;
      sparks = [];
      buildColumns(true);
      origin = performance.now();
      prevTime = 0;
    }

    replayRef.current = () => {
      if (compact) return;
      concealContent();
      reset();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || compact) revealContent();
    else document.body.classList.add("homeHeroPlaying");

    function boot() {
      if (cancelled) return;
      resize();
      origin = performance.now();
      if (reduced) {
        origin = performance.now() - 8000;
        let fake = origin;
        const dt = 1 / 60;
        for (let t = 0; t < 8; t += dt) {
          fake += dt * 1000;
          update(dt, fake);
        }
      }
      prevTime = performance.now();
      raf = requestAnimationFrame(loop);
    }

    const observer = new ResizeObserver(() => {
      if (!cancelled && w > 0) resize();
    });
    observer.observe(canvas);
    observer.observe(waveCanvas);

    const ready = document.fonts?.load
      ? document.fonts.load(`600 64px ${family}`)
      : Promise.resolve();
    Promise.race([
      ready,
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]).then(boot);

    const failTimer = window.setTimeout(revealContent, 9000);

    return () => {
      cancelled = true;
      replayRef.current = null;
      cancelAnimationFrame(raf);
      window.clearTimeout(failTimer);
      observer.disconnect();
      document.body.classList.remove("homeHeroSettled");
      document.body.classList.remove("homeHeroPlaying");
    };
  }, []);

  return (
    <>
      <div className="homeWaves" aria-hidden="true">
        <canvas ref={waveRef} />
      </div>
      <section className="homeHero" aria-label="Converent" onClick={() => replayRef.current?.()}>
        <h1 className="homeHeroTitle">Converent</h1>
        <p className="homeHeroTag">Clarity in systems and software</p>
        <canvas ref={canvasRef} className={montserrat.className} aria-hidden="true" />
      </section>
    </>
  );
}
