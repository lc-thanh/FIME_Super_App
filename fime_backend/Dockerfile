#############################
# BUILD STAGE
#############################
FROM node:22.9.0-slim AS build

WORKDIR /usr/src/app

# Enable pnpm via corepack
RUN corepack enable

# Pin pnpm version to avoid verifySignature issues 
RUN corepack prepare pnpm@9.12.2 --activate

# --- FIX PRISMA OPENSSL WARNING ---
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files first for better cache
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install deps (includes devDeps for build + prisma generate)
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm prisma generate

# Copy full source
COPY . .

# Build NestJS
RUN pnpm build

# Remove devDependencies -> keep only production deps
RUN pnpm prune --prod

#############################
# PRODUCTION STAGE
#############################
FROM node:22.9.0-slim AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Enable corepack (optional, keeps pnpm env consistent)
RUN corepack enable

# --- FIX PRISMA OPENSSL WARNING (runtime) ---
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Run as non-root user for better security
USER node

# Copy output from builder
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 8080

CMD ["node", "dist/src/main.js"]
