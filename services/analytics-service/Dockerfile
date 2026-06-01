# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/analytics-service ./services/analytics-service
RUN npm install
WORKDIR /app/services/analytics-service
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS production
WORKDIR /app/services/analytics-service
ENV NODE_ENV=production
COPY services/analytics-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/analytics-service/dist ./dist
COPY --from=builder /app/services/analytics-service/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/services/analytics-service/node_modules/@prisma/client ./node_modules/@prisma/client
EXPOSE 3007
CMD ["node", "dist/index.js"]
