// Minimal Supabase lead capture — no SDK, just a single PostgREST insert.
// The publishable key is public; RLS on the `waitlist` table restricts it to
// INSERT only (no read), so nothing sensitive is exposed.

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!URL || !KEY) {
  // Surface misconfiguration loudly in dev; in prod the form will report an error.
  console.error("[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
}

/**
 * Insert a waitlist lead.
 * @returns {Promise<{ok: true} | {ok: false, duplicate?: boolean, message: string}>}
 */
export async function submitLead(email, extra = {}) {
  const clean = (v) => {
    const s = (v ?? "").toString().trim();
    return s.length ? s : null;
  };
  const payload = {
    email: email.trim().toLowerCase(),
    name: clean(extra.name),
    industry: clean(extra.industry),
    position: clean(extra.position),
    painpoints: clean(extra.painpoints),
    source: extra.source ?? "landing",
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  };

  let res;
  try {
    res = await fetch(`${URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        // Don't return the row (RLS forbids select anyway) — just ack.
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    return { ok: false, message: "Network error — please try again." };
  }

  if (res.ok) return { ok: true };

  // Unique-violation on email → treat as already-on-list (a success for the user).
  if (res.status === 409) return { ok: false, duplicate: true, message: "You're already on the list." };

  let detail = "";
  try {
    detail = (await res.json())?.message || "";
  } catch {
    /* ignore */
  }
  return { ok: false, message: detail || "Something went wrong — please try again." };
}
