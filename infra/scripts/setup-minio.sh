#!/bin/bash

# Configuration
MINIO_ENDPOINT="http://postgres:9000" # Using 'postgres' as a placeholder or host IP, but usually it's 'minio' in docker network.
# Since we run from host, we use localhost:9000
MINIO_URL="http://localhost:9000"
MINIO_ROOT_USER="minioadmin"
MINIO_ROOT_PASSWORD="minioadmin123"
BUCKET_NAME="smarttani-media"

echo "⏳ Waiting for MinIO to be ready..."
# Simple wait loop could be here, but we assume container is already started by user or by us previously.

# Use docker to run mc (MinIO Client) to avoid requiring local installation
docker run --rm --network host --entrypoint /bin/sh minio/mc -c "
  mc alias set local $MINIO_URL $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD;
  
  echo '📦 Creating bucket: $BUCKET_NAME...';
  mc mb --ignore-existing local/$BUCKET_NAME;

  echo '🔐 Setting public-read policy for /products and /proposals...';
  # 'download' policy allows public access to objects
  mc anonymous set download local/$BUCKET_NAME/products;
  mc anonymous set download local/$BUCKET_NAME/proposals;

  echo '🔒 Ensuring /users remains private...';
  mc anonymous set private local/$BUCKET_NAME/users;

  echo '✅ MinIO setup completed successfully!';
  mc ls local/$BUCKET_NAME;
"
