import { pool } from '@/lib/mysql';
import { NextRequest, NextResponse } from 'next/server';

/**
 * CategoryController
 * Контроллер для работы с категориями (как в Laravel)
 */
export class CategoryController {
  
  /**
   * GET /api/categories
   * Получить все категории
   */
  static async index(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      let whereClause = 'WHERE isActive = 1';
      let params: any[] = [];
      
      if (search) {
        whereClause += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      const [categories] = await pool.execute(
        `SELECT c.*, COUNT(p.id) as productCount 
         FROM categories c 
         LEFT JOIN products p ON c.id = p.categoryId 
         ${whereClause.replace('isActive', 'c.isActive')} 
         GROUP BY c.id 
         ORDER BY c.name ASC 
         LIMIT ? OFFSET ?`,
        [...params, limit, skip]
      );

      const [totalResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM categories ${whereClause}`,
        params
      );
      const total = (totalResult as any[])[0].total;

      return NextResponse.json({
        success: true,
        data: categories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Ошибка получения категорий:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка получения категорий' },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/categories/[id]
   * Получить категорию по ID
   */
  static async show(id: string) {
    try {
      const [categories] = await pool.execute(
        'SELECT * FROM categories WHERE id = ?',
        [parseInt(id)]
      );

      const category = (categories as any[])[0];

      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Категория не найдена' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Ошибка получения категории:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка получения категории' },
        { status: 500 }
      );
    }
  }

  /**
   * POST /api/categories
   * Создать новую категорию
   */
  static async store(request: NextRequest) {
    try {
      const body = await request.json();
      const { name, description, imageUrl } = body;

      // Валидация
      if (!name) {
        return NextResponse.json(
          { success: false, error: 'Название категории обязательно' },
          { status: 400 }
        );
      }

      const category = await prisma.category.create({
        data: {
          name,
          description: description || null,
          imageUrl: imageUrl || null
        }
      });

      return NextResponse.json({
        success: true,
        data: category,
        message: 'Категория создана успешно'
      });
    } catch (error) {
      console.error('Ошибка создания категории:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка создания категории' },
        { status: 500 }
      );
    }
  }

  /**
   * PUT /api/categories/[id]
   * Обновить категорию
   */
  static async update(id: string, request: NextRequest) {
    try {
      const body = await request.json();
      const { name, description, imageUrl, isActive } = body;

      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description: description || null,
          imageUrl: imageUrl || null,
          isActive: isActive !== undefined ? isActive : true
        }
      });

      return NextResponse.json({
        success: true,
        data: category,
        message: 'Категория обновлена успешно'
      });
    } catch (error) {
      console.error('Ошибка обновления категории:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления категории' },
        { status: 500 }
      );
    }
  }

  /**
   * DELETE /api/categories/[id]
   * Удалить категорию
   */
  static async destroy(id: string) {
    try {
      const connection = await pool.getConnection();
      
      // Проверяем, есть ли товары в этой категории
      const [products] = await connection.execute(
        'SELECT COUNT(*) as count FROM products WHERE categoryId = ?',
        [parseInt(id)]
      );
      
      if (products[0].count > 0) {
        connection.release();
        return NextResponse.json(
          { success: false, error: 'Нельзя удалить категорию, в которой есть товары' },
          { status: 400 }
        );
      }
      
      // Удаляем категорию
      await connection.execute(
        'DELETE FROM categories WHERE id = ?',
        [parseInt(id)]
      );
      
      connection.release();

      return NextResponse.json({
        success: true,
        message: 'Категория удалена успешно'
      });
    } catch (error) {
      console.error('Ошибка удаления категории:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка удаления категории' },
        { status: 500 }
      );
    }
  }
}
