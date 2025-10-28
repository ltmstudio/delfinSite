import { NextRequest } from 'next/server';
import { ProductController } from '@/controllers/ProductController';

/**
 * GET /api/products/[id]
 * Получить товар по ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.show(id);
}

/**
 * PUT /api/products/[id]
 * Обновить товар
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.update(id, request);
}

/**
 * DELETE /api/products/[id]
 * Удалить товар
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.destroy(id);
}
