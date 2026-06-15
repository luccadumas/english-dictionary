# API image — build context is monorepo root (Railway)
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl

FROM base AS deps
COPY backend/package*.json backend/.npmrc ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY backend/ .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN apk add --no-cache curl
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY backend/package*.json ./
COPY backend/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
RUN addgroup --system --gid 1001 nestjs && adduser --system --uid 1001 nestjs
USER nestjs
EXPOSE 3333
ENTRYPOINT ["./docker-entrypoint.sh"]
