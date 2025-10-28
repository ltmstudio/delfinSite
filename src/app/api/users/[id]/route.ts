import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/UserController';

/**
 * GET /api/users/[id]
 * Получить пользователя по ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return UserController.show(id);
}

/**
 * PUT /api/users/[id]
 * Обновить пользователя
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return UserController.update(id, request);
}

/**
 * DELETE /api/users/[id]
 * Удалить пользователя
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return UserController.destroy(request, id);
}
