#!/bin/bash
# This scripts runs on the server to deploy the application, this is saved here for
#tracking and reference purposes If updated here make sure it reflects on the
# server our deployment directory is ~/htdocs/sparked-next Move the current
# sparked-next directory to sparked-next-old if it exists

echo $(pwd);

if [ -d "htdocs/sparked-next" ]; then
    mv htdocs/sparked-next htdocs/sparked-next-old || echo "Failed to move htdocs/sparked-next directory";
fi

cd htdocs
mkdir -p sparked-next
cd sparked-next

# unarchize the file
if [ -f "../archive.tar.gz" ]; then
    tar -xvf ../archive.tar.gz
else
    echo "archive.tar.gz file does not exist";
fi
# Check if the sparked-next directory exists
# Create the releases directory if it doesn't exist
mkdir -p ../releases;

# Copy .env from sparked-next-old to the new sparked-next
if [ -f "../sparked-next-old/.env" ]; then
    cp ../sparked-next-old/.env  ./;
fi
# Run yarn and build the project

cp ../.next ./
# Run the application
forever start -c "yarn start" ./;

# Move sparked-next-old to the releases directory
DATE=$(date +%Y%m%d%H%M);
mv "../sparked-next-old" "../releases/sparked-next-old-$DATE";