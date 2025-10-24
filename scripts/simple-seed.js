const mysql = require('mysql2/promise');

async function main() {
  console.log('🚀 Подключение к базе данных...');
  
  try {
    // Подключение к базе данных
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'delfinsite'
    });

    console.log('✅ Подключение успешно');

    // Создаем категории
    const categories = [
      ['Смесители', 'Смесители для ванной и кухни', '/category_banners/smesitel_banner.jpg'],
      ['Унитазы', 'Унитазы и биде', '/category_banners/toilet_category.png'],
      ['Котлы', 'Отопительные котлы', '/category_banners/boiler_category.png']
    ];

    for (const [name, description, imageUrl] of categories) {
      const [existing] = await connection.execute(
        'SELECT id FROM categories WHERE name = ?',
        [name]
      );

      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO categories (name, description, imageUrl, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [name, description, imageUrl, true]
        );
        console.log(`✅ Создана категория: ${name}`);
      } else {
        console.log(`ℹ️  Категория уже существует: ${name}`);
      }
    }

    // Создаем продукты
    const products = [
      ['Смеситель для раковины 8609', 'Современный смеситель с поворотным изливом', 'Смесители', 15000, '/products/washdown_rimless/8609.png'],
      ['Смеситель для раковины 8614', 'Элегантный смеситель с высоким изливом', 'Смесители', 18000, '/products/washdown_rimless/8614.png'],
      ['Унитаз подвесной 9000', 'Современный подвесной унитаз', 'Унитазы', 45000, '/products/washdown_rimless/9000.png'],
      ['Унитаз напольный 9001', 'Классический напольный унитаз', 'Унитазы', 35000, '/products/washdown_rimless/9001.jpg'],
      ['Котел газовый 25 кВт', 'Энергоэффективный газовый котел', 'Котлы', 120000, '/products/boiler_hero.png']
    ];

    for (const [name, description, category, price, imageUrl] of products) {
      const [existing] = await connection.execute(
        'SELECT id FROM products WHERE name = ?',
        [name]
      );

      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO products (name, description, category, price, imageUrl, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [name, description, category, price, imageUrl, true]
        );
        console.log(`✅ Создан продукт: ${name}`);
      } else {
        console.log(`ℹ️  Продукт уже существует: ${name}`);
      }
    }

    await connection.end();
    console.log('🎉 Заполнение базы данных завершено!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

main();
