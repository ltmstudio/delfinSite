'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Страница редактирования категории
 */
export default function EditCategoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    if (session) {
      fetchCategory();
    }
  }, [session, categoryId]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`);
      const data = await response.json();
      
      if (data.success) {
        const category = data.data;
        setFormData({
          name: category.name || '',
          description: category.description || '',
          imageUrl: category.imageUrl || '',
          isActive: category.isActive
        });
      } else {
        setError('Категория не найдена');
      }
    } catch (error) {
      setError('Ошибка загрузки категории');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/categories');
      } else {
        setError(data.error || 'Ошибка обновления категории');
      }
    } catch (error) {
      setError('Ошибка обновления категории');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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
              <Link href="/admin/categories" className="text-dark me-3" style={{textDecoration: 'none'}}>
                ← Назад к категориям
              </Link>
              <h1 className="h4 fw-bold text-dark mb-0">Редактировать категорию</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border" style={{borderRadius: '0.5rem'}}>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger mb-4">
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-medium">Название категории *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Введите название категории"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label fw-medium">Описание</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Введите описание категории"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label fw-medium">URL изображения</label>
                    <input
                      type="url"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-medium" htmlFor="isActive">
                        Категория активна
                      </label>
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn btn-primary"
                    >
                      {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                    <Link href="/admin/categories" className="btn btn-outline-secondary">
                      Отмена
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
