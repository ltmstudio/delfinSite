'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface Category {
  id: number;
  name_ru: string;
  name_en: string;
  name_tk: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  productCount?: number;
}

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_ru: '',
    name_en: '',
    name_tk: '',
    description: '',
    imageUrl: '',
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const mountedRef = useRef(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories?page=${currentPage}&limit=${pageSize}`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    if (!mountedRef.current) {
      mountedRef.current = true;
      fetchCategories();
    }
  }, [session, status, fetchCategories]);

  // Отдельный useEffect для отслеживания изменений пагинации
  useEffect(() => {
    if (mountedRef.current) {
      fetchCategories();
    }
  }, [currentPage, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setCategories(categories.filter(c => c.id !== id));
        showToast('Категория удалена успешно', 'success');
        // Закрываем модальное окно после успешного удаления
        setShowModal(false);
        setEditingCategory(null);
      } else {
        showToast(data.error || 'Ошибка удаления категории', 'error');
      }
    } catch (error) {
      showToast('Ошибка удаления категории', 'error');
    }
  };

  const handleDoubleClick = (category: Category) => {
    setEditingCategory(category);
    setImagePreview(category.imageUrl || '');
    setFormData({
      name_ru: category.name_ru,
      name_en: category.name_en,
      name_tk: category.name_tk,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      isActive: category.isActive
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setImagePreview('');
    setFormData({
      name_ru: '',
      name_en: '',
      name_tk: '',
      description: '',
      imageUrl: '',
      isActive: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}` 
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const updateData: any = {
        name_ru: formData.name_ru,
        name_en: formData.name_en,
        name_tk: formData.name_tk,
        description: formData.description,
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
          editingCategory ? 'Категория обновлена' : 'Категория создана', 
          'success'
        );
        handleCloseModal();
        fetchCategories();
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
                <h1 className="h4 fw-bold text-dark mb-0">Категории</h1>
                <p className="text-muted small mb-0">Управление категориями товаров</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingCategory(null);
                setImagePreview('');
                setFormData({name_ru: '', name_en: '', name_tk: '', description: '', imageUrl: '', isActive: true});
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить категорию
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
          {categories.length === 0 ? (
            <div className="card-body text-center py-5">
              <div className="mx-auto mb-4" style={{width: '3rem', height: '3rem', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg style={{width: '1.5rem', height: '1.5rem', color: '#94a3b8'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="h5 fw-medium text-dark mb-2">Категории не найдены</h3>
              <p className="text-muted mb-4">Начните с добавления первой категории</p>
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
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Товары</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Статус</th>
                    <th style={{padding: '1rem 0.75rem', fontWeight: '600', borderBottom: '2px solid #dee2e6'}}>Создана</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr 
                      key={category.id} 
                      onDoubleClick={() => handleDoubleClick(category)}
                      style={{transition: 'background-color 0.15s ease', cursor: 'pointer'}}
                    >
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <span className="text-muted">{category.id}</span>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        {category.imageUrl ? (
                          <img
                            className="rounded-3 shadow-sm"
                            src={category.imageUrl}
                            alt={category.name_ru}
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
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <h6 className="fw-semibold text-dark mb-0" style={{fontSize: '0.9375rem'}}>
                          {category.name_ru}
                        </h6>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <h6 className="fw-semibold text-dark mb-0" style={{fontSize: '0.9375rem'}}>
                          {category.name_en}
                        </h6>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <h6 className="fw-semibold text-dark mb-0" style={{fontSize: '0.9375rem'}}>
                          {category.name_tk}
                        </h6>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <p className="text-muted small mb-0" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.875rem'}}>
                          {category.description || '—'}
                        </p>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <span className="badge bg-info">
                          {category.productCount || 0} товаров
                        </span>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}} onClick={(e) => e.stopPropagation()}>
                        <div className="form-check form-switch" onClick={(e) => e.stopPropagation()}>
                          <input 
                            className="form-check-input"
                            style={{backgroundColor: category.isActive ? '#198754' : '', borderColor: category.isActive ? '#198754' : ''}}
                            type="checkbox" 
                            checked={category.isActive}
                            onChange={(e) => {
                              const newStatus = !category.isActive;
                              fetch(`/api/categories/${category.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ isActive: newStatus })
                              }).then(res => {
                                if (res.ok) {
                                  setCategories(categories.map(c => 
                                    c.id === category.id ? {...c, isActive: newStatus} : c
                                  ));
                                  showToast(`Категория ${newStatus ? 'активирована' : 'деактивирована'}`, 'success');
                                }
                              });
                            }}
                          />
                        </div>
                      </td>
                      <td style={{padding: '1rem 0.75rem', verticalAlign: 'middle'}}>
                        <small className="text-muted" style={{fontSize: '0.875rem'}}>
                          {new Date(category.createdAt).toLocaleDateString()}
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
                  {editingCategory ? 'Редактировать категорию' : 'Создать категорию'}
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
                      <label className="form-label mb-1">Описание</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <label className="form-check-label">Активна</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer py-3 px-4">
                  {editingCategory && (
                    <button 
                      type="button" 
                      className="btn btn-danger me-auto"
                      onClick={() => handleDelete(editingCategory.id)}
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
