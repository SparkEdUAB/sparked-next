#!/bin/bash

# This scripts runs on the server to deploy the application, this is saved here for tracking and reference purposes
# If updated here make sure it reflects on the server

cd htdocs/
# Create the releases directory if it doesn't exist
mkdir -p releases;

# Rename the current sparked-next directory to sparked-next-old
if [ -d "sparked-next" ]; then
  mv sparked-next sparked-next-old;
fi

# Extract the new archive.tar.gz into sparked-next
mkdir sparked-next;
tar -xzvf archive.tar.gz -C sparked-next;

# Copy .env from sparked-next-old to the new sparked-next
if [ -d "sparked-next-old" ]; then
  cp sparked-next-old/.env sparked-next/.env;
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

rm ../archive.tar.gz # Remove the archive.tar.gz file

# Run the application
forever start -c "yarn start" ./;