'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { initScrollAnimations } from '@/utils/animations';

const Categories = () => {
  const { categories } = useLocalizedContent();

  // Инициализация анимаций появления при скролле
  useEffect(() => {
    const animationObserver = initScrollAnimations();
    return () => animationObserver.disconnect();
  }, []);

  return (
    <section id="categories" className="categories">
      <div className="container"> {/* Using Bootstrap container */}
        {/* Header секция */}
        <div className="row justify-content-left mb-5 align-items-start ">
          <div className="col-12 col-lg-8 text-start ">
            <h2 className="section__title mb-3 animate-on-scroll" data-animation="animate-fade-in-up">
              {categories.title}
            </h2>
            <h3 className="categories__subtitle mb-4 animate-on-scroll" data-animation="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {categories.subtitle}
            </h3>
            <p className="categories__description animate-on-scroll" data-animation="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {categories.description}
            </p>
          </div>
        </div>

        {/* Основное изображение */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="category__featured animate-on-scroll" data-animation="animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="category__image">
                <Image
                  src="/category_banners/smesitel_banner.jpg"
                  alt={categories.gestureControl}
                  fill
                  className="category__bg-image"
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className="category__placeholder">
                  <span>{categories.gestureControl}</span>
                  <small>{categories.touchlessOperation}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Два меньших изображения */}
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="category__item animate-on-scroll" data-animation="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="category__image">
                <Image
                  src="/category_banners/boiler_category.png"
                  alt={categories.touchlessGestureControl}
                  fill
                  className="category__bg-image"
                  style={{ objectFit: 'cover' }}
                />
                <div className="category__placeholder">
                  <span>{categories.touchlessGestureControl}</span>
                  <small>{categories.powerUpDescription}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="category__item animate-on-scroll" data-animation="animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
              <div className="category__image">
                <Image
                  src="/category_banners/toilet_category.png"
                  alt={categories.speedAdjustment}
                  fill
                  className="category__bg-image"
                  style={{ objectFit: 'cover' }}
                />
                <div className="category__placeholder">
                  <span>{categories.touchlessGestureControl}</span>
                  <small>{categories.speedAdjustment}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
