#!/bin/bash

# SmartTani Service Starter
echo "🚀 Starting SmartTani Services..."

ROOT_DIR=$(pwd)
NPM_BIN=$(command -v npm)
LOG_DIR="$ROOT_DIR/logs/$(date +%Y%m%d-%H%M%S)"

if [ -z "$NPM_BIN" ]; then
  echo "❌ npm not found in PATH. Load your Node environment first."
  exit 1
fi

mkdir -p "$LOG_DIR"

check_port() {
  local host=$1
  local port=$2
  if ! timeout 1 bash -c "</dev/tcp/$host/$port" >/dev/null 2>&1; then
    return 1
  fi
}

echo "🔎 Checking infrastructure dependencies..."
infra_ports=(5432 27017 6379 5672 9000)
for port in "${infra_ports[@]}"; do
  if ! check_port "127.0.0.1" "$port"; then
    echo "❌ Required infrastructure port $port is not reachable on localhost."
    echo "   Start Docker dependencies first: docker compose up -d"
    exit 1
  fi
done
echo "✅ Infrastructure dependencies are reachable."

# Services to start
services=("auth-service" "marketplace-service" "order-service" "investment-service" "logistics-service" "notification-service" "analytics-service" "api-gateway")

for service in "${services[@]}"; do
  echo "📦 Starting $service..."
  if [ -d "$ROOT_DIR/services/$service" ]; then
    cd "$ROOT_DIR/services/$service"
    "$NPM_BIN" run dev > "$LOG_DIR/$service.log" 2>&1 &
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
echo "📝 Logs directory: $LOG_DIR"
# Keep script alive
wait
