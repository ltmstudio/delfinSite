# 🗄️ Как работать с базой данных в Next.js (как в Laravel)

## 📁 Структура проекта

```
delfinSite/
├── prisma/                    # 📂 Как database/ в Laravel
│   ├── schema.prisma         # 📄 Как migrations/ (модели)
│   └── migrations/           # 📄 Миграции (автоматически)
├── src/
│   ├── lib/
│   │   └── database.ts       # 🔗 Подключение к БД (как DB::)
│   └── generated/
│       └── prisma/          # 🤖 Автогенерированный клиент
└── scripts/                  # 📜 Seeders и утилиты
```

## 🚀 Основные команды (как в Laravel)

### **Создание/обновление таблиц:**
```bash
# Laravel: php artisan migrate
npx prisma migrate dev

# Laravel: php artisan migrate:fresh --seed  
npx prisma migrate reset
```

### **Создание моделей:**
```bash
# Laravel: php artisan make:model Product -m
# В Next.js: редактируем prisma/schema.prisma
```

### **Работа с данными:**
```bash
# Laravel: php artisan tinker
npx prisma studio  # Веб-интерфейс для БД
```

## 📝 Пошаговый workflow

### **1. Изменение структуры БД:**
1. Редактируем `prisma/schema.prisma`
2. Запускаем `npx prisma migrate dev --name описание_изменения`
3. Prisma автоматически создает миграцию

### **2. Добавление данных:**
1. Создаем файл в `scripts/`
2. Запускаем `node scripts/имя_файла.js`

### **3. Использование в коде:**
```typescript
import { prisma } from '@/lib/database';

// Получить все продукты
const products = await prisma.product.findMany();

// Создать продукт
const product = await prisma.product.create({
  data: { name: 'Новый товар', price: 1000 }
});
```

## 🔄 Полный цикл разработки

### **Добавление новой таблицы:**
1. **Редактируем схему** `prisma/schema.prisma`
2. **Создаем миграцию** `npx prisma migrate dev --name add_orders`
3. **Генерируем клиент** `npx prisma generate`
4. **Используем в коде** через `prisma.order.findMany()`

### **Изменение существующей таблицы:**
1. **Редактируем схему** `prisma/schema.prisma`
2. **Создаем миграцию** `npx prisma migrate dev --name update_products`
3. **Генерируем клиент** `npx prisma generate`

### **Добавление данных:**
1. **Создаем seeder** `scripts/add-products.js`
2. **Запускаем** `node scripts/add-products.js`

## 🛠️ Полезные команды

```bash
# Просмотр БД в браузере (как phpMyAdmin)
npx prisma studio

# Сброс БД с пересозданием
npx prisma migrate reset

# Применение изменений без миграций (только для разработки)
npx prisma db push

# Генерация клиента после изменений
npx prisma generate
```

## 📊 Мониторинг и отладка

### **Просмотр миграций:**
```bash
# Laravel: php artisan migrate:status
# В Next.js: смотрим в prisma/migrations/
```

### **Откат миграций:**
```bash
# Laravel: php artisan migrate:rollback
# В Next.js: вручную через SQL или reset
```

### **Просмотр данных:**
```bash
# Laravel: php artisan tinker
# Next.js: npx prisma studio (веб-интерфейс)
```

## 🎯 Лучшие практики

1. **Всегда создавайте миграции** для изменений структуры
2. **Используйте seeders** для тестовых данных
3. **Проверяйте изменения** через `npx prisma studio`
4. **Делайте backup** перед большими изменениями
5. **Используйте типы TypeScript** для безопасности
