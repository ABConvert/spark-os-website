/* Spark OS — motion helpers shared by the landing sections and modal. */

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

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
