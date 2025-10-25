'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
        showToast('Пользователь удален успешно', 'success');
      } else {
        showToast('Ошибка удаления пользователя', 'error');
      }
    } catch (error) {
      showToast('Ошибка удаления пользователя', 'error');
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
            <Link 
              href="/admin/users/new" 
              className="btn btn-primary"
            >
              <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить пользователя
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
                    <th style={{width: '60px'}}>Аватар</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th>Создан</th>
                    <th style={{width: '200px'}}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center justify-content-center" style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '50%'}}>
                          <span className="text-white fw-bold" style={{fontSize: '1.125rem'}}>
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
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
                      <td>
                        <span className={`badge ${
                          user.isActive 
                            ? 'bg-success' 
                            : 'bg-danger'
                        }`}>
                          {user.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id)}
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
