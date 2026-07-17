/* Spark OS landing sections — implemented from the Claude Design project
   "Spark OS Landing.dc.html". Product-console content (fleet, workload,
   squads, versions, brain) is illustrative sample data ported from the
   design's script block. */

import React from "react";
import { Reveal } from "./ui.jsx";
import { useWaitlist } from "./WaitlistModal.jsx";

/* ── Sample data (ported from the design) ─────────────────────────── */

const STATUS_STYLES = {
  Healthy: { dot: "var(--color-status-healthy)", bg: "var(--color-status-healthy-soft)", stroke: "var(--color-status-healthy-stroke)" },
  Idle: { dot: "var(--color-status-idle)", bg: "var(--color-status-idle-soft)", stroke: "var(--color-status-idle-stroke)" },
  Stale: { dot: "var(--color-status-stale)", bg: "var(--color-status-stale-soft)", stroke: "var(--color-status-stale-stroke)" },
};

const AGENTS = [
  { emoji: "🦉", name: "Jimmy", id: "AGT-7F2K", status: "Healthy", spend: "$312.40", budget: "$500", pct: 62, skills: ["pr-review", "github", "sentry"] },
  { emoji: "🦭", name: "Bruce", id: "AGT-3M9X", status: "Healthy", spend: "$188.05", budget: "$400", pct: 47, skills: ["issue-triage", "linear"] },
  { emoji: "🐙", name: "Nadia", id: "AGT-5Q1R", status: "Stale", spend: "$451.90", budget: "$500", pct: 90, skills: ["price-tests", "shopify"] },
  { emoji: "🦔", name: "Osei", id: "AGT-8B4T", status: "Idle", spend: "$64.12", budget: "$300", pct: 21, skills: ["content", "theme-tests"] },
];

const ACTIVITIES = [
  { agent: "Jimmy", task: "pr review", ref: "store/checkout fix/shipping-threshold", time: "7/16/2026, 6:03:23 PM", dur: "155s" },
  { agent: "Jimmy", task: "issue investigation", ref: "", time: "7/16/2026, 6:00:47 PM", dur: "382s" },
  { agent: "Bruce", task: "pr review", ref: "", time: "7/16/2026, 11:01:18 AM", dur: "48s" },
];

const VERSIONS = [
  { num: "v14", desc: "Tightened PR review gate — two approvals on pricing changes", time: "2d ago · by you", tag: "CURRENT", current: true },
  { num: "v13", desc: "Added sentry skill to Jimmy; raised squad budget to $500/wk", time: "9d ago · by you", tag: "" },
  { num: "v12", desc: "Cloned from checkout-squad — adapted roles for storefront", time: "16d ago · by Bruce", tag: "CLONE" },
];

const INTEGRATION_GROUPS = [
  { label: "Models", count: "6 / 9 connected", items: ["Anthropic", "OpenAI", "OpenAI Codex", "Claude (Pro/Max)", "Google (Gemini)", "DeepSeek", "Ollama", "OpenRouter", "xAI (Grok)"] },
  { label: "Channels", count: "1 / 7 connected", items: ["Slack", "Discord", "Telegram", "WhatsApp", "LINE", "WeChat 微信", "Feishu 飛書"] },
  { label: "Marketing & commerce", count: "6 available", items: ["Shopify", "Stripe", "Klaviyo", "Google Ads", "Google Analytics", "Meta Ads"] },
  { label: "Tools", count: "22 / 23 connected", items: ["GitHub", "Linear", "Notion", "Figma", "Sentry", "PostHog", "Intercom", "MongoDB", "Deepgram", "ElevenLabs", "Shopify Partner", "SMTP", "+ 11 more"] },
];

const failColor = (n) => (n === "0" ? "var(--color-text-muted)" : "var(--color-status-stale)");

const WORKLOAD_TYPES = [
  ["PR review", "751", "717", "3"],
  ["Issue investigation", "407", "393", "4"],
  ["General task", "305", "305", "0"],
  ["Feature dev", "145", "132", "4"],
  ["Test automation", "132", "130", "1"],
  ["Bug fix", "66", "57", "5"],
].map(([name, started, done, failed]) => ({ name, started, done, failed }));

