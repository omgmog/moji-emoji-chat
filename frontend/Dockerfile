# Multi-stage build for optimized production
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/caddy

# Copy Caddyfile for SPA routing
COPY --from=builder /app/Caddyfile /etc/caddy/Caddyfile