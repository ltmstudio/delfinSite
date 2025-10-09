/**
 * Утилиты для работы с формами
 */

/**
 * Создает универсальный обработчик изменения полей формы
 */
export const createFormChangeHandler = <T extends Record<string, any>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>
) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
};

/**
 * Создает обработчик отправки формы
 */
export const createFormSubmitHandler = <T>(
  callback: (data: T) => void | Promise<void>
) => {
  return (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as T;
    callback(data);
  };
};

/**
 * Валидирует email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Валидирует телефон
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

