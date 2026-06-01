# Stage 1: Build
FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/notification-service ./services/notification-service
RUN npm install
WORKDIR /app/services/notification-service
RUN npm run build

# Stage 2: Production
FROM node:24-slim AS production
WORKDIR /app/services/notification-service
ENV NODE_ENV=production
COPY services/notification-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/notification-service/dist ./dist
EXPOSE 3006
CMD ["node", "dist/services/notification-service/src/index.js"]
