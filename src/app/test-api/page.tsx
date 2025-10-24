'use client';

import { useState, useEffect } from 'react';

/**
 * Тестовая страница для проверки API
 */
export default function TestApiPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      const [productsData, categoriesData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json()
      ]);

      setProducts(productsData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Тест API - Del'fin
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Товары */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Товары ({products.length})
            </h2>
            <div className="space-y-3">
              {products.map((product: any) => (
                <div key={product.id} className="border rounded p-3">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-sm text-gray-500">
                    Категория: {product.category}
                    {product.price && ` • ${product.price} руб.`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Категории */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Категории ({categories.length})
            </h2>
            <div className="space-y-3">
              {categories.map((category: any) => (
                <div key={category.id} className="border rounded p-3">
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/admin/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-medium"
          >
            Перейти в админку
          </a>
        </div>
      </div>
    </div>
  );
}
