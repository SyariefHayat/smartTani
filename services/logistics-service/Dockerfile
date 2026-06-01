# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/logistics-service ./services/logistics-service
RUN npm install
WORKDIR /app/services/logistics-service
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS production
WORKDIR /app/services/logistics-service
ENV NODE_ENV=production
COPY services/logistics-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/logistics-service/dist ./dist
EXPOSE 3005
CMD ["node", "dist/services/logistics-service/src/index.js"]
