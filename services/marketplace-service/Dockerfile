# Stage 1: Build
FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/marketplace-service ./services/marketplace-service
RUN npm install
WORKDIR /app/services/marketplace-service
RUN npm run build

# Stage 2: Production
FROM node:24-slim AS production
WORKDIR /app/services/marketplace-service
ENV NODE_ENV=production
COPY services/marketplace-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/marketplace-service/dist ./dist
EXPOSE 3002
CMD ["node", "dist/services/marketplace-service/src/index.js"]
