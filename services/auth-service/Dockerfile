# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/auth-service ./services/auth-service
RUN npm install
WORKDIR /app/services/auth-service
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS production
WORKDIR /app/services/auth-service
ENV NODE_ENV=production
COPY services/auth-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/auth-service/dist ./dist
COPY --from=builder /app/services/auth-service/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/services/auth-service/node_modules/@prisma/client ./node_modules/@prisma/client
EXPOSE 3001
CMD ["node", "dist/services/auth-service/src/index.js"]
