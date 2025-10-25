import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pool } from './mysql';
import bcrypt from 'bcryptjs';

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
          // Прямое подключение к MySQL
          const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ? AND isActive = 1',
            [credentials.email]
          );

          const users = rows as any[];
          const user = users[0];

          console.log('👤 NextAuth: Пользователь найден', {
            found: !!user,
            isActive: user?.isActive,
            email: user?.email
          });

          if (!user) {
            console.log('❌ NextAuth: Пользователь не найден');
            return null;
          }

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
    }),
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
