# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy lockfile and manifest only — Docker cache is invalidated only when these change
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --ignore-scripts

# ── Stage 2: Build the React app ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arg lets CI/CD inject the real API URL at build time:
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com/api/v1 .
# Falls back to the proxy path for docker-compose local usage.
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ── Stage 3: Minimal nginx runtime ────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Upgrade all Alpine packages to their latest patched versions.
# This fixes OS-level CVEs (openssl, musl, zlib, etc.) that exist in the
# base image at the time nginx:1.27-alpine was published.
RUN apk upgrade --no-cache

# Remove default nginx configs
RUN rm -f /etc/nginx/conf.d/default.conf \
       /etc/nginx/nginx.conf

# Copy our tuned config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Use non-root nginx user (nginx:alpine already ships with 'nginx' user)
# Writable paths are set to /tmp/* in nginx.conf so no root needed at runtime
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
