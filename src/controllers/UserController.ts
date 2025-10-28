import { pool } from '@/lib/mysql';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-simple';
import { getToken } from 'next-auth/jwt';
import { cache } from '@/lib/cache';

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

      // Создаем ключ кэша
      const cacheKey = `users:${page}:${limit}:${search || 'all'}`;
      
      // Проверяем кэш
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }

      let whereClause = '';
      let params: any[] = [];
      
      if (search) {
        whereClause = 'WHERE (name LIKE ? OR email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      // Оптимизированный запрос с параметрами
      const [users] = await pool.execute(
        `SELECT id, name, email, role, isActive, createdAt, updatedAt 
         FROM users 
         ${whereClause} 
         ORDER BY createdAt DESC 
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), Number(skip)]
      );

      const [totalResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM users ${whereClause}`,
        params
      );
      const total = (totalResult as any[])[0].total;

      const response = {
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };

      // Кэшируем результат на 2 минуты
      cache.set(cacheKey, response, 120000);

      return NextResponse.json(response);
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }
  }

  /**
   * GET /api/users/[id]
   * Получить пользователя по ID
   */
  static async show(id: string) {
    try {
      const [users] = await pool.execute(
        'SELECT id, name, email, role, isActive, createdAt, updatedAt FROM users WHERE id = ?',
        [parseInt(id)]
      );
      
      const user = (users as any[])[0];
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: user });
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
    }
  }

  /**
   * POST /api/users
   * Создать нового пользователя
   */
  static async store(request: NextRequest) {
    try {
      const body = await request.json();
      const { name, email, password, role, isActive } = body;

      if (!email || !password) {
        return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, role, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [name, email, hashedPassword, role || 'user', isActive !== undefined ? isActive : true]
      );

      const insertId = (result as any).insertId;
      const [users] = await pool.execute(
        'SELECT id, name, email, role, isActive, createdAt, updatedAt FROM users WHERE id = ?',
        [insertId]
      );

      // Инвалидируем кэш пользователей
      cache.clear();

      return NextResponse.json({ success: true, data: (users as any[])[0], message: 'User created successfully' }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
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

      // Получаем текущего пользователя из сессии
      let currentUserId = 0;
      try {
        const session = await getServerSession(authOptions);
        currentUserId = parseInt(session?.user?.id || '0');
        
        // Если не получили через getServerSession, пробуем через getToken
        if (!currentUserId) {
          const token = await getToken({ 
            req: request as any, 
            secret: process.env.NEXTAUTH_SECRET 
          });
          currentUserId = parseInt(token?.sub || '0');
        }
      } catch (error) {
      }
      
      const targetUserId = parseInt(id);

      // Проверяем, что пользователь не пытается деактивировать или удалить себя
      if (currentUserId === targetUserId && isActive !== undefined && !isActive) {
        return NextResponse.json(
          { success: false, error: 'Вы не можете деактивировать себя' },
          { status: 400 }
        );
      }

      let updateFields = [];
      let params = [];

      if (name !== undefined) {
        updateFields.push('name = ?');
        params.push(name);
      }
      if (email !== undefined) {
        updateFields.push('email = ?');
        params.push(email);
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push('password = ?');
        params.push(hashedPassword);
      }
      if (role !== undefined) {
        updateFields.push('role = ?');
        params.push(role);
      }
      if (isActive !== undefined) {
        updateFields.push('isActive = ?');
        params.push(isActive);
      }

      updateFields.push('updatedAt = NOW()');
      params.push(targetUserId);

      await pool.execute(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      const [users] = await pool.execute(
        'SELECT id, name, email, role, isActive, createdAt, updatedAt FROM users WHERE id = ?',
        [targetUserId]
      );

      // Инвалидируем кэш пользователей
      cache.clear();

      return NextResponse.json({ success: true, data: (users as any[])[0], message: 'User updated successfully' });
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
    }
  }

  /**
   * DELETE /api/users/[id]
   * Удалить пользователя
   */
  static async destroy(request: NextRequest, id: string) {
    try {
      // Получаем текущего пользователя из сессии
      let currentUserId = 0;
      try {
        const session = await getServerSession(authOptions);
        currentUserId = parseInt(session?.user?.id || '0');
        
        // Если не получили через getServerSession, пробуем через getToken
        if (!currentUserId) {
          const token = await getToken({ 
            req: request as any, 
            secret: process.env.NEXTAUTH_SECRET 
          });
          currentUserId = parseInt(token?.sub || '0');
        }
      } catch (error) {
      }
      
      const targetUserId = parseInt(id);

      // Проверяем, что пользователь не пытается удалить себя
      if (currentUserId === targetUserId) {
        return NextResponse.json(
          { success: false, error: 'Вы не можете удалить самого себя' },
          { status: 400 }
        );
      }

      await pool.execute('DELETE FROM users WHERE id = ?', [targetUserId]);
      
      // Инвалидируем кэш пользователей
      cache.clear();
      
      return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
    }
  }
}