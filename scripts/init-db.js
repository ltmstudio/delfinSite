const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Инициализация базы данных...');
  
  try {
    // Проверяем подключение к базе данных
    await prisma.$connect();
    console.log('✅ Подключение к базе данных успешно');
    
    // Создаем начальные категории
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

    for (const category of categories) {
      const existingCategory = await prisma.category.findFirst({
        where: { name: category.name }
      });

      if (!existingCategory) {
        await prisma.category.create({
          data: category
        });
        console.log(`✅ Создана категория: ${category.name}`);
      } else {
        console.log(`ℹ️  Категория уже существует: ${category.name}`);
      }
    }

    console.log('🎉 Инициализация базы данных завершена!');
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
