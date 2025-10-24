import { prisma } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

/**
 * UserController
 * Контроллер для работы с пользователями (как в Laravel)
 */
export class UserController {
  
  /**
   * GET /api/users
   * Получить всех пользователей
   */
  static async index(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { email: { contains: search } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        }),
        prisma.user.count({ where })
      ]);

      return NextResponse.json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Ошибка получения пользователей:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка получения пользователей' },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/users/[id]
   * Получить пользователя по ID
   */
  static async show(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Пользователь не найден' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Ошибка получения пользователя:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка получения пользователя' },
        { status: 500 }
      );
    }
  }

  /**
   * POST /api/users
   * Создать нового пользователя
   */
  static async store(request: NextRequest) {
    try {
      const body = await request.json();
      const { name, email, password, role = 'admin' } = body;

      // Валидация
      if (!name || !email || !password) {
        return NextResponse.json(
          { success: false, error: 'Имя, email и пароль обязательны' },
          { status: 400 }
        );
      }

      // Проверяем, существует ли пользователь с таким email
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Пользователь с таким email уже существует' },
          { status: 400 }
        );
      }

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return NextResponse.json({
        success: true,
        data: user,
        message: 'Пользователь создан успешно'
      });
    } catch (error) {
      console.error('Ошибка создания пользователя:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка создания пользователя' },
        { status: 500 }
      );
    }
  }

  /**
   * PUT /api/users/[id]
   * Обновить пользователя
   */
  static async update(id: string, request: NextRequest) {
    try {
      const body = await request.json();
      const { name, email, password, role, isActive } = body;

      const updateData: any = {
        name,
        email,
        role,
        isActive: isActive !== undefined ? isActive : true
      };

      // Если передан новый пароль, хешируем его
      if (password) {
        updateData.password = await bcrypt.hash(password, 12);
      }

      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return NextResponse.json({
        success: true,
        data: user,
        message: 'Пользователь обновлен успешно'
      });
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления пользователя' },
        { status: 500 }
      );
    }
  }

  /**
   * DELETE /api/users/[id]
   * Удалить пользователя
   */
  static async destroy(id: string) {
    try {
      // Проверяем, не пытается ли пользователь удалить самого себя
      // (это можно добавить позже через middleware)
      
      await prisma.user.delete({
        where: { id: parseInt(id) }
      });

      return NextResponse.json({
        success: true,
        message: 'Пользователь удален успешно'
      });
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка удаления пользователя' },
        { status: 500 }
      );
    }
  }
}
