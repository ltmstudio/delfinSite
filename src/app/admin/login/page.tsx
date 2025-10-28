'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Страница входа в админку
 * Форма аутентификации (как в Laravel)
 */
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Неверный email или пароль');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      setError('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page d-flex align-items-center justify-content-center" style={{minHeight: '100vh', backgroundColor: '#ffffff', padding: '3rem 1rem'}}>
      <div style={{width: '100%', maxWidth: '28rem'}}>

        {/* Форма входа */}
        <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e5e5'}}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-dark">
                  Email адрес
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-control"
                  style={{backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: '#000000', padding: '0.75rem 1rem'}}
                  placeholder="Введите email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label text-dark">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-control"
                  style={{backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: '#000000', padding: '0.75rem 1rem'}}
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger mb-3" style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626'}}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn w-100 text-white fw-semibold py-3 px-4"
              style={{ 
                backgroundColor: '#000000', 
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Вход...
                </div>
              ) : (
                'Войти в админку'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
