#!/bin/bash

# SmartTani Staging Deployment Script
set -e

echo "🚀 Starting Staging Deployment..."

# 1. Check prerequisites
command -v docker >/dev/null 2>&1 || { echo >&2 "❌ Docker is required but not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo >&2 "❌ Docker Compose is required but not installed. Aborting."; exit 1; }

# 2. Setup Environment
if [ ! -f .env.staging ]; then
    echo "📝 Creating .env.staging from template..."
    cp staging.env.example .env.staging
    echo "⚠️  Action Required: Update .env.staging with real secrets before continuing!"
    exit 0
fi

# 3. Pull/Build and Start Services
echo "📦 Building and starting services..."
docker-compose -f docker-compose.staging.yml --env-file .env.staging up -d --build

# 4. Run Database Migrations
echo "🐘 Running PostgreSQL migrations..."
docker-compose -f docker-compose.staging.yml --env-file .env.staging exec -T auth-service npx prisma db push
docker-compose -f docker-compose.staging.yml --env-file .env.staging exec -T order-service npx prisma db push
docker-compose -f docker-compose.staging.yml --env-file .env.staging exec -T investment-service npx prisma db push

# 5. Wait for health checks
echo "⏳ Waiting for services to be healthy..."
sleep 30

# 6. Smoke Test
echo "🔍 Running Smoke Test..."
STATUS_GATEWAY=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health || echo "fail")

if [ "$STATUS_GATEWAY" == "200" ]; then
    echo "✅ API Gateway is UP"
else
    echo "❌ API Gateway is DOWN (Status: $STATUS_GATEWAY)"
fi

echo "✨ Deployment Complete!"
echo "Next step: Setup SSL with Certbot manually if first time deployment."
echo "Command: docker-compose -f docker-compose.staging.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d staging.smarttani.id"
