import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Список поддерживаемых локалей
  locales: ['ru', 'tr', 'en'],

  // Локаль по умолчанию
  defaultLocale: 'tr',

  // Автоматическое определение локали
  localeDetection: true
});

export const config = {
  // Соответствует локализованным путям, исключая статические файлы и API  
  matcher: [
    // Совпадение со всеми путями, кроме:
    // - API routes (api/*)
    // - статических файлов (_next/static/*) 
    // - файлы изображений (*.ico, *.png, etc.)
    '/((?!_next|api|.*\\..*|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ]
};
