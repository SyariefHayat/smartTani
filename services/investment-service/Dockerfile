# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY shared ./shared
COPY services/investment-service ./services/investment-service
WORKDIR /app/services/investment-service
RUN npm install
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS production
WORKDIR /app/services/investment-service
ENV NODE_ENV=production
COPY services/investment-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/investment-service/dist ./dist
COPY --from=builder /app/services/investment-service/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/services/investment-service/node_modules/@prisma/client ./node_modules/@prisma/client
EXPOSE 3004
CMD ["node", "dist/index.js"]
