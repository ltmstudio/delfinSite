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

      let whereClause = 'WHERE p.isActive = 1';
      let params: any[] = [];
      
      if (search) {
        whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (category) {
        whereClause += ' AND c.name = ?';
        params.push(category);
      }

      const [products] = await pool.execute(
        `SELECT p.*, c.name as categoryName 
         FROM products p 
         LEFT JOIN categories c ON p.categoryId = c.id 
         ${whereClause} 
         ORDER BY p.createdAt DESC 
         LIMIT ? OFFSET ?`,
        [...params, limit, skip]
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
      console.error('Ошибка получения товаров:', error);
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
        `SELECT p.*, c.name as categoryName 
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
      console.error('Ошибка получения товара:', error);
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
      const { name, description, categoryId, price, imageUrl } = body;

      if (!name || !categoryId) {
        return NextResponse.json(
          { success: false, error: 'Название и категория обязательны' },
          { status: 400 }
        );
      }

      const [result] = await pool.execute(
        'INSERT INTO products (name, description, categoryId, price, imageUrl, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [name, description || null, parseInt(categoryId), price ? parseFloat(price) : null, imageUrl || null, true]
      );

      const insertId = (result as any).insertId;
      const [products] = await pool.execute(
        `SELECT p.*, c.name as categoryName 
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
    } catch (error) {
      console.error('Ошибка создания товара:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка создания товара' },
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
      const { name, description, categoryId, price, imageUrl, isActive } = body;

      let updateFields = [];
      let params = [];

      if (name !== undefined) {
        updateFields.push('name = ?');
        params.push(name);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        params.push(description);
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
        params.push(imageUrl);
      }
      if (isActive !== undefined) {
        updateFields.push('isActive = ?');
        params.push(isActive);
      }

      updateFields.push('updatedAt = NOW()');
      params.push(parseInt(id));

      await pool.execute(
        `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      const [products] = await pool.execute(
        `SELECT p.*, c.name as categoryName 
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
    } catch (error) {
      console.error('Ошибка обновления товара:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления товара' },
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
      console.error('Ошибка удаления товара:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка удаления товара' },
        { status: 500 }
      );
    }
  }
}