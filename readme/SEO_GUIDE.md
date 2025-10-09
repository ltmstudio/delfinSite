# SEO Руководство для Delfin

## Реализованные SEO улучшения

### ✅ 1. Meta теги

Все meta теги динамически генерируются на основе локали и находятся в файлах локализации:
- `messages/ru.json`
- `messages/en.json`
- `messages/tr.json`

**Реализованные теги:**
- Title (оптимизированный для каждого языка)
- Description (уникальное описание с ключевыми словами)
- Keywords (релевантные ключевые слова)
- Author, Creator, Publisher
- Copyright

### ✅ 2. Open Graph теги

Полная поддержка Open Graph для красивого отображения в социальных сетях:
- `og:title` - заголовок
- `og:description` - описание
- `og:type` - тип контента (website)
- `og:url` - канонический URL
- `og:site_name` - название сайта
- `og:image` - изображение для превью
- `og:locale` - локаль страницы

### ✅ 3. Twitter Card теги

Оптимизация для Twitter:
- `twitter:card` - тип карточки (summary_large_image)
- `twitter:title` - заголовок
- `twitter:description` - описание
- `twitter:image` - изображение

### ✅ 4. Canonical URLs и Alternate Links

**Canonical URLs:**
- Каждая страница имеет канонический URL
- Предотвращает дублирование контента

**Alternate Links:**
- Автоматические ссылки на альтернативные языковые версии
- Поддержка `hreflang` для правильной индексации мультиязычного контента

### ✅ 5. Robots Meta теги

Настройки для поисковых роботов:
- `index: true` - разрешена индексация
- `follow: true` - разрешено следовать по ссылкам
- Специальные настройки для Googlebot
- Максимальные превью для изображений и видео

### ✅ 6. Структурированные данные (JSON-LD)

Реализованы Schema.org разметки:

**Organization Schema:**
- Информация о компании
- Контактные данные
- Логотип
- Поддержка нескольких языков

**WebSite Schema:**
- URL сайта
- Поддержка поиска (SearchAction)
- Указание языка

**Product Schema:**
- Информация о продуктах
- Бренд и производитель
- Доступность товаров
- Валюта для каждой локали

**BreadcrumbList Schema:**
- Хлебные крошки для навигации
- Улучшает отображение в поисковой выдаче

### ✅ 7. Sitemap.xml

**Динамический sitemap** (`/sitemap.xml`):
- Автоматическая генерация для всех локалей
- Указание приоритетов страниц
- Частота обновления
- Alternate языковые ссылки
- Дата последнего изменения

**Доступен по адресу:** `https://your-domain.com/sitemap.xml`

### ✅ 8. Robots.txt

**Динамический robots.txt** (`/robots.txt`):
- Правила для всех поисковых ботов
- Специальные настройки для Googlebot и Yandex
- Указание на sitemap.xml
- Блокировка служебных директорий (/api/, /_next/)

**Доступен по адресу:** `https://your-domain.com/robots.txt`

## Настройка

### 1. Базовый URL

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_BASE_URL=https://your-actual-domain.com
```

**Важно:** Замените на ваш реальный домен в продакшене!

### 2. Верификация поисковых систем

В файле `src/app/[locale]/layout.tsx` раскомментируйте и добавьте коды верификации:

```typescript
verification: {
  google: 'your-google-verification-code',
  yandex: 'your-yandex-verification-code',
},
```

#### Как получить коды верификации:

**Google Search Console:**
1. Перейдите на https://search.google.com/search-console
2. Добавьте свой сайт
3. Выберите метод верификации "HTML-тег"
4. Скопируйте код из атрибута `content`

**Yandex Webmaster:**
1. Перейдите на https://webmaster.yandex.ru
2. Добавьте сайт
3. Выберите метод верификации "Meta-тег"
4. Скопируйте код

### 3. Социальные сети

В файле `src/components/StructuredData.tsx` добавьте ссылки на социальные сети:

```typescript
"sameAs": [
  "https://www.facebook.com/your-page",
  "https://www.instagram.com/your-account",
  "https://www.linkedin.com/company/your-company"
]
```

### 4. Изображение для Open Graph

Рекомендуемые параметры изображения:
- Размер: 1200x630 пикселей
- Формат: PNG или JPG
- Размер файла: до 8 МБ
- Путь: `/public/og-image.png`

Обновите путь в `layout.tsx`:
```typescript
images: [
  {
    url: `${baseUrl}/og-image.png`,
    width: 1200,
    height: 630,
    alt: 'Delfin Premium Bathroom Fixtures',
  },
],
```

## Тестирование SEO

### 1. Meta теги и Open Graph

**Facebook Sharing Debugger:**
- https://developers.facebook.com/tools/debug/

**Twitter Card Validator:**
- https://cards-dev.twitter.com/validator

**LinkedIn Post Inspector:**
- https://www.linkedin.com/post-inspector/

### 2. Структурированные данные

**Google Rich Results Test:**
- https://search.google.com/test/rich-results

**Schema.org Validator:**
- https://validator.schema.org/

### 3. Общая SEO проверка

**Google Lighthouse:**
```bash
npm install -g lighthouse
lighthouse https://your-domain.com
```

**PageSpeed Insights:**
- https://pagespeed.web.dev/

### 4. Sitemap и Robots

Проверьте доступность:
- `https://your-domain.com/sitemap.xml`
- `https://your-domain.com/robots.txt`

