const { seedCategories } = require('./CategorySeeder');
const { seedProducts } = require('./ProductSeeder');

/**
 * Database Seeder
 * Главный seeder, который запускает все остальные (как в Laravel)
 */
async function runAllSeeders() {
  console.log('🚀 Запуск всех seeders...');
  console.log('='.repeat(50));
  
  try {
    // Запускаем seeders в правильном порядке
    await seedCategories();
    console.log('');
    await seedProducts();
    
    console.log('');
    console.log('🎉 Все seeders выполнены успешно!');
  } catch (error) {
    console.error('❌ Ошибка при выполнении seeders:', error);
    throw error;
  }
}

// Запуск только если файл вызван напрямую
if (require.main === module) {
  runAllSeeders();
}

module.exports = { runAllSeeders };
