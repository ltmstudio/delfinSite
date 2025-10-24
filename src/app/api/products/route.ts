import { NextRequest } from 'next/server';
import { ProductController } from '@/controllers/ProductController';

/**
 * GET /api/products
 * Получить все товары
 */
export async function GET(request: NextRequest) {
  return ProductController.index(request);
}

/**
 * POST /api/products
 * Создать новый товар
 */
export async function POST(request: NextRequest) {
  return ProductController.store(request);
}
