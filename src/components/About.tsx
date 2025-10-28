'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createScrollAnimationObserver, animateCounter, initScrollAnimations } from '@/utils/animations';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';

const About = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);
  const { about } = useLocalizedContent();

  const accordionItems = [
    {
      id: 0,
      number: "01",
      title: about.accordion.about.title,
      description: about.accordion.about.description,
      isActive: true
    },
    {
      id: 1,
      number: "02",
      title: about.accordion.mission.title,
      description: about.accordion.mission.description,
      isActive: false
    },
    {
      id: 2,
      number: "03",
      title: about.accordion.vision.title,
      description: about.accordion.vision.description,
      isActive: false
    }
  ];

  const stats = [
    { target: 150, suffix: "+", label: about.stats.satisfiedClients, step: 10 },
    { target: 10000, suffix: "+", label: about.stats.completedProjects, step: 500 },
    { target: 24, suffix: "+", label: about.stats.countries, step: 2 }
  ];

  // Intersection Observer для запуска анимации
  useEffect(() => {
    const observer = createScrollAnimationObserver(() => {
      if (!hasAnimated) {
        setHasAnimated(true);
        
        // Запускаем анимацию для каждой цифры
        stats.forEach((stat, index) => {
          animateCounter(stat.target, stat.step, (value) => {
            setAnimatedStats(prev => {
              const newStats = [...prev];
              newStats[index] = value;
              return newStats;
            });
          });
        });
      }
    }, { threshold: 0.5 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Инициализация анимаций появления при скролле
  useEffect(() => {
    const animationObserver = initScrollAnimations();
    return () => animationObserver.disconnect();
  }, []);

  return (
    <section id="about" className="about">
      <div className="container-custom">
        <div className="about__content">
          {/* Верхняя часть: заголовок и аккордеон */}
          <div className="row mb-5">
            {/* Заголовок слева с наградой */}
            <div className="col-lg-6">
              <div className="about__header-section">
                <h2 className="about__main-title animate-on-scroll" data-animation="animate-fade-in-left">
                  {about.title}
                </h2>

              </div>
            </div>

            {/* Аккордеон справа */}
            <div className="col-lg-6">
              <div className="about__accordion d-flex flex-column gap-3 animate-on-scroll" data-animation="animate-fade-in-right">
                {accordionItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`about__accordion-item ${activeAccordion === item.id ? 'active' : ''}`}
                    onClick={() => setActiveAccordion(item.id)}
                  >
                    <div className="about__accordion-header d-flex align-items-center">
                      <div className="about__accordion-number">{item.number}</div>
                      <div className="about__accordion-title">{item.title}</div>
                      <div className="about__accordion-arrow">
                        {activeAccordion === item.id ? '↗' : '↓'}
                      </div>
                    </div>
                    {activeAccordion === item.id && (
                      <div className="about__accordion-content">
                        <p>{item.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Средняя часть: изображения */}
          <div className="row ">
            <div className="col-12 vh-75">
              <div className="about__images-container d-flex align-items-center justify-content-center gap-4">
                {/* Левое изображение */}
                <div className="about__image-left animate-on-scroll" data-animation="animate-scale-in">
                  <Image
                    src="/about_us/office_banner.png"
                    alt="Наш офис"
                    fill
                    className="about__image-hover"
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Правое изображение */}
                <div className="about__image-right animate-on-scroll" data-animation="animate-scale-in" style={{ animationDelay: '0.3s' }}>
                  <Image
                    src="/about_us/shop_banner.png"
                    alt="Наш магазин"
                    fill
                    className="about__image-hover about__image-hover--top"
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Нижняя часть: статистика */}
          {/* <div className="row">
            <div className="col-12">
              <div ref={statsRef} className="about__stats-container d-flex justify-content-center gap-5">
                {stats.map((stat, index) => (
                  <div key={index} className="about__stat-item">
                    <div className="about__stat-number">
                      {animatedStats[index].toLocaleString()}{stat.suffix}
                    </div>
                    <div className="about__stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default About;