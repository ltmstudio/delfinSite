const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Заполнение базы данных продуктами...');
  
  try {
    // Получаем категории
    const categories = await prisma.category.findMany();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Продукты для заполнения
    const products = [
      {
        name: 'Смеситель для раковины 8609',
        description: 'Современный смеситель с поворотным изливом',
        category: 'Смесители',
        price: 15000,
        imageUrl: '/products/washdown_rimless/8609.png'
      },
      {
        name: 'Смеситель для раковины 8614',
        description: 'Элегантный смеситель с высоким изливом',
        category: 'Смесители',
        price: 18000,
        imageUrl: '/products/washdown_rimless/8614.png'
      },
      {
        name: 'Унитаз подвесной 9000',
        description: 'Современный подвесной унитаз',
        category: 'Унитазы',
        price: 45000,
        imageUrl: '/products/washdown_rimless/9000.png'
      },
      {
        name: 'Унитаз напольный 9001',
        description: 'Классический напольный унитаз',
        category: 'Унитазы',
        price: 35000,
        imageUrl: '/products/washdown_rimless/9001.jpg'
      },
      {
        name: 'Котел газовый 25 кВт',
        description: 'Энергоэффективный газовый котел',
        category: 'Котлы',
        price: 120000,
        imageUrl: '/products/boiler_hero.png'
      }
    ];

    for (const product of products) {
      const existingProduct = await prisma.product.findFirst({
        where: { name: product.name }
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            imageUrl: product.imageUrl
          }
        });
        console.log(`✅ Создан продукт: ${product.name}`);
      } else {
        console.log(`ℹ️  Продукт уже существует: ${product.name}`);
      }
    }

    console.log('🎉 Заполнение продуктами завершено!');
  } catch (error) {
    console.error('❌ Ошибка при заполнении продуктами:', error);
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
