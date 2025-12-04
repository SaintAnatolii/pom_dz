const MAILER_URL = './send.php';

//! Маска для телефона
function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[name="phone"]');
    if (!phoneInputs.length) return;

    phoneInputs.forEach(phoneInput => {
        phoneInput.addEventListener('input', function (e) {
            let value = this.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }

                let formatted = '';

                if (value.length > 0) {
                    formatted = '+7 (';
                }

                if (value.length > 0) {
                    formatted += value.substring(0, 3);
                }

                if (value.length > 3) {
                    formatted += ') ' + value.substring(3, 6);
                }

                if (value.length > 6) {
                    formatted += '-' + value.substring(6, 8);
                }

                if (value.length > 8) {
                    formatted += '-' + value.substring(8, 10);
                }

                this.value = formatted;
            }
        });

        // Автозаполнение +7 при фокусе, если поле пустое
        phoneInput.addEventListener('focus', function () {
            if (!this.value) {
                this.value = '+7 (';
            }
        });

        // Валидация при потере фокуса
        phoneInput.addEventListener('blur', function () {
            const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
            if (this.value && !phoneRegex.test(this.value)) {
                this.style.borderColor = '#ff4444';
                this.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    });
}

//! Функция проверки всех полей
function validateForm(formData, formElement) {
    const errors = [];

    // Проверка имени
    const name = formData.get('firstname')?.trim();
    if (!name) {
        errors.push('Введите ваше имя');
    } else if (name.length < 2) {
        errors.push('Имя должно содержать минимум 2 символа');
    }

    // Проверка телефона
    const phone = formData.get('phone')?.trim();
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phone) {
        errors.push('Введите номер телефона');
    } else if (!phoneRegex.test(phone)) {
        errors.push('Введите корректный номер телефона (+7 (XXX) XXX-XX-XX)');
    }

    // Проверка email
    const email = formData.get('email')?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.push('Введите email адрес');
    } else if (!emailRegex.test(email)) {
        errors.push('Введите корректный email адрес');
    }

    // Проверка учителя/предмета
    const teacher = formData.get('teacher')?.trim();
    if (!teacher) {
        errors.push('Выберите учителя или предмет');
    }

    // Проверка чекбокса (ищем внутри текущей формы)
    const privacy = formElement.querySelector('#privacy');
    if (privacy && !privacy.checked) {
        errors.push('Необходимо согласие на обработку персональных данных');
    }

    return errors;
}

