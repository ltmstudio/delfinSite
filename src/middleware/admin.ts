import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware для защиты админ панели
 * Проверяет аутентификацию (как в Laravel)
 */
export async function adminMiddleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Если пользователь не аутентифицирован
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Если пользователь не админ
  if (token.role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}
