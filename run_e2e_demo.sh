#!/bin/bash

# SmartTani E2E Demo Orchestrator
echo "🚀 Starting SmartTani Services for E2E Demo..."

# Function to cleanup on exit
cleanup() {
  echo "🧹 Cleaning up services..."
  pkill -f "ts-node"
  pkill -f "ts-node-dev"
  echo "✅ Cleanup complete."
}

trap cleanup EXIT

# Start Services
ROOT_DIR=$(pwd)
echo "📂 Root directory: $ROOT_DIR"

services=(
  "auth-service"
  "marketplace-service"
  "order-service"
  "investment-service"
  "logistics-service"
  "notification-service"
  "analytics-service"
  "api-gateway"
)

for service in "${services[@]}"; do
  echo "📦 Starting $service..."
  if [ -d "$ROOT_DIR/services/$service" ]; then
    (cd "$ROOT_DIR/services/$service" && npm run dev > "$ROOT_DIR/$service.log" 2>&1) &
  else
    echo "⚠️ Directory $ROOT_DIR/services/$service not found!"
  fi
done

echo "⏳ Waiting for services to be healthy..."
services_ports=(3000 3001 3002 3003 3004 3005 3006 3007)
max_retries=120
count=0

for port in "${services_ports[@]}"; do
  echo -n "Checking port $port..."
  count=0
  while ! curl -s http://localhost:$port/health > /dev/null && ! curl -s http://localhost:$port/ > /dev/null; do
    sleep 2
    count=$((count+1))
    if [ $count -ge $max_retries ]; then
      echo -e "\n❌ Service on port $port failed to start."
      exit 1
    fi
    echo -n "."
  done
  echo " OK"
done

echo -e "\n✅ All services are up!"

# Run Demo Script
echo "🎬 Running E2E Demo Script..."
npx ts-node e2e_demo_enhanced.ts

echo "🏁 Demo Script Finished."
