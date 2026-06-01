# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY shared ./shared
COPY services/notification-service ./services/notification-service
WORKDIR /app/services/notification-service
RUN npm install
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS production
WORKDIR /app/services/notification-service
ENV NODE_ENV=production
COPY services/notification-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/notification-service/dist ./dist
EXPOSE 3006
CMD ["node", "dist/index.js"]
