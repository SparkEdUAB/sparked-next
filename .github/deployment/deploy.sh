#!/bin/bash
set -e

# Navigate to your project directory
cd /var/www/sparked-next || exit

# Pull the latest changes from the main branch
git pull origin main

# The app runs on Node 22; Bun is only the package manager
node -v | grep -q '^v22\.' || { echo "Node 22 required"; exit 1; }

# Install Bun if missing, then install dependencies from bun.lock
[ "$(bun --version 2>/dev/null)" = "1.4.5" ] || npm install -g bun@1.4.5
bun ci

# Build the Next.js app
bun run build

# (Re)start the app with PM2 on the Node runtime
pm2 delete sparked-next >/dev/null 2>&1 || true
pm2 start node_modules/next/dist/bin/next --name sparked-next --interpreter node -- start

# Save the PM2 process list
pm2 save
