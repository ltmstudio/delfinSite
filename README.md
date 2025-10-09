Это проект [Next.js](https://nextjs.org) для сайта del'fin - компания, специализирующаяся на морском оборудовании и аксессуарах.

## Особенности

- 🌍 **Мультиязычность** - поддержка русского, английского и турецкого языков
- 🎨 **Современный дизайн** - адаптивный интерфейс с Bootstrap
- 📧 **Контактная форма** - автоматическая отправка заявок на email
- 🚀 **Оптимизация** - использование Next.js 15 с турбо режимом
- 🔍 **SEO оптимизация** - полная настройка для поисковых систем
  - Meta теги (Title, Description, Keywords)
  - Open Graph для социальных сетей
  - Twitter Cards
  - Структурированные данные (JSON-LD)
  - Автоматический Sitemap.xml
  - Robots.txt
  - Canonical URLs и Alternate Links

## Контактная форма

Сайт включает в себя полностью функциональную контактную форму, которая:
- Отправляет заявки на email `k_beshimova@mail.ru`
- Включает валидацию полей
- Показывает статус отправки
- Поддерживает все типы обращения

Для настройки email отправки см. [EMAIL_SETUP.md](./EMAIL_SETUP.md).

## SEO оптимизация

Сайт полностью оптимизирован для поисковых систем (Google, Yandex, Bing) и социальных сетей.

### ⚡ Быстрый старт:
См. [QUICK_SEO_SETUP.md](./QUICK_SEO_SETUP.md) - настройка за 5 минут

### 📚 Полная документация:
См. [SEO_GUIDE.md](./SEO_GUIDE.md) - детальное руководство по SEO

### Что включено:

✅ **Meta теги** - оптимизированные title, description, keywords для каждого языка  
✅ **Open Graph** - красивые превью в Facebook, VK, LinkedIn  
✅ **Twitter Cards** - оптимизация для Twitter  
✅ **Structured Data** - Schema.org разметка (Organization, WebSite, Product, BreadcrumbList)  
✅ **Sitemap.xml** - автоматическая генерация `/sitemap.xml`  
✅ **Robots.txt** - управление индексацией `/robots.txt`  
✅ **Canonical URLs** - предотвращение дублирования контента  
✅ **Alternate Links** - поддержка мультиязычности (hreflang)  

### Настройка:

1. Создайте `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=https://ваш-домен.com
```

2. После деплоя зарегистрируйте сайт:
   - [Google Search Console](https://search.google.com/search-console)
   - [Yandex Webmaster](https://webmaster.yandex.ru)

3. Отправьте sitemap: `https://ваш-домен.com/sitemap.xml`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
