interface ThemeConfig {
  theme: 'light' | 'dark';
  backgroundColor?: string;
}

/**
 * Автоматически управляет темой навбара на основе фонового цвета секций
 */
export class NavbarThemeManager {
  private sections: ThemeConfig[] = [];
  private navbar: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Находим навбар
    this.navbar = document.querySelector('.navbar');
    
    if (!this.navbar) {
      console.warn('Navbar not found');
      return;
    }

    // Добавляем слушатель прокрутки
    this.setupScrollListener();
    
    // Настраиваем секции
    this.setupSections();
    
    // Устанавливаем начальную тему
    this.updateTheme();
  }

  private setupScrollListener() {
    let ticking = false;
    
    const updateThemeOnScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateTheme();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateThemeOnScroll, { passive: true });
  }

  private setupSections() {
    // Определяем темы для разных секций
    const sectionSelectors = [
      // Hero - темный фон (создаст светлый текст)
      { selector: '#hero', theme: 'dark' },
      
      // Categories - светлый фон (создаст темный текст)
      { selector: '#categories', theme: 'light' },
      
      // About - темный фон (создаст светлый текст)
      { selector: '#about', theme: 'dark' },
      
      // Products - светлый фон (создаст темный текст)
      { selector: '#products', theme: 'light' },
      
      // Footer - темный фон (создаст светлый текст)
      { selector: '#footer', theme: 'dark' }
    ];

    this.sections = sectionSelectors.map(section => ({
      theme: section.theme as 'light' | 'dark'
    }));
  }

  private updateTheme() {
    if (!this.navbar) return;

    const scrollPosition = window.scrollY + 100; // Немного смещения
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Определяем текущую секцию на основе прокрутки
    let currentTheme: 'light' | 'dark' = 'dark'; // По умолчанию темная тема

    // Проверяем каждую секцию
    const heroElement = document.querySelector('#hero');
    const categoriesElement = document.querySelector('#categories');
    const aboutElement = document.querySelector('#about');
    const productsElement = document.querySelector('#products');
    const footerElement = document.querySelector('#footer');

    if (heroElement) {
      const heroRect = heroElement.getBoundingClientRect();
      if (heroRect.top <= 0 && heroRect.bottom > 0) {
        currentTheme = 'dark';
      }
    }

    if (categoriesElement) {
      const categoriesRect = categoriesElement.getBoundingClientRect();
      if (categoriesRect.top <= 0 && categoriesRect.bottom > 0) {
        currentTheme = 'light';
      }
    }

    if (aboutElement) {
      const aboutRect = aboutElement.getBoundingClientRect();
      if (aboutRect.top <= 0 && aboutRect.bottom > 0) {
        currentTheme = 'dark';
      }
    }

    if (productsElement) {
      const productsRect = productsElement.getBoundingClientRect();
      if (productsRect.top <= 0 && productsRect.bottom > 0) {
        currentTheme = 'light';
      }
    }

    if (footerElement) {
      const footerRect = footerElement.getBoundingClientRect();
      if (footerRect.top <= 0) {
        currentTheme = 'dark';
      }
    }

    // Применяем тему
    this.applyTheme(currentTheme);
  }

  private applyTheme(theme: 'light' | 'dark') {
    if (!this.navbar) return;

    // Удаляем предыдущие классы тем
    this.navbar.classList.remove('theme-light', 'theme-dark');
    
    // Добавляем новый класс темы
    this.navbar.classList.add(`theme-${theme}`);
  }

  // Публичные методы для ручного управления
  public setTheme(theme: 'light' | 'dark') {
    this.applyTheme(theme);
  }

  public destroy() {
    window.removeEventListener('scroll', this.updateTheme);
    this.navbar = null;
  }
}

// Экспорт для использования в компонентах
export const initNavbarTheme = () => {
  // Инициализируем только в браузере
  if (typeof window !== 'undefined') {
    return new NavbarThemeManager();
  }
  return null;
};
