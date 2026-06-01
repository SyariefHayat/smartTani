# Stage 1: Build
FROM node:24-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/investment-service ./services/investment-service
RUN npm install
WORKDIR /app/services/investment-service
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:24-slim AS production
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app/services/investment-service
ENV NODE_ENV=production
COPY services/investment-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/investment-service/dist ./dist
COPY --from=builder /app/services/investment-service/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/services/investment-service/node_modules/@prisma/client ./node_modules/@prisma/client
EXPOSE 3004
CMD ["node", "dist/services/investment-service/src/index.js"]
