#!/bin/bash

# Navigate to your project directory
cd /var/www/sparked-next || exit

# Pull the latest changes from the main branch
git pull origin main

# Install updated dependencies
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install --frozen-lockfile

# Build the Next.js app
pnpm build

# Restart the app with PM2
pm2 stop sparked-next
pm2 start sparked-next

# Optional: Save the PM2 process list
pm2 save
