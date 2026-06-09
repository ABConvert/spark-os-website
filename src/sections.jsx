/* Spark OS — landing page sections + shell.
   Ported from the Paper export; Paper "Tweaks"/edit-mode tooling removed.
   Hero layout is fixed to "split" (the design's saved default). */

import React, { useState, useEffect } from "react";
import {
  ABConvertMark,
  CountUp,
  Reveal,
  BrowserFrame,
  FleetStrip,
  DrawSparkline,
  HeadlineLime,
  useMotion,
  shotOverview,
  shotAgents,
} from "./ui.jsx";
import { WaitlistForm } from "./WaitlistForm.jsx";

// Spark OS (product) outcome metrics — not the DGX Spark hardware specs.
const SPECS = [
  { prefix: "", value: 10, suffix: "×", unit: "output", desc: "vs a human team" },
  { prefix: "$", value: 50, suffix: "k+", unit: "/mo", desc: "saved vs headcount" },
  { prefix: "", value: 24, suffix: "/7", unit: "on", desc: "always-on workforce" },
  { prefix: "", value: 1, suffix: "-click", unit: "hire", desc: "any role, in seconds" },
];

const PILLARS = [
  {
    n: "01",
    tag: "The control plane",
    title: "Hire any role in one click",
    body: "One-click setup — we handle the hardware and infra, you just run the business. Onboard a coder, a marketer, any role anytime, with integrations and predefined workflows out of the box.",
  },
  {
    n: "02",
    tag: "The intelligence layer",
    title: "Skills that earn their keep",
    body: "An expert harness of ROI-validated skills — proven playbooks, not noise. Every role shares one intelligence layer, so your whole company learns and compounds together.",
  },
  {
    n: "03",
    tag: "The scale layer",
    title: "Scale without a ceiling",
    body: "Start on one DGX Spark, burst to the cloud when you need more. From your first hire to a thousand, the workforce never hits a limit — your data, your models, no lock-in.",
  },
];

const ROLES = [
  { name: "Coder", emoji: "🧑‍💻", task: "shipping a PR", runtime: "openclaw" },
  { name: "Marketer", emoji: "📣", task: "drafting a campaign", runtime: "hermes" },
  { name: "Analyst", emoji: "📊", task: "building the weekly report", runtime: "nemoclaw" },
  { name: "Support", emoji: "🎧", task: "clearing the ticket queue", runtime: "hermes" },
  { name: "Researcher", emoji: "🔬", task: "running a deep dive", runtime: "openclaw" },
  { name: "Ops", emoji: "⚙️", task: "reconciling invoices", runtime: "nemoclaw" },
  { name: "Designer", emoji: "🎨", task: "iterating on the landing page", runtime: "hermes" },
  { name: "SDR", emoji: "📞", task: "booking demos", runtime: "openclaw" },
];
const RUNTIME_COLOR = {
  openclaw: "var(--color-runtime-openclaw)",
  nemoclaw: "var(--color-runtime-nemoclaw)",
  hermes: "var(--color-runtime-hermes)",
};
const COMPOUND_SERIES = [3, 4, 4, 6, 7, 7, 9, 11, 12, 15, 16, 20, 22, 27, 33];

