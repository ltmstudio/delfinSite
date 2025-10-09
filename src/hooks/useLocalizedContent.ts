'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { productsTranslations } from '@/data/productsTranslations';
import { footerTranslations } from '@/data/footerTranslations';

// Типы для локализации
type Locale = 'ru' | 'tr' | 'en';

// Переводы для Header компонента
const headerTranslations: Record<Locale, any> = {
  ru: {
    logo: "del'fin",
    nav: {
      delphin: "Дельфин",
      products: "Продукция",
      about: "О нас",
      contact: "Контакты"
    },
    contactButton: "Связаться"
  },
  tr: {
    logo: "del'fin",
    nav: {
      delphin: "Delphin",
      products: "Ürünler",
      about: "Hakkımızda",
      contact: "İletişim"
    },
    contactButton: "Ulaşmak"
  },
  en: {
    logo: "del'fin",
    nav: {
      delphin: "Delphin",
      products: "Products",
      about: "About",
      contact: "Contact"
    },
    contactButton: "Contact"
  }
};

// Переводы для Hero компонента
const heroTranslations: Record<Locale, any> = {
  ru: {
    slides: [
      {
        title: 'Ванна, унитаз, смесители и раковины – сочетание эстетики и долговечности',
        description: 'Современные дизайны, разработанные в Турции. Производство, соответствующее европейским стандартам, экологически чистые материалы и гарантия долговечного использования.'
      },
      {
        title: 'Современные и надёжные турецкие смесители',
        description: 'Эстетичный дизайн, долговечность и технологии экономии воды'
      },
      {
        title: 'Надёжные турецкие бойлеры',
        description: 'Энергоэффективность, безопасность и комфорт в каждый день'
      }
    ],
    downloadCatalog: 'Скачать каталог'
  },
  tr: {
    slides: [
      {
        title: 'Türk Musluk, Lavabo ve Su Isıtıcılarında Premium Çözümler',
        description: 'Yüksek kaliteli Türk üretimi ürünlerimizle banyonuzda modern tasarım ve maksimum konfor. 7/24 destek ve garantili hizmet'
      },
      {
        title: 'Modern ve Dayanıklı Türk Muslukları',
        description: 'Estetik tasarım, uzun ömürlü kullanım ve su tasarrufu sağlayan çözümler.'
      },
      {
        title: 'Güvenilir Türk Su Isıtıcıları',
        description: 'Enerji verimliliği, güvenlik ve her gün maksimum konfor.'
      }
    ],
    downloadCatalog: 'Katalog indir'
  },
  en: {
    slides: [
      {
        title: 'Premium Turkish Faucets, Sinks & Water Heaters',
        description: 'Discover high-quality Turkish sanitary solutions for your home. Modern design, reliable performance and guaranteed support 24/7.'
      },
      {
        title: 'Modern & Durable Turkish Faucets',
        description: 'Elegant design, long-lasting quality and water-saving technology.'
      },
      {
        title: 'Reliable Turkish Water Heaters',
        description: 'Energy efficiency, safety and everyday comfort for your home.'
      }
    ],
    downloadCatalog: 'Download catalog'
  }
};

// Переводы для Categories компонента
const categoriesTranslations: Record<Locale, any> = {
  ru: {
    title: "Дизайн и функциональность в каждой детали",
    subtitle: "Комфорт и долговечность - наш приоритет",
    description: "Наши продукты добавляют эстетику и практичность в ванные комнаты. Современные технологии и качественные материалы обеспечивают безотказное использование в течение многих лет.",
    gestureControl: "Управление жестами",
    touchlessOperation: "Бесконтактная работа",
    touchlessGestureControl: "Бесконтактное управление жестами",
    powerUpDescription: "Включение вытяжки без касания устройства",
    speedAdjustment: "Регулировка скорости"
  },
  tr: {
    title: "Her detayda tasarım ve işlevsellik",
    subtitle: "Konfor ve dayanıklılık önceliğimizdir",
    description: "Ürünlerimiz banyolara estetik ve pratiklik katıyor. Modern teknoloji ve kaliteli malzemelerle uzun yıllar sorunsuz kullanım sağlar.",
    gestureControl: "Gesture Control",
    touchlessOperation: "Touchless Operation",
    touchlessGestureControl: "Touchless Gesture Control",
    powerUpDescription: "Power up the rangehood without touching the device",
    speedAdjustment: "Speed Adjustment"
  },
  en: {
    title: "Design and functionality in every detail",
    subtitle: "Comfort and durability are our priority",
    description: "Our products add aesthetics and practicality to bathrooms. Modern technology and quality materials ensure reliable use for many years.",
    gestureControl: "Gesture Control",
    touchlessOperation: "Touchless Operation",
    touchlessGestureControl: "Touchless Gesture Control",
    powerUpDescription: "Power up the rangehood without touching the device",
    speedAdjustment: "Speed Adjustment"
  }
};

