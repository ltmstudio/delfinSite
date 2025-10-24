const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

/**
 * User Seeder
 * Создает администратора (как в Laravel)
 */
async function seedUsers() {
  console.log('👤 Создание пользователей...');
  
  try {
    // Подключение к базе данных
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'delfinsite'
    });

    console.log('✅ Подключение успешно');

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Создаем администратора
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@delfin.com']
    );

    if (existing.length === 0) {
      await connection.execute(
        'INSERT INTO users (email, password, name, role, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        ['admin@delfin.com', hashedPassword, 'Администратор', 'admin', true]
      );
      console.log('✅ Создан администратор: admin@delfin.com');
      console.log('🔑 Пароль: admin123');
    } else {
      console.log('ℹ️  Администратор уже существует');
    }

    await connection.end();
    console.log('🎉 UserSeeder завершен!');
  } catch (error) {
    console.error('❌ Ошибка в UserSeeder:', error);
  }
}

// Запуск только если файл вызван напрямую
if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers };
