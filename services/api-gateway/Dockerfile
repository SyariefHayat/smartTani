# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/api-gateway ./services/api-gateway
RUN npm install
WORKDIR /app/services/api-gateway
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS production
WORKDIR /app/services/api-gateway
ENV NODE_ENV=production
COPY services/api-gateway/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/api-gateway/dist ./dist
EXPOSE 3000
CMD ["node", "dist/services/api-gateway/src/index.js"]
