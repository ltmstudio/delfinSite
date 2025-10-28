import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/mysql';

/**
 * GET /api/products/public
 * Публичный API для получения товаров с фильтрацией по категориям
 * Используется на главной странице для секции "Наша коллекция"
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'ru';

    let whereClause = '';
    let params: any[] = [];

    // Фильтрация по категории
    if (category && category !== 'all') {
      // Получаем все категории из БД для динамического маппинга
      const [categories] = await pool.query(
        'SELECT id, name_ru, name_en, name_tk FROM categories WHERE isActive = 1'
      );
      
      // Создаем динамический маппинг на основе данных из БД
      const categoryMap: { [key: string]: string } = {};
      (categories as any[]).forEach((cat: any) => {
        // Генерируем ID как в Products.tsx: name_en.toLowerCase().replace(/\s+/g, '_')
        const categoryId = cat.name_en.toLowerCase().replace(/\s+/g, '_');
        categoryMap[categoryId] = cat.name_ru;
      });

      const categoryName = categoryMap[category];
      if (categoryName) {
        whereClause = 'AND c.name_ru = ?';
        params.push(categoryName);
      }
    }

    // Выбираем поле названия в зависимости от локали
    const nameField = locale === 'ru' ? 'p.name_ru' : 
                     locale === 'en' ? 'p.name_en' : 
                     locale === 'tk' ? 'p.name_tk' : 'p.name_ru';

    const [products] = await pool.query(
      `SELECT p.id, ${nameField} as name, p.description, p.price, p.imageUrl, c.name_ru as categoryName
       FROM products p 
       LEFT JOIN categories c ON p.categoryId = c.id 
       WHERE p.isActive = 1 ${whereClause}
       ORDER BY p.createdAt DESC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ошибка получения товаров' },
      { status: 500 }
    );
  }
}
