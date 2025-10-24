import { NextRequest } from 'next/server';
import { CategoryController } from '@/controllers/CategoryController';

/**
 * GET /api/categories/[id]
 * Получить категорию по ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return CategoryController.show(params.id);
}

/**
 * PUT /api/categories/[id]
 * Обновить категорию
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return CategoryController.update(params.id, request);
}

/**
 * DELETE /api/categories/[id]
 * Удалить категорию
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return CategoryController.destroy(params.id);
}