//! Функция показа уведомления
function showNotification(message, type = 'success') {
    // Создаем контейнер для уведомлений, если его еще нет
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificationContainer);
    }

    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // Иконка в зависимости от типа
    const icon = type === 'success' ? '✓' : '✗';

    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">${message}</div>
        <div class="notification-close">&times;</div>
    `;

    // Стили для уведомления
    notification.style.cssText = `
        background: ${type === 'success' ? '#4caf50' : '#ebb800ff'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out forwards;
        transform: translateX(100%);
        opacity: 0;
    `;

    // Стили для иконки
    notification.querySelector('.notification-icon').style.cssText = `
        font-size: 20px;
        font-weight: bold;
        flex-shrink: 0;
    `;

    // Стили для контента
    notification.querySelector('.notification-content').style.cssText = `
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
    `;

    // Стили для кнопки закрытия
    notification.querySelector('.notification-close').style.cssText = `
        cursor: pointer;
        font-size: 20px;
        opacity: 0.7;
        transition: opacity 0.2s;
        flex-shrink: 0;
        padding-left: 10px;
    `;

    // Добавляем CSS анимации
    const style = document.createElement('style');
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // Добавляем уведомление в контейнер
    notificationContainer.appendChild(notification);

    // Запускаем анимацию появления
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out forwards';
    }, 10);

    // Функция закрытия уведомления
    const closeNotification = () => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };

    // Закрытие по кнопке
    notification.querySelector('.notification-close').addEventListener('click', closeNotification);

    // Автоматическое закрытие через 3 секунды
    const autoCloseTimeout = setTimeout(closeNotification, 3000);

    // Останавливаем авто-закрытие при наведении
    notification.addEventListener('mouseenter', () => {
        clearTimeout(autoCloseTimeout);
    });

    // Возобновляем авто-закрытие при уходе курсора
    notification.addEventListener('mouseleave', () => {
        setTimeout(closeNotification, 3000);
    });
}

//! отправлять данные на сервер
const sendData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Данные отправлены');
        return await response.json();

    } catch (error) {
        console.error('Ошибка отправки данных:', error);
        throw error;
    }
};

//! Подсветка поля
function highlightField(field) {
    field.style.borderColor = '#ff4444';
    field.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
    field.style.transition = 'all 0.3s ease';

    // Убираем подсветку при фокусе
    field.addEventListener('focus', function () {
        this.style.borderColor = '';
        this.style.boxShadow = '';
    }, { once: true });
}

//! Очистка подсветки всех полей в форме
function clearFieldHighlights(formElement) {
    const fields = formElement.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
}

//! Инициализация формы
function initForm(formElement) {
    if (!formElement) return;

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Получаем данные формы
        const formData = new FormData(formElement);

        // Валидация формы
        const validationErrors = validateForm(formData, formElement);

        if (validationErrors.length > 0) {
            // Показываем первую ошибку
            showNotification(validationErrors[0], 'error');

            // Подсвечиваем проблемные поля
            highlightInvalidFields(validationErrors, formElement);
            return;
        }

        // Преобразуем FormData в объект
        const formObject = Object.fromEntries(formData);
        console.log('Данные для отправки из формы', formElement.id || 'unnamed', ':', formObject);

        // Показываем уведомление о начале отправки
        showNotification('Отправка данных...', 'info');

        try {
            // Отправляем данные
            const response = await sendData(MAILER_URL, formObject);
            console.log('Ответ сервера:', response);

            if (response.result === 'success') {
                showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');

                // Очищаем форму при успешной отправке
                formElement.reset();

                // Убираем подсветку полей
                clearFieldHighlights(formElement);

            } else {
                showNotification(`Ошибка: ${response.status}`, 'error');
            }

        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            showNotification('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.', 'error');
        }
    });

    // Подсветка невалидных полей
    function highlightInvalidFields(errors, formElement) {
        clearFieldHighlights(formElement);

        // Подсвечиваем поля в зависимости от ошибок
        errors.forEach(error => {
            if (error.includes('имя') || error.includes('Имя')) {
                const nameField = formElement.querySelector('input[name="firstname"]');
                if (nameField) highlightField(nameField);
            }
            if (error.includes('телефон') || error.includes('Телефон')) {
                const phoneField = formElement.querySelector('input[name="phone"]');
                if (phoneField) highlightField(phoneField);
            }
            if (error.includes('email') || error.includes('Email')) {
                const emailField = formElement.querySelector('input[name="email"]');
                if (emailField) highlightField(emailField);
            }
            if (error.includes('учителя') || error.includes('предмет') || error.includes('Выберите')) {
                const teacherField = formElement.querySelector('input[name="teacher"]');
                if (teacherField) highlightField(teacherField);
            }
            if (error.includes('согласие') || error.includes('обработку')) {
                const privacyField = formElement.querySelector('#privacy');
                if (privacyField) highlightField(privacyField);
            }
        });
    }

    // Валидация в реальном времени для текущей формы
    const inputs = formElement.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            const formData = new FormData(formElement);
            const errors = validateForm(formData, formElement);

            // Проверяем ошибки для текущего поля
            const fieldName = input.name || input.id;
            const fieldError = errors.find(error =>
                (fieldName === 'firstname' && error.includes('имя')) ||
                (fieldName === 'phone' && error.includes('телефон')) ||
                (fieldName === 'email' && error.includes('email')) ||
                (fieldName === 'teacher' && error.includes('учителя'))
            );

            if (fieldError) {
                highlightField(input);
            } else {
                input.style.borderColor = '#4CAF50';
                input.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.2)';

                // Возвращаем обычный стиль через секунду
                setTimeout(() => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                }, 1000);
            }
        });
    });
}

//! Основная функция инициализации всех форм
const initAllForms = () => {
    // Массивы ID форм для обработки
    const formIds = ['main-form', 'sub-form'];

    // Инициализируем маску телефона для всех форм
    initPhoneMask();

    // Инициализируем каждую форму
    formIds.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            initForm(form);
            console.log(`Форма ${formId} инициализирована`);
        } else {
            console.warn(`Форма с ID ${formId} не найдена`);
        }
    });

    // Также можно инициализировать формы по классу, если нужно
    const formsByClass = document.querySelectorAll('.send-form'); // пример класса
    if (formsByClass.length > 0) {
        formsByClass.forEach(form => {
            if (!form.id) {
                initForm(form);
                console.log('Форма по классу инициализирована');
            }
        });
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initAllForms();
});

// Экспортируем функции для использования в других модулях (если нужно)
// window.formHandler = {
//     initAllForms,
//     showNotification,
//     validateForm,
//     sendData
// };