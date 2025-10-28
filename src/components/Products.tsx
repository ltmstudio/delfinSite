'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { smoothScroll, createScrollWatcher } from '@/utils/scroll';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryName: string;
}

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { products: productTranslations, locale } = useLocalizedContent();

  // Загрузка категорий из API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        // Преобразуем категории из API в формат для фронтенда
        const apiCategories = data.data.map((cat: any) => ({
          id: cat.name_en.toLowerCase().replace(/\s+/g, '_'),
          name: locale === 'ru' ? cat.name_ru : 
                locale === 'en' ? cat.name_en : 
                locale === 'tr' ? cat.name_tk : cat.name_ru
        }));
        
        // Добавляем категорию "Все" в начало
        setCategories([
          { id: 'all', name: locale === 'ru' ? 'Все' : 
                           locale === 'en' ? 'All' : 
                           locale === 'tr' ? 'Tümü' : 'Все' },
          ...apiCategories
        ]);
      }
    } catch (error) {
      // Fallback к статическим категориям
      setCategories(productTranslations.categories);
    }
  };

  // Загрузка товаров из API
  const fetchProducts = async (category: string) => {
    try {
      setLoading(true);
      const url = category === 'all' 
        ? `/api/products/public?locale=${locale}`
        : `/api/products/public?category=${category}&locale=${locale}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    fetchCategories();
  }, [locale]);

  // Загрузка товаров при смене категории
  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory, locale]);

  // Функции для управления скроллом
  const handleScrollLeft = () => {
    smoothScroll(scrollContainerRef.current, -720);
  };

  const handleScrollRight = () => {
    smoothScroll(scrollContainerRef.current, 720);
  };

  // Эффект для проверки кнопок при изменении категории
  useEffect(() => {
    // Сброс скролла при смене категории
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [activeCategory]);

  // Слушатель скролла
  useEffect(() => {
    const cleanup = createScrollWatcher(
      scrollContainerRef.current,
      ({ left, right }) => {
        setCanScrollLeft(left);
        setCanScrollRight(right);
      }
    );
    return cleanup;
  }, [products]);

  return (
    <section id="products" className="products vh-100">
      <div className="product-container">
        <div className="products__content">
          {/* Заголовок и категории */}
          <div className="row mb-5">
            <div className="col-lg-8">
              <div className="products__brand">{productTranslations.brand}</div>
              <h2 className="products__title">{productTranslations.title}</h2>
            </div>
            <div className="col-lg-4">
              <div className="products__categories d-flex justify-content-end gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`products__category-btn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Продукты */}
          <div className="row">
            <div className="col-12">
               <div className="products__container">
                 <div 
                   className="products__scroll-container"
                   ref={scrollContainerRef}
                 >
                   <div className="products__grid">
                    {loading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Загрузка...</span>
                        </div>
                      </div>
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <div key={product.id} className="products__card">
                          <div 
                            className="products__card-bg"
                            style={{ backgroundColor: '#2c2c2c' }}
                          >
                            <div className="products__image-container" style={{ position: 'relative' }}>
                              <Image 
                                src={product.imageUrl} 
                                alt={product.name}
                                fill
                                className="products__image"
                                style={{ objectFit: 'contain' }}
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              />
                            </div>
                            <div className="products__info">
                              <h3 className="products__name">{product.name}</h3>
                              <p className="products__tagline">{product.description}</p>
                              {product.price && (
                                <p className="products__price">{product.price.toLocaleString()} руб.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
                        <p className="text-muted">Товары не найдены</p>
                      </div>
                    )}
                  </div>
                </div>

                 {/* Навигация */}
                 <div className="products__navigation">
                   <button 
                     className="products__nav-btn products__nav-btn--prev" 
                     disabled={!canScrollLeft}
                     onClick={handleScrollLeft}
                   >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                       <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </button>
                   <button 
                     className="products__nav-btn products__nav-btn--next"
                     disabled={!canScrollRight}
                     onClick={handleScrollRight}
                   >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                       <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
