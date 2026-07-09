# SSO Gateway (Next.js standalone) — runtime Node 24 slim.
# syntax=docker/dockerfile:1

# --- build: next build → .next/standalone ---
FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime: bundle standalone minimale ---
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Cloud Run richiede l'ascolto su 0.0.0.0.
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
