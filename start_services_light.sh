#!/bin/bash

# SmartTani Lightweight & Selective Service Starter
echo -e "\033[1;36m🚀 SmartTani Selective Service Starter (RAM Optimizer)\033[0m"
echo -e "=========================================================="

ROOT_DIR=$(pwd)
NPM_BIN=$(command -v npm)
LOG_DIR="$ROOT_DIR/logs/light-$(date +%Y%m%d-%H%M%S)"

if [ -z "$NPM_BIN" ]; then
  echo -e "\033[0;31m❌ npm not found in PATH. Load your Node environment first.\033[0m"
  exit 1
fi

mkdir -p "$LOG_DIR"

# Clean up all background tasks on exit
cleanup() {
  echo -e "\n\033[1;33m🧹 Stopping active background services...\033[0m"
  # Get all background PIDs from this script session and kill them
  local pids=$(jobs -pr)
  if [ -n "$pids" ]; then
    echo "$pids" | xargs kill 2>/dev/null
    sleep 1
    echo "$pids" | xargs kill -9 2>/dev/null
  fi
  echo -e "\033[0;32m👋 All background processes successfully terminated. RAM freed!\033[0m"
  exit 0
}
trap cleanup SIGINT SIGTERM

check_port() {
  local host=$1
  local port=$2
  if ! timeout 1 bash -c "</dev/tcp/$host/$port" >/dev/null 2>&1; then
    return 1
  fi
}

echo -e "\033[1;34m🔎 Checking Docker infrastructure dependencies...\033[0m"
infra_ports=(5432 27017 6379 5672)
infra_missing=0

for port in "${infra_ports[@]}"; do
  if ! check_port "127.0.0.1" "$port"; then
    infra_missing=1
    break
  fi
done

if [ $infra_missing -eq 1 ]; then
  echo -e "\033[0;33m⚠️ Docker infrastructure is not running. Let's start the optimized version!\033[0m"
  echo -e "Starting: \033[0;32mdocker compose -f docker-compose.light.yml up -d\033[0m"
  docker compose -f docker-compose.light.yml up -d
  
  echo "⏳ Waiting for databases to initialize..."
  for i in {1..15}; do
    infra_missing=0
    for port in "${infra_ports[@]}"; do
      if ! check_port "127.0.0.1" "$port"; then
        infra_missing=1
      fi
    done
    if [ $infra_missing -eq 0 ]; then
      break
    fi
    sleep 2
  done
  
  if [ $infra_missing -eq 1 ]; then
    echo -e "\033[0;31m❌ Docker services did not start in time. Check Docker Desktop / engine.\033[0m"
    exit 1
  fi
else
  echo -e "\033[0;32m✅ Docker databases and services are already reachable!\033[0m"
fi

# Define all available services
# Format: service_name|port
all_services=(
  "api-gateway|3000"
  "auth-service|3001"
  "marketplace-service|3002"
  "order-service|3003"
  "investment-service|3004"
  "logistics-service|3005"
  "notification-service|3006"
  "analytics-service|3007"
)

# Display Options
echo
echo -e "\033[1;35mSelect a development profile to save RAM (8GB optimized):\033[0m"
echo -e "  \033[1;32m1)\033[0m \033[1mBare Minimum (Auth & Gateway)\033[0m"
echo -e "     Runs: api-gateway, auth-service"
echo -e "     Memory: ~300MB RAM. Perfect for frontend UI work with local fallback."
echo
echo -e "  \033[1;32m2)\033[0m \033[1mMarketplace & Checkout Focus\033[0m"
echo -e "     Runs: api-gateway, auth-service, marketplace-service, order-service"
echo -e "     Memory: ~750MB RAM. For Farmer/Buyer marketplace, cart, and checkout flows."
echo
echo -e "  \033[1;32m3)\033[0m \033[1mInvestment Focus\033[0m"
echo -e "     Runs: api-gateway, auth-service, investment-service"
echo -e "     Memory: ~550MB RAM. For Investor and Farmer proposals."
echo
echo -e "  \033[1;32m4)\033[0m \033[1mLogistics Focus\033[0m"
echo -e "     Runs: api-gateway, auth-service, logistics-service, order-service"
echo -e "     Memory: ~750MB RAM. For Shipment tracking and dispatching."
echo
echo -e "  \033[1;32m5)\033[0m \033[1mCustom Selection\033[0m (Choose exactly what you want)"
echo
echo -e "  \033[1;32m6)\033[0m \033[1mAll Services\033[0m (Original startup - NOT RECOMMENDED for 8GB RAM)"
echo

