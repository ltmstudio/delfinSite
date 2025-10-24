import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './database';

/**
 * Конфигурация NextAuth
 * Аутентификация через email/password (как в Laravel)
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔍 NextAuth: Попытка аутентификации', { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ NextAuth: Отсутствуют учетные данные');
          return null;
        }

        try {
          // Ищем пользователя в базе данных
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          console.log('👤 NextAuth: Пользователь найден', { 
            found: !!user, 
            isActive: user?.isActive,
            email: user?.email 
          });

          if (!user || !user.isActive) {
            console.log('❌ NextAuth: Пользователь не найден или неактивен');
            return null;
          }

          // Проверяем пароль
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('🔐 NextAuth: Проверка пароля', { isValid: isPasswordValid });

          if (!isPasswordValid) {
            console.log('❌ NextAuth: Неверный пароль');
            return null;
          }

          console.log('✅ NextAuth: Аутентификация успешна');
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('❌ NextAuth: Ошибка аутентификации:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  }
};
