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
    <div className="admin-page d-flex align-items-center justify-content-center" style={{minHeight: '100vh', padding: '3rem 1rem'}}>
      {/* Анимированные декоративные элементы */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
        <div style={{position: 'absolute', top: '5rem', left: '5rem', width: '18rem', height: '18rem', backgroundColor: 'rgba(59, 130, 246, 0.3)', borderRadius: '50%', filter: 'blur(3rem)', animation: 'pulse 2s infinite'}}></div>
        <div style={{position: 'absolute', top: '10rem', right: '5rem', width: '24rem', height: '24rem', backgroundColor: 'rgba(147, 51, 234, 0.3)', borderRadius: '50%', filter: 'blur(3rem)', animation: 'pulse 2s infinite 1s'}}></div>
        <div style={{position: 'absolute', bottom: '5rem', left: '33%', width: '20rem', height: '20rem', backgroundColor: 'rgba(236, 72, 153, 0.3)', borderRadius: '50%', filter: 'blur(3rem)', animation: 'pulse 2s infinite 2s'}}></div>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '16rem', height: '16rem', backgroundColor: 'rgba(6, 182, 212, 0.2)', borderRadius: '50%', filter: 'blur(2rem)', animation: 'pulse 2s infinite 0.5s'}}></div>
      </div>
      
      <div style={{position: 'relative', zIndex: 10, width: '100%', maxWidth: '28rem'}}>
        {/* Логотип и заголовок */}
        <div className="text-center mb-5">
          <div className="mx-auto mb-4" style={{width: '5rem', height: '5rem', background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
            <span className="text-white fw-bold" style={{fontSize: '1.875rem'}}>D</span>
          </div>
          <h1 className="text-white mb-3 fw-bold" style={{fontSize: '2.25rem', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Добро пожаловать
          </h1>
          <p className="text-white-50" style={{fontSize: '1.125rem'}}>
            Войдите в админ панель Del'fin
          </p>
        </div>

        {/* Форма входа */}
        <div style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-white-50">
                  Email адрес
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-control"
                  style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', color: 'white', padding: '0.75rem 1rem'}}
                  placeholder="admin@delfin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label text-white-50">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-control"
                  style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', color: 'white', padding: '0.75rem 1rem'}}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger mb-3" style={{backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fecaca'}}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn w-100 text-white fw-semibold py-3 px-4 rounded-3"
              style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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

        {/* Тестовые данные */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h3 className="text-slate-300 text-sm font-medium mb-2">Тестовые данные:</h3>
          <div className="text-slate-400 text-xs space-y-1">
            <p>Email: <span className="text-slate-300">admin@delfin.com</span></p>
            <p>Пароль: <span className="text-slate-300">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
