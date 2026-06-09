-- ============================================================================
-- Spark OS — waitlist lead capture
-- Project: nrlcrgsyvrheugcniaqp
--
-- Run this in the Supabase SQL editor (or `supabase db push`) for the leads
-- project. It is idempotent.
--
-- After running this, set the Slack webhook secret ONCE (kept out of source
-- control — see supabase/set_slack_webhook.sql or the README):
--   select vault.create_secret('<slack-webhook-url>', 'slack_waitlist_webhook');
-- ============================================================================

-- Extensions ----------------------------------------------------------------
create extension if not exists citext with schema extensions;      -- case-insensitive email
create extension if not exists pg_net;                             -- async HTTP for Slack
-- supabase_vault is already installed on Supabase projects (stores the webhook).

-- Table ---------------------------------------------------------------------
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      extensions.citext not null unique,
  name       text,
  industry   text,
  position   text,
  painpoints text,
  source     text,
  referrer   text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- If the table already existed from an earlier version, add the new lead fields.
alter table public.waitlist add column if not exists name       text;
alter table public.waitlist add column if not exists industry   text;
alter table public.waitlist add column if not exists position   text;
alter table public.waitlist add column if not exists painpoints text;

comment on table public.waitlist is 'Spark OS landing-page waitlist signups.';

-- Row-level security --------------------------------------------------------
-- Anonymous visitors may INSERT only. No SELECT/UPDATE/DELETE policy exists,
-- so the publishable (anon) key cannot read or modify existing rows.
alter table public.waitlist enable row level security;

revoke all on public.waitlist from anon, authenticated;
grant insert on public.waitlist to anon, authenticated;

drop policy if exists "anon can join waitlist" on public.waitlist;
create policy "anon can join waitlist"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

-- Slack notification on new lead --------------------------------------------
-- AFTER INSERT trigger posts to the Slack incoming webhook stored in Vault.
-- pg_net is async, so the visitor's insert is never blocked by Slack latency.
create or replace function public.notify_slack_on_waitlist()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault, net
as $$
declare
  webhook_url text;
  msg         text;
begin
  select decrypted_secret
    into webhook_url
    from vault.decrypted_secrets
   where name = 'slack_waitlist_webhook'
   limit 1;

  -- No webhook configured yet → skip silently (don't fail the signup).
  if webhook_url is null then
    return new;
  end if;

  msg := format(
    ':tada: New *Spark OS* waitlist lead%s%s%s%s',
    chr(10) || '• email: `' || new.email || '`',
    case when new.name     is not null then chr(10) || '• name: ' || new.name else '' end ||
    case when new.position is not null then '  ·  role: ' || new.position else '' end ||
    case when new.industry is not null then '  ·  industry: ' || new.industry else '' end,
    case when new.painpoints is not null then chr(10) || '• pain points: ' || new.painpoints else '' end,
    chr(10) || '• source: ' || coalesce(new.source, '—')
  );

  perform net.http_post(
    url     := webhook_url,
    body    := jsonb_build_object('text', msg),
    headers := jsonb_build_object('Content-Type', 'application/json')
  );

  return new;
end;
$$;

drop trigger if exists trg_waitlist_slack_notify on public.waitlist;
create trigger trg_waitlist_slack_notify
  after insert on public.waitlist
  for each row
  execute function public.notify_slack_on_waitlist();
