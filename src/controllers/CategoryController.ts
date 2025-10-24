import { prisma } from '@/lib/database';
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

      const where: any = { isActive: true };
      
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } }
        ];
      }

      const [categories, total] = await Promise.all([
        prisma.category.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: 'asc' }
        }),
        prisma.category.count({ where })
      ]);

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
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) }
      });

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
      await prisma.category.delete({
        where: { id: parseInt(id) }
      });

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
