# spark-os-website

Marketing + waitlist landing page for **Spark OS** (`spark-os.io`).

This repo contains a static React/Vite site, the client-side waitlist form, and the deployment assets used to publish the site to Kubernetes.

## What it does

- Renders the public Spark OS landing page
- Captures waitlist signups from the browser
- Writes leads directly to Supabase using a **publishable** key and RLS insert-only policy
- Notifies Slack of new leads via a database trigger configured in Supabase

```text
Browser ── insert(waitlist lead) ──▶ Supabase REST API
                                      │
                                      └─ AFTER INSERT trigger ──▶ Slack webhook
```

## Stack

- **Frontend:** React 18 + Vite
- **Styling:** custom CSS in `src/styles.css`
- **Lead capture:** Supabase REST API from the browser
- **Container runtime:** `nginx:alpine`
- **Deployment:** Docker + Kubernetes manifests in `k8s/`

## Repository layout

```text
src/                  React application source
src/lib/supabase.js   Waitlist insert call
public/               Static assets
supabase/migrations/  SQL schema / RLS setup
k8s/                  Kubernetes deployment manifests
Dockerfile            Production image build
nginx.conf            Nginx config for serving the built site
.reference/           Local design-export reference (ignored by git)
dist/                 Local production build output (ignored by git)
```

## Prerequisites

- Node.js 18+
- npm 9+

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

Default dev server: `http://localhost:5173`

## Environment variables

Create a local `.env` from `.env.example`.

```bash
cp .env.example .env
```

### Public browser variables

These are bundled into the frontend and are safe to expose to the browser:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Private variables

These must **never** be shipped to the browser or committed to git:

- `SUPABASE_SECRET_KEY`
- Slack webhook secrets
- kubeconfig files

## Available scripts

```bash
npm run dev      # local development
npm run build    # production build into dist/
npm run preview  # preview the production build locally
```

## Supabase setup

The waitlist table and RLS policy are defined in:

- `supabase/migrations/0001_waitlist.sql`

A separate SQL file may be used to store Slack webhook configuration in Supabase/Vault:

- `supabase/set_slack_webhook.sql`

That file is intentionally gitignored because it can contain secrets.

## Production build

```bash
npm run build
```

The generated static site is written to `dist/`.

## Docker

Build locally:

```bash
docker build -t spark-os-website:local .
```

## Kubernetes deploy

Apply the manifests:

```bash
kubectl apply -f k8s/
kubectl -n abconvert rollout status deployment/spark-os-website
```

## Publishing this repository to GitHub

Recommended repo name:

- `ABConvert/spark-os-website`

Before the first push, verify that:

- `.env` is not tracked
- `dist/` is not tracked
- `supabase/set_slack_webhook.sql` is not tracked
- local-only design exports under `.reference/` are not tracked

## Notes

- This repo is intended to contain **source code and deployment manifests**, not local secrets or built artifacts.
- If you rotate Supabase or Slack credentials, update local env/config outside git.
