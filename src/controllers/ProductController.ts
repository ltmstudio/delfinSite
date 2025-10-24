import { prisma } from '@/lib/database';
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
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      const where: any = { isActive: true };
      
      if (category) {
        where.category = {
          name: category
        };
      }
      
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } }
        ];
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            category: true
          }
        }),
        prisma.product.count({ where })
      ]);

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
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: {
          category: true
        }
      });

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

      // Валидация
      if (!name || !categoryId) {
        return NextResponse.json(
          { success: false, error: 'Название и категория обязательны' },
          { status: 400 }
        );
      }

      const product = await prisma.product.create({
        data: {
          name,
          description: description || null,
          categoryId: parseInt(categoryId),
          price: price ? parseFloat(price) : null,
          imageUrl: imageUrl || null
        },
        include: {
          category: true
        }
      });

      return NextResponse.json({
        success: true,
        data: product,
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

      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description: description || null,
          categoryId: categoryId ? parseInt(categoryId) : undefined,
          price: price ? parseFloat(price) : null,
          imageUrl: imageUrl || null,
          isActive: isActive !== undefined ? isActive : true
        },
        include: {
          category: true
        }
      });

      return NextResponse.json({
        success: true,
        data: product,
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
      await prisma.product.delete({
        where: { id: parseInt(id) }
      });

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
