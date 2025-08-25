#!/bin/bash

echo "Stopping all containers..."
docker compose down -v

echo "Starting MySQL container..."
docker compose up -d db

echo "Waiting for MySQL to be ready..."
sleep 10

echo "Generating Prisma client..."
npx prisma generate

echo "Pushing schema to database..."
npx prisma db push

echo "Done! Now run 'npm run dev' to start the server."
