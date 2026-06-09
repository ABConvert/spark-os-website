/* Waitlist popup — collects name, email, industry, position, pain points and
   writes them to Supabase. Exposed app-wide via <WaitlistProvider> + useWaitlist. */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { submitLead } from "./lib/supabase.js";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const INDUSTRIES = ["Ecommerce", "SaaS", "Agency", "Retail / DTC", "Marketplace", "Other"];

const WaitlistCtx = createContext({ open: () => {} });
export const useWaitlist = () => useContext(WaitlistCtx);

export function WaitlistProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState("");

  const open = useCallback((email = "") => {
    setPrefillEmail(email || "");
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <WaitlistCtx.Provider value={{ open }}>
      {children}
      {isOpen && <WaitlistModal prefillEmail={prefillEmail} onClose={close} />}
    </WaitlistCtx.Provider>
  );
}

function Field({ label, htmlFor, children, hint }) {
  return (
    <label className="lp-field" htmlFor={htmlFor}>
      <span className="lp-field-label">{label}</span>
      {children}
      {hint && <span className="lp-field-hint">{hint}</span>}
    </label>
  );
}

function WaitlistModal({ prefillEmail, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: prefillEmail || "",
    industry: "",
    position: "",
    painpoints: "",
  });
  const [state, setState] = useState("idle"); // idle | submitting | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const firstFieldRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Esc to close + lock background scroll + focus first field.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(form.email)) {
      setErrorMsg("Please enter a valid work email.");
      setState("error");
      return;
    }
    setState("submitting");
    const res = await submitLead(form.email, {
      name: form.name,
      industry: form.industry,
      position: form.position,
      painpoints: form.painpoints,
    });
    if (res.ok || res.duplicate) {
      setState("done");
      return;
    }
    setErrorMsg(res.message);
    setState("error");
  };

  return (
    <div className="lp-modal-backdrop" onMouseDown={onClose}>
      <div
        className="lp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="lp-modal-close" aria-label="Close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {state === "done" ? (
          <div className="lp-modal-done">
            <div className="lp-modal-check">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-healthy)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="lp-h3-big" style={{ marginBottom: 8 }}>You're on the list.</h3>
            <p className="text-body" style={{ maxWidth: 360, margin: "0 auto" }}>
              Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""} — we'll reach out about early access soon.
            </p>
            <button className="btn btn-primary" style={{ marginTop: 22, padding: "0 20px", height: 44 }} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="lp-modal-head">
              <span className="text-mono-label" style={{ color: "var(--color-lime)" }}>Join the waitlist</span>
              <h3 id="waitlist-modal-title" className="lp-h3-big" style={{ marginTop: 8 }}>
                Tell us about your company
              </h3>
              <p className="text-body-sm" style={{ marginTop: 6 }}>
                Early access for SaaS &amp; ecommerce teams. Takes 20 seconds.
              </p>
            </div>

            <form onSubmit={onSubmit} noValidate className="lp-modal-form">
              <div className="lp-field-row">
                <Field label="Full name" htmlFor="wl-name">
                  <input id="wl-name" ref={firstFieldRef} className="input" type="text" autoComplete="name" placeholder="Ada Lovelace" value={form.name} onChange={set("name")} />
                </Field>
                <Field label="Work email *" htmlFor="wl-email">
                  <input id="wl-email" className="input" type="email" required autoComplete="email" placeholder="you@company.com" value={form.email} onChange={set("email")} style={{ borderColor: state === "error" && !EMAIL_RE.test(form.email) ? "var(--color-status-down-stroke)" : undefined }} />
                </Field>
              </div>

              <div className="lp-field-row">
                <Field label="Industry" htmlFor="wl-industry">
                  <select id="wl-industry" className="input lp-select" value={form.industry} onChange={set("industry")}>
                    <option value="" disabled>Select…</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Your role" htmlFor="wl-position">
                  <input id="wl-position" className="input" type="text" autoComplete="organization-title" placeholder="Founder, Head of Growth…" value={form.position} onChange={set("position")} />
                </Field>
              </div>

              <Field label="What would you hand to an AI workforce first?" htmlFor="wl-pain" hint="Your biggest time sink or bottleneck.">
                <textarea id="wl-pain" className="input lp-textarea" rows={3} placeholder="e.g. we can't keep up with support tickets and weekly reporting eats two days…" value={form.painpoints} onChange={set("painpoints")} />
              </Field>

              {state === "error" && (
                <div className="text-body-sm" style={{ color: "var(--color-status-down)" }}>{errorMsg}</div>
              )}

              <button type="submit" className="btn btn-primary lp-modal-submit" disabled={state === "submitting"}>
                {state === "submitting" ? "Joining…" : "Join the waitlist"}
              </button>
              <p className="text-body-sm" style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                No spam. We'll only email you about early access.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
