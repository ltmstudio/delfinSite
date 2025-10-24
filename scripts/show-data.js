const mysql = require('mysql2/promise');

async function main() {
  console.log('📦 Содержимое базы данных delfinsite\n');
  
  try {
    // Подключение к базе данных
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'delfinsite'
    });

    console.log('✅ Подключение успешно\n');

    // Показываем категории
    console.log('📂 КАТЕГОРИИ:');
    console.log('='.repeat(50));
    const [categories] = await connection.execute('SELECT * FROM categories ORDER BY id');
    categories.forEach(cat => {
      console.log(`ID: ${cat.id}`);
      console.log(`Название: ${cat.name}`);
      console.log(`Описание: ${cat.description}`);
      console.log(`Изображение: ${cat.imageUrl}`);
      console.log(`Активна: ${cat.isActive ? 'Да' : 'Нет'}`);
      console.log(`Создана: ${cat.createdAt}`);
      console.log('-'.repeat(30));
    });

    console.log('\n');

    // Показываем товары
    console.log('🛍️  ТОВАРЫ:');
    console.log('='.repeat(50));
    const [products] = await connection.execute('SELECT * FROM products ORDER BY id');
    products.forEach(prod => {
      console.log(`ID: ${prod.id}`);
      console.log(`Название: ${prod.name}`);
      console.log(`Описание: ${prod.description}`);
      console.log(`Категория: ${prod.category}`);
      console.log(`Цена: ${prod.price ? prod.price + ' руб.' : 'Не указана'}`);
      console.log(`Изображение: ${prod.imageUrl}`);
      console.log(`Активен: ${prod.isActive ? 'Да' : 'Нет'}`);
      console.log(`Создан: ${prod.createdAt}`);
      console.log('-'.repeat(30));
    });

    await connection.end();
    console.log('\n🎉 Просмотр данных завершен!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

main();
