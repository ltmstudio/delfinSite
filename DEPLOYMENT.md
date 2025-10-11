# 🚀 Инструкция по развертыванию сайта Delfin

## ⚠️ Важная информация о статических файлах

В режиме `output: 'standalone'` Next.js **НЕ копирует автоматически** папку `public/` и статические файлы. Это включает:
- Изображения
- Видео 
- PDF файлы
- Другие статические ресурсы

## 📦 Вариант 1: Сборка со standalone режимом (рекомендуется для Docker)

### Шаг 1: Сборка проекта
```bash
npm run build:standalone
```

Этот скрипт:
1. Создаст standalone сборку
2. Автоматически скопирует папку `public/` в `.next/standalone/public/`

### Шаг 2: Копирование файлов на сервер
Скопируйте следующие файлы/папки на сервер:
```bash
.next/standalone/     # Основная сборка
.next/static/         # Статические ассеты Next.js
public/              # Статические файлы (изображения, видео, PDF)
```

### Шаг 3: Структура на сервере
```
/var/www/delfin/
├── .next/
│   ├── standalone/
│   │   ├── server.js
│   │   ├── public/          # ← Важно!
│   │   └── ...
│   └── static/
└── public/                   # ← Важно!
```

### Шаг 4: Запуск на сервере
```bash
cd /var/www/delfin/.next/standalone
NODE_ENV=production node server.js
```

## 📦 Вариант 2: Обычная сборка (проще для обычных серверов)

Если вам не нужен standalone режим, можно его отключить:

### Шаг 1: Удалить `output: 'standalone'` из next.config.ts
```typescript
const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    // ...
  },
  // output: 'standalone', // ← Удалить эту строку
  webpack: (config) => {
    // ...
  },
};
```

### Шаг 2: Обычная сборка
```bash
npm run build
npm start
```

В этом случае папка `public/` будет работать автоматически!

## 🔧 Использование с PM2

### Вариант 1 (standalone):
```bash
pm2 start .next/standalone/server.js --name delfin-site
```

### Вариант 2 (обычная сборка):
```bash
pm2 start npm --name delfin-site -- start
```

## 🌐 Настройка Nginx (опционально)

Если используете Nginx, настройте правильную отдачу статических файлов:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /_next/static {
        alias /var/www/delfin/.next/static;
        expires 1y;
        access_log off;
    }

    location /static {
        alias /var/www/delfin/public;
        expires 1y;
        access_log off;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ✅ Проверка после развертывания

1. Откройте сайт в браузере
2. Проверьте в DevTools (F12) → Network:
   - Изображения загружаются (статус 200)
   - Видео загружается (статус 200)
   - Нет ошибок 404

3. Проверьте файлы:
   ```bash
   # На сервере проверьте, что файлы существуют:
   ls -la /var/www/delfin/public/showroom_video.mp4
   ls -la /var/www/delfin/public/products/
   ls -la /var/www/delfin/public/hero_banners/
   ```

## 🐛 Решение проблем

### Видео не отображается
1. Проверьте права доступа к файлам:
   ```bash
   chmod -R 755 /var/www/delfin/public
   ```

2. Проверьте MIME-типы в nginx:
   ```nginx
   include /etc/nginx/mime.types;
   ```

3. Проверьте размер файла (не слишком ли большой):
   ```bash
   ls -lh /var/www/delfin/public/showroom_video.mp4
   ```

### Изображения не отображаются
1. Убедитесь, что папка `public/` скопирована
2. Проверьте консоль браузера на ошибки 404
3. Убедитесь, что пути начинаются с `/` (например, `/products/...`)

## 📝 Автоматизация развертывания

Создайте bash-скрипт `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying Delfin website..."

# Сборка
npm run build:standalone

# Копирование на сервер (замените на ваши данные)
rsync -avz --delete .next/ user@your-server:/var/www/delfin/.next/
rsync -avz --delete public/ user@your-server:/var/www/delfin/public/

# Перезапуск на сервере
ssh user@your-server "pm2 restart delfin-site"

echo "✅ Deployment complete!"
```

Сделайте скрипт исполняемым:
```bash
chmod +x deploy.sh
```

Используйте:
```bash
./deploy.sh
```

