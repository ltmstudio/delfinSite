/**
 * Утилиты для кастомного курсора
 */

export interface CursorPosition {
  x: number;
  y: number;
}

/**
 * Отслеживает позицию курсора
 */
export const createCursorTracker = (
  callback: (position: CursorPosition) => void
): (() => void) => {
  const handleMouseMove = (e: MouseEvent) => {
    callback({ x: e.clientX, y: e.clientY });
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  
  return () => window.removeEventListener('mousemove', handleMouseMove);
};

/**
 * Отслеживает hover на интерактивных элементах
 */
export const createHoverTracker = (
  onEnter: () => void,
  onLeave: () => void,
  selector: string = 'a, button, input, select, textarea, [role="button"]'
): (() => void) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((el) => {
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
  });
  
  return () => {
    elements.forEach((el) => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    });
  };
};

