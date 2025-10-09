'use client';

import { useEffect, useState } from 'react';
import { createCursorTracker, createHoverTracker } from '@/utils/cursor';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Проверяем, является ли устройство мобильным
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 'ontouchstart' in window;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Если мобильное устройство, не добавляем обработчики
    if (isMobile) {
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }

    // Отслеживание движения мыши
    const cleanupCursor = createCursorTracker(setPosition);

    // Отслеживание hover на интерактивных элементах
    const cleanupHover = createHoverTracker(
      () => setIsHovering(true),
      () => setIsHovering(false)
    );

    return () => {
      cleanupCursor();
      cleanupHover();
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Не отображаем курсор на мобильных устройствах
  if (isMobile) {
    return null;
  }

  return (
    <>
      <div
        className="custom-cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '20px' : '10px',
          height: isHovering ? '20px' : '10px',
        }}
      />
      <div
        className="custom-cursor-outline"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '60px' : '40px',
          height: isHovering ? '60px' : '40px',
        }}
      />
    </>
  );
};

export default CustomCursor;

