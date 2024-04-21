#!/bin/bash

# This scripts runs on the server to deploy the application, this is saved here for tracking and reference purposes
# If updated here make sure it reflects on the server

cd htdocs/
# Create the releases directory if it doesn't exist
mkdir -p releases;

# Rename the current sparked-next directory to sparked-next-old
if [ -d "sparked-next" ]; then
  mv sparked-next-old sparked-next-older;
fi

# Copy .env from sparked-next-old to the new sparked-next
if [ -d "sparked-next-old" ]; then
  cp sparked-next-older/.env sparked-next/.env;
fi

# Move into the new directory and run yarn
cd sparked-next;
yarn;
yarn build;

# Move sparked-next-old to the releases directory
if [ -d "../sparked-next-old" ]; then
  DATE=$(date +%Y%m%d%H%M);
  mv ../sparked-next-old ../releases/sparked-next-old-$DATE;
fi

# Run the application
forever start -c "yarn start" ./;