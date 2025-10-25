'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Страница управления категориями
 * CRUD операции (как в Laravel)
 */
export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchCategories();
  }, [session, status, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCategories(categories.filter(c => c.id !== id));
        showToast('Категория удалена успешно', 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Ошибка удаления категории', 'error');
      }
    } catch (error) {
      showToast('Ошибка удаления категории', 'error');
    }
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
              <Link href="/admin" className="text-primary me-3" style={{textDecoration: 'none'}}>
                ← Назад
              </Link>
              <h1 className="h4 fw-bold text-dark mb-0">
                Управление категориями
              </h1>
            </div>
            <Link
              href="/admin/categories/create"
              className="btn btn-primary"
            >
              <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить категорию
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid py-4">
        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}

        <div className="card shadow-sm border-0" style={{borderRadius: '1rem'}}>
          {categories.length === 0 ? (
            <div className="card-body text-center py-5">
              <div className="mx-auto mb-4" style={{width: '3rem', height: '3rem', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg style={{width: '1.5rem', height: '1.5rem', color: '#94a3b8'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="h5 fw-medium text-dark mb-2">Категории не найдены</h3>
              <p className="text-muted mb-4">Начните с добавления первой категории</p>
              <Link
                href="/admin/categories/create"
                className="btn btn-primary"
              >
                Добавить категорию
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th style={{width: '60px'}}>Фото</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Товары</th>
                    <th>Статус</th>
                    <th>Создана</th>
                    <th style={{width: '200px'}}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        {category.imageUrl ? (
                          <img
                            className="rounded-3 shadow-sm"
                            src={category.imageUrl}
                            alt={category.name}
                            style={{width: '3rem', height: '3rem', objectFit: 'cover'}}
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center" style={{width: '3rem', height: '3rem', backgroundColor: '#f1f5f9', borderRadius: '0.75rem'}}>
                            <svg style={{width: '1.5rem', height: '1.5rem', color: '#94a3b8'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td>
                        <h6 className="fw-semibold text-dark mb-0">
                          {category.name}
                        </h6>
                      </td>
                      <td>
                        <p className="text-muted small mb-0" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                          {category.description || '—'}
                        </p>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {category.productCount || 0} товаров
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          category.isActive 
                            ? 'bg-success' 
                            : 'bg-danger'
                        }`}>
                          {category.isActive ? 'Активна' : 'Неактивна'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
