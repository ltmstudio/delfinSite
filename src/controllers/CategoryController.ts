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

      let whereClause = '';
      let params: any[] = [];
      
      if (search) {
        whereClause = 'WHERE (c.name_ru LIKE ? OR c.name_en LIKE ? OR c.name_tk LIKE ? OR c.description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Избегаем ONLY_FULL_GROUP_BY: считаем товары подзапросом вместо GROUP BY
      const [categories] = await pool.query(
        `SELECT 
           c.*, 
           (SELECT COUNT(*) FROM products p WHERE p.categoryId = c.id) AS productCount
         FROM categories c
         ${whereClause}
         ORDER BY c.name_ru ASC 
         LIMIT ${Number(limit)} OFFSET ${Number(skip)}`,
        params
      );

      const [totalResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM categories c ${whereClause}`,
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
      const { name_ru, name_en, name_tk, description, imageUrl } = body;

      // Валидация
      if (!name_ru || !name_en || !name_tk) {
        return NextResponse.json(
          { success: false, error: 'Названия категории на всех языках обязательны' },
          { status: 400 }
        );
      }

      const [result] = await pool.execute(
        'INSERT INTO categories (name_ru, name_en, name_tk, description, imageUrl, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [name_ru, name_en, name_tk, description || null, imageUrl || null, true]
      );

      const [categories] = await pool.execute(
        'SELECT * FROM categories WHERE id = ?',
        [(result as any).insertId]
      );

      const category = (categories as any[])[0];

      return NextResponse.json({
        success: true,
        data: category,
        message: 'Категория создана успешно'
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: 'Ошибка создания категории', details: error.message },
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
      const { name_ru, name_en, name_tk, description, imageUrl, isActive } = body;

      let updateFields = [];
      let params = [];

      if (name_ru !== undefined) {
        updateFields.push('name_ru = ?');
        params.push(name_ru);
      }
      if (name_en !== undefined) {
        updateFields.push('name_en = ?');
        params.push(name_en);
      }
      if (name_tk !== undefined) {
        updateFields.push('name_tk = ?');
        params.push(name_tk);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        params.push(description || null);
      }
      if (imageUrl !== undefined) {
        updateFields.push('imageUrl = ?');
        params.push(imageUrl || null);
      }
      if (isActive !== undefined) {
        updateFields.push('isActive = ?');
        params.push(isActive ? 1 : 0);
      }

      updateFields.push('updatedAt = NOW()');
      params.push(parseInt(id));

      await pool.execute(
        `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      const [categories] = await pool.execute(
        'SELECT * FROM categories WHERE id = ?',
        [parseInt(id)]
      );

      const category = (categories as any[])[0];

      return NextResponse.json({
        success: true,
        data: category,
        message: 'Категория обновлена успешно'
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления категории', details: error.message },
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
      
      if ((products as any[])[0].count > 0) {
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
      return NextResponse.json(
        { success: false, error: 'Ошибка удаления категории' },
        { status: 500 }
      );
    }
  }
}