## Отправка в поисковые системы

### Google Search Console

1. Перейдите: https://search.google.com/search-console
2. Добавьте сайт
3. Подтвердите владение (используйте код верификации)
4. Отправьте sitemap: `https://your-domain.com/sitemap.xml`

### Yandex Webmaster

1. Перейдите: https://webmaster.yandex.ru
2. Добавьте сайт
3. Подтвердите владение
4. Добавьте sitemap в разделе "Индексирование"

### Bing Webmaster Tools

1. Перейдите: https://www.bing.com/webmasters
2. Добавьте сайт
3. Отправьте sitemap

## Мониторинг

### Что отслеживать:

1. **Позиции в поиске** - Google Search Console, Yandex Webmaster
2. **Трафик** - Google Analytics, Yandex Metrica
3. **Ошибки индексации** - проверяйте в Search Console
4. **Скорость загрузки** - PageSpeed Insights
5. **Мобильная версия** - Mobile-Friendly Test

## Рекомендации по улучшению

### 1. Контент

- ✅ Добавьте уникальные описания для каждой категории товаров
- ✅ Создайте страницу блога с полезными статьями
- ✅ Добавьте FAQ секцию
- ✅ Используйте heading теги (H1, H2, H3) правильно

### 2. Производительность

- ✅ Оптимизируйте изображения (используйте Next.js Image)
- ✅ Включите кэширование
- ✅ Минифицируйте CSS и JS (Next.js делает это автоматически)
- ✅ Используйте CDN для статических ресурсов

### 3. Мобильная оптимизация

- ✅ Проверьте отзывчивость на всех устройствах
- ✅ Убедитесь, что текст читается без зума
- ✅ Кнопки достаточно большие для нажатия
- ✅ Быстрая загрузка на мобильных устройствах

### 4. Локальное SEO (если применимо)

- ✅ Добавьте LocalBusiness Schema
- ✅ Укажите адрес и контакты
- ✅ Зарегистрируйтесь в Google My Business
- ✅ Добавьте карту с местоположением

### 5. Ссылки

- ✅ Получайте обратные ссылки с качественных сайтов
- ✅ Регистрируйтесь в отраслевых каталогах
- ✅ Социальные сигналы (активность в соцсетях)

## Обновление SEO данных

### Изменение мета-данных

Редактируйте файлы локализации:
- `messages/ru.json`
- `messages/en.json`  
- `messages/tr.json`

Секция `meta` содержит все SEO данные.

### Добавление новых страниц в Sitemap

Отредактируйте `src/app/sitemap.ts`:
```typescript
const additionalPages: MetadataRoute.Sitemap = [
  {
    url: `${baseUrl}/ru/catalog`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
];
```

## Checklist перед запуском

- [ ] Установлен правильный `NEXT_PUBLIC_BASE_URL` в `.env.local`
- [ ] Добавлены коды верификации Google и Yandex
- [ ] Добавлены ссылки на социальные сети
- [ ] Создано качественное OG изображение (1200x630)
- [ ] Проверены все meta теги в каждой локали
- [ ] Протестированы структурированные данные
- [ ] Проверена доступность sitemap.xml и robots.txt
- [ ] Сайт добавлен в Google Search Console
- [ ] Сайт добавлен в Yandex Webmaster
- [ ] Отправлен sitemap в поисковые системы
- [ ] Настроена аналитика (Google Analytics, Yandex Metrica)

## Полезные ссылки

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

---

**Создано:** 2025
**Последнее обновление:** 2025

