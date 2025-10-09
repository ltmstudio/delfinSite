import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Список поддерживаемых локалей
  locales: ['ru', 'tr', 'en'],

  // Локаль по умолчанию
  defaultLocale: 'ru',

  // Автоматическое определение локали
  localeDetection: true
});

export const config = {
  // Соответствует только локализованным путям (включая корневую страницу)
  matcher: ['/', '/(ru|en|tr)/:path*']
};
