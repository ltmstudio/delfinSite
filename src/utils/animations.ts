/**
 * Утилиты для анимаций
 */

/**
 * Создает Intersection Observer для запуска анимации при появлении элемента в viewport
 */
export const createScrollAnimationObserver = (
  callback: () => void,
  options: IntersectionObserverInit = { threshold: 0.5 }
): IntersectionObserver => {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    },
    options
  );
};

/**
 * Создает Intersection Observer для анимации появления элементов при скролле
 */
export const createScrollRevealObserver = (
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
): IntersectionObserver => {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const animationClass = element.dataset.animation;
          
          if (animationClass) {
            element.classList.add(animationClass);
            // Удаляем observer после анимации для оптимизации
            // observer.unobserve(element);
          }
        }
      });
    },
    options
  );
};

/**
 * Инициализирует анимации появления для элементов с классом animate-on-scroll
 */
export const initScrollAnimations = (): IntersectionObserver => {
  const observer = createScrollRevealObserver();
  
  // Находим все элементы с классом animate-on-scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
  
  return observer;
};

/**
 * Анимирует счетчик от 0 до целевого значения
 */
export const animateCounter = (
  target: number,
  step: number,
  callback: (value: number) => void,
  duration: number = 2000
): NodeJS.Timeout => {
  const steps = Math.ceil(target / step);
  const stepDuration = duration / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    const currentValue = Math.min(currentStep * step, target);
    callback(currentValue);

    if (currentValue >= target) {
      clearInterval(interval);
    }
  }, stepDuration);

  return interval;
};

