#!/bin/bash

# SmartTani DB Schema Initializer (Prisma Db Push)
echo -e "\033[1;36m🔄 Initializing SmartTani Database Schemas...\033[0m"
echo -e "=========================================================="

ROOT_DIR=$(pwd)
NPM_BIN=$(command -v npm)

if [ -z "$NPM_BIN" ]; then
  echo -e "\033[0;31m❌ npm not found in PATH. Load your Node environment first.\033[0m"
  exit 1
fi

services=("auth-service" "order-service" "investment-service" "analytics-service")

for service in "${services[@]}"; do
  echo -e "\n\033[1;34m📦 Pushing DB Schema for $service...\033[0m"
  if [ -d "$ROOT_DIR/services/$service" ]; then
    cd "$ROOT_DIR/services/$service"
    
    # Run prisma db push to sync the database with Prisma schemas
    npx prisma db push
    
    if [ $? -eq 0 ]; then
      echo -e "\033[0;32m✅ Successfully pushed schema for $service\033[0m"
    else
      echo -e "\033[0;31m❌ Failed to push schema for $service\033[0m"
    fi
    cd "$ROOT_DIR"
  else
    echo -e "\033[0;33m⚠️ Directory $ROOT_DIR/services/$service not found!\033[0m"
  fi
done

echo -e "\n\033[1;32m🎉 All Prisma database schemas successfully initialized!\033[0m"
