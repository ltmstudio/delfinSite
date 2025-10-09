import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://delfin-sanitary.com';
  const locales = ['ru', 'en', 'tr'];
  const lastModified = new Date();

  // Генерируем URL для всех локалей
  const routes = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        locales.map(l => [l, `${baseUrl}/${l}`])
      ),
    },
  }));

  // Дополнительные статические страницы можно добавить здесь
  // Например, страницы категорий, контакты и т.д.
  const additionalPages: MetadataRoute.Sitemap = [
    // {
    //   url: `${baseUrl}/ru/catalog`,
    //   lastModified,
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.8,
    // },
  ];

  return [...routes, ...additionalPages];
}

