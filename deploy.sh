#!/bin/bash

set -e

CONFIG_FILE="./config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: config.json not found"
  exit 1
fi

RELAY_NAME=$(grep -A 3 '"relay"' "$CONFIG_FILE" | grep '"name"' | cut -d'"' -f4)
RELAY_URL=$(grep -A 3 '"relay"' "$CONFIG_FILE" | grep '"url"' | cut -d'"' -f4)
FRONTEND_NAME=$(grep -A 3 '"frontend"' "$CONFIG_FILE" | grep '"name"' | cut -d'"' -f4)

echo "Generating frontend .env file..."
cat > frontend/.env << EOF
VITE_GUN_RELAY_URL=${RELAY_URL}
EOF
echo ""

echo "Deploying services..."
echo ""

echo "Deploying relay server..."
cd gun-relay
fly deploy -a "$RELAY_NAME"
cd ..
echo ""

echo "Deploying frontend..."
cd frontend
fly deploy -a "$FRONTEND_NAME"
cd ..
echo ""

echo "Deployment complete!"
echo ""
echo "Services:"
echo "  Frontend: https://${FRONTEND_NAME}.fly.dev"
echo "  Relay:    https://${RELAY_NAME}.fly.dev"
