// Инициализация Bootstrap JavaScript компонентов только на клиенте
import { useEffect } from 'react';

export const useBootstrap = () => {
  useEffect(() => {
    // Динамически импортируем Bootstrap только на клиенте
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
};
