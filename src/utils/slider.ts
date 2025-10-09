/**
 * Утилиты для слайдеров и каруселей
 */

/**
 * Автоматическая смена слайдов
 */
export const createAutoSlider = (
  totalSlides: number,
  callback: (index: number) => void,
  interval: number = 5000
): NodeJS.Timeout => {
  let currentIndex = 0;

  return setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    callback(currentIndex);
  }, interval);
};

/**
 * Навигация по слайдам
 */
export const sliderNavigation = {
  next: (current: number, total: number): number => {
    return (current + 1) % total;
  },
  
  prev: (current: number, total: number): number => {
    return (current - 1 + total) % total;
  },
  
  goTo: (index: number, total: number): number => {
    return Math.max(0, Math.min(index, total - 1));
  }
};

/**
 * Создает массив слайдов с дублированием для бесшовной прокрутки
 */
export const createInfiniteSlides = <T>(items: T[], itemsPerSlide: number): T[] => {
  return [...items, ...items.slice(0, itemsPerSlide)];
};

/**
 * Разбивает массив элементов на группы для слайдов
 */
export const chunkItems = <T>(items: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
};

