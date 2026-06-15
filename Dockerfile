FROM node:20.19.0-bullseye-slim AS builder
WORKDIR /app

# Install dependencies (builder)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Prune dev deps to keep runtime node_modules small
RUN npm prune --production

FROM node:20.19.0-bullseye-slim AS runner
WORKDIR /app

# Install required system packages (ffmpeg, libvips, canvas deps)
RUN apt-get update && apt-get install -y --no-install-recommends \
  ffmpeg \
  libvips-dev \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  python3 \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Copy built app and production node_modules from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/workers ./workers

EXPOSE 3000
CMD ["npm","start"]
