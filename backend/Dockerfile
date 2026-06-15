FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl

FROM base AS deps
COPY package.json package-lock.json .npmrc ./
RUN npm ci --legacy-peer-deps

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev
RUN npm install prisma@5.17.0 --no-save --legacy-peer-deps

FROM base AS runner
ENV NODE_ENV=production
RUN apk add --no-cache curl openssl
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY scripts/import-words.mjs ./scripts/import-words.mjs
COPY package.json ./
COPY docker-entrypoint.sh ./
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh
RUN addgroup --system --gid 1001 nestjs && adduser --system --uid 1001 nestjs
USER nestjs
EXPOSE 3333
ENTRYPOINT ["./docker-entrypoint.sh"]
