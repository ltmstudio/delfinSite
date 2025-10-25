'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface Product {
  id: number;
  name: string;
  description: string | null;
  category: string;
  price: number | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Страница управления товарами
 * CRUD операции (как в Laravel)
 */
export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        showToast('Товар удален успешно', 'success');
      } else {
        showToast('Ошибка удаления товара', 'error');
      }
    } catch (error) {
      showToast('Ошибка удаления товара', 'error');
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
              <Link href="/admin" className="p-2 me-3 rounded-3" style={{transition: 'all 0.2s'}}>
                <svg style={{width: '1.25rem', height: '1.25rem', color: '#64748b'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="h4 fw-bold text-dark mb-0">Товары</h1>
                <p className="text-muted small mb-0">Управление каталогом товаров</p>
              </div>
            </div>
            <Link
              href="/admin/products/create"
              className="btn btn-primary"
            >
              <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить товар
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
          {products.length === 0 ? (
            <div className="card-body text-center py-5">
              <div className="mx-auto mb-4" style={{width: '3rem', height: '3rem', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg style={{width: '1.5rem', height: '1.5rem', color: '#94a3b8'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="h5 fw-medium text-dark mb-2">Товары не найдены</h3>
              <p className="text-muted mb-4">Начните с добавления первого товара</p>
              <Link
                href="/admin/products/create"
                className="btn btn-primary d-inline-flex align-items-center"
              >
                <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить товар
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th style={{width: '60px'}}>Фото</th>
                    <th>Название</th>
                    <th>Категория</th>
                    <th>Цена</th>
                    <th>Статус</th>
                    <th>Создан</th>
                    <th style={{width: '200px'}}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.imageUrl ? (
                          <img
                            className="rounded-3 shadow-sm"
                            src={product.imageUrl}
                            alt={product.name}
                            style={{width: '3rem', height: '3rem', objectFit: 'cover'}}
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center" style={{width: '3rem', height: '3rem', backgroundColor: '#f1f5f9', borderRadius: '0.75rem'}}>
                            <svg style={{width: '1.5rem', height: '1.5rem', color: '#94a3b8'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <h6 className="fw-semibold text-dark mb-1">
                            {product.name}
                          </h6>
                          {product.description && (
                            <p className="text-muted small mb-0" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                              {product.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="d-flex align-items-center">
                          <svg style={{width: '1rem', height: '1rem', marginRight: '0.25rem', color: '#6c757d'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {product.category}
                        </span>
                      </td>
                      <td>
                        {product.price ? (
                          <span className="d-flex align-items-center">
                            <svg style={{width: '1rem', height: '1rem', marginRight: '0.25rem', color: '#6c757d'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            {product.price} руб.
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          product.isActive 
                            ? 'bg-success' 
                            : 'bg-danger'
                        }`}>
                          {product.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
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
