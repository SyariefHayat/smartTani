#!/bin/bash

# SmartTani Service Starter for Load Test
echo "🚀 Starting SmartTani Services..."

ROOT_DIR=$(pwd)

# Services to start
services=("auth-service" "marketplace-service" "order-service" "investment-service" "logistics-service" "notification-service" "analytics-service" "api-gateway")

for service in "${services[@]}"; do
  echo "📦 Starting $service..."
  if [ -d "$ROOT_DIR/services/$service" ]; then
    cd "$ROOT_DIR/services/$service"
    npm run dev > "$ROOT_DIR/$service.log" 2>&1 &
    cd "$ROOT_DIR"
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
# Wait forever to keep services alive
tail -f /dev/null