/* ── Top nav (responsive: collapses to a menu on mobile) ──────────── */
function TopNav({ onCta }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const opaque = scrolled || menuOpen;
  const links = [
    { href: "#pillars", label: "How it works" },
    { href: "#proof", label: "Customer zero" },
    { href: "#cta", label: "Pricing" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: `1px solid ${opaque ? "var(--color-border-subtle)" : "transparent"}`,
        background: opaque ? "rgba(8,9,10,0.82)" : "transparent",
        backdropFilter: opaque ? "blur(12px)" : "none",
        transition: "background 0.3s var(--ease-spark), border-color 0.3s var(--ease-spark)",
      }}
    >
      <div className="lp-nav" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 10 }}>
        <ABConvertMark size={20} />
        <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: "var(--color-text-primary)" }}>Spark OS</span>
        <span className="pill" style={{ marginLeft: 4, borderColor: "var(--color-border-subtle)", background: "var(--color-surface-raised)", color: "var(--color-text-muted)", fontSize: 9 }}>
          waitlist
        </span>

        {/* Desktop nav */}
        <nav className="lp-nav-desktop" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 24 }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="lp-navlink">{l.label}</a>
          ))}
          <button className="btn btn-primary" onClick={onCta} style={{ padding: "8px 14px", whiteSpace: "nowrap" }}>
            Join the waitlist
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lp-nav-burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="lp-nav-mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="lp-nav-mobile-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <button
            className="btn btn-primary"
            style={{ width: "100%", height: 46, marginTop: 6 }}
            onClick={() => {
              setMenuOpen(false);
              onCta();
            }}
          >
            Join the waitlist
          </button>
        </div>
      )}
    </header>
  );
}

