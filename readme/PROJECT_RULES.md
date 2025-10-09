# Правила проекта Delfin

## 🎯 Основные принципы

### 1. Bootstrap для адаптивности
- **ВСЕГДА используем Bootstrap классы** для:
  - Сетки (`container`, `row`, `col-*`)
  - Flexbox (`d-flex`, `justify-content-*`, `align-items-*`)
  - Отступы (`p-*`, `m-*`, `px-*`, `py-*`)
  - Адаптивность (`col-md-*`, `d-md-none`, etc.)

### 2. CSS переменные для дизайна
- **Только для цветов, шрифтов, размеров**
- **НЕ дублируем Bootstrap функционал**

### 3. Структура компонентов
```jsx
// ✅ ПРАВИЛЬНО - Bootstrap для layout
<div className="container">
  <div className="row">
    <div className="col-md-6 d-flex justify-content-center">
      // контент
    </div>
  </div>
</div>

// ❌ НЕПРАВИЛЬНО - кастомный CSS для layout
<div className="custom-container">
  <div className="custom-grid">
    // контент
  </div>
</div>
```

### 4. Кастомные стили только для:
- Цвета (`background: var(--primary-color)`)
- Шрифты (`font-family: var(--font-heading)`)
- Специфичные эффекты (анимации, тени)

### 5. Bootstrap классы по приоритету:
1. **Grid system** - `container`, `row`, `col-*`
2. **Flexbox** - `d-flex`, `justify-content-*`, `align-items-*`
3. **Spacing** - `p-*`, `m-*`, `gap-*`
4. **Typography** - `fs-*`, `fw-*`, `text-*`
5. **Display** - `d-*`, `position-*`

## 📱 Адаптивность
- `col-12` - мобильные (по умолчанию)
- `col-md-6` - планшеты (768px+)
- `col-lg-4` - десктопы (992px+)
- `d-none d-md-block` - скрыть на мобильных

## 🎨 Дизайн-система
- Используем CSS переменные из `:root`
- Bootstrap для структуры
- Кастомные стили только для уникального дизайна
