const mysql = require('mysql2/promise');

async function main() {
  console.log('📋 Проверка таблиц в базе данных...');
  
  try {
    // Подключение к базе данных
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'delfinsite'
    });

    console.log('✅ Подключение успешно');

    // Получаем список таблиц
    const [tables] = await connection.execute('SHOW TABLES');
    
    console.log('\n📊 Таблицы в базе данных:');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`${index + 1}. ${tableName}`);
    });

    // Проверяем содержимое таблиц
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`   - ${tableName}: ${count[0].count} записей`);
    }

    await connection.end();
    console.log('\n🎉 Проверка завершена!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

main();
