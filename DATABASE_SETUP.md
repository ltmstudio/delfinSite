# Настройка MySQL базы данных для проекта Delfin

## Предварительные требования

1. **Установите MySQL Server** на вашем компьютере:
   - Windows: [MySQL Installer](https://dev.mysql.com/downloads/installer/)
   - macOS: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Создайте базу данных**:
   ```sql
   CREATE DATABASE delfin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## Настройка проекта

### 1. Создайте файл .env

Скопируйте `env.example` в `.env` и заполните переменные:

```bash
cp env.example .env
```

Отредактируйте `.env` файл:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/delfin_db"

# Email Configuration (уже настроено)
SMTP_USER=your_email@mail.ru
SMTP_PASS=your_app_password

# Next.js
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 2. Генерация Prisma клиента

```bash
npm run db:generate
```

### 3. Создание таблиц в базе данных

```bash
npm run db:push
```

### 4. Заполнение базы данных начальными данными

```bash
npm run db:seed
```

## Доступные команды

- `npm run db:generate` - Генерирует Prisma клиент
- `npm run db:push` - Создает/обновляет таблицы в БД
- `npm run db:migrate` - Создает миграции (для продакшена)
- `npm run db:seed` - Заполняет БД начальными данными
- `npm run db:reset` - Полный сброс БД с пересозданием

## Структура базы данных

### Таблица `contacts`
- `id` - Уникальный идентификатор
- `name` - Имя клиента
- `company` - Компания (опционально)
- `email` - Email адрес
- `phone` - Телефон
- `message` - Сообщение (опционально)
- `locale` - Язык (ru/tr/en)
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

### Таблица `products`
- `id` - Уникальный идентификатор
- `name` - Название продукта
- `description` - Описание
- `category` - Категория
- `price` - Цена
- `imageUrl` - URL изображения
- `isActive` - Активен ли продукт
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

### Таблица `categories`
- `id` - Уникальный идентификатор
- `name` - Название категории
- `description` - Описание
- `imageUrl` - URL изображения
- `isActive` - Активна ли категория
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

## Использование в коде

```typescript
import { prisma } from '@/lib/database';

// Получить все контакты
const contacts = await prisma.contact.findMany();

// Создать новый контакт
const contact = await prisma.contact.create({
  data: {
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+7 999 123 45 67'
  }
});

// Получить продукты по категории
const products = await prisma.product.findMany({
  where: { category: 'Смесители' }
});
```

## Проверка работы

После настройки:

1. Запустите проект: `npm run dev`
2. Отправьте тестовую форму на сайте
3. Проверьте, что данные сохранились в БД:

```sql
SELECT * FROM contacts;
SELECT * FROM products;
SELECT * FROM categories;
```

## Решение проблем

### Ошибка подключения к БД
- Проверьте, что MySQL сервер запущен
- Убедитесь, что данные в `.env` файле корректны
- Проверьте, что база данных `delfin_db` существует

### Ошибки Prisma
- Выполните `npm run db:generate`
- Проверьте, что все зависимости установлены: `npm install`

### Проблемы с миграциями
- Используйте `npm run db:push` для разработки
- Для продакшена используйте `npm run db:migrate`
