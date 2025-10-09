'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Получаем текущую локаль из URL напрямую
  const urlLocale = pathname.split('/')[1] || 'ru';

  const languages = [
    { 
      code: 'ru', 
      name: 'Русский', 
      short: 'RUS',
      flag: '🇷🇺'
    },
    { 
      code: 'tr', 
      name: 'Türkçe', 
      short: 'TR',
      flag: '🇹🇷'
    },
    { 
      code: 'en', 
      name: 'English', 
      short: 'EN',
      flag: '🇺🇸'
    }
  ];

  const handleLanguageChange = (locale: string) => {
    // Простая замена локаль в URL
    const currentPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    
    // Если путь не изменился, значит локаль не найдена, просто ставим новую
    const newPath = currentPath === pathname ? `/${locale}` : currentPath;
    
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === urlLocale) || languages[0];
  
  // Обновляем состояние при изменении URL
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="language-switcher position-relative">
      <button
        className="language-btn btn btn-link text-light d-flex align-items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch language"
        style={{ padding: '0.25rem 0.5rem' }}
      >
        <span className="language-flag" style={{ fontSize: '18px' }}>
          {currentLanguage.flag}
        </span>
        <span className="language-code d-none d-md-inline">
          {currentLanguage.short}
        </span>
        <svg 
          width="10" 
          height="10" 
          fill="currentColor" 
          viewBox="0 0 16 16"
          className={isOpen ? 'rotate-180' : ''}
          style={{ transition: 'transform 0.2s ease' }}
        >
          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 9 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            className="language-dropdown position-absolute bg-white border rounded shadow-sm"
            style={{ 
              top: '100%', 
              right: 0, 
              minWidth: '140px', 
              zIndex: 10,
              marginTop: '6px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            {languages.map((language) => (
              <button
                key={language.code}
                className={`language-option btn btn-link w-100 text-start px-3 py-2 border-0 d-flex align-items-center gap-2 ${
                  urlLocale === language.code ? 'active' : ''
                }`}
                onClick={() => handleLanguageChange(language.code)}
                style={{ 
                  fontSize: '14px',
                  borderRadius: currentLocale === language.code ? '6px' : '0'
                }}
              >
                <span className="language-flag" style={{ fontSize: '16px' }}>
                  {language.flag}
                </span>
                <span className="language-name">{language.name}</span>
                {urlLocale === language.code && (
                  <svg 
                    width="12" 
                    height="12" 
                    fill="currentColor" 
                    viewBox="0 0 16 16"
                    className="ms-auto"
                  >
                    <path fillRule="evenodd" d="m10.354 3.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L7.707 11.646a.5.5 0 0 1-.708 0L4.646 8.7a.5.5 0 1 1 .708-.708L7 10.586l3.646-3.646a.5.5 0 0 1 .708 0z"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
