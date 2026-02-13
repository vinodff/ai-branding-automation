
#!/bin/bash
set -e

echo ">>> [BrandCraft Deploy] Starting Deployment Sequence..."

# 1. Environment Check
if [ ! -f .env ]; then
    echo "ERROR: .env file not found. Create it before deploying."
    exit 1
fi

# 2. Build Docker Images
echo ">>> [BrandCraft Deploy] Building Docker images..."
docker-compose build --pull

# 3. Zero-Downtime Migration (Placeholder for DB)
echo ">>> [BrandCraft Deploy] Running pre-deployment checks..."

# 4. Stop and Restart
echo ">>> [BrandCraft Deploy] Launching containers..."
docker-compose up -d

# 5. Verify Health
echo ">>> [BrandCraft Deploy] Verifying health..."
sleep 5
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)

if [ "$STATUS_CODE" -eq 200 ]; then
    echo "SUCCESS: BrandCraft is live and healthy."
else
    echo "FAILURE: Health check failed with status $STATUS_CODE. Check logs."
    docker-compose logs --tail=50
    exit 1
fi

echo ">>> [BrandCraft Deploy] Deployment Complete."
