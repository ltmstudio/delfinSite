import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, phone, message } = body;

    // Получаем язык из URL или заголовков
    const url = new URL(request.url);
    const locale = url.pathname.includes('/ru') ? 'ru' : 
                   url.pathname.includes('/tr') ? 'tr' : 
                   url.pathname.includes('/en') ? 'en' : 'ru';

    // Переводы сообщений
    const messages = {
      ru: {
        validationRequired: 'Пожалуйста, заполните все обязательные поля',
        validationEmail: 'Пожалуйста, введите корректный email адрес',
        success: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        error: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
      },
      tr: {
        validationRequired: 'Lütfen tüm zorunlu alanları doldurun',
        validationEmail: 'Lütfen geçerli bir e-posta adresi girin',
        success: 'Başvuru başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.',
        error: 'Başvuru gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'
      },
      en: {
        validationRequired: 'Please fill in all required fields',
        validationEmail: 'Please enter a valid email address',
        success: 'Application successfully sent! We will contact you soon.',
        error: 'An error occurred while sending the application. Please try again later.'
      }
    };

    const t = messages[locale] || messages.ru;

    // Валидация обязательных полей
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: t.validationRequired },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: t.validationEmail },
        { status: 400 }
      );
    }

    // Создание транспортера для sentки email через Mail.ru
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465, // Попробуем SSL порт
      secure: true, // SSL соединение
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        servername: 'smtp.mail.ru'
      },
      connectionTimeout: 60000, // Увеличиваем таймаут
      greetingTimeout: 30000,
      socketTimeout: 60000
    });

    // Настройка email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'k_beshimova@mail.ru',
      subject: `Новая заявка с сайта del'fin от ${name}`,
      html: `
        <h2>Новая заявка с сайта del'fin</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Компания:</strong> ${company || 'Не указано'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Тип обращения:</strong> ${message || 'Не указано'}</p>
        <hr>
        <p><small>Дата отправки: ${new Date().toLocaleString('ru-RU')}</small></p>
      `,
      text: `
        Новая заявка с сайта del'fin
        
        Имя: ${name}
        Компания: ${company || 'Не указано'}
        Email: ${email}
        Телефон: ${phone}
        Тип обращения: ${message || 'Не указано'}
        
        Дата отправки: ${new Date().toLocaleString('ru-RU')}
      `,
    };

    // Отправка email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: t.success },
      { status: 200 }
    );

  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('Детали ошибки:', {
      message: errorMessage,
      code: (error as any)?.code,
      command: (error as any)?.command,
      response: (error as any)?.response
    });
    
    // Получаем язык для сообщения об ошибке
    const url = new URL(request.url);
    const locale = url.pathname.includes('/ru') ? 'ru' : 
                   url.pathname.includes('/tr') ? 'tr' : 
                   url.pathname.includes('/en') ? 'en' : 'ru';
    const messages = {
      ru: { error: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.' },
      tr: { error: 'Başvuru gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.' },
      en: { error: 'An error occurred while sending the application. Please try again later.' }
    };
    const t = messages[locale] || messages.ru;
    
    return NextResponse.json(
      { error: t.error },
      { status: 500 }
    );
  }
}
