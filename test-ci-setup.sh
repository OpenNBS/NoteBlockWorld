#!/bin/bash

# Test script to simulate CI environment locally
# This script sets up the same environment variables as CI and runs tests

echo "Setting up CI-like environment for testing..."

# Set test environment variables (same as CI)
export NODE_ENV=test
export GITHUB_CLIENT_ID=test_client_id
export GITHUB_CLIENT_SECRET=test_client_secret
export GOOGLE_CLIENT_ID=test_client_id
export GOOGLE_CLIENT_SECRET=test_client_secret
export DISCORD_CLIENT_ID=test_client_id
export DISCORD_CLIENT_SECRET=test_client_secret
export MAGIC_LINK_SECRET=test_magic_link_secret
export COOKIE_EXPIRES_IN=604800
export JWT_SECRET=test_jwt_secret
export JWT_EXPIRES_IN=1h
export JWT_REFRESH_SECRET=test_jwt_refresh_secret
export JWT_REFRESH_EXPIRES_IN=7d
export MONGO_URL=mongodb://localhost:27017/test
export SERVER_URL=http://localhost:4000
export FRONTEND_URL=http://localhost:3000
export APP_DOMAIN=localhost
export RECAPTCHA_KEY=disabled
export S3_ENDPOINT=http://localhost:9000
export S3_BUCKET_SONGS=test-songs
export S3_BUCKET_THUMBS=test-thumbs
export S3_KEY=test_key
export S3_SECRET=test_secret
export S3_REGION=us-east-1
export WHITELISTED_USERS=""
export DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/test
export MAIL_TRANSPORT=smtp://test:test@localhost:1025
export MAIL_FROM="Test <test@example.com>"
export THUMBNAIL_URL=localhost:9000

# Create test environment file
cat > apps/backend/.env.test << EOF
NODE_ENV=test
GITHUB_CLIENT_ID=test_client_id
GITHUB_CLIENT_SECRET=test_client_secret
GOOGLE_CLIENT_ID=test_client_id
GOOGLE_CLIENT_SECRET=test_client_secret
DISCORD_CLIENT_ID=test_client_id
DISCORD_CLIENT_SECRET=test_client_secret
MAGIC_LINK_SECRET=test_magic_link_secret
COOKIE_EXPIRES_IN=604800
JWT_SECRET=test_jwt_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=test_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
MONGO_URL=mongodb://localhost:27017/test
SERVER_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
APP_DOMAIN=localhost
RECAPTCHA_KEY=disabled
S3_ENDPOINT=http://localhost:9000
S3_BUCKET_SONGS=test-songs
S3_BUCKET_THUMBS=test-thumbs
S3_KEY=test_key
S3_SECRET=test_secret
S3_REGION=us-east-1
WHITELISTED_USERS=
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/test
MAIL_TRANSPORT=smtp://test:test@localhost:1025
MAIL_FROM=Test <test@example.com>
EOF

echo "Environment variables set. Running tests..."

# Run tests
bun test

echo "Test completed. Cleaning up..."
rm -f apps/backend/.env.test
