import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/UserController';

/**
 * GET /api/users
 * Получить всех пользователей
 */
export async function GET(request: NextRequest) {
  return UserController.index(request);
}

/**
 * POST /api/users
 * Создать нового пользователя
 */
export async function POST(request: NextRequest) {
  return UserController.store(request);
}