/* ── Spec strip ───────────────────────────────────────────────────── */
function SpecStrip() {
  return (
    <div className="lp-spec-strip">
      {SPECS.map((s, i) => (
        <div key={i} style={{ background: "var(--color-surface-elevated)", padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--color-text-primary)", fontFeatureSettings: '"tnum"' }}>
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </span>
            <span className="text-mono" style={{ fontSize: 13, color: "var(--color-lime)" }}>{s.unit}</span>
          </div>
          <div className="text-body-sm" style={{ marginTop: 6 }}>{s.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────── */
function Eyebrow({ children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--color-lime)" }} className="pulse-dot"></span>
      <span className="text-mono-label" style={{ color: "var(--color-text-tertiary)", fontSize: 11 }}>{children}</span>
    </div>
  );
}

function HeroCopy({ align = "start" }) {
  return (
    <>
      <Reveal><Eyebrow>The operating system for the AI-native company</Eyebrow></Reveal>
      <Reveal delay={80}>
        <h1 className="lp-h1" style={{ textAlign: align }}>
          Run your entire company from <HeadlineLime>one DGX&nbsp;Spark</HeadlineLime>.
        </h1>
      </Reveal>
      <Reveal delay={150}>
        <p className="lp-lead" style={{ textAlign: align, marginInline: align === "center" ? "auto" : 0 }}>
          An always-on workforce of AI agents that runs your business — hire any role, in one click. We handle the hardware and infra. You just run the company.
        </p>
      </Reveal>
      <Reveal delay={220} style={{ marginTop: 28 }}>
        <div id="waitlist" style={{ scrollMarginTop: 90 }}><WaitlistForm align={align} /></div>
      </Reveal>
      <Reveal delay={300} style={{ marginTop: 22 }}>
        <div style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start" }}>
          <FleetStrip />
        </div>
      </Reveal>
    </>
  );
}

function Hero() {
  return (
    <section className="lp-section" style={{ paddingTop: 56 }}>
      <div className="lp-inner">
        <div className="lp-hero-split">
          <div style={{ minWidth: 0 }}>
            <HeroCopy align="start" />
          </div>
          <Reveal delay={180} style={{ minWidth: 0 }}>
            <BrowserFrame src={shotOverview} url="app.spark-os.io/overview" alt="Spark OS operator console" />
          </Reveal>
        </div>
        <Reveal delay={260} style={{ marginTop: 40 }}>
          <SpecStrip />
        </Reveal>
      </div>
    </section>
  );
}

/* ── One-click hire illustration ──────────────────────────────────── */
function HireIllustration() {
  const { reduce } = useMotion();
  const [idx, setIdx] = useState(0);
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    if (reduce) return;
    let hireTimer;
    const cycle = setInterval(() => {
      setHiring(true);
      hireTimer = setTimeout(() => {
        setIdx((i) => (i + 1) % ROLES.length);
        setHiring(false);
      }, 520);
    }, 2800);
    return () => {
      clearInterval(cycle);
      clearTimeout(hireTimer);
    };
  }, [reduce]);

  const role = ROLES[idx];
  const rc = RUNTIME_COLOR[role.runtime];

  return (
    <div className="hire-illu">
      <div className="text-mono-label" style={{ marginBottom: 10 }}>Pick a role</div>
      <div className="hire-roles">
        {ROLES.map((r, i) => {
          const active = i === idx;
          return (
            <button
              key={r.name}
              type="button"
              className="hire-chip"
              aria-pressed={active}
              onClick={() => !reduce && setIdx(i)}
              style={{
                borderColor: active ? "var(--color-lime-stroke)" : "var(--color-border-subtle)",
                background: active ? "var(--color-lime-soft)" : "var(--color-surface-raised)",
                color: active ? "var(--color-lime)" : "var(--color-text-secondary)",
                fontWeight: active ? 600 : 500,
              }}
            >
              <span style={{ fontSize: 13 }}>{r.emoji}</span>
              {r.name}
            </button>
          );
        })}
      </div>

      <button type="button" className="hire-cta" tabIndex={-1} aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 4 14h7l-2 8 9-12h-7z" fill="currentColor" stroke="none" />
        </svg>
        {hiring ? "Hiring…" : `Hire ${role.name} — one click`}
      </button>

      <div className="hire-agent" key={idx} data-hiring={hiring ? "1" : "0"}>
        <div className="hire-agent-avatar" style={{ borderColor: `color-mix(in oklab, ${rc} 35%, transparent)` }}>
          <span style={{ fontSize: 20 }}>{role.emoji}</span>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-text-primary)" }}>{role.name} agent</span>
            <span className="pill" style={{ borderColor: `color-mix(in oklab, ${rc} 30%, transparent)`, background: `color-mix(in oklab, ${rc} 12%, transparent)`, color: rc, fontSize: 9 }}>
              {role.runtime}
            </span>
            <span className="pill" style={{ borderColor: "var(--color-status-healthy-stroke)", background: "var(--color-status-healthy-soft)", color: "var(--color-status-healthy)", fontSize: 9 }}>
              <span className="dot pulse-dot" style={{ background: "var(--color-status-healthy)" }}></span>
              healthy
            </span>
          </div>
          <div className="text-body-sm" style={{ marginTop: 4 }}>
            Provisioned in 1 click · {role.task}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Pillars ──────────────────────────────────────────────────────── */
function PillarCard({ p, children, big = false }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: big ? 32 : 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span className="text-mono" style={{ fontSize: 12, color: "var(--color-lime)" }}>{p.n}</span>
        <span className="text-mono-label" style={{ color: "var(--color-text-muted)" }}>{p.tag}</span>
      </div>
      <h3 className={big ? "lp-h3-big" : "text-h3"} style={{ marginBottom: 10 }}>{p.title}</h3>
      <p className="text-body" style={{ margin: 0, maxWidth: 520 }}>{p.body}</p>
      {children && <div style={{ marginTop: "auto", paddingTop: 24 }}>{children}</div>}
    </div>
  );
}

function Pillars() {
  return (
    <section className="lp-section" id="pillars" style={{ scrollMarginTop: 80 }}>
      <div className="lp-inner">
        <Reveal>
          <div style={{ marginBottom: 40, maxWidth: 640 }}>
            <span className="text-mono-label" style={{ color: "var(--color-text-tertiary)" }}>How it works</span>
            <h2 className="lp-h2" style={{ marginTop: 12 }}>Easy to run. Gets smarter. Scales without limits.</h2>
          </div>
        </Reveal>
        <div className="lp-pillar-grid">
          <Reveal style={{ gridArea: "big" }}>
            <PillarCard p={PILLARS[0]} big>
              <HireIllustration />
            </PillarCard>
          </Reveal>
          <Reveal delay={120} style={{ gridArea: "t" }}>
            <PillarCard p={PILLARS[1]}>
              <div>
                <div className="text-mono-label" style={{ marginBottom: 6 }}>Compounding output · 30d</div>
                <DrawSparkline data={COMPOUND_SERIES} height={48} />
              </div>
            </PillarCard>
          </Reveal>
          <Reveal delay={200} style={{ gridArea: "b" }}>
            <PillarCard p={PILLARS[2]}>
              <FleetStrip compact />
            </PillarCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Compound band ────────────────────────────────────────────────── */
function CompoundBand() {
  return (
    <section className="lp-section" style={{ paddingBlock: 40 }}>
      <div className="lp-inner">
        <Reveal>
          <div style={{ borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)", padding: "56px 0", textAlign: "center" }}>
            <p className="lp-statement">
              Your company doesn't just run overnight.<br />
              It <HeadlineLime>compounds</HeadlineLime> overnight.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Proof — customer zero ────────────────────────────────────────── */
function Proof() {
  return (
    <section className="lp-section" id="proof" style={{ scrollMarginTop: 80 }}>
      <div className="lp-inner">
        <div className="lp-proof-grid">
          <div>
            <Reveal><span className="text-mono-label" style={{ color: "var(--color-lime)" }}>We run on it ourselves</span></Reveal>
            <Reveal delay={80}>
              <h2 className="lp-h2" style={{ marginTop: 14, marginBottom: 18 }}>Customer zero is us.</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-body" style={{ fontSize: 16, lineHeight: 1.7, maxWidth: 480, marginTop: 0 }}>
                We don't just sell it — we run our own company on it. ABConvert, our experimentation platform for Shopify stores, operates on Spark OS today. We're productizing exactly what we built to run ourselves.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <ABConvertMark size={28} framed />
                <div>
                  <div style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>ABConvert</div>
                  <div className="text-body-sm">the team behind it</div>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <BrowserFrame src={shotAgents} url="app.spark-os.io/agent" alt="Spark OS agent registry" glow={false} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ────────────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section className="lp-section" id="cta" style={{ scrollMarginTop: 80, paddingBottom: 40 }}>
      <div className="lp-inner">
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-3xl)",
            border: "1px solid var(--color-border-subtle)",
            background: "linear-gradient(180deg, rgba(172,255,23,0.04), transparent 60%), var(--color-surface-elevated)",
            padding: "72px 40px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -80,
              left: "50%",
              transform: "translateX(-50%)",
              width: 480,
              height: 200,
              background: "radial-gradient(50% 100% at 50% 0%, var(--color-lime-glow), transparent 70%)",
              opacity: 0.2,
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          ></div>
          <Reveal>
            <h2 className="lp-h1" style={{ fontSize: "clamp(34px, 5vw, 56px)", maxWidth: 760, margin: "0 auto" }}>
              Replace a whole company for <HeadlineLime>$1,000/month</HeadlineLime>.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lp-lead" style={{ textAlign: "center", margin: "18px auto 0" }}>Starting today.</p>
          </Reveal>
          <Reveal delay={180} style={{ marginTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "center" }}><WaitlistForm align="center" /></div>
          </Reveal>
          <Reveal delay={240}>
            <p className="text-body-sm" style={{ marginTop: 16 }}>Early access for SaaS &amp; ecommerce teams.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--color-border-subtle)", marginTop: 40 }}>
      <div className="lp-footer" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <ABConvertMark size={18} />
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Spark OS</span>
        <span className="text-body-sm" style={{ marginLeft: 4 }}>One box. Unlimited employees.</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href="#pillars" className="lp-navlink">How it works</a>
          <a href="#proof" className="lp-navlink">Customer zero</a>
          <a href="#cta" className="lp-navlink">Waitlist</a>
        </div>
        <span className="text-mono" style={{ width: "100%", color: "var(--color-text-muted)", fontSize: 10.5, marginTop: 4 }}>
          © 2026 ABConvert · built on NVIDIA DGX Spark
        </span>
      </div>
    </footer>
  );
}

export { TopNav, Hero, Pillars, CompoundBand, Proof, FinalCta, Footer };
