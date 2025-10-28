'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface Product {
  id: number;
  name_ru: string;
  name_en: string;
  name_tk: string;
  description: string | null;
  category?: string;
  categoryName?: string;
  categoryId: number;
  price: number | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast, ToastContainer } = useToast();
  const [showModal, setShowModal] = useState(false);
  // Серверная пагинация
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name_ru: '',
    name_en: '',
    name_tk: '',
    description: '',
    categoryId: '',
    price: '',
    imageUrl: '',
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const mountedRef = useRef(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`/api/products?page=${currentPage}&limit=${pageSize}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    if (!mountedRef.current) {
      mountedRef.current = true;
      fetchProducts();
      fetchCategories();
    }
  }, [session, status, fetchProducts, fetchCategories]);

  // Отдельный useEffect для отслеживания изменений пагинации
  useEffect(() => {
    if (mountedRef.current) {
      fetchProducts();
    }
  }, [currentPage, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setProducts(products.filter(p => p.id !== id));
        showToast('Товар удален успешно', 'success');
        // Закрываем модальное окно после успешного удаления
        setShowModal(false);
        setEditingProduct(null);
      } else {
        showToast(data.error || 'Ошибка удаления товара', 'error');
      }
    } catch (error) {
      showToast('Ошибка удаления товара', 'error');
    }
  };

  const handleDoubleClick = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.imageUrl || '');
    setFormData({
      name_ru: product.name_ru,
      name_en: product.name_en,
      name_tk: product.name_tk,
      description: product.description || '',
      categoryId: String(product.categoryId),
      price: product.price ? String(product.price) : '',
      imageUrl: product.imageUrl || '',
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImagePreview('');
    setFormData({
      name_ru: '',
      name_en: '',
      name_tk: '',
      description: '',
      categoryId: '',
      price: '',
      imageUrl: '',
      isActive: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}` 
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const updateData: any = {
        name_ru: formData.name_ru,
        name_en: formData.name_en,
        name_tk: formData.name_tk,
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        price: formData.price ? parseFloat(formData.price) : null,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        showToast(
          editingProduct ? 'Товар обновлен' : 'Товар создан', 
          'success'
        );
        handleCloseModal();
        fetchProducts();
      } else {
        showToast(data.error || 'Ошибка', 'error');
      }
    } catch (error) {
      showToast('Ошибка', 'error');
    } finally {
      setLoading(false);
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
            <button 
              onClick={() => {
                setEditingProduct(null);
                setImagePreview('');
                setFormData({name_ru: '', name_en: '', name_tk: '', description: '', categoryId: '', price: '', imageUrl: '', isActive: true});
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить товар
            </button>
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
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover" style={{fontSize: '0.9375rem'}}>
                <thead className="table-light">
                  <tr>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6', width: '70px'}}>ID</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6', width: '60px'}}>Фото</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Название (RU)</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Название (EN)</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Название (TK)</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Описание</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Категория</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Цена</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Статус</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Создан</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr 
                      key={product.id} 
                      onDoubleClick={() => handleDoubleClick(product)}
                      style={{transition: 'background-color 0.15s ease', cursor: 'pointer'}}
                    >
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <span className="text-muted">{product.id}</span>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        {product.imageUrl ? (
                          <img
                            className="rounded-3 shadow-sm"
                            src={product.imageUrl}
                            alt={product.name_ru}
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
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <h6 className="fw-semibold text-dark mb-0" style={{fontSize: '0.9375rem'}}>
                          {product.name_ru}
                        </h6>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <h6 className="fw-semibold text-dark mb-0" style={{fontSize: '0.9375rem'}}>
                          {product.name_en}
                        </h6>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <h6 className="fw-semibold text-dark mb-0" style={{fontSize: '0.9375rem'}}>
                          {product.name_tk}
                        </h6>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <p className="text-muted small mb-0" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.875rem'}}>
                          {product.description || '—'}
                        </p>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <span style={{fontSize: '0.9375rem', color: '#495057'}}>
                          {product.categoryName || product.category || '—'}
                        </span>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        {product.price ? (
                          <span style={{fontSize: '0.9375rem'}}>
                            {product.price} руб.
                          </span>
                        ) : (
                          <span className="text-muted" style={{fontSize: '0.9375rem'}}>—</span>
                        )}
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}} onClick={(e) => e.stopPropagation()}>
                        <div className="form-check form-switch" onClick={(e) => e.stopPropagation()}>
                          <input 
                            className="form-check-input"
                            style={{backgroundColor: product.isActive ? '#198754' : '', borderColor: product.isActive ? '#198754' : ''}}
                            type="checkbox" 
                            checked={product.isActive}
                            onChange={(e) => {
                              const newStatus = !product.isActive;
                              fetch(`/api/products/${product.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ isActive: newStatus })
                              }).then(res => {
                                if (res.ok) {
                                  setProducts(products.map(p => 
                                    p.id === product.id ? {...p, isActive: newStatus} : p
                                  ));
                                  showToast(`Товар ${newStatus ? 'активирован' : 'деактивирован'}`, 'success');
                                }
                              });
                            }}
                          />
                        </div>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <small className="text-muted" style={{fontSize: '0.875rem'}}>
                          {new Date(product.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted">На странице:</span>
                  <select
                    className="form-select form-select-sm"
                    style={{width: '90px'}}
                    value={pageSize}
                    onChange={(e) => {
                      const size = parseInt(e.target.value);
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Назад
                  </button>
                  <span className="text-muted small">
                    Стр. {currentPage} из {pagination.pages} • Всего: {pagination.total}
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage >= pagination.pages}
                    onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                  >
                    Вперёд
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div 
          className="modal show" 
          style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', minHeight: '100vh', padding: '1rem'}}
          onClick={handleCloseModal}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" style={{maxWidth: '860px', margin: '1.5rem'}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{borderRadius: '0.75rem'}}>
              <div className="modal-header py-3">
                <h5 className="modal-title">
                  {editingProduct ? 'Редактировать товар' : 'Создать товар'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label mb-1">Название (Русский) *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name_ru}
                        onChange={(e) => setFormData({...formData, name_ru: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label mb-1">Название (English) *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name_en}
                        onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-1">Название (Türkçe) *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name_tk}
                        onChange={(e) => setFormData({...formData, name_tk: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label mb-1">Категория *</label>
                      <select
                        className="form-select"
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      >
                        <option value="">Выберите категорию</option>
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name_ru || cat.name_en || cat.name_tk || `Категория ${cat.id}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label mb-1">Описание</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-1">Цена</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label mb-1">Изображение</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreview(reader.result as string);
                              setFormData({...formData, imageUrl: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {imagePreview && (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{width: '80px', height: '80px', objectFit: 'cover', marginTop: '8px', borderRadius: '8px'}}
                        />
                      )}
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <label className="form-check-label">Активен</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer py-3">
                  {editingProduct && (
                    <button 
                      type="button" 
                      className="btn btn-danger me-auto"
                      onClick={() => handleDelete(editingProduct.id)}
                    >
                      Удалить
                    </button>
                  )}
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
