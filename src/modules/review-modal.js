(function () {
  'use strict';
  const BASE_URL = 'http://saintdevor.temp.swtest.ru'
  // Конфигурация - ИЗМЕНЕНО ДЛЯ ВАШЕГО API
  const CONFIG = {
    modalBackground: 'rgba(77, 37, 235, 1)',
    accentColor: '#cdff07',
    textColor: 'rgba(255, 255, 255, 1)',
    // ИЗМЕНЕНО: правильный endpoint для вашего API
    apiEndpoint: BASE_URL + '/api.php?action=reviews',
    animationDuration: 400,
  };

  // Создание HTML структуры - МИНИМАЛЬНЫЕ ИЗМЕНЕНИЯ
  function createModalHTML() {
    return `
      <div class="review-modal-overlay">
        <div class="review-modal-container">
          <div class="review-modal-close">&#10006;</div>
          <h2 class="review-modal-title">Оставить отзыв</h2>
          
          <form class="review-modal-form" id="reviewForm">
            <!-- Скрытые поля -->
            <div class="review-modal-form-group" style="display: none;">
              <input type="hidden" id="reviewTeacherId" name="teacher_id" value="">
            </div>
            
            <!-- Поле с именем учителя (только для чтения) -->
            <div class="review-modal-form-group">
              <div class="teacher-name-display">
                <span class="teacher-label">Преподаватель:</span>
                <input 
                  type="text" 
                  id="reviewTeacherName" 
                  name="teacher_name" 
                  class="teacher-name-input" 
                  readonly
                  placeholder="Загрузка..."
                >
              </div>
            </div>
            
            <!-- Рейтинг -->
            <div class="review-modal-form-group">
              <div class="review-rating-container">
                <span class="review-rating-label">Ваша оценка:</span>
                <div class="review-rating-stars">
                  <input type="radio" id="reviewStar1" name="rating" value="1">
                  <label for="reviewStar1" title="Очень плохо">★</label>
                  <input type="radio" id="reviewStar2" name="rating" value="2">
                  <label for="reviewStar2" title="Плохо">★</label>
                  <input type="radio" id="reviewStar3" name="rating" value="3">
                  <label for="reviewStar3" title="Удовлетворительно">★</label>
                  <input type="radio" id="reviewStar4" name="rating" value="4">
                  <label for="reviewStar4" title="Хорошо">★</label>
                  <input type="radio" id="reviewStar5" name="rating" value="5">
                  <label for="reviewStar5" title="Отлично">★</label>
                </div>
              </div>
            </div>
            
            <!-- Имя пользователя - ИЗМЕНЕНО name для API -->
            <div class="review-modal-form-group">
              <input type="text" name="user_name" placeholder="Ваше имя *" required>
            </div>
            
            <!-- Email - ИЗМЕНЕНО name для API -->
            <div class="review-modal-form-group">
              <input type="email" name="email" placeholder="Ваш email *" required>
            </div>
            
            <!-- УБРАН телефон (не поддерживается API) -->
            <!-- УБРАН child_name (не поддерживается API) -->
            <!-- УБРАН subject (не поддерживается API) -->
            
            <!-- Текст отзыва - ИЗМЕНЕНО name для API -->
            <div class="review-modal-form-group">
              <textarea name="comment" placeholder="Текст отзыва *" rows="3" required></textarea>
            </div>
            
            <!-- Чекбокс -->
            <div class="review-modal-checkbox-container">
              <input type="checkbox" id="reviewPrivacy" required>
              <label for="reviewPrivacy">Я согласен(на) на обработку персональных данных в соответствии с <a href="/policy.html"
                    style="color:white">политикой конфиденциальности</a></label>
            </div>
            
            <!-- Кнопка отправки -->
            <button type="submit" class="review-modal-btn-submit">Отправить отзыв</button>
            
            <!-- Сообщение -->
            <div class="review-modal-message" id="reviewMessage"></div>
          </form>
        </div>
      </div>
      
      <!-- Кнопка вызова виджета -->
      <button class="review-widget-button" id="reviewWidgetButton">
        <span class="review-widget-icon">✏️</span>
        <span class="review-widget-text">Оставить отзыв</span>
      </button>
    `;
  }


  // Создание CSS стилей
  function createModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Основные стили модального окна - КОМПАКТНЫЕ */
      .review-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        z-index: 10001;
        backdrop-filter: blur(5px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease-in-out;
      }
      
      .review-modal-overlay.review-modal-open {
        opacity: 1;
        visibility: visible;
      }
      
      .review-modal-container {
        width: 90%;
        max-width: 600px;
        max-height: 85vh;
        border-radius: 30px;
        box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.2);
        background: ${CONFIG.modalBackground};
        padding: 30px 40px;
        position: relative;
        transform: scale(0.9) translateY(-30px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      
      .review-modal-overlay.review-modal-open .review-modal-container {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
      
      .review-modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 28px;
        color: ${CONFIG.textColor};
        cursor: pointer;
        transition: all 0.3s ease;
        line-height: 1;
        z-index: 10;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .review-modal-close:hover {
        transform: scale(1.1);
        color: ${CONFIG.accentColor};
      }
      
      .review-modal-title {
        color: ${CONFIG.textColor};
        font-size: 28px;
        font-weight: 700;
        line-height: 1.2;
        text-align: center;
        margin: 0 0 25px 0;
        padding-right: 30px;
      }
      
      .review-modal-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        flex: 1;
      }
      
      .review-modal-form-group {
        width: 100%;
      }
      
      /* Стили для отображения имени учителя */
      .teacher-name-display {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 5px;
      }
      
      .teacher-label {
        color: ${CONFIG.textColor};
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
        flex-shrink: 0;
      }
      
      .teacher-name-input {
        flex: 1;
        height: 50px;
        box-sizing: border-box;
        border: 1px solid rgba(208, 208, 208, 0.5);
        border-radius: 25px;
        background: rgba(255, 255, 255, 0.9);
        padding: 0 20px;
        color: rgba(0, 0, 0, 0.8);
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s ease;
        font-family: inherit;
        cursor: default;
      }
      
      .teacher-name-input:focus {
        outline: none;
        background: rgba(255, 255, 255, 1);
        border-color: ${CONFIG.accentColor};
      }
      
      .review-modal-form-group input,
      .review-modal-form-group textarea {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        border: 1px solid rgba(208, 208, 208, 0.5);
        border-radius: 25px;
        background: rgba(255, 255, 255, 1);
        padding: 0 20px;
        color: rgba(0, 0, 0, 1);
        font-size: 16px;
        font-weight: 400;
        transition: all 0.3s ease;
        font-family: inherit;
      }
      
      .review-modal-form-group input:focus,
      .review-modal-form-group textarea:focus {
        outline: none;
        border-color: ${CONFIG.accentColor};
        box-shadow: 0 0 0 2px rgba(205, 255, 7, 0.3);
      }
      
      .review-modal-form-group textarea {
        height: 100px;
        padding: 15px 20px;
        border-radius: 20px;
        resize: vertical;
        line-height: 1.4;
      }
      
      /* Рейтинг - компактный */
      .review-rating-container {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 5px;
      }
      
      .review-rating-label {
        color: ${CONFIG.textColor};
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
      }
      
      .review-rating-stars {
        display: flex;
        gap: 8px;
      }
      
      .review-rating-stars input[type="radio"] {
        display: none;
      }
      
      .review-rating-stars label {
        font-size: 32px;
        color: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.2s ease;
        line-height: 1;
      }
      
      /* ЗВЕЗДЫ СЛЕВА НАПРАВО */
      .review-rating-stars input[type="radio"]:checked ~ label,
      .review-rating-stars label:hover ~ label {
        color: rgba(255, 255, 255, 0.3);
      }
      
      .review-rating-stars label:hover,
      .review-rating-stars input[type="radio"]:checked + label {
        color: ${CONFIG.accentColor};
      }
      
      .review-rating-stars input[type="radio"]:checked + label ~ label {
        color: rgba(255, 255, 255, 0.3);
      }
      
      .review-modal-btn-submit {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        border: none;
        border-radius: 25px;
        background: ${CONFIG.accentColor};
        color: rgba(32, 32, 32, 1);
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 5px;
      }
      
      .review-modal-btn-submit:hover {
        background: #b8e600;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(205, 255, 7, 0.3);
      }
      
      .review-modal-btn-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }
      
      .review-modal-checkbox-container {
        display: flex;
        align-items: center;
        gap: 10px;
        color: ${CONFIG.textColor};
        font-size: 14px;
        font-weight: 400;
        line-height: 1.3;
        margin-top: 5px;
      }
      
      #reviewPrivacy {
        width: 16px;
        height: 16px;
        cursor: pointer;
        flex-shrink: 0;
      }
      
      .review-modal-checkbox-container a {
        color: ${CONFIG.accentColor};
        text-decoration: none;
      }
      
      .review-modal-checkbox-container a:hover {
        text-decoration: underline;
      }
      
      .review-modal-message {
        padding: 12px 20px;
        border-radius: 20px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        margin-top: 10px;
        display: none;
      }
      
      .review-modal-message.success {
        display: block;
        background-color: rgba(205, 255, 7, 0.2);
        color: ${CONFIG.accentColor};
        border: 1px solid ${CONFIG.accentColor};
      }
      
      .review-modal-message.error {
        display: block;
        background-color: rgba(255, 79, 79, 0.2);
        color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 79, 79, 0.5);
      }
      
      /* Дополнительные поля в одну строку */
      .review-modal-extra-fields {
        display: flex;
        gap: 15px;
        margin-top: 5px;
      }
      
      .review-modal-form-group.half-width {
        width: calc(50% - 7.5px);
      }
      
      /* Кнопка вызова виджета */
      .review-widget-button {
        position: fixed;
        bottom: 25px;
        right: 25px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 25px;
        background: ${CONFIG.modalBackground};
        color: ${CONFIG.textColor};
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(77, 37, 235, 0.3);
        transition: all 0.3s ease;
        z-index: 10000;
        animation: reviewWidgetPulse 3s infinite;
      }
      
      .review-widget-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(77, 37, 235, 0.4);
        background: rgba(67, 37, 200, 1);
      }
      
      .review-widget-icon {
        font-size: 20px;
      }
      
      @keyframes reviewWidgetPulse {
        0% {
          box-shadow: 0 6px 20px rgba(77, 37, 235, 0.3);
        }
        50% {
          box-shadow: 0 6px 25px rgba(77, 37, 235, 0.5);
        }
        100% {
          box-shadow: 0 6px 20px rgba(77, 37, 235, 0.3);
        }
      }
      
      /* Адаптивность для планшетов */
      @media screen and (max-width: 768px) {
        .review-modal-container {
          width: 95%;
          max-width: 500px;
          padding: 25px 30px;
          border-radius: 25px;
        }
        
        .review-modal-title {
          font-size: 24px;
          margin-bottom: 20px;
        }
        
        .teacher-name-display {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        
        .teacher-label {
          font-size: 15px;
        }
        
        .teacher-name-input {
          width: 100%;
          height: 45px;
          font-size: 15px;
        }
        
        .review-modal-form {
          gap: 12px;
        }
        
        .review-modal-form-group input,
        .review-modal-form-group textarea {
          height: 45px;
          border-radius: 22px;
          font-size: 15px;
          padding: 0 18px;
        }
        
        .review-modal-form-group textarea {
          height: 90px;
          padding: 12px 18px;
        }
        
        .review-modal-close {
          top: 15px;
          right: 15px;
          font-size: 24px;
        }
        
        .review-rating-label {
          font-size: 15px;
        }
        
        .review-rating-stars label {
          font-size: 28px;
        }
        
        .review-modal-btn-submit {
          height: 45px;
          font-size: 16px;
          border-radius: 22px;
        }
        
        .review-modal-checkbox-container {
          font-size: 13px;
        }
        
        .review-widget-button {
          bottom: 20px;
          right: 20px;
          padding: 12px 20px;
          font-size: 15px;
        }
      }
      
      /* Адаптивность для мобильных */
      @media screen and (max-width: 480px) {
        .review-modal-container {
          width: 95%;
          max-width: none;
          padding: 20px;
          border-radius: 20px;
          max-height: 90vh;
        }
        
        .review-modal-title {
          font-size: 20px;
          margin-bottom: 15px;
          padding-right: 25px;
        }
        
        .teacher-name-display {
          flex-direction: column;
          gap: 6px;
        }
        
        .teacher-label {
          font-size: 14px;
        }
        
        .teacher-name-input {
          height: 40px;
          font-size: 14px;
          padding: 0 15px;
        }
        
        .review-modal-form {
          gap: 10px;
        }
        
        .review-modal-form-group input,
        .review-modal-form-group textarea {
          height: 40px;
          border-radius: 20px;
          font-size: 14px;
          padding: 0 15px;
        }
        
        .review-modal-form-group textarea {
          height: 80px;
          padding: 10px 15px;
        }
        
        .review-modal-close {
          top: 10px;
          right: 10px;
          font-size: 22px;
        }
        
        .review-rating-container {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        
        .review-rating-label {
          font-size: 14px;
        }
        
        .review-rating-stars label {
          font-size: 24px;
        }
        
        .review-modal-extra-fields {
          flex-direction: column;
          gap: 10px;
        }
        
        .review-modal-form-group.half-width {
          width: 100%;
        }
        
        .review-modal-btn-submit {
          height: 40px;
          font-size: 15px;
          border-radius: 20px;
        }
        
        .review-modal-checkbox-container {
          font-size: 12px;
          line-height: 1.2;
        }
        
        .review-modal-message {
          font-size: 13px;
          padding: 10px 15px;
        }
        
        .review-widget-button {
          bottom: 15px;
          right: 15px;
          padding: 10px 15px;
          font-size: 14px;
        }
        
        .review-widget-text {
          display: none;
        }
        
        .review-widget-icon {
          font-size: 18px;
        }
      }
      
      /* Очень маленькие экраны */
      @media screen and (max-width: 360px) {
        .review-modal-container {
          padding: 15px;
        }
        
        .review-modal-title {
          font-size: 18px;
        }
        
        .teacher-name-input {
          height: 38px;
          font-size: 13px;
        }
        
        .review-modal-form-group input {
          height: 38px;
          font-size: 13px;
        }
        
        .review-modal-btn-submit {
          height: 38px;
          font-size: 14px;
        }
        
        .review-widget-button {
          bottom: 10px;
          right: 10px;
          padding: 8px;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      
      /* Прокрутка внутри модального окна */
      .review-modal-container::-webkit-scrollbar {
        width: 6px;
      }
      
      .review-modal-container::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
      
      .review-modal-container::-webkit-scrollbar-thumb {
        background: ${CONFIG.accentColor};
        border-radius: 3px;
      }
      
      /* Предотвращаем прокрутку фона когда модалка открыта */
      body.review-modal-open {
        overflow: hidden;
      }
    `;
    return style;
  }

  // Класс виджета отзывов
  class ReviewWidget {
    constructor() {
      this.modal = null;
      this.form = null;
      this.submitButton = null;
      this.messageElement = null;
      this.teacherNameInput = null;
      this.isOpen = false;
      this.isSubmitting = false;

      this.init();
    }

    // Инициализация
    init() {
      // Добавляем стили
      document.head.appendChild(createModalStyles());

      // Добавляем HTML
      const container = document.createElement('div');
      container.innerHTML = createModalHTML();
      document.body.appendChild(container);

      // Получаем элементы
      this.modal = document.querySelector('.review-modal-overlay');
      this.form = document.getElementById('reviewForm');
      this.submitButton = this.form.querySelector('.review-modal-btn-submit');
      this.messageElement = document.getElementById('reviewMessage');
      this.teacherNameInput = document.getElementById('reviewTeacherName');

      // Устанавливаем данные учителя
      this.setTeacherData();

      // Назначаем обработчики событий
      this.bindEvents();

      // Добавляем обработчик для показа/скрытия кнопки при прокрутке
      this.initScrollBehavior();

      // Настраиваем звезды рейтинга (слева направо)
      this.setupRatingStars();

      console.log('ReviewWidget initialized');
    }

    // Установка данных учителя
    setTeacherData() {
      const teacherIdInput = document.getElementById('reviewTeacherId');

      // Получаем ID учителя из URL
      const urlParams = new URLSearchParams(window.location.search);
      const teacherId = urlParams.get('teacherId') || 'unknown';

      // Устанавливаем ID в скрытое поле
      teacherIdInput.value = teacherId;

      // Получаем имя учителя с вашей страницы
      this.getTeacherNameFromPage();

      // Если есть API для получения данных учителя, можно использовать его
      if (teacherId !== 'unknown') {
        this.fetchTeacherData(teacherId);
      }
    }

    // Получение имени учителя со страницы
    getTeacherNameFromPage() {
      // Пробуем найти имя учителя на странице
      const possibleNameSelectors = [
        '.teacher_fullname',
        '.teacher-fullname',
        '.teacher_full_name',
        '.teacher-name',
        '.teacher_name',
        'h1.teacher-name',
        '.teacher_info h1',
        '.teacher_header .teacher_fullname',
        'h1'
      ];

      for (const selector of possibleNameSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.trim()) {
          const teacherName = element.textContent.trim();
          this.teacherNameInput.value = teacherName;
          this.teacherNameInput.placeholder = teacherName;
          console.log('Found teacher name from page:', teacherName);
          return;
        }
      }

      // Если не нашли на странице, пробуем получить из вашего скрипта teacherProfile
      this.extractTeacherNameFromScript();
    }

    // Извлечение имени учителя из вашего скрипта teacherProfile
    extractTeacherNameFromScript() {
      // Пытаемся получить данные из глобальной переменной или из DOM
      setTimeout(() => {
        // Проверяем есть ли элемент с именем учителя в форме записи
        const teacherFormInput = document.querySelector('input[name="teacher"]');
        if (teacherFormInput && teacherFormInput.value) {
          this.teacherNameInput.value = teacherFormInput.value;
          this.teacherNameInput.placeholder = teacherFormInput.value;
          console.log('Found teacher name from form:', teacherFormInput.value);
          return;
        }

        // Если не нашли, оставляем placeholder
        this.teacherNameInput.value = '';
        this.teacherNameInput.placeholder = 'Имя преподавателя';
      }, 500);
    }

    // Получение данных учителя через API (если доступно)
    async fetchTeacherData(teacherId) {
      try {
        // Используем тот же BASE_URL что и в teacherProfile
        const BASE_URL = 'http://saintdevor.temp.swtest.ru';

        const response = await fetch(`${BASE_URL}/api.php?action=teachers&id=${teacherId}`);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const teacherData = await response.json();

        if (teacherData && teacherData.full_name) {
          this.teacherNameInput.value = teacherData.full_name;
          this.teacherNameInput.placeholder = teacherData.full_name;
          console.log('Fetched teacher data from API:', teacherData.full_name);
        }
      } catch (error) {
        console.warn('Could not fetch teacher data from API, using page data instead:', error);
      }
    }

    // Настройка звезд рейтинга (слева направо)
    setupRatingStars() {
      const stars = this.form.querySelectorAll('.review-rating-stars label');
      const inputs = this.form.querySelectorAll('.review-rating-stars input[type="radio"]');

      // Добавляем обработчики для правильной работы слева направо
      stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
          // Подсвечиваем все звезды до текущей (включая её)
          for (let i = 0; i <= index; i++) {
            stars[i].style.color = CONFIG.accentColor;
          }
          // Остальные - обычные
          for (let i = index + 1; i < stars.length; i++) {
            stars[i].style.color = 'rgba(255, 255, 255, 0.3)';
          }
        });

        star.addEventListener('click', () => {
          // При клике сохраняем выбранную звезду
          inputs[index].checked = true;
        });
      });

      // При уходе мыши с контейнера звезд
      const starsContainer = this.form.querySelector('.review-rating-stars');
      starsContainer.addEventListener('mouseleave', () => {
        // Восстанавливаем состояние на основе выбранной звезды
        let selectedIndex = -1;
        inputs.forEach((input, idx) => {
          if (input.checked) {
            selectedIndex = idx;
          }
        });

        if (selectedIndex >= 0) {
          // Подсвечиваем до выбранной звезды
          for (let i = 0; i <= selectedIndex; i++) {
            stars[i].style.color = CONFIG.accentColor;
          }
          for (let i = selectedIndex + 1; i < stars.length; i++) {
            stars[i].style.color = 'rgba(255, 255, 255, 0.3)';
          }
        } else {
          // Ничего не выбрано - все серые
          stars.forEach(star => {
            star.style.color = 'rgba(255, 255, 255, 0.3)';
          });
        }
      });

      // При изменении выбора через радио-кнопки
      inputs.forEach((input, index) => {
        input.addEventListener('change', () => {
          // Подсвечиваем до выбранной звезды
          for (let i = 0; i <= index; i++) {
            stars[i].style.color = CONFIG.accentColor;
          }
          for (let i = index + 1; i < stars.length; i++) {
            stars[i].style.color = 'rgba(255, 255, 255, 0.3)';
          }
        });
      });
    }

    // Назначение обработчиков событий
    bindEvents() {
      // Кнопка открытия
      document.getElementById('reviewWidgetButton').addEventListener('click', () => this.open());

      // Кнопка закрытия
      document.querySelector('.review-modal-close').addEventListener('click', () => this.close());

      // Закрытие по клику на фон
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });

      // Закрытие по ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Отправка формы
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));

      // Обновляем имя учителя при каждом открытии
      const openButton = document.getElementById('reviewWidgetButton');
      openButton.addEventListener('click', () => {
        setTimeout(() => {
          this.getTeacherNameFromPage();
        }, 100);
      });
    }

    // Обработка прокрутки
    initScrollBehavior() {
      let lastScrollTop = 0;
      const button = document.getElementById('reviewWidgetButton');

      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
          // Прокрутка вниз - скрываем
          button.style.transform = 'translateY(80px)';
          button.style.opacity = '0';
        } else {
          // Прокрутка вверх или в начале - показываем
          button.style.transform = 'translateY(0)';
          button.style.opacity = '1';
        }

        lastScrollTop = scrollTop;
      });
    }

    // Открытие модального окна
    open() {
      this.isOpen = true;
      this.modal.classList.add('review-modal-open');
      document.body.classList.add('review-modal-open');

      // Обновляем имя учителя перед открытием
      this.getTeacherNameFromPage();

      // Сбрасываем форму
      this.resetForm();

      // Фокус на первое поле (имя пользователя)
      setTimeout(() => {
        const userNameInput = this.form.querySelector('input[name="reviewer_name"]');
        if (userNameInput) userNameInput.focus();
      }, 300);
    }

    // Закрытие модального окна
    close() {
      this.isOpen = false;
      this.modal.classList.remove('review-modal-open');
      document.body.classList.remove('review-modal-open');
    }

    // Сброс формы
    resetForm() {
      this.form.reset();
      this.hideMessage();

      // Сохраняем имя учителя (оно не должно сбрасываться)
      const teacherName = this.teacherNameInput.value;

      // Сбрасываем звезды рейтинга
      const starInputs = this.form.querySelectorAll('input[name="rating"]');
      starInputs.forEach(input => input.checked = false);

      // Сбрасываем цвет звезд
      const stars = this.form.querySelectorAll('.review-rating-stars label');
      stars.forEach(star => {
        star.style.color = 'rgba(255, 255, 255, 0.3)';
      });

      // Восстанавливаем имя учителя
      this.teacherNameInput.value = teacherName;

      // Разблокируем кнопку
      this.submitButton.disabled = false;
      this.submitButton.textContent = 'Отправить отзыв';
      this.isSubmitting = false;
    }

    // Показать сообщение
    showMessage(text, type) {
      this.messageElement.textContent = text;
      this.messageElement.className = `review-modal-message ${type}`;
      this.messageElement.style.display = 'block';

      // Автоматически скрываем через 5 секунд
      if (type === 'success') {
        setTimeout(() => {
          this.hideMessage();
        }, 5000);
      }
    }

    // Скрыть сообщение
    hideMessage() {
      this.messageElement.style.display = 'none';
    }

    // Валидация формы
    validateForm(formData) {
      const errors = [];

      // Проверка рейтинга
      if (!formData.get('rating')) {
        errors.push('Пожалуйста, поставьте оценку (1-5 звезд)');
      }

      // Проверка имени
      if (!formData.get('user_name')?.trim()) {
        errors.push('Введите ваше имя');
      }

      // Проверка email
      if (!formData.get('email')?.trim()) {
        errors.push('Введите ваш email');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.get('email'))) {
          errors.push('Введите корректный email');
        }
      }

      // Проверка текста отзыва
      const comment = formData.get('comment')?.trim();
      if (!comment) {
        errors.push('Введите текст отзыва');
      } else if (comment.length < 10) {
        errors.push('Отзыв должен содержать минимум 10 символов');
      } else if (comment.length > 2000) {
        errors.push('Отзыв слишком длинный (максимум 2000 символов)');
      }

      // Проверка учителя
      if (!formData.get('teacher_id')) {
        errors.push('Ошибка: не указан преподаватель');
      }

      return errors;
    }

    // Обработка отправки формы - ПЕРЕПИСАНА для работы с вашим API
    async handleSubmit(event) {
      event.preventDefault();

      if (this.isSubmitting) return;

      // Собираем данные из формы
      const formData = new FormData(this.form);

      // Подготавливаем данные для API
      const reviewData = {
        teacher_id: formData.get('teacher_id'),
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment'),
        user_name: formData.get('user_name'),
        email: formData.get('email')
      };

      // Валидация
      const errors = this.validateForm(formData);
      if (errors.length > 0) {
        this.showMessage(errors[0], 'error');
        return;
      }

      // Начинаем отправку
      this.isSubmitting = true;
      this.submitButton.disabled = true;
      this.submitButton.textContent = 'Отправка...';
      this.hideMessage();

      try {
        // Определяем BASE_URL
        const BASE_URL = window.BASE_URL || window.location.origin;
        // ИСПРАВЛЕН endpoint
        const apiUrl = `${BASE_URL}/api.php?action=reviews`;

        console.log('Отправка отзыва на:', apiUrl);
        console.log('Данные отзыва:', reviewData);

        // Отправляем запрос в формате JSON, как требует API
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(reviewData)
        });

        const result = await response.json();

        if (result.success) {
          // Успешная отправка
          this.showMessage(
            result.message || 'Спасибо! Ваш отзыв успешно отправлен и будет опубликован после проверки.',
            'success'
          );

          // Сбрасываем форму через 3 секунды
          setTimeout(() => {
            this.resetForm();
            this.close();
          }, 3000);

          // Отправляем событие об успешной отправке отзыва
          this.dispatchReviewSubmittedEvent(reviewData);

        } else {
          // Обработка ошибок от API
          let errorMessage = result.message || 'Неизвестная ошибка сервера';

          // Более понятные сообщения
          if (result.error) {
            if (result.error.includes('already reviewed')) {
              errorMessage = 'Вы уже оставляли отзыв этому преподавателю';
            } else if (result.error.includes('invalid rating')) {
              errorMessage = 'Некорректная оценка. Выберите значение от 1 до 5';
            } else if (result.error.includes('invalid teacher')) {
              errorMessage = 'Преподаватель не найден';
            }
          }

          throw new Error(errorMessage);
        }

      } catch (error) {
        console.error('Ошибка при отправке отзыва:', error);

        let errorMessage = error.message || 'Ошибка при отправке отзыва';

        // Более понятные сообщения для пользователя
        if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Ошибка соединения. Проверьте интернет-соединение и попробуйте снова.';
        } else if (errorMessage.includes('HTTP error: 404')) {
          errorMessage = 'Сервис временно недоступен. Пожалуйста, попробуйте позже.';
        } else if (errorMessage.includes('HTTP error: 500')) {
          errorMessage = 'Ошибка на сервере. Пожалуйста, попробуйте позже.';
        }

        this.showMessage(errorMessage, 'error');

        // Восстанавливаем кнопку
        this.submitButton.disabled = false;
        this.submitButton.textContent = 'Отправить отзыв';
        this.isSubmitting = false;
      }
    }

    // Отправка события о добавлении отзыва
    dispatchReviewSubmittedEvent(formData) {
      const event = new CustomEvent('reviewSubmitted', {
        detail: {
          teacherId: formData.get('teacher_id'),
          teacherName: formData.get('teacher_name'),
          rating: formData.get('rating'),
          reviewerName: formData.get('reviewer_name'),
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(event);
    }
  }

  // Инициализация при загрузке страницы
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.review-widget-button')) {
      window.reviewWidget = new ReviewWidget();
      console.log('Review widget loaded successfully');
    }
  });

  // Если DOM уже загружен, инициализируем сразу
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.querySelector('.review-widget-button')) {
        window.reviewWidget = new ReviewWidget();
      }
    });
  } else {
    // DOM уже загружен
    if (!document.querySelector('.review-widget-button')) {
      window.reviewWidget = new ReviewWidget();
    }
  }

})();