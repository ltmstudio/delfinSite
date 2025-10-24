const mysql = require('mysql2/promise');

/**
 * Простой seeder без Prisma (как в Laravel)
 * Использует прямые SQL запросы
 */
async function seedDatabase() {
  console.log('🌱 Заполнение базы данных...');
  
  try {
    // Подключение к базе данных
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'delfinsite'
    });

    console.log('✅ Подключение успешно');

    // Очищаем таблицы
    await connection.execute('DELETE FROM products');
    await connection.execute('DELETE FROM categories');
    console.log('🗑️  Старые данные удалены');

    // Создаем категории
    const categories = [
      ['Смесители', 'Смесители для ванной и кухни', '/category_banners/smesitel_banner.jpg'],
      ['Унитазы', 'Унитазы и биде', '/category_banners/toilet_category.png'],
      ['Котлы', 'Отопительные котлы', '/category_banners/boiler_category.png']
    ];

    for (const [name, description, imageUrl] of categories) {
      await connection.execute(
        'INSERT INTO categories (name, description, imageUrl, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [name, description, imageUrl, true]
      );
      console.log(`✅ Создана категория: ${name}`);
    }

    // Получаем ID категорий
    const [categoryRows] = await connection.execute('SELECT id, name FROM categories');
    const categoryMap = {};
    categoryRows.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Создаем товары с правильными categoryId
    const products = [
      ['Смеситель для раковины 8609', 'Современный смеситель с поворотным изливом', 'Смесители', 15000, '/products/washdown_rimless/8609.png'],
      ['Смеситель для раковины 8614', 'Элегантный смеситель с высоким изливом', 'Смесители', 18000, '/products/washdown_rimless/8614.png'],
      ['Унитаз подвесной 9000', 'Современный подвесной унитаз', 'Унитазы', 45000, '/products/washdown_rimless/9000.png'],
      ['Унитаз напольный 9001', 'Классический напольный унитаз', 'Унитазы', 35000, '/products/washdown_rimless/9001.jpg'],
      ['Котел газовый 25 кВт', 'Энергоэффективный газовый котел', 'Котлы', 120000, '/products/boiler_hero.png']
    ];

    for (const [name, description, categoryName, price, imageUrl] of products) {
      const categoryId = categoryMap[categoryName];
      await connection.execute(
        'INSERT INTO products (name, description, categoryId, price, imageUrl, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [name, description, categoryId, price, imageUrl, true]
      );
      console.log(`✅ Создан товар: ${name}`);
    }

    await connection.end();
    console.log('🎉 База данных заполнена успешно!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

// Запуск только если файл вызван напрямую
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
