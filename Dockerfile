# syntax=docker/dockerfile:1

# ── Build stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Vite inlines VITE_* env at build time. These are PUBLIC (publishable key +
# project URL); override with --build-arg if the project ever changes.
ARG VITE_SUPABASE_URL=https://nrlcrgsyvrheugcniaqp.supabase.co
ARG VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_12o-rvbG8TZr0G7BQh3JkQ_3lfU3Bol

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Write the values Vite reads at build time.
RUN printf 'VITE_SUPABASE_URL=%s\nVITE_SUPABASE_PUBLISHABLE_KEY=%s\n' \
    "$VITE_SUPABASE_URL" "$VITE_SUPABASE_PUBLISHABLE_KEY" > .env.production \
 && npm run build

# ── Runtime stage ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
