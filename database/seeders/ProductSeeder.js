// Загружаем переменные окружения
require('dotenv').config();

const { PrismaClient } = require('../../src/generated/prisma/client');

const prisma = new PrismaClient();

/**
 * Product Seeder
 * Создает мультиязычные товары на основе статических данных из productsTranslations.ts
 */
async function seedProducts() {
  console.log('🛍️  Заполнение мультиязычных товаров...');
  
  // Сначала получаем категории
  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.name_ru] = cat.id;
  });

  const products = [
    // Смесители (Faucets) - используем изображения из washdown_rimless
    {
      name_ru: 'Смеситель для раковины 8609',
      name_en: 'Sink Faucet 8609',
      name_tk: 'Lavabo Musluğu 8609',
      description: 'Элегантный смеситель для раковины',
      categoryId: categoryMap['Смесители'],
      price: 25000,
      imageUrl: '/products/washdown_rimless/8609.png'
    },
    {
      name_ru: 'Смеситель для раковины 8614',
      name_en: 'Sink Faucet 8614',
      name_tk: 'Lavabo Musluğu 8614',
      description: 'Современный дизайн и функциональность',
      categoryId: categoryMap['Смесители'],
      price: 28000,
      imageUrl: '/products/washdown_rimless/8614.png'
    },
    {
      name_ru: 'Смеситель для раковины 8615',
      name_en: 'Sink Faucet 8615',
      name_tk: 'Lavabo Musluğu 8615',
      description: 'Классическая красота',
      categoryId: categoryMap['Смесители'],
      price: 30000,
      imageUrl: '/products/washdown_rimless/8615-62.png'
    },
    {
      name_ru: 'Смеситель для раковины 8617',
      name_en: 'Sink Faucet 8617',
      name_tk: 'Lavabo Musluğu 8617',
      description: 'Премиум качество и стиль',
      categoryId: categoryMap['Смесители'],
      price: 35000,
      imageUrl: '/products/washdown_rimless/8617.png'
    },
    {
      name_ru: 'Смеситель для раковины 8618',
      name_en: 'Sink Faucet 8618',
      name_tk: 'Lavabo Musluğu 8618',
      description: 'Белоснежная элегантность',
      categoryId: categoryMap['Смесители'],
      price: 36000,
      imageUrl: '/products/washdown_rimless/8618-62.png'
    },
    
    // Унитазы (Toilets) - используем изображения из washdown_rimless
    {
      name_ru: 'Унитаз подвесной 9000',
      name_en: 'Wall-hung Toilet 9000',
      name_tk: 'Asma Tuvalet 9000',
      description: 'Современный дизайн без ободка',
      categoryId: categoryMap['Унитазы'],
      price: 45000,
      imageUrl: '/products/washdown_rimless/9000-62.png'
    },
    {
      name_ru: 'Унитаз напольный 9001',
      name_en: 'Floor-standing Toilet 9001',
      name_tk: 'Yer Tuvaleti 9001',
      description: 'Элегантность и функциональность',
      categoryId: categoryMap['Унитазы'],
      price: 48000,
      imageUrl: '/products/washdown_rimless/9001.jpg'
    },
    {
      name_ru: 'Унитаз напольный 9002',
      name_en: 'Floor-standing Toilet 9002',
      name_tk: 'Yer Tuvaleti 9002',
      description: 'Компактное решение',
      categoryId: categoryMap['Унитазы'],
      price: 42000,
      imageUrl: '/products/washdown_rimless/9002.png'
    },
    {
      name_ru: 'Унитаз подвесной 8622',
      name_en: 'Wall-hung Toilet 8622',
      name_tk: 'Asma Tuvalet 8622',
      description: 'Премиум качество',
      categoryId: categoryMap['Унитазы'],
      price: 52000,
      imageUrl: '/products/washdown_rimless/8622.jpg'
    },
    {
      name_ru: 'Унитаз напольный 8624',
      name_en: 'Floor-standing Toilet 8624',
      name_tk: 'Yer Tuvaleti 8624',
      description: 'Инновационные технологии',
      categoryId: categoryMap['Унитазы'],
      price: 55000,
      imageUrl: '/products/washdown_rimless/8624.png'
    },
    
    // Скрытые бачки (Concealed Cisterns) - используем существующие изображения
    {
      name_ru: 'Concealed Cistern 9800',
      name_en: 'Concealed Cistern 9800',
      name_tk: 'Concealed Cistern 9800',
      description: 'Скрытый бачок премиум класса',
      categoryId: categoryMap['Скрытые бачки'],
      price: 35000,
      imageUrl: '/products/concealed_cistern/Concealed_Cistern_9800.jpg'
    },
    {
      name_ru: 'Concealed Cistern 9801',
      name_en: 'Concealed Cistern 9801',
      name_tk: 'Concealed Cistern 9801',
      description: 'Современный дизайн и функциональность',
      categoryId: categoryMap['Скрытые бачки'],
      price: 38000,
      imageUrl: '/products/concealed_cistern/Concealed_Cistern_9801.jpg'
    },
    {
      name_ru: 'Concealed Cistern 9802',
      name_en: 'Concealed Cistern 9802',
      name_tk: 'Concealed Cistern 9802',
      description: 'Элегантность и надёжность',
      categoryId: categoryMap['Скрытые бачки'],
      price: 40000,
      imageUrl: '/products/concealed_cistern/Concealed_Cistern_9802.jpg'
    },
    {
      name_ru: 'Concealed Cistern 9803',
      name_en: 'Concealed Cistern 9803',
      name_tk: 'Concealed Cistern 9803',
      description: 'Инновационные технологии',
      categoryId: categoryMap['Скрытые бачки'],
      price: 42000,
      imageUrl: '/products/concealed_cistern/Concealed_Cistern_9803.jpg'
    }
  ];

  // Создаем товары только если они не существуют
  for (const productData of products) {
    const existing = await prisma.product.findFirst({
      where: { 
        name_ru: productData.name_ru,
        categoryId: productData.categoryId
      }
    });

    if (!existing) {
      await prisma.product.create({
        data: productData
      });
      console.log(`✅ Создан товар: ${productData.name_ru}`);
    } else {
      console.log(`ℹ️  Товар уже существует: ${productData.name_ru}`);
    }
  }
}

async function main() {
  try {
    await seedProducts();
    console.log('🎉 ProductSeeder завершен!');
  } catch (error) {
    console.error('❌ Ошибка в ProductSeeder:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск только если файл вызван напрямую
if (require.main === module) {
  main();
}

module.exports = { seedProducts };
