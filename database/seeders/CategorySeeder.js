// Загружаем переменные окружения
require('dotenv').config();

const { PrismaClient } = require('../../src/generated/prisma/client.ts');

const prisma = new PrismaClient();

/**
 * Category Seeder
 * Создает мультиязычные категории товаров
 */
async function seedCategories() {
  console.log('🌱 Заполнение мультиязычных категорий...');
  
  const categories = [
    {
      name_ru: 'Смесители',
      name_en: 'Faucets',
      name_tk: 'Musluklar',
      description: 'Смесители для ванной и кухни',
      imageUrl: '/hero_banners/smesitel_hero.png'
    },
    {
      name_ru: 'Унитазы', 
      name_en: 'Toilets',
      name_tk: 'Tuvaletler',
      description: 'Унитазы и биде',
      imageUrl: '/hero_banners/toilet_hero.png'
    },
    {
      name_ru: 'Скрытые бачки',
      name_en: 'Concealed Cisterns',
      name_tk: 'Gizli Depolar',
      description: 'Скрытые бачки для унитазов', 
      imageUrl: '/hero_banners/boiler_hero.png'
    }
  ];

  for (const categoryData of categories) {
    const existing = await prisma.category.findFirst({
      where: { name_ru: categoryData.name_ru }
    });

    if (!existing) {
      await prisma.category.create({
        data: categoryData
      });
      console.log(`✅ Создана категория: ${categoryData.name_ru} / ${categoryData.name_en} / ${categoryData.name_tk}`);
    } else {
      console.log(`ℹ️  Категория уже существует: ${categoryData.name_ru}`);
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
