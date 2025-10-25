'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Главная страница админки
 * Простой дашборд с навигацией
 */
export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  if (!session) {
    return null;
  }

  return (
     <div style={{minHeight: '100vh', backgroundColor: '#ffffff'}}>
       {/* Header */}
       <header style={{backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5'}}>
         <div className="container-fluid">
           <div className="d-flex justify-content-between align-items-center py-3">
             <div className="d-flex align-items-center">
               <div style={{width: '2.5rem', height: '2.5rem', backgroundColor: '#000000', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem'}}>
                 <span className="text-white fw-bold">D</span>
               </div>
               <div>
                 <h1 className="h4 fw-bold text-dark mb-0">Админ панель</h1>
                 <p className="text-muted small mb-0">Del'fin - Управление сайтом</p>
               </div>
             </div>
             <div className="d-flex align-items-center">
               <div className="text-end me-3">
                 <p className="text-dark fw-medium mb-0">{session.user?.name || session.user?.email}</p>
                 <p className="text-muted small mb-0">Администратор</p>
               </div>
               <button
                 onClick={handleLogout}
                 className="btn btn-outline-dark"
               >
                 Выйти
               </button>
             </div>
           </div>
         </div>
       </header>

      {/* Main Content */}
      <main className="container-fluid py-4">

         {/* Management Cards */}
         <div className="row g-4">
           <div className="col-md-6 col-lg-4">
             <Link href="/admin/products" className="text-decoration-none">
               <div className="card h-100 border" style={{borderRadius: '0.5rem'}}>
                 <div className="card-body p-4">
                   <div className="d-flex align-items-center mb-3">
                     <div className="p-3 me-3" style={{backgroundColor: '#f8f9fa', borderRadius: '0.5rem'}}>
                       <svg className="text-dark" style={{width: '1.5rem', height: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                       </svg>
                     </div>
                     <h5 className="card-title mb-0 text-dark">Товары</h5>
                   </div>
                   <p className="card-text text-muted mb-3">Управляйте каталогом товаров</p>
                   <div className="d-flex align-items-center text-dark fw-medium">
                     Перейти к товарам
                     <svg className="ms-2" style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                   </div>
                 </div>
               </div>
             </Link>
           </div>

           <div className="col-md-6 col-lg-4">
             <Link href="/admin/categories" className="text-decoration-none">
               <div className="card h-100 border" style={{borderRadius: '0.5rem'}}>
                 <div className="card-body p-4">
                   <div className="d-flex align-items-center mb-3">
                     <div className="p-3 me-3" style={{backgroundColor: '#f8f9fa', borderRadius: '0.5rem'}}>
                       <svg className="text-dark" style={{width: '1.5rem', height: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                       </svg>
                     </div>
                     <h5 className="card-title mb-0 text-dark">Категории</h5>
                   </div>
                   <p className="card-text text-muted mb-3">Организуйте товары по категориям</p>
                   <div className="d-flex align-items-center text-dark fw-medium">
                     Перейти к категориям
                     <svg className="ms-2" style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                   </div>
                 </div>
               </div>
             </Link>
           </div>

           <div className="col-md-6 col-lg-4">
             <Link href="/admin/users" className="text-decoration-none">
               <div className="card h-100 border" style={{borderRadius: '0.5rem'}}>
                 <div className="card-body p-4">
                   <div className="d-flex align-items-center mb-3">
                     <div className="p-3 me-3" style={{backgroundColor: '#f8f9fa', borderRadius: '0.5rem'}}>
                       <svg className="text-dark" style={{width: '1.5rem', height: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                       </svg>
                     </div>
                     <h5 className="card-title mb-0 text-dark">Пользователи</h5>
                   </div>
                   <p className="card-text text-muted mb-3">Управление пользователями системы</p>
                   <div className="d-flex align-items-center text-dark fw-medium">
                     Перейти к пользователям
                     <svg className="ms-2" style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                   </div>
                 </div>
               </div>
             </Link>
           </div>

           <div className="col-md-6 col-lg-4">
             <Link href="/" className="text-decoration-none">
               <div className="card h-100 border" style={{borderRadius: '0.5rem'}}>
                 <div className="card-body p-4">
                   <div className="d-flex align-items-center mb-3">
                     <div className="p-3 me-3" style={{backgroundColor: '#f8f9fa', borderRadius: '0.5rem'}}>
                       <svg className="text-dark" style={{width: '1.5rem', height: '1.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                       </svg>
                     </div>
                     <h5 className="card-title mb-0 text-dark">Сайт</h5>
                   </div>
                   <p className="card-text text-muted mb-3">Посмотреть публичный сайт</p>
                   <div className="d-flex align-items-center text-dark fw-medium">
                     Перейти на сайт
                     <svg className="ms-2" style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                   </div>
                 </div>
               </div>
             </Link>
           </div>
         </div>
      </main>
    </div>
  );
}
