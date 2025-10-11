#!/bin/bash

echo "🚀 Starting deployment of Delfin website..."

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка наличия node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Running npm install...${NC}"
    npm install
fi

# Сборка проекта
echo -e "${YELLOW}📦 Building project with standalone mode...${NC}"
npm run build:standalone

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Проверка наличия папки public в standalone
if [ -d ".next/standalone/public" ]; then
    echo -e "${GREEN}✅ Public folder copied to standalone build${NC}"
else
    echo -e "${YELLOW}⚠️  Public folder not found in standalone build. Copying manually...${NC}"
    cp -r public .next/standalone/
fi

# Проверка наличия статических файлов
echo -e "${YELLOW}🔍 Checking static files...${NC}"

STATIC_FILES=(
    "public/showroom_video.mp4"
    "public/logo-delfin.png"
    "public/catalog.pdf"
)

for file in "${STATIC_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Found: $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
    fi
done

echo ""
echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Copy .next/standalone/, .next/static/, and public/ to your server"
echo "2. On server, run: NODE_ENV=production node server.js"
echo ""
echo "Or use rsync to deploy directly:"
echo "  rsync -avz .next/ user@server:/var/www/delfin/.next/"
echo "  rsync -avz public/ user@server:/var/www/delfin/public/"
echo ""
echo -e "${GREEN}For more details, see DEPLOYMENT.md${NC}"

