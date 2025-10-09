/**
 * Утилиты для работы со скроллом
 */

/**
 * Прокручивает элемент на указанное расстояние
 */
export const smoothScroll = (
  element: HTMLElement | null,
  distance: number,
  behavior: ScrollBehavior = 'smooth'
): void => {
  if (!element) return;
  
  element.scrollBy({
    left: distance,
    behavior
  });
};

/**
 * Проверяет, можно ли скроллить в указанном направлении
 */
export const canScroll = (element: HTMLElement | null): { left: boolean; right: boolean } => {
  if (!element) return { left: false, right: false };
  
  const { scrollLeft, scrollWidth, clientWidth } = element;
  
  return {
    left: scrollLeft > 0,
    right: scrollLeft < scrollWidth - clientWidth - 1
  };
};

/**
 * Создает обработчик для отслеживания возможности скролла
 */
export const createScrollWatcher = (
  element: HTMLElement | null,
  callback: (canScroll: { left: boolean; right: boolean }) => void
): (() => void) => {
  if (!element) return () => {};
  
  const handleScroll = () => {
    callback(canScroll(element));
  };
  
  element.addEventListener('scroll', handleScroll);
  
  // Первичная проверка
  handleScroll();
  
  // Возвращаем функцию очистки
  return () => element.removeEventListener('scroll', handleScroll);
};

