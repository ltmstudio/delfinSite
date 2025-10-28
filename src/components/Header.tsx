'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import LanguageSwitcher from './LanguageSwitcher';
import { initNavbarTheme } from '@/utils/navbarTheme';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { header } = useLocalizedContent();

  useEffect(() => {
    // Инициализируем автоматическую смену темы навбара
    const themeManager = initNavbarTheme();

    // Очистка при размонтировании компонента
    return () => {
      if (themeManager) {
        themeManager.destroy();
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        {/* Логотип */}
        <div className="navbar-brand d-flex align-items-center">
          <div className="logo-container">
            <Image
              src="/logo-delfin.png"
              alt="Del'fin Logo"
              className="dolphin-logo"
              width={80}
              height={100}
              priority
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Десктопное меню */}
        <div className="navbar-nav mx-auto d-flex flex-row d-none d-lg-flex">
          <a className="nav-link me-4" href="#hero">{header.nav.delphin}</a>
          <a className="nav-link me-4" href="#products">{header.nav.collection}</a>
          <a className="nav-link me-4" href="#about">{header.nav.collection}</a>
          <a className="nav-link" href="#footer">{header.nav.contact}</a>
        </div>

        {/* Десктопные кнопки */}
        <div className="d-flex align-items-center d-none d-lg-flex">
          <a href="#footer" className="btn btn-outline-light me-3 d-flex align-items-center">
            {header.contactButton}
            <svg
              className="ms-2"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
            </svg>
          </a>
          <LanguageSwitcher />
        </div>

        {/* Мобильная кнопка бургер меню */}
        <button
          className="navbar-toggler d-lg-none border-0 bg-transparent"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Мобильное меню */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu__overlay" onClick={closeMenu}></div>
        <div className="mobile-menu__content">
          <div className="mobile-menu__header">
            <div className="logo-container">
              <Image
                src="/logo-delfin.png"
                alt="Del'fin Logo"
                className="dolphin-logo"
                width={32}
                height={32}
              />
            </div>
            <button
              className="mobile-menu__close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu__nav">
            <a className="mobile-menu__link" href="#hero" onClick={closeMenu}>
              {header.nav.delphin}
            </a>
            <a className="mobile-menu__link" href="#products" onClick={closeMenu}>
              {header.nav.collection}
            </a>
            <a className="mobile-menu__link" href="#about" onClick={closeMenu}>
              {header.nav.collection}
            </a>
            <a className="mobile-menu__link" href="#footer" onClick={closeMenu}>
              {header.nav.contact}
            </a>
          </nav>

          <div className="mobile-menu__actions">
            <a href="#footer" className="btn btn-outline-light w-100 mb-3 d-flex align-items-center justify-content-center">
              {header.contactButton}
              <svg
                className="ms-2"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
              </svg>
            </a>
            <div className="text-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
