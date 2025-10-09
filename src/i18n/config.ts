import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Определяем локаль из URL или используем дефолтную
  const locale = 'ru'; // Для начала используем русский как дефолтный
  
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
