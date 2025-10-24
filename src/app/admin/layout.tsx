'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import './admin.css';

/**
 * Layout для админки с провайдером сессий
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Добавляем класс к body для принудительного отключения кастомного курсора
    document.body.classList.add('admin-page');
    document.documentElement.classList.add('admin-page');
    
    return () => {
      // Убираем класс при размонтировании
      document.body.classList.remove('admin-page');
      document.documentElement.classList.remove('admin-page');
    };
  }, []);

  return (
    <div className="admin-page">
      <SessionProvider>
        {children}
      </SessionProvider>
    </div>
  );
}
