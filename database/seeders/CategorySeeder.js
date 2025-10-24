const { PrismaClient } = require('../../src/generated/prisma/client');

const prisma = new PrismaClient();

/**
 * Category Seeder
 * Создает категории товаров (как в Laravel)
 */
async function seedCategories() {
  console.log('🌱 Заполнение категорий...');
  
  const categories = [
    {
      name: 'Смесители',
      description: 'Смесители для ванной и кухни',
      imageUrl: '/category_banners/smesitel_banner.jpg'
    },
    {
      name: 'Унитазы', 
      description: 'Унитазы и биде',
      imageUrl: '/category_banners/toilet_category.png'
    },
    {
      name: 'Котлы',
      description: 'Отопительные котлы', 
      imageUrl: '/category_banners/boiler_category.png'
    }
  ];

  for (const categoryData of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: categoryData.name }
    });

    if (!existing) {
      await prisma.category.create({
        data: categoryData
      });
      console.log(`✅ Создана категория: ${categoryData.name}`);
    } else {
      console.log(`ℹ️  Категория уже существует: ${categoryData.name}`);
    }
  }
}

async function main() {
  try {
    await seedCategories();
    console.log('🎉 CategorySeeder завершен!');
  } catch (error) {
    console.error('❌ Ошибка в CategorySeeder:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск только если файл вызван напрямую
if (require.main === module) {
  main();
}

module.exports = { seedCategories };
