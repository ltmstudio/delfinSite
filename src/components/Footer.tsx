'use client';

import React, { useState } from 'react';
import { createFormChangeHandler } from '@/utils/forms';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';

const Footer = () => {
  const { footer } = useLocalizedContent();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = createFormChangeHandler(setFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация на клиенте
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setErrorMessage('Пожалуйста, введите корректный email адрес');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Очистка формы
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Произошла ошибка при отправке заявки');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="container-custom">
        <div className="footer__content">
          {/* Основной контент */}
          <div className="row mb-5">
            {/* Левая колонка - Контакты */}
            <div className="col-lg-6">
              <h3 className="footer__section-title">{footer.sections.visit}</h3>

              <div className="footer__contact-item">
                <h4 className="footer__location-title">{footer.sections.office.title}</h4>
                <p className="footer__address">{footer.sections.office.address}</p>
              </div>

              <div className="footer__contact-item">
                <h4 className="footer__location-title">{footer.sections.factory.title}</h4>
                <p className="footer__address">{footer.sections.factory.address}</p>
                <p className="footer__phone">1300 881 693 | 1300 881 693</p>
              </div>

              <div className="footer__contact-item">
                <h4 className="footer__location-title">Ofis - Ankara</h4>
                <p className="footer__address">Unit 1/167 Moray Street, South Melbourne VIC 3205</p>
              </div>

              <div className="footer__contact-item">
                <h4 className="footer__location-title">Mağaza</h4>
                <p className="footer__address">Suite 81, 26-32 Pirrama Road, Pyrmont NSW 2009</p>
              </div>
            </div>

            {/* Правая колонка - Форма */}
            <div className="col-lg-6">
              <h3 className="footer__section-title">{footer.sections.getInTouch}</h3>
              <p className="footer__form-description">
                {footer.sections.form.description}
              </p>

              {/* Уведомление о статусе */}
              {submitStatus === 'success' && (
                <div className="alert alert-success mb-3" role="alert">
                  {footer.sections.form.messages.success}
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="alert alert-danger mb-3" role="alert">
                  {footer.sections.form.messages.error}: {errorMessage}
                </div>
              )}

              <form className="footer__form" onSubmit={handleSubmit}>
                <div className="footer__form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="footer__form-input"
                    placeholder={footer.sections.form.name.placeholder}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="footer__form-group">
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="footer__form-input"
                    placeholder={footer.sections.form.company.placeholder}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="footer__form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="footer__form-input"
                    placeholder={footer.sections.form.email.placeholder}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="footer__form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="footer__form-input"
                    placeholder={footer.sections.form.phone.placeholder}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="footer__form-group">
                  <select
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="footer__form-select"
                    disabled={isSubmitting}
                  >
                    <option value="">Select one...</option>
                    <option value="product-info">Ürün Bilgisi</option>
                    <option value="collaboration">İş Birliği</option>
                    <option value="support">Destek</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="footer__form-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                     
                    </>
                  ) : (
                    footer.sections.form.submitButton
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Нижняя часть */}
          <div className="footer__bottom-section">
            <div className="footer__logo">
              <img 
                src="/logo-delfin.png" 
                alt="Del'fin Logo" 
                className="footer__logo-icon"
                height="80"
              />
         
            </div>
            {/* Социальные сети */}
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Pinterest">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Houzz">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0L2 6v12l10 6 10-6V6L12 0zm6 15.5l-6 3.5-6-3.5v-7l6-3.5 6 3.5v7z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="ArchiExpo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19 8v8l-7 3.5L5 16V8l7-3.5z" fill="currentColor"/>
                </svg>
              </a>
            </div>

            {/* Логотип */}


          </div>

          {/* Разделитель */}
          <div className="footer__divider"></div>

          {/* Копирайт */}
          <div className="footer__copyright">
            <p>{footer.bottom.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;