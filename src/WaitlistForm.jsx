/* Inline email capture — low-friction entry point that opens the full waitlist
   popup (pre-filled with the email) where the rest of the details are collected. */

import React, { useState } from "react";
import { useWaitlist } from "./WaitlistModal.jsx";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function WaitlistForm({ size = "lg", align = "start" }) {
  const { open } = useWaitlist();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const big = size === "lg";

  const onSubmit = (e) => {
    e.preventDefault();
    if (email && !EMAIL_RE.test(email)) {
      setError(true);
      return;
    }
    open(email); // empty email is fine — modal collects it
  };

  return (
    <form
      name="waitlist"
      onSubmit={onSubmit}
      noValidate
      className="lp-inline-form"
      style={{ width: "100%", maxWidth: 460, marginInline: align === "center" ? "auto" : 0 }}
    >
      <div className="lp-inline-form-row" style={{ display: "flex", gap: 8 }}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(false);
          }}
          className="input"
          style={{
            flex: 1,
            height: big ? 46 : 40,
            padding: big ? "0 16px" : "0 14px",
            fontSize: big ? 14 : 13,
            borderColor: error ? "var(--color-status-down-stroke)" : undefined,
          }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            height: big ? 46 : 40,
            padding: big ? "0 20px" : "0 16px",
            fontSize: big ? 14 : 13,
            whiteSpace: "nowrap",
            justifyContent: "center",
          }}
        >
          Join the waitlist
        </button>
      </div>
      {error && (
        <div className="text-body-sm" style={{ marginTop: 7, color: "var(--color-status-down)" }}>
          Please enter a valid email address.
        </div>
      )}
    </form>
  );
}
