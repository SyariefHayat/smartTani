# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY shared ./shared
COPY services/marketplace-service ./services/marketplace-service
WORKDIR /app/services/marketplace-service
RUN npm install
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS production
WORKDIR /app/services/marketplace-service
ENV NODE_ENV=production
COPY services/marketplace-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/marketplace-service/dist ./dist
EXPOSE 3002
CMD ["node", "dist/index.js"]
