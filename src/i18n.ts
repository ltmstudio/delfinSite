export function getLocale() {
  return 'ru';
}

export function getLocaleMessage(locale: string) {
  return import(`../messages/${locale}.json`);
}
