'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Страница управления пользователями
 * CRUD операции для пользователей
 */
export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    isActive: true
  });
  const mountedRef = useRef(false);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/users?page=${currentPage}&limit=${pageSize}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Ошибка загрузки пользователей');
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
      fetchUsers();
    }
  }, [session, status, currentPage, pageSize]);

  // Отдельный useEffect для отслеживания изменений пагинации
  useEffect(() => {
    if (mountedRef.current) {
      fetchUsers();
    }
  }, [currentPage, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUsers(users.filter(u => u.id !== id));
        showToast('Пользователь удален успешно', 'success');
        // Закрываем модальное окно после успешного удаления
        setShowModal(false);
        setEditingUser(null);
      } else {
        showToast(data.error || 'Ошибка удаления пользователя', 'error');
      }
    } catch (error) {
      showToast('Ошибка удаления пользователя', 'error');
    }
  };

  const handleDoubleClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      isActive: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingUser 
        ? `/api/users/${editingUser.id}` 
        : '/api/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive
      };

      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        showToast(
          editingUser ? 'Пользователь обновлен' : 'Пользователь создан', 
          'success'
        );
        handleCloseModal();
        fetchUsers();
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
                <h1 className="h4 fw-bold text-dark mb-0">Пользователи</h1>
                <p className="text-muted small mb-0">Управление пользователями системы</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingUser(null);
                setFormData({name: '', email: '', password: '', role: 'admin', isActive: true});
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить пользователя
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
          {users.length === 0 ? (
            <div className="card-body text-center py-5">
              <div className="mx-auto mb-4" style={{width: '3rem', height: '3rem', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg style={{width: '1.5rem', height: '1.5rem', color: '#94a3b8'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="h5 fw-medium text-dark mb-2">Пользователи не найдены</h3>
              <p className="text-muted mb-4">Начните с добавления первого пользователя</p>
              <Link
                href="/admin/users/new"
                className="btn btn-primary d-inline-flex align-items-center"
              >
                <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить пользователя
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th style={{width: '70px'}}>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th>Создан</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      onDoubleClick={() => handleDoubleClick(user)}
                      style={{cursor: 'pointer'}}
                    >
                      <td>
                        <span className="text-muted">{user.id}</span>
                      </td>
                      <td>
                        <h6 className="fw-semibold text-dark mb-0">
                          {user.name || 'Без имени'}
                        </h6>
                      </td>
                      <td>
                        <span className="text-muted">
                          {user.email}
                        </span>
                      </td>
                      <td>
                        <span className="d-flex align-items-center">
                          <svg style={{width: '1rem', height: '1rem', marginRight: '0.25rem', color: '#6c757d'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {user.role}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="form-check form-switch" onClick={(e) => e.stopPropagation()}>
                          <input 
                            className="form-check-input"
                            style={{backgroundColor: user.isActive ? '#198754' : '', borderColor: user.isActive ? '#198754' : ''}}
                            type="checkbox" 
                            checked={user.isActive}
                            onChange={async (e) => {
                              const newStatus = !user.isActive;
                              try {
                                const res = await fetch(`/api/users/${user.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ isActive: newStatus })
                                });
                                const data = await res.json();
                                if (res.ok && data.success) {
                                  setUsers(users.map(u => 
                                    u.id === user.id ? {...u, isActive: newStatus} : u
                                  ));
                                  showToast(`Пользователь ${newStatus ? 'активирован' : 'деактивирован'}`, 'success');
                                } else {
                                  showToast(data.error || 'Ошибка обновления статуса', 'error');
                                }
                              } catch (error) {
                                showToast('Ошибка обновления статуса', 'error');
                              }
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
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
          style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}
          onClick={handleCloseModal}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? 'Редактировать пользователя' : 'Создать пользователя'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Имя</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Пароль {editingUser ? '(оставьте пустым)' : '*'}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      required={!editingUser}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Роль</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="admin">Администратор</option>
                      <option value="user">Пользователь</option>
                    </select>
                  </div>
                  <div className="mb-3">
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
                <div className="modal-footer">
                  {editingUser && (
                    <button 
                      type="button" 
                      className="btn btn-danger me-auto"
                      onClick={() => {
                        handleDelete(editingUser.id);
                        handleCloseModal();
                      }}
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
