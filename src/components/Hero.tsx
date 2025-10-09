'use client';

import React, { useState, useEffect } from 'react';
import { createAutoSlider, sliderNavigation } from '@/utils/slider';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { locale, hero } = useLocalizedContent();
    
    const slides = [
        {
            image: '/hero_banners/toilet_hero.png',
            title: hero.slides[0].title,
            description: hero.slides[0].description
        },
        {
            image: '/hero_banners/smesitel_hero.png',
            title: hero.slides[1].title,
            description: hero.slides[1].description
        },
        {
            image: '/hero_banners/boiler_hero.png',
            title: hero.slides[2].title,
            description: hero.slides[2].description
        }
    ];

    useEffect(() => {
        const timer = createAutoSlider(slides.length, setCurrentSlide, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(sliderNavigation.goTo(index, slides.length));
    };

    const nextSlide = () => {
        setCurrentSlide(sliderNavigation.next(currentSlide, slides.length));
    };

    const prevSlide = () => {
        setCurrentSlide(sliderNavigation.prev(currentSlide, slides.length));
    };

    const downloadCatalog = () => {
        const link = document.createElement('a');
        link.href = '/catalog.pdf';
        link.download = 'delfin-catalog.pdf';
        link.click();
    };

    return (
        <section id="home" className="hero vh-100 position-relative">
            <div className="hero__slider">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero__slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        <div className="hero__overlay"></div>
                    </div>
                ))}
            </div>

            <div className="container-custom h-100 d-flex flex-column justify-content-end pb-5">
                <div className="row w-100 mb-md-0 mb-4 g-3">
                    <div className="col-md-5 text-start">
                        <h1 className="display-4 fw-semibold text-white">
                            {slides[currentSlide].title}
                        </h1>
                    </div>
                    <div className="col-md-2 d-flex align-items-center justify-content-start justify-content-lg-center">
                        <button 
                            className="btn btn-outline-light d-flex align-items-center gap-2 px-4 py-3 fs-5"
                            onClick={downloadCatalog}
                        >
                            {hero.downloadCatalog}
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                            </svg>
                        </button>
                    </div>
                    <div className="col-md-5 text-end">
                        <p className="text-white  opacity-75">
                            {slides[currentSlide].description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Навигация слайдера */}
            {/* <div className="position-absolute top-50 start-0 end-0 d-flex justify-content-between px-4">
                <button
                    className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '50px', height: '50px' }}
                    onClick={prevSlide}
                >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>
                <button
                    className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '50px', height: '50px' }}
                    onClick={nextSlide}
                >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                </button>
            </div> */}

            {/* Индикаторы слайдов */}
            {/* <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-3 mb-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`btn rounded-circle ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                        style={{ width: '12px', height: '12px', padding: '0' }}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div> */}
        </section>
    );
};

export default Hero;
