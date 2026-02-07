#!/bin/bash
# filepath: start-mongo.sh

echo "Starting MongoDB..."

# Check if MongoDB is already running in Docker
if docker ps | grep -q mongodb; then
    echo "MongoDB is already running"
    exit 0
fi

# Check if container exists but is stopped
if docker ps -a | grep -q mongodb; then
    echo "Starting existing MongoDB container..."
    docker start mongodb
else
    echo "Creating new MongoDB container..."
    docker run -d \
      --name mongodb \
      -p 27017:27017 \
      -v mongodb_data:/data/db \
      mongo:latest
fi

echo "MongoDB started successfully!"
echo "Connection string: mongodb://localhost:27017/wall"