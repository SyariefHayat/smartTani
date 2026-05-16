#!/bin/bash

set -u

ROOT_DIR=$(pwd)

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() {
  echo -e "${GREEN}✅ $1${NC}"
}

fail() {
  echo -e "${RED}❌ $1${NC}"
}

warn() {
  echo -e "${YELLOW}⚠️ $1${NC}"
}

check_command() {
  local cmd=$1
  if command -v "$cmd" >/dev/null 2>&1; then
    pass "Command available: $cmd"
  else
    fail "Command missing: $cmd"
    return 1
  fi
}

check_port() {
  local host=$1
  local port=$2
  timeout 1 bash -c "</dev/tcp/$host/$port" >/dev/null 2>&1
}

check_http() {
  local url=$1
  local label=$2
  if curl -fsS --max-time 3 "$url" >/dev/null 2>&1; then
    pass "$label"
  else
    fail "$label"
    return 1
  fi
}

echo "🔎 SmartTani system check"
echo "📂 Root: $ROOT_DIR"

echo
echo "== Prerequisites =="
check_command node || exit 1
check_command npm || exit 1
check_command curl || exit 1

echo
echo "== Infrastructure Ports =="
infra_ports=(5432 27017 6379 5672 9000)
for port in "${infra_ports[@]}"; do
  if check_port "127.0.0.1" "$port"; then
    pass "Port $port reachable"
  else
    fail "Port $port not reachable"
  fi
done

echo
echo "== Backend Health =="
services=(
  "3000|API Gateway|http://localhost:3000/health"
  "3001|Auth Service|http://localhost:3001/health"
  "3002|Marketplace Service|http://localhost:3002/health"
  "3003|Order Service|http://localhost:3003/health"
  "3004|Investment Service|http://localhost:3004/health"
  "3005|Logistics Service|http://localhost:3005/health"
  "3006|Notification Service|http://localhost:3006/health"
  "3007|Analytics Service|http://localhost:3007/health"
)

for item in "${services[@]}"; do
  IFS='|' read -r port name url <<< "$item"
  if check_port "127.0.0.1" "$port"; then
    check_http "$url" "$name health endpoint"
  else
    fail "$name port $port is not listening"
  fi
done

echo
echo "== Public API Smoke =="
check_http "http://localhost:3000/api-docs" "Swagger UI reachable"
check_http "http://localhost:3000/products" "Products endpoint reachable"
check_http "http://localhost:3000/categories" "Categories endpoint reachable"

echo
echo "== Frontend =="
if check_port "127.0.0.1" "3008"; then
  check_http "http://localhost:3008" "Frontend reachable on port 3008"
else
  warn "Frontend port 3008 is not listening"
fi

echo
echo "== Recommended Functional Tests =="
echo "1. Run backend: ./start_services.sh"
echo "2. Run frontend: cd frontend/web && npm run dev -- --port 3008"
echo "3. Run E2E demo: ./run_e2e_demo.sh"
echo "4. Review Swagger: http://localhost:3000/api-docs"
