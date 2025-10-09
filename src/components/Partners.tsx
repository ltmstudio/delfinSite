'use client';

import React, { useState, useEffect } from 'react';
import { createAutoSlider, createInfiniteSlides, chunkItems } from '@/utils/slider';

const Partners = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const partners = [
    { name: "Logo Ipsum", logo: "/logo_logo.png" },
    { name: "LOGO IPSUM", logo: "/logo_logo.png" },
    { name: "Abstract", logo: "/logo_logo.png" },
    { name: "CCC", logo: "/logo_logo.png" },
    { name: "Logoipsum", logo: "/logo_logo.png" },
    { name: "LOGOIPSUM", logo: "/logo_logo.png" },
    { name: "LOGO | IPSUM", logo: "/logo_logo.png" },
    { name: "logoipsum", logo: "/logo_logo.png" },
    { name: "IPSUM", logo: "/logo_logo.png" },
    { name: "Logoipsum", logo: "/logo_logo.png" },
    { name: "LOGO", logo: "/logo_logo.png" },
    { name: "logo-ipsum", logo: "/logo_logo.png" },
    { name: "ロゴ IPSUM", logo: "/logo_logo.png" },
    { name: "IPSUM", logo: "/logo_logo.png" },
    { name: "logoipsum", logo: "/logo_logo.png" }
  ];

  const slidesPerView = 8;
  const totalSlides = Math.ceil(partners.length / slidesPerView);

  // Создаем дублированные слайды для цикличности
  const duplicatedPartners = createInfiniteSlides(partners, slidesPerView);
  const totalDuplicatedSlides = Math.ceil(duplicatedPartners.length / slidesPerView);

  // Автоматическая смена слайдов с цикличностью
  useEffect(() => {
    const interval = createAutoSlider(
      totalDuplicatedSlides, 
      (index) => setCurrentSlide(index >= totalDuplicatedSlides ? 0 : index),
      4000
    );
    return () => clearInterval(interval);
  }, [totalDuplicatedSlides]);

  // Обработчик клика по индикатору
  const handleIndicatorClick = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  // Создаем слайды с дублированными партнерами
  const allSlides = chunkItems(duplicatedPartners, slidesPerView);

  return (
    <section id="partners" className="partners">
      <div className="container-custom">
        <div className="partners__content">
          {/* Заголовок */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="partners__title text-center">
                Изучите наших клиентов и партнеров
              </h2>
            </div>
          </div>

          {/* Слайдер логотипов */}
          <div className="row">
            <div className="col-12">
              <div className="partners__slider">
                <div 
                  className="partners__logos-container"
                  style={{
                    transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
                    transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    width: `${totalSlides * 100}%`
                  }}
                >
                  {allSlides.map((slidePartners, slideIndex) => (
                    <div key={slideIndex} className="partners__slide">
                      <div className="partners__logos-grid">
                        {slidePartners.map((partner, index) => (
                          <div key={`${slideIndex}-${index}`} className="partners__logo-item">
                            <img 
                              src={partner.logo} 
                              alt={partner.name}
                              className="partners__logo-img"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Индикаторы */}
              <div className="partners__indicators d-flex justify-content-center gap-2 mt-4">
                {Array.from({ length: totalSlides }, (_, index) => (
                  <button
                    key={index}
                    className={`partners__indicator ${currentSlide % totalSlides === index ? 'active' : ''}`}
                    onClick={() => handleIndicatorClick(index)}
                    disabled={isTransitioning}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
