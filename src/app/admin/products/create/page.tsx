'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Страница создания товара
 */
export default function CreateProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    imageUrl: '',
    isActive: true
  });

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      // Ошибка загрузки категорий скрывается в UI через setError при необходимости
    }
  };

  // Загружаем категории при загрузке страницы
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          categoryId: parseInt(formData.categoryId)
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.error || 'Ошибка создания товара');
      }
    } catch (error) {
      setError('Ошибка создания товара');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <div style={{minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column'}}>
      {/* Header */}
      <header style={{backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5', flexShrink: 0}}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <Link href="/admin/products" className="text-dark me-3" style={{textDecoration: 'none'}}>
                ← Назад к товарам
              </Link>
              <h1 className="h5 fw-bold text-dark mb-0">Создать товар</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid py-3" style={{flex: 1, overflow: 'auto'}}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border" style={{borderRadius: '0.5rem'}}>
              <div className="card-body p-3">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger mb-3">
                      {error}
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label htmlFor="name" className="form-label fw-medium">Название товара *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Введите название товара"
                      />
                    </div>

                    <div className="col-md-6 mb-2">
                      <label htmlFor="categoryId" className="form-label fw-medium">Категория *</label>
                      <select
                        className="form-select form-select-sm"
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Выберите категорию</option>
                        {categories.map((category: any) => (
                          <option key={category.id} value={category.id}>
                            {category.name_ru || category.name_en || category.name_tk || `Category ${category.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-2">
                    <label htmlFor="description" className="form-label fw-medium">Описание</label>
                    <textarea
                      className="form-control form-control-sm"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Введите описание товара"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label htmlFor="price" className="form-label fw-medium">Цена (руб.)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-sm"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="col-md-6 mb-2">
                      <label htmlFor="imageUrl" className="form-label fw-medium">URL изображения</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
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
                        Товар активен
                      </label>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary btn-sm"
                    >
                      {loading ? 'Создание...' : 'Создать товар'}
                    </button>
                    <Link href="/admin/products" className="btn btn-outline-secondary btn-sm">
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
