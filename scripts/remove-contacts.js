const mysql = require('mysql2/promise');

async function main() {
  console.log('🗑️  Удаление таблицы contacts...');
  
  try {
    // Подключение к базе данных
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'delfinsite'
    });

    console.log('✅ Подключение успешно');

    // Удаляем таблицу contacts
    await connection.execute('DROP TABLE IF EXISTS contacts');
    console.log('✅ Таблица contacts удалена');

    await connection.end();
    console.log('🎉 Готово! Таблица contacts удалена из базы данных');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

main();
