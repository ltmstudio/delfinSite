import { NextRequest } from 'next/server';
import { CategoryController } from '@/controllers/CategoryController';

/**
 * GET /api/categories
 * Получить все категории
 */
export async function GET(request: NextRequest) {
  return CategoryController.index(request);
}

/**
 * POST /api/categories
 * Создать новую категорию
 */
export async function POST(request: NextRequest) {
  return CategoryController.store(request);
}
