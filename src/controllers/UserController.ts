import { pool } from '@/lib/mysql';
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
      const [users] = await pool.execute(
        'SELECT id, name, email, role, isActive, createdAt, updatedAt FROM users ORDER BY createdAt DESC'
      );
      return NextResponse.json({ success: true, data: users });
    } catch (error) {
      console.error('Error fetching users:', error);
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
      console.error('Error fetching user:', error);
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

      return NextResponse.json({ success: true, data: (users as any[])[0], message: 'User created successfully' }, { status: 201 });
    } catch (error) {
      console.error('Error creating user:', error);
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
      params.push(parseInt(id));

      await pool.execute(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      const [users] = await pool.execute(
        'SELECT id, name, email, role, isActive, createdAt, updatedAt FROM users WHERE id = ?',
        [parseInt(id)]
      );

      return NextResponse.json({ success: true, data: (users as any[])[0], message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
    }
  }

  /**
   * DELETE /api/users/[id]
   * Удалить пользователя
   */
  static async destroy(id: string) {
    try {
      await pool.execute('DELETE FROM users WHERE id = ?', [parseInt(id)]);
      return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
    }
  }
}