import { pool } from '@/lib/mysql';
import { NextRequest, NextResponse } from 'next/server';

/**
 * ProductController
 * Контроллер для работы с товарами (как в Laravel)
 */
export class ProductController {
  
  /**
   * GET /api/products
   * Получить все товары
   */
  static async index(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get('search');
      const category = searchParams.get('category');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      let whereClause = '';
      let params: any[] = [];
      
      const conditions = [];
      
      if (search) {
        conditions.push('(p.name_ru LIKE ? OR p.name_en LIKE ? OR p.name_tk LIKE ? OR p.description LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (category) {
        conditions.push('(c.name_ru = ? OR c.name_en = ? OR c.name_tk = ?)');
        params.push(category, category, category);
      }
      
      if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
      }

      // Используем query вместо execute для LIMIT и OFFSET
      const [products] = await pool.query(
        `SELECT p.*, c.name_ru as categoryName 
         FROM products p 
         LEFT JOIN categories c ON p.categoryId = c.id 
         ${whereClause} 
         ORDER BY p.createdAt DESC 
         LIMIT ${Number(limit)} OFFSET ${Number(skip)}`
      );

      const [totalResult] = await pool.execute(
        `SELECT COUNT(*) as total 
         FROM products p 
         LEFT JOIN categories c ON p.categoryId = c.id 
         ${whereClause}`,
        params
      );
      const total = (totalResult as any[])[0].total;

      return NextResponse.json({
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Ошибка получения товаров' },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/products/[id]
   * Получить товар по ID
   */
  static async show(id: string) {
    try {
      const [products] = await pool.execute(
        `SELECT p.*, c.name_ru as categoryName 
         FROM products p 
         LEFT JOIN categories c ON p.categoryId = c.id 
         WHERE p.id = ?`,
        [parseInt(id)]
      );

      const product = (products as any[])[0];

      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Товар не найден' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: product
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Ошибка получения товара' },
        { status: 500 }
      );
    }
  }

  /**
   * POST /api/products
   * Создать новый товар
   */
  static async store(request: NextRequest) {
    try {
      const body = await request.json();
      const { name_ru, name_en, name_tk, description, categoryId, price, imageUrl } = body;

      if (!name_ru || !name_en || !name_tk || !categoryId) {
        return NextResponse.json(
          { success: false, error: 'Названия товара на всех языках и категория обязательны' },
          { status: 400 }
        );
      }

      const [result] = await pool.execute(
        'INSERT INTO products (name_ru, name_en, name_tk, description, categoryId, price, imageUrl, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [name_ru, name_en, name_tk, description || null, parseInt(categoryId), price ? parseFloat(price) : null, imageUrl || null, true]
      );

      const insertId = (result as any).insertId;
      const [products] = await pool.execute(
        `SELECT p.*, c.name_ru as categoryName 
         FROM products p 
         LEFT JOIN categories c ON p.categoryId = c.id 
         WHERE p.id = ?`,
        [insertId]
      );

      return NextResponse.json({
        success: true,
        data: (products as any[])[0],
        message: 'Товар создан успешно'
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: 'Ошибка создания товара', details: error.message },
        { status: 500 }
      );
    }
  }

  /**
   * PUT /api/products/[id]
   * Обновить товар
   */
  static async update(id: string, request: NextRequest) {
    try {
      const body = await request.json();
      const { name_ru, name_en, name_tk, description, categoryId, price, imageUrl, isActive } = body;

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
      if (categoryId !== undefined) {
        updateFields.push('categoryId = ?');
        params.push(parseInt(categoryId));
      }
      if (price !== undefined) {
        updateFields.push('price = ?');
        params.push(price ? parseFloat(price) : null);
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
        `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      const [products] = await pool.execute(
        `SELECT p.*, c.name_ru as categoryName 
         FROM products p 
         LEFT JOIN categories c ON p.categoryId = c.id 
         WHERE p.id = ?`,
        [parseInt(id)]
      );

      return NextResponse.json({
        success: true,
        data: (products as any[])[0],
        message: 'Товар обновлен успешно'
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления товара', details: error.message },
        { status: 500 }
      );
    }
  }

  /**
   * DELETE /api/products/[id]
   * Удалить товар
   */
  static async destroy(id: string) {
    try {
      await pool.execute('DELETE FROM products WHERE id = ?', [parseInt(id)]);
      return NextResponse.json({
        success: true,
        message: 'Товар удален успешно'
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Ошибка удаления товара' },
        { status: 500 }
      );
    }
  }
}