const WORKLOAD_AGENTS = [
  ["🦭", "Bruce", "655", "622", "4"],
  ["🛰️", "Sparkops", "330", "328", "0"],
  ["🐙", "Ditto", "322", "295", "9"],
  ["🦋", "Rita", "184", "184", "0"],
  ["🦉", "Jimmy", "119", "116", "1"],
  ["🐢", "Neo", "83", "80", "1"],
].map(([emoji, name, started, done, failed]) => ({ emoji, name, started, done, failed }));

const AUTONOMY = [
  { rank: "1", emoji: "🌸", name: "sunsun", aix: "100%", steps: "93", interventions: "0" },
  { rank: "2", emoji: "🐢", name: "Neo", aix: "99%", steps: "2,571", interventions: "28" },
  { rank: "3", emoji: "🦉", name: "Jimmy", aix: "99%", steps: "2,109", interventions: "23" },
  { rank: "4", emoji: "🛰️", name: "Sparkops", aix: "99%", steps: "10,869", interventions: "154" },
];

/* ── Shared bits ──────────────────────────────────────────────────── */

const mono = (size, color, extra = {}) => ({
  fontFamily: "var(--font-mono)",
  fontSize: size,
  color,
  ...extra,
});

function SectionIntro({ eyebrow, lime = true, title, sub }) {
  return (
    <>
      <div className={`lp-eyebrow${lime ? " lime" : ""}`}>{eyebrow}</div>
      <h2 className="lp-h2">{title}</h2>
      {sub && <p className="lp-sub">{sub}</p>}
    </>
  );
}

function Trio({ items }) {
  return (
    <div className="lp-trio">
      {items.map(([title, body]) => (
        <div key={title}>
          <div className="lp-trio-title">{title}</div>
          <div className="lp-trio-body">{body}</div>
        </div>
      ))}
    </div>
  );
}

function DemoButton({ size = "sm", children = "Book a demo" }) {
  const { open } = useWaitlist();
  return (
    <button type="button" className={`lp-btn lp-btn-lime lp-btn-${size}`} onClick={() => open()}>
      {children}
    </button>
  );
}

/* ── Nav ──────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  ["#observe", "Observability"],
  ["#measure", "Autonomy"],
  ["#squads", "Squads"],
  ["#brain", "Brain"],
  ["#integrations", "Integrations"],
  ["#use-cases", "Use cases"],
];

export function TopNav() {
  return (
    <nav className="lp-nav">
      <div className="lp-nav-brand">
        <img src="/assets/mark-color.png" alt="Spark OS" style={{ width: 26, height: 26 }} />
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em" }}>Spark OS</span>
        <span className="lp-badge">By ABConvert</span>
      </div>
      <div className="lp-nav-links">
        {NAV_LINKS.map(([href, label]) => (
          <a key={href} href={href} className="lp-navlink">{label}</a>
        ))}
        <DemoButton size="sm" />
      </div>
    </nav>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────── */

const HERO_STATS = [
  ["1,313", "Workflows completed"],
  ["13", "Agents in one fleet"],
  ["330", "Pages of shared memory"],
];

