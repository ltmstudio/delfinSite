const { PrismaClient } = require('../../src/generated/prisma/client');

const prisma = new PrismaClient();

/**
 * Product Seeder
 * Создает товары (как в Laravel)
 */
async function seedProducts() {
  console.log('🛍️  Заполнение товаров...');
  
    // Сначала получаем категории
    const categories = await prisma.category.findMany();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    const products = [
      {
        name: 'Смеситель для раковины 8609',
        description: 'Современный смеситель с поворотным изливом',
        categoryId: categoryMap['Смесители'],
        price: 15000,
        imageUrl: '/products/washdown_rimless/8609.png'
      },
      {
        name: 'Смеситель для раковины 8614',
        description: 'Элегантный смеситель с высоким изливом',
        categoryId: categoryMap['Смесители'],
        price: 18000,
        imageUrl: '/products/washdown_rimless/8614.png'
      },
      {
        name: 'Унитаз подвесной 9000',
        description: 'Современный подвесной унитаз',
        categoryId: categoryMap['Унитазы'],
        price: 45000,
        imageUrl: '/products/washdown_rimless/9000.png'
      },
      {
        name: 'Унитаз напольный 9001',
        description: 'Классический напольный унитаз',
        categoryId: categoryMap['Унитазы'],
        price: 35000,
        imageUrl: '/products/washdown_rimless/9001.jpg'
      },
      {
        name: 'Котел газовый 25 кВт',
        description: 'Энергоэффективный газовый котел',
        categoryId: categoryMap['Котлы'],
        price: 120000,
        imageUrl: '/products/boiler_hero.png'
      }
    ];

  for (const productData of products) {
    const existing = await prisma.product.findFirst({
      where: { name: productData.name }
    });

    if (!existing) {
      await prisma.product.create({
        data: productData
      });
      console.log(`✅ Создан товар: ${productData.name}`);
    } else {
      console.log(`ℹ️  Товар уже существует: ${productData.name}`);
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
