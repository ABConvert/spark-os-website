/* Spark OS — UI primitives & motion helpers.
   Ported from the Paper export (atoms + helpers), trimmed to what the landing
   page actually uses, and converted to ES modules. Console-faithful: reuses the
   design tokens in styles.css; lime is the only saturated color. */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import shotOverview from "./assets/shot-overview.png";

export { shotOverview };
export { default as shotAgents } from "./assets/shot-agents.png";

/* ── Motion context — respects prefers-reduced-motion ─────────────── */
export const MotionCtx = createContext({ reduce: false });
export const useMotion = () => useContext(MotionCtx);

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = (e) => setReduce(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

/* ── useInView — flips true shortly after mount (load-triggered) ──── */
function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return [ref, inView];
}

/* ── Reveal — fade + rise on mount ────────────────────────────────── */
export function Reveal({ children, delay = 0, y = 16, style, className }) {
  const { reduce } = useMotion();
  const [ref, inView] = useInView();
  const on = reduce || inView;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : `translateY(${y}px)`,
        transition: reduce
          ? "none"
          : `opacity 0.7s var(--ease-spark) ${delay}ms, transform 0.7s var(--ease-spark) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── CountUp — animate a number when in view ──────────────────────── */
export function CountUp({ value, prefix = "", suffix = "", decimals = 0, duration = 1300 }) {
  const { reduce } = useMotion();
  const [ref, inView] = useInView();
  const [n, setN] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setN(value);
      return;
    }
    let raf, start;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setN(value * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);
  const display = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString();
  return (
    <span ref={ref} className="tnum">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ── ABConvert mark (eleven asymmetric bars) ──────────────────────── */
export function ABConvertMark({ size = 20, framed = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1000 1000" fill="none" aria-hidden="true">
      {framed && <rect width="1000" height="1000" rx="160" fill="#08090A" />}
      <path d="M473.4 840.503V743.317H541.662V840.503H473.4Z" fill="#82C621" />
      <path d="M473.4 354.099V159.494H541.662V354.099H473.4Z" fill="#D6FF8C" />
      <path d="M648.279 811.972L599.686 727.744L658.814 693.632L707.407 777.86L648.279 811.972Z" fill="#FF5F47" />
      <path d="M402.538 386.307L307.781 222.132L366.902 188.009L461.659 352.185L402.538 386.307Z" fill="#FFABD6" />
      <path d="M785.387 699.857L701.159 651.263L735.271 592.136L819.499 640.729L785.387 699.857Z" fill="#217BD1" />
      <path d="M347.02 446.728L195.571 359.376L229.676 300.244L381.125 387.596L347.02 446.728Z" fill="#5DEFFF" />
      <path d="M195.551 640.744L304.886 577.572L339.036 636.678L229.701 699.849L195.551 640.744Z" fill="#FF8690" />
      <path d="M616.927 397.554L785.383 300.252L819.526 359.362L651.069 456.664L616.927 397.554Z" fill="#FFD4EA" />
      <path d="M307.781 777.833L360.423 686.662L419.538 720.796L366.896 811.966L307.781 777.833Z" fill="#3FB4E8" />
      <path d="M550.983 356.581L648.285 188.009L707.405 222.134L610.103 390.706L550.983 356.581Z" fill="#A4F6FF" />
      <path d="M167.035 465.86H319.062V534.122H167.035V465.86Z" fill="#ACFF17" />
    </svg>
  );
}

/* ── Minimal on-brand browser frame ───────────────────────────────── */
export function BrowserFrame({ src, url = "app.spark-os.io/overview", alt = "", glow = true, style }) {
  return (
    <div style={{ position: "relative", ...style }}>
      {glow && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-1px -1px auto -1px",
            height: 120,
            background: "radial-gradient(60% 100% at 50% 0%, var(--color-lime-glow), transparent 70%)",
            opacity: 0.18,
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        ></div>
      )}
      <div
        style={{
          position: "relative",
          background: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--radius-3xl)",
          overflow: "hidden",
          boxShadow: "0 40px 120px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 16px",
            borderBottom: "1px solid var(--color-border-faint)",
            background: "var(--color-surface-canvas)",
          }}
        >
          <div style={{ display: "flex", gap: 7 }}>
            {["#2A2C2F", "#2A2C2F", "#2A2C2F"].map((c, i) => (
              <span
                key={i}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 999,
                  background: c,
                  border: "1px solid var(--color-border-subtle)",
                }}
              ></span>
            ))}
          </div>
          <div
            style={{
              flex: 1,
              maxWidth: 360,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              height: 26,
              borderRadius: 999,
              background: "var(--color-surface-raised)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-healthy)" strokeWidth="2">
              <path d="M7 11V8a5 5 0 0 1 10 0v3" />
              <rect x="5" y="11" width="14" height="9" rx="2" fill="var(--color-status-healthy)" stroke="none" opacity="0.25" />
              <rect x="5" y="11" width="14" height="9" rx="2" />
            </svg>
            <span className="text-mono" style={{ fontSize: 10.5, color: "var(--color-text-tertiary)" }}>
              {url}
            </span>
          </div>
          <div style={{ width: 44 }}></div>
        </div>
        <img src={src} alt={alt} style={{ display: "block", width: "100%", height: "auto" }} />
      </div>
    </div>
  );
}

/* ── Live fleet strip — pulsing status dots + ticking counts ──────── */
const FLEET_SEED = ["healthy", "healthy", "healthy", "stale", "healthy", "behind", "healthy", "down", "idle", "healthy"];
const FLEET_COLOR = {
  healthy: "var(--color-status-healthy)",
  stale: "var(--color-status-stale)",
  behind: "var(--color-status-behind)",
  down: "var(--color-status-down)",
  idle: "var(--color-status-idle)",
};

export function FleetStrip({ compact = false }) {
  const { reduce } = useMotion();
  const [ref, inView] = useInView();
  const healthy = FLEET_SEED.filter((s) => s === "healthy").length;
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {FLEET_SEED.map((s, i) => (
          <span
            key={i}
            className={!reduce && s === "healthy" ? "pulse-dot" : ""}
            style={{
              width: compact ? 8 : 9,
              height: compact ? 8 : 9,
              borderRadius: 999,
              background: FLEET_COLOR[s],
              opacity: inView || reduce ? 1 : 0,
              transform: inView || reduce ? "none" : "scale(0.4)",
              transition: reduce
                ? "none"
                : `opacity 0.4s var(--ease-spark) ${i * 55}ms, transform 0.4s var(--ease-spark) ${i * 55}ms`,
            }}
          ></span>
        ))}
      </div>
      <span className="text-mono" style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
        <span style={{ color: "var(--color-text-primary)" }}>
          <CountUp value={10} />
        </span>{" "}
        agents ·{" "}
        <span style={{ color: "var(--color-status-healthy)" }}>
          <CountUp value={healthy} /> healthy
        </span>
      </span>
    </div>
  );
}

/* ── Animated sparkline that draws itself in ──────────────────────── */
export function DrawSparkline({ data, width = 200, height = 56, strokeWidth = 1.75 }) {
  const { reduce } = useMotion();
  const [ref, inView] = useInView();
  const max = Math.max(...data),
    min = Math.min(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / span) * (height - 6) - 3]);
  const dPath = "M " + pts.map((p) => p.map((n) => n.toFixed(1)).join(" ")).join(" L ");
  const area = dPath + ` L ${width} ${height} L 0 ${height} Z`;
  const len = 600;
  const drawn = reduce || inView;
  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none" style={{ display: "block" }}>
      <path
        d={area}
        fill="var(--color-lime-soft)"
        style={{ opacity: drawn ? 1 : 0, transition: reduce ? "none" : "opacity 0.8s var(--ease-spark) 0.3s" }}
      />
      <path
        d={dPath}
        fill="none"
        stroke="var(--color-lime)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: len,
          strokeDashoffset: drawn ? 0 : len,
          transition: reduce ? "none" : "stroke-dashoffset 1.4s var(--ease-spark)",
        }}
      />
    </svg>
  );
}

export function HeadlineLime({ children }) {
  return <span style={{ color: "var(--color-lime)" }}>{children}</span>;
}