// Переводы для About компонента
const aboutTranslations: Record<Locale, any> = {
  ru: {
    title: "О нашей компании",
    subtitle: "Мы создаем инновационные решения для современного дома",
    description: "Наша компания специализируется на разработке и производстве высокотехнологичных решений для дома. Мы сочетаем инновационный дизайн с проверенными технологиями.",
    features: {
      innovation: {
        title: "Инновации",
        description: "Мы используем последние технологии в своих продуктах"
      },
      quality: {
        title: "Качество",
        description: "Высочайшее качество материалов и сборки"
      },
      service: {
        title: "Сервис",
        description: "Полная поддержка на всех этапах сотрудничества"
      },
      sustainability: {
        title: "Экологичность",
        description: "Ответственный подход к окружающей среде"
      }
    },
    accordion: {
      about: {
        title: "О нас",
        description: "Современные производственные мощности и экспертная команда позволяют нам разрабатывать высококачественные сантехнические решения, соответствующие международным стандартам качества."
      },
      mission: {
        title: "Наша миссия",
        description: "Мы объединяем инновационный дизайн, надежность и функциональность, чтобы превзойти ожидания наших клиентов и создать комфорт в каждом доме."
      },
      vision: {
        title: "Наше видение",
        description: "Стать ведущим поставщиком инновационных решений для дома, зарекомендовав себя как надежный партнер во всех сегментах рынка."
      }
    },
    stats: {
      satisfiedClients: "Довольных клиентов",
      completedProjects: "Завершенных проектов",
      countries: "Страны присутствия"
    }
  },
  tr: {
    title: "Şirketimiz Hakkında",
    subtitle: "Modern ev için yenilikçi çözümler yaratıyoruz",
    description: "Şirketimiz yüksek teknolojili ev çözümlerinin geliştirilmesi ve üretimi konusunda uzmanlaşmıştır. Yenilikçi tasarımı kanıtlanmış teknolojilerle birleştiriyoruz.",
    features: {
      innovation: {
        title: "Yenilik",
        description: "Ürünlerimizde en son teknolojileri kullanıyoruz"
      },
      quality: {
        title: "Kalite",
        description: "Malzeme ve montajda en yüksek kalite"
      },
      service: {
        title: "Hizmet",
        description: "İş birliğinin tüm aşamalarında tam destek"
      },
      sustainability: {
        title: "Sürdürülebilirlik",
        description: "Çevreye karşı sorumlu yaklaşım"
      }
    },
    accordion: {
      about: {
        title: "Hakkımızda",
        description: "Modern üretim kapasitelerimiz ve uzman ekibimiz sayesinde uluslararası kalite standartlarına uygun yüksek kaliteli sıhhi tesisat çözümleri geliştiriyoruz."
      },
      mission: {
        title: "Misyonumuz",
        description: "Yenilikçi tasarım, güvenilirlik ve işlevselliği birleştirerek müşterilerimizin beklentilerini aşmak ve her evde konfor yaratmak için çalışıyoruz."
      },
      vision: {
        title: "Vizyonumuz",
        description: "Tüm pazar segmentlerinde güvenilir bir ortak olarak kendimizi kanıtlayarak ev için yenilikçi çözümlerin önde gelen tedarikçisi olmak."
      }
    },
    stats: {
      satisfiedClients: "Memnun Müşteri",
      completedProjects: "Tamamlanan Proje",
      countries: "Bulunduğu Ülkeler"
    }
  },
  en: {
    title: "About Our Company",
    subtitle: "We create innovative solutions for modern home",
    description: "Our company specializes in developing and manufacturing high-tech home solutions. We combine innovative design with proven technologies.",
    features: {
      innovation: {
        title: "Innovation",
        description: "We use the latest technologies in our products"
      },
      quality: {
        title: "Quality",
        description: "Highest quality materials and assembly"
      },
      service: {
        title: "Service",
        description: " место support at all stages of cooperation"
      },
      sustainability: {
        title: "Sustainability",
        description: "Responsible approach to environment"
      }
    },
    accordion: {
      about: {
        title: "About Us",
        description: "Modern production facilities and expert team allow us to develop high-quality plumbing solutions that meet international quality standards."
      },
      mission: {
        title: "Our Mission",
        description: "We combine innovative design, reliability and functionality to exceed our customers' expectations and create comfort in every home."
      },
      vision: {
        title: "Our Vision",
        description: "To become a leading supplier of innovative home solutions by establishing ourselves as a reliable partner in all market segments."
      }
    },
    stats: {
      satisfiedClients: "Satisfied Clients",
      completedProjects: "Completed Projects",
      countries: "Countries Present"
    }
  }
};

export function useLocalizedContent() {
  const pathname = usePathname();
  
  // Получаем локаль из URL
  const locale = useMemo((): Locale => {  
    const segments = pathname.split('/');
    const urlLocale = segments[1] || 'ru';
    return ['ru', 'tr', 'en'].includes(urlLocale) ? urlLocale as Locale : 'ru';
  }, [pathname]);

  // Получаем переводы для текущей локали
  const translations = useMemo(() => ({
    locale,
    hero: heroTranslations[locale],
    header: headerTranslations[locale],
    categories: categoriesTranslations[locale],
    about: aboutTranslations[locale],
    products: productsTranslations[locale],
    footer: footerTranslations[locale],
  }), [locale]);

  return {
    locale,
    translations,
    hero: translations.hero,
    header: translations.header,
    categories: translations.categories,
    about: translations.about,
    products: translations.products,
    footer: translations.footer,
  };
}
