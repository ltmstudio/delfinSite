import { NextRequest } from 'next/server';
import { CategoryController } from '@/controllers/CategoryController';

/**
 * GET /api/categories/[id]
 * Получить категорию по ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return CategoryController.show(id);
}

/**
 * PUT /api/categories/[id]
 * Обновить категорию
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return CategoryController.update(id, request);
}

/**
 * DELETE /api/categories/[id]
 * Удалить категорию
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return CategoryController.destroy(id);
}