export function Hero() {
  return (
    <header className="lp-hero">
      <Reveal>
        <div className="lp-eyebrow" style={{ marginBottom: 24 }}>Agent operations for real work</div>
      </Reveal>
      <Reveal delay={60}>
        <h1 className="lp-h1">Run a team of agents in a few clicks.</h1>
      </Reveal>
      <Reveal delay={120}>
        <p className="lp-hero-sub">
          Spark OS is one console to observe every agent you run, coordinate them as squads
          with a real process, and keep everything they learn in a single source of truth.
        </p>
      </Reveal>
      <Reveal delay={180}>
        <div className="lp-hero-ctas" style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <DemoButton size="md" />
          <a href="#observe" className="lp-btn lp-btn-outline lp-btn-md">See how it works</a>
        </div>
      </Reveal>
      <Reveal delay={260}>
        <div className="lp-stats">
          {HERO_STATS.map(([num, label], i) => (
            <React.Fragment key={label}>
              {i > 0 && <div className="lp-stat-sep" />}
              <div>
                <div className="lp-stat-num">{num}</div>
                <div className="lp-stat-label">{label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Reveal>
    </header>
  );
}

/* ── 01 Observe — fleet overview ──────────────────────────────────── */

export function Observe() {
  return (
    <section id="observe" className="lp-section">
      <SectionIntro
        eyebrow="01 · Observe"
        title="Every agent in your infra, on one screen"
        sub="Status, budgets, and workload for the whole fleet — plus skill and integration management that doesn't require touching a config file. When something drifts, you see it before it costs you."
      />
      <div className="lp-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span className="lp-mono-label">Fleet overview</span>
          <span className="lp-mono-label dim">Updated 12s ago</span>
        </div>
        <div className="lp-scroll">
          <div style={{ minWidth: 760 }}>
            {AGENTS.map((a) => {
              const s = STATUS_STYLES[a.status];
              const barColor = a.pct >= 85 ? "var(--color-status-stale)" : "var(--color-lime)";
              return (
                <div
                  key={a.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "220px 110px 1fr 200px",
                    gap: 16,
                    alignItems: "center",
                    padding: "14px 12px",
                    borderTop: "1px solid var(--color-border-faint)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{a.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{a.name}</div>
                      <div style={mono(11, "var(--color-text-muted)")}>{a.id}</div>
                    </div>
                  </div>
                  <div className="lp-pill" style={{ background: s.bg, borderColor: s.stroke }}>
                    <span className="dot" style={{ background: s.dot }} />
                    <span style={{ color: s.dot }}>{a.status}</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span className="lp-mono-label dim">Budget</span>
                      <span style={mono(11, "var(--color-text-secondary)")}>{a.spend} / {a.budget}</span>
                    </div>
                    <div className="lp-bar-track">
                      <div className="lp-bar-fill" style={{ background: barColor, width: `${a.pct}%` }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {a.skills.map((sk) => (
                      <span key={sk} className="lp-chip">{sk}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16, padding: 12, borderTop: "1px solid var(--color-border-subtle)" }}>
          <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>11 of 13 agents enabled.</span>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="lp-chip-btn">Skills</span>
            <span className="lp-chip-btn">Integrations</span>
            <span className="lp-chip-btn lime">Environment</span>
          </div>
        </div>
      </div>
      <Trio
        items={[
          ["Live status", "Healthy, idle, stale, behind, down — every agent's health at a glance, with alerts before things break."],
          ["Budgets that hold", "Per-agent and per-squad spend caps. Track cost to the cent and stop runaway runs automatically."],
          ["Skills & integrations", "Grant and revoke capabilities per agent from one panel — no config files, no redeploys."],
        ]}
      />
    </section>
  );
}

/* ── 02 Measure — workload & autonomy ─────────────────────────────── */

function WorkloadTable({ title, rows }) {
  const cols = { display: "grid", gridTemplateColumns: "1fr 76px 76px 60px", gap: 8 };
  return (
    <div className="lp-card">
      <div className="lp-mono-label" style={{ marginBottom: 16 }}>{title}</div>
      <div className="lp-scroll">
        <div style={{ minWidth: 420 }}>
          <div style={{ ...cols, padding: "0 12px 10px", borderBottom: "1px solid var(--color-border-subtle)" }}>
            {["NAME", "STARTED", "DONE", "FAILED"].map((h, i) => (
              <span key={h} style={mono(11, "var(--color-text-faint)", { letterSpacing: "0.08em", textAlign: i ? "right" : "left" })}>{h}</span>
            ))}
          </div>
          {rows.map((w) => (
            <div key={w.name} style={{ ...cols, alignItems: "center", padding: 12, borderTop: "1px solid var(--color-border-faint)" }}>
              <span style={{ fontSize: 14, color: "var(--color-text-primary)" }}>
                {w.emoji && <span style={{ marginRight: 8 }}>{w.emoji}</span>}
                {w.name}
              </span>
              <span style={mono(13, "var(--color-text-tertiary)", { textAlign: "right" })}>{w.started}</span>
              <span style={mono(13, "var(--color-text-secondary)", { textAlign: "right" })}>{w.done}</span>
              <span style={mono(13, failColor(w.failed), { textAlign: "right" })}>{w.failed}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Measure() {
  const cols = { display: "grid", gridTemplateColumns: "40px 1fr 220px 110px 110px", gap: 12 };
  return (
    <section id="measure" className="lp-section">
      <SectionIntro
        eyebrow="02 · Measure"
        title="Who's carrying the work — and how far they run alone"
        sub="Workload broken down by workflow type and by agent, plus an autonomy index: how many steps each agent completes without a human stepping in. You see where work piles up — and which agents you can trust to run unattended."
      />
      <div className="lp-grid-2">
        <WorkloadTable title="Workload · by workflow type" rows={WORKLOAD_TYPES} />
        <WorkloadTable title="Workload · by agent · last 30 days" rows={WORKLOAD_AGENTS} />
      </div>
      <div className="lp-card" style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <span className="lp-mono-label">Autonomy leaderboard</span>
          <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Steps completed without human intervention</span>
        </div>
        <div className="lp-scroll">
          <div style={{ minWidth: 680 }}>
            <div style={{ ...cols, padding: "0 12px 10px", borderBottom: "1px solid var(--color-border-subtle)" }}>
              {["#", "AGENT", "AIX", "STEPS", "INTERVENTIONS"].map((h, i) => (
                <span key={h} style={mono(11, "var(--color-text-faint)", { letterSpacing: "0.08em", textAlign: i >= 3 ? "right" : "left" })}>{h}</span>
              ))}
            </div>
            {AUTONOMY.map((r) => (
              <div key={r.rank} style={{ ...cols, alignItems: "center", padding: "13px 12px", borderTop: "1px solid var(--color-border-faint)" }}>
                <span style={mono(13, "var(--color-text-muted)")}>{r.rank}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-primary)" }}>
                  <span style={{ marginRight: 8 }}>{r.emoji}</span>
                  {r.name}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="lp-bar-track" style={{ flex: 1 }}>
                    <div className="lp-bar-fill" style={{ background: "var(--color-lime)", width: r.aix }} />
                  </div>
                  <span style={mono(13, "var(--color-lime)", { width: 42, textAlign: "right" })}>{r.aix}</span>
                </div>
                <span style={mono(13, "var(--color-text-secondary)", { textAlign: "right" })}>{r.steps}</span>
                <span style={mono(13, "var(--color-text-tertiary)", { textAlign: "right" })}>{r.interventions}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Trio
        items={[
          ["Workload, assigned fairly", "See task assignment by workflow and by agent — spot the overloaded, the idle, and the failure hotspots."],
          ["Autonomy you can measure", "AIx tracks how many steps an agent completes per human intervention — a concrete trust score per agent."],
          ["Delegate with evidence", "As an agent's AIx climbs, loosen its approval gates. Autonomy is earned in the data, not assumed."],
        ]}
      />
    </section>
  );
}

/* ── 03 Coordinate — squads ───────────────────────────────────────── */

export function Squads() {
  return (
    <section id="squads" className="lp-section">
      <SectionIntro
        eyebrow="03 · Coordinate"
        title="Not one agent — a squad with a process"
        sub="Group agents into squads with defined roles, shared context, and a written process guideline they actually follow. The same squad process your team runs — implemented, not just documented."
      />
      <div className="lp-card" style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 12, background: "var(--color-lime-soft)", border: "1px solid var(--color-lime-stroke)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-lime)", fontSize: 22 }}>⧉</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em" }}>Storefront Squad</span>
                <span className="lp-pill" style={{ background: "var(--color-status-healthy-soft)", borderColor: "var(--color-status-healthy-stroke)", padding: "3px 12px" }}>
                  <span className="dot" style={{ background: "var(--color-status-healthy)" }} />
                  <span style={{ color: "var(--color-status-healthy)", letterSpacing: "0.08em" }}>ACTIVE</span>
                </span>
              </div>
              <div style={{ fontSize: 14, color: "var(--color-text-tertiary)", marginTop: 6 }}>Agent team that runs the store's testing and release loop</div>
              <div style={mono(12, "var(--color-text-muted)", { marginTop: 4 })}>storefront-squad</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="lp-ghost-btn">Move to draft</span>
            <span className="lp-ghost-btn">Archive</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 28, borderBottom: "1px solid var(--color-border-subtle)", overflowX: "auto", whiteSpace: "nowrap" }}>
          {[
            ["Members", "6"],
            ["Roles", "3"],
            ["Context", "4"],
            ["Process guideline", null],
          ].map(([label, n]) => (
            <span key={label} style={{ fontSize: 14, color: "var(--color-text-tertiary)", paddingBottom: 12 }}>
              {label} {n && <span style={mono(12, "var(--color-text-muted)")}>{n}</span>}
            </span>
          ))}
          <span style={{ fontSize: 14, color: "var(--color-text-primary)", paddingBottom: 12, borderBottom: "2px solid var(--color-lime)" }}>Activities</span>
        </div>
        <div className="lp-trio" style={{ gap: 16, marginTop: 24 }}>
          {[
            ["Conversations", "5,654"],
            ["Cost", "$4,017.78"],
            ["Workflows completed", "1,313"],
          ].map(([label, value]) => (
            <div key={label} className="lp-card-inner" style={{ padding: 20 }}>
              <div className="lp-mono-label" style={{ marginBottom: 12 }}>{label}</div>
              <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: "-0.01em", color: "var(--color-text-primary)" }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          {ACTIVITIES.map((act, i) => (
            <div key={i} className="lp-card-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "16px 20px" }}>
              <div>
                <div style={{ fontSize: 14 }}>
                  <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{act.agent}</span>{" "}
                  <span style={{ color: "var(--color-text-tertiary)" }}>{act.task}</span>{" "}
                  {act.ref && <span style={mono(13, "var(--color-text-muted)")}>{act.ref}</span>}
                </div>
                <div style={mono(12, "var(--color-text-muted)", { marginTop: 6 })}>{act.time} · {act.dur}</div>
              </div>
              <span style={mono(11, "var(--color-lime)", { letterSpacing: "0.08em", border: "1px solid var(--color-lime-stroke)", background: "var(--color-lime-soft)", borderRadius: 999, padding: "4px 12px" })}>COMPLETED</span>
            </div>
          ))}
        </div>
      </div>
      <Trio
        items={[
          ["Roles, not prompts", "Each member gets a role with clear responsibilities — reviewer, investigator, builder — and hands work off accordingly."],
          ["Process guidelines", "Write your team's process once — review gates, escalation rules, definitions of done — and the squad follows it on every run."],
          ["A clear paper trail", "Every conversation, handoff, and workflow is logged. You always know who did what, when, and why."],
        ]}
      />
    </section>
  );
}

/* ── 04 Operate — clone / version / roll back ─────────────────────── */

export function Operate() {
  return (
    <section id="operate" className="lp-section">
      <SectionIntro
        eyebrow="04 · Operate"
        title="Clone it, version it, roll it back"
        sub="Squads and agents are configuration, and configuration is operated like code. Clone a proven squad to a new store or project in one click; every change to roles, process, and skills is versioned and reversible."
      />
      <div className="lp-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <span className="lp-mono-label">Version history · storefront-squad</span>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#000", background: "var(--color-lime)", borderRadius: 8, padding: "6px 14px", whiteSpace: "nowrap" }}>Clone squad</span>
            <span className="lp-ghost-btn" style={{ padding: "6px 14px" }}>Restore version</span>
          </div>
        </div>
        <div className="lp-scroll">
          <div style={{ minWidth: 640 }}>
            {VERSIONS.map((v) => (
              <div key={v.num} style={{ display: "grid", gridTemplateColumns: "64px 1fr 180px 110px", gap: 16, alignItems: "center", padding: "13px 12px", borderTop: "1px solid var(--color-border-faint)" }}>
                <span style={mono(13, v.current ? "var(--color-lime)" : "var(--color-text-tertiary)")}>{v.num}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>{v.desc}</span>
                <span style={mono(12, "var(--color-text-muted)")}>{v.time}</span>
                <span style={mono(11, v.current ? "var(--color-lime)" : "var(--color-text-muted)", { letterSpacing: "0.08em", textAlign: "right" })}>{v.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Trio
        items={[
          ["Clone what works", "Duplicate a proven squad — roles, process, skills, and context — and point it at the next store or project."],
          ["Version control built in", "Every configuration change is a version with an author and a diff. Nothing changes silently."],
          ["Roll back in seconds", "A process tweak backfires? Restore the previous version and the squad picks it up on the next run."],
        ]}
      />
    </section>
  );
}

/* ── 05 Remember — the brain ──────────────────────────────────────── */

/* Animated 3D-style knowledge graph, styled after the real Brain page:
   translucent spheres, beams radiating from a hub, plus the page's own UI
   chrome (filter bar, node-type legend, hover tooltip, controls hint).
   Three SVG layers drift at different speeds for parallax; motion is
   disabled under prefers-reduced-motion (see styles.css). */

const BRAIN_TYPES = [
  ["repo", "#3FB4E8"],
  ["decision", "#A78BFA"],
  ["person", "#FFABD6"],
  ["team", "#F5A524"],
  ["incident", "#FF5F47"],
  ["project", "#82C621"],
  ["concept", "#5DEFFF"],
  ["guide", "#FFD54A"],
  ["note", "#B4B4BB"],
  ["meeting", "#FF7AC6"],
  ["insight", "#ACFF17"],
];

function BrainViz() {
  /* Scattered small nodes — deterministic seeded LCG (from the design's makeGraph). */
  let seed = 42;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const scatterColors = ["#ACFF17", "#ACFF17", "#82C621", "#5DEFFF", "#A78BFA", "#F5A524", "#FFABD6"];
  const scatter = [];
  for (let i = 0; i < 34; i++) {
    scatter.push({ x: rnd() * 1000, y: rnd() * 620, r: 2 + rnd() * rnd() * 8, c: scatterColors[Math.floor(rnd() * scatterColors.length)], o: 0.25 + rnd() * 0.55 });
  }
  const far = [];
  for (let i = 0; i < 22; i++) {
    far.push({ x: rnd() * 1000, y: rnd() * 620, r: 3 + rnd() * 10, o: 0.1 + rnd() * 0.2 });
  }

  const hub = { x: 810, y: 330 };
  const beamEnds = [[620, 60], [585, 425], [995, 150], [860, 600], [435, 310], [150, 180], [330, 610], [1010, 430]];

  return (
    <div className="lp-brain-viz" role="img" aria-label="Brain knowledge graph — 330 nodes, 641 links, filterable by page type">
      <svg width="100%" height="100%" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <defs>
          <radialGradient id="bviz-lime" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#D6FF8C" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#ACFF17" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4F7D0B" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="bviz-violet" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#D6CCFE" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#A78BFA" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4C3199" stopOpacity="0.32" />
          </radialGradient>
          <radialGradient id="bviz-amber" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#F5C544" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B57F10" stopOpacity="0.5" />
          </radialGradient>
          <radialGradient id="bviz-dark" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#2A3A38" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#101B1A" stopOpacity="0.55" />
          </radialGradient>
          <filter id="bviz-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="bviz-haze" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* far layer — blurred depth */}
        <g className="lp-brain-layer-far" filter="url(#bviz-haze)">
          <circle cx="140" cy="390" r="48" fill="url(#bviz-dark)" />
          <circle cx="470" cy="530" r="62" fill="url(#bviz-dark)" />
          <circle cx="80" cy="120" r="38" fill="url(#bviz-dark)" />
          <circle cx="940" cy="215" r="45" fill="url(#bviz-dark)" />
          <circle cx="620" cy="180" r="26" fill="#ACFF17" opacity="0.14" />
          {far.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="#9FB98A" opacity={n.o} />
          ))}
        </g>

        {/* mid layer — hub, beams, hero spheres */}
        <g className="lp-brain-layer-mid">
          {beamEnds.map(([x, y], i) => (
            <line key={i} x1={hub.x} y1={hub.y} x2={x} y2={y} stroke="#9DE84C" strokeWidth={i % 3 === 0 ? 14 : 8} opacity={0.1 + (i % 3) * 0.03} filter="url(#bviz-soft)" />
          ))}
          <circle cx="620" cy="55" r="90" fill="url(#bviz-lime)" />
          <circle cx="735" cy="180" r="52" fill="url(#bviz-lime)" opacity="0.85" />
          <circle cx={hub.x} cy={hub.y} r="95" fill="url(#bviz-violet)" />
          <circle cx="585" cy="425" r="48" fill="url(#bviz-lime)" opacity="0.9" />
          <circle cx="250" cy="545" r="20" fill="url(#bviz-violet)" opacity="0.8" />
          <circle cx="435" cy="310" r="58" fill="#F5A524" opacity="0.3" filter="url(#bviz-haze)" />
          <circle cx="435" cy="310" r="30" fill="url(#bviz-amber)" />
          <circle cx="150" cy="95" r="6" fill="#FFABD6" opacity="0.8" />
          <circle cx="905" cy="95" r="5" fill="#FF5F47" opacity="0.8" />
          {scatter.map((n, i) => (
            <circle key={i} className={i % 4 === 0 ? "lp-brain-tw" : undefined} style={i % 4 === 0 ? { animationDelay: `${(i % 9) * 0.8}s` } : undefined} cx={n.x} cy={n.y} r={n.r} fill={n.c} opacity={n.o} />
          ))}
        </g>

        {/* near layer — large partially-clipped spheres, opposite drift */}
        <g className="lp-brain-layer-near">
          <circle cx="320" cy="660" r="115" fill="url(#bviz-dark)" filter="url(#bviz-soft)" />
          <circle cx="860" cy="610" r="108" fill="url(#bviz-lime)" />
          <circle cx="955" cy="565" r="38" fill="url(#bviz-violet)" opacity="0.9" />
        </g>
      </svg>

      {/* UI chrome overlays */}
      <div className="lp-brain-filter lp-brain-ui-card">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        Filter pages by title, slug, or type…
      </div>
      <div className="lp-brain-legend lp-brain-ui-card">
        <div className="lp-brain-legend-title">330 NODES · 641 LINKS</div>
        <div className="lp-brain-legend-items">
          {BRAIN_TYPES.map(([label, color]) => (
            <span key={label} className="lp-brain-legend-item">
              <span className="dot" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
        <div className="lp-brain-legend-sep">
          <span className="lp-brain-legend-item">
            <span className="dot" style={{ background: "#85868D" }} />
            recently added
          </span>
        </div>
      </div>
      <div className="lp-brain-tooltip lp-brain-ui-card">
        <div className="lp-brain-tooltip-title">2026-06-18 Checkout threshold test readout</div>
        <div className="lp-brain-tooltip-sub">meeting · org</div>
      </div>
      <div className="lp-brain-hint">Left-click: rotate · Mouse-wheel: zoom · Right-click: pan</div>
    </div>
  );
}

export function Brain() {
  return (
    <section id="brain" className="lp-section">
      <SectionIntro
        eyebrow="05 · Remember"
        title="A built-in intelligence layer. One source of truth."
        sub="Everything your agents learn — decisions, incidents, guides, meeting notes, artifacts — consolidates into one company brain. It's MCP-ready, so agents inside and outside Spark OS exchange learnings — and a dedicated curation agent keeps every page accurate."
      />
      <div className="lp-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 9, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.30)", display: "flex", alignItems: "center", justifyContent: "center", ...mono(14, "var(--color-violet)") }}>{"</>"}</div>
          <div>
            <div style={mono(11, "var(--color-violet)", { letterSpacing: "0.08em" })}>BRAIN MCP · INBOUND</div>
            <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginTop: 4 }}>Connect your local coding agent (Claude Code, Cursor, …) to the org brain with a personal token.</div>
          </div>
        </div>
        <span className="lp-ghost-btn">Manage →</span>
      </div>
      <div className="lp-card lp-brain-split" style={{ padding: 0, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 360px" }}>
        <div style={{ position: "relative", minHeight: 440, background: "var(--color-surface-sunken)", overflow: "hidden" }}>
          <BrainViz />
        </div>
        <div style={{ borderLeft: "1px solid var(--color-border-subtle)", padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={mono(11, "var(--color-lime)", { letterSpacing: "0.08em", border: "1px solid var(--color-lime-stroke)", background: "var(--color-lime-soft)", borderRadius: 999, padding: "4px 12px", width: "fit-content" })}>DECISION</span>
          <div>
            <div style={{ fontSize: 20, lineHeight: "26px", fontWeight: 500, letterSpacing: "-0.01em" }}>Checkout test playbook — Q3</div>
            <div style={mono(12, "var(--color-text-muted)", { marginTop: 8 })}>decision/checkout-test-playbook-q3 · updated 3d ago</div>
          </div>
          <div style={{ borderTop: "1px solid var(--color-border-subtle)", paddingTop: 16, fontSize: 14, lineHeight: "22px", color: "var(--color-text-secondary)", textWrap: "pretty" }}>
            Free-shipping threshold tests beat flat discounts in every store we ran them. Keep the threshold within 10% of average order value. <span style={{ color: "var(--color-text-muted)" }}>[Source: squad:storefront]</span>
          </div>
          <div style={{ fontSize: 14, lineHeight: "22px", color: "var(--color-text-secondary)", textWrap: "pretty" }}>
            Roll winners out store-by-store — priors from earlier stores cut the next test's runtime nearly in half. <span style={{ color: "var(--color-text-muted)" }}>[Source: squad:storefront]</span>
          </div>
          <div style={{ marginTop: "auto", border: "1px solid var(--color-lime-stroke)", color: "var(--color-lime)", textAlign: "center", borderRadius: 8, padding: 11, fontSize: 14, fontWeight: 500 }}>Open in editor</div>
        </div>
      </div>
      <Trio
        items={[
          ["Learnings consolidated", "Every agent writes what it learns back to the brain — sourced, linked, and deduplicated. No agent solves the same problem twice."],
          ["MCP-ready", "The brain speaks MCP. Claude Code, Cursor, and any MCP client read and write the same knowledge as your squads."],
          ["A curation agent on duty", "A dedicated curator reviews new pages, merges duplicates, and flags stale docs — so knowledge stays accurate."],
        ]}
      />
    </section>
  );
}

/* ── Integrations ─────────────────────────────────────────────────── */

export function Integrations() {
  return (
    <section id="integrations" className="lp-section">
      <SectionIntro
        lime={false}
        eyebrow="Integrations"
        title="Plugged into the stack you already run"
        sub="Models, channels, commerce, and tools — connected with a key or an OAuth click, managed per agent from one panel."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {INTEGRATION_GROUPS.map((g) => (
          <div key={g.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: 10, marginBottom: 14 }}>
              <span className="lp-mono-label">{g.label}</span>
              <span style={mono(11, "var(--color-text-muted)")}>{g.count}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {g.items.map((it) => (
                <span key={it} className="lp-tag">{it}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Use cases ────────────────────────────────────────────────────── */

const USE_CASES = [
  {
    tag: "E-commerce",
    title: "A/B testing on autopilot",
    body: "A squad proposes tests, ships variants, watches significance, and writes the winner back to the brain. Your next test starts smarter than your last.",
    steps: [
      "Test ideas ranked from store data and past results",
      "Price, theme, and content variants shipped automatically",
      "Winners declared only when the data clears the bar",
    ],
  },
  {
    tag: "Solo founders",
    title: "A full engineering loop, minus the headcount",
    body: "One founder, one squad: issues get investigated, features get built and reviewed, and every fix teaches the team. You approve; the squad ships.",
    steps: [
      "Issues triaged and investigated the moment they land",
      "Feature work built, PR-reviewed, and tested by the squad",
      "You stay the approver — Approve / Decline on every ship",
    ],
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="lp-section">
      <div className="lp-eyebrow">Use cases</div>
      <h2 className="lp-h2" style={{ marginBottom: 48 }}>Two ways teams run Spark OS today</h2>
      <div className="lp-grid-2">
        {USE_CASES.map((uc) => (
          <div key={uc.tag} className="lp-card" style={{ padding: 36, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={mono(11, "var(--color-lime)", { letterSpacing: "0.08em", textTransform: "uppercase" })}>{uc.tag}</div>
            <div style={{ fontSize: 26, lineHeight: "32px", fontWeight: 500, letterSpacing: "-0.01em" }}>{uc.title}</div>
            <div style={{ fontSize: 15, lineHeight: "23px", color: "var(--color-text-soft)", textWrap: "pretty" }}>{uc.body}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              {uc.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={mono(12, "var(--color-lime)")}>{`0${i + 1}`}</span>
                  <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────────────────── */

export function FinalCta() {
  return (
    <section id="demo" className="lp-cta">
      <img src="/assets/mark-color.png" alt="" style={{ width: 44, height: 44, marginBottom: 28 }} />
      <h2 style={{ font: "500 clamp(34px, 4.4vw, 48px)/1.12 var(--font-sans)", letterSpacing: "-0.02em", color: "var(--color-text-primary)", margin: "0 0 20px" }}>
        See Spark OS on your workflows
      </h2>
      <p style={{ fontSize: 17, lineHeight: "26px", color: "var(--color-text-soft)", maxWidth: 480, margin: "0 auto 36px" }}>
        A 30-minute walkthrough with the team that runs it in production every day.
      </p>
      <DemoButton size="lg" />
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="lp-footer">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/assets/mark-white.png" alt="" style={{ width: 18, height: 18, opacity: 0.7 }} />
        <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>© 2026 ABConvert. Spark OS.</span>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <a href="#observe" className="lp-footer-link">Observability</a>
        <a href="#squads" className="lp-footer-link">Squads</a>
        <a href="#brain" className="lp-footer-link">Brain</a>
        <a href="#demo" className="lp-footer-link">Book a demo</a>
      </div>
    </footer>
  );
}
