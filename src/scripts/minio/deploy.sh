#!/bin/bash



#!/bin/bash

echo "Setting up the environment... "

# Define paths
ENV_FILE=".env"
MINIO_CONFIG="/etc/default/minio"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "$ENV_FILE not found! Please ensure the .env file exists in the current directory."
  exit 1
fi

# Check if /etc/default/minio exists, if not, create it
if [ ! -f "$MINIO_CONFIG" ]; then
  echo "$MINIO_CONFIG does not exist. Creating the file..."
  sudo touch "$MINIO_CONFIG"
fi

# Copy .env content to /etc/default/minio, overwriting the existing content
echo "Copying contents of $ENV_FILE to $MINIO_CONFIG..."
sudo cp "$ENV_FILE" "$MINIO_CONFIG"

echo "Done! Contents of $ENV_FILE have been copied to $MINIO_CONFIG."

echo "Starting deploy..."

# Define environment variables
MINIO_ACCESS_KEY="your-access-key"     # Replace with your actual access key
MINIO_SECRET_KEY="your-secret-key"     # Replace with your actual secret key
MINIO_PORT="9000"                      # Define MinIO port (default is 9000)
MINIO_DATA_PATH="/data/minio"          # Define local path to persist data

# Pull the latest MinIO Docker image
docker pull docker://minio/minio

# Run MinIO container
docker run -dt                                  \
  -p 9000:9000 -p 9001:9001                     \
  -v PATH:/mnt/data                             \
  -v /etc/default/minio:/etc/config.env         \
  -e "MINIO_CONFIG_ENV_FILE=/etc/config.env"    \
  --name "minio_local"                          \
  minio server --console-address ":9001"