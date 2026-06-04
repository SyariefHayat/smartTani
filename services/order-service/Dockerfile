# Stage 1: Build
FROM node:24-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/order-service ./services/order-service
RUN npm install
WORKDIR /app/services/order-service
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:24-slim AS production
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app/services/order-service
ENV NODE_ENV=production
COPY services/order-service/package*.json ./
RUN npm install --omit=dev
COPY services/order-service/prisma ./prisma
COPY --from=builder /app/services/order-service/dist ./dist
COPY --from=builder /app/services/order-service/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/services/order-service/node_modules/@prisma/client ./node_modules/@prisma/client
EXPOSE 3003
CMD ["sh", "-c", "npx prisma db push && node dist/services/order-service/src/index.js"]