read -p "Enter your choice [1-6]: " choice

selected_services=()

case $choice in
  1)
    selected_services=("api-gateway" "auth-service")
    ;;
  2)
    selected_services=("api-gateway" "auth-service" "marketplace-service" "order-service")
    ;;
  3)
    selected_services=("api-gateway" "auth-service" "investment-service")
    ;;
  4)
    selected_services=("api-gateway" "auth-service" "order-service" "logistics-service")
    ;;
  5)
    echo -e "\nChoose services to start (y/n):"
    for item in "${all_services[@]}"; do
      IFS='|' read -r name port <<< "$item"
      read -p "Start $name? (y/n): " ans
      if [[ "$ans" =~ ^[Yy]$ ]]; then
        selected_services+=("$name")
      fi
    done
    ;;
  6)
    selected_services=("api-gateway" "auth-service" "marketplace-service" "order-service" "investment-service" "logistics-service" "notification-service" "analytics-service")
    ;;
  *)
    echo -e "\033[0;31m❌ Invalid option. Exiting.\033[0m"
    exit 1
    ;;
esac

if [ ${#selected_services[@]} -eq 0 ]; then
  echo -e "\033[0;33m⚠️ No services selected. Exiting.\033[0m"
  exit 0
fi

echo
echo -e "\033[1;32m📦 Starting selected services:\033[0m ${selected_services[*]}"
echo -e "📝 Logs will be written to: $LOG_DIR/"
echo

# Start services
for service in "${selected_services[@]}"; do
  echo -n "Starting $service..."
  if [ -d "$ROOT_DIR/services/$service" ]; then
    cd "$ROOT_DIR/services/$service"
    
    # Run Node with limited heap memory to avoid OOM crashes (max 512MB heap memory per service for TS compilation)
    NODE_OPTIONS="--max-old-space-size=512" "$NPM_BIN" run dev > "$LOG_DIR/$service.log" 2>&1 &
    
    cd "$ROOT_DIR"
    echo -e " \033[0;32m[OK]\033[0m"
  else
    echo -e " \033[0;31m[FAILED (Directory missing)]\033[0m"
  fi
done

# Wait for selected services to start up and become healthy
echo
echo -e "\033[1;34m⏳ Checking service health...\033[0m"
max_retries=60

for service in "${selected_services[@]}"; do
  # Find matching port
  port=""
  for item in "${all_services[@]}"; do
    IFS='|' read -r name p <<< "$item"
    if [ "$name" == "$service" ]; then
      port=$p
      break
    fi
  done
  
  if [ -n "$port" ]; then
    echo -n "Checking $service on port $port..."
    count=0
    while ! curl -s http://localhost:$port/health > /dev/null && ! curl -s http://localhost:$port/ > /dev/null; do
      sleep 1.5
      count=$((count+1))
      if [ $count -ge $max_retries ]; then
        echo -e " \033[0;31m[TIMED OUT]\033[0m"
        echo -e "⚠️ Check service logs at: $LOG_DIR/$service.log"
        break
      fi
      echo -n "."
    done
    if [ $count -lt $max_retries ]; then
      echo -e " \033[0;32m[HEALTHY]\033[0m"
    fi
  fi
done

echo
echo -e "\033[1;32m🎉 Success! Selected services are running.\033[0m"
echo -e "\033[1;33m⚠️ Keep this terminal open! Press Ctrl+C to stop all services and free RAM.\033[0m"
echo

# Keep script active to manage processes
wait
