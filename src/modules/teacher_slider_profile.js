const teacher_profile_slider = async () => {
    const BASE_URL = 'http://saintdevor.temp.swtest.ru/';

    // Получаем ID учителя из URL
    const teacherId = new URLSearchParams(window.location.search).get('teacherId');

    if (!teacherId) {
        console.error('teacherId не найден в URL параметрах');
        return;
    }

    // Функция для получения корректного URL
    const getCorrectUrl = (path) => {
        if (!path) return './src/img/uploads/default-teacher.jpg';

        if (path.startsWith('http')) return path;

        if (path.startsWith('site/uploads/') || path.startsWith('uploads/')) {
            return BASE_URL + path;
        }

        return path;
    };

    // Функция для получения корректного URL фото учителя
    const getTeacherPhotoUrl = (photo) => {
        return getCorrectUrl(photo) || './src/img/uploads/default-teacher.jpg';
    };

    // Данные предметов и их иконок
    const allSubjectsIcons = {
        'Подготовка к школе': 'active_подготовка_к_школе.svg',
        'Начальная школа': 'active_начальная_школа.svg',
        'Русский язык': 'active_русский.svg',
        'Литература': 'active_литература.svg',
        'История': 'active_история.svg',
        'Обществознание': 'active_обществознание.svg',
        'Окружающий мир': 'active_окружающий_мир.svg',
        'Биология': 'active_биологоия.svg',
        'География': 'active_география.svg',
        'Математика': 'active_математика.svg',
        'Физика': 'active_физика.svg',
        'Химия': 'active_химия.svg',
        'Информатика': 'active_информатика.svg',
        'Английский': 'active_английский.svg',
        'Немецкий': 'active_немецкий.svg',
        'Французский': 'active_французский.svg',
        'Испанский': 'active_испанский.svg',
        'Шахматы': 'active_шахматы.svg',
        'Музыка': 'active_музыка.svg',
        'Программирование': 'active_программирование.svg',
        'Вокал': 'active_вокал.svg',
    };

    // Функция создания иконок предметов
    const createIcons = (subjects) => {
        if (!subjects || !Array.isArray(subjects)) return '';

        const languageBadges = document.createElement('div');
        languageBadges.className = 'language-badges';

        subjects.forEach((subject) => {
            if (allSubjectsIcons[subject]) {
                const iconPath = getCorrectUrl(`./src/img/classes/${allSubjectsIcons[subject]}`);
                const iconElement = document.createElement('img');
                iconElement.className = 'language-badge';
                iconElement.src = iconPath;
                iconElement.alt = subject;
                languageBadges.appendChild(iconElement);
            }
        });

        return languageBadges.outerHTML;
    };

    // Функция создания карточки учителя
    const createTeacherCard = (teacher) => {
        const { id, full_name, subjects = [], photo } = teacher;
        const subjectsText = subjects.join(', ');
        const photoUrl = getTeacherPhotoUrl(photo);

        return `
            <div class="teacher-card swiper-slide" id="teacher-${id}">
                <div class="teacher-photo">
                    ${createIcons(subjects)}
                    <img src="${photoUrl}" alt="${full_name}" class="teacher-photo_img" 
                         onerror="this.src='./src/img/uploads/default-teacher.jpg'">
                </div>
                <h2 class="teacher-name">${full_name}</h2>
                <p class="teacher-languages">${subjectsText}</p>
                <a href="/teacher_profile.html?teacherId=${id}" class="profile-btn" 
                   style="background-color: var(--main_color_page);">В профиль</a>
            </div>
        `;
    };

    // Диагностика DOM перед инициализацией Swiper
    const debugDOM = () => {
        const wrapper = document.querySelector('.swiper-wrapper');
        const slides = document.querySelectorAll('.swiper-slide');

        console.log('=== SWIPER DEBUG ===');
        console.log('Wrapper found:', !!wrapper);
        console.log('Number of slides:', slides.length);

        if (wrapper) {
            console.log('Wrapper CSS:', window.getComputedStyle(wrapper));
            console.log('Wrapper display:', wrapper.style.display);
            console.log('Wrapper flexDirection:', wrapper.style.flexDirection);
        }

        slides.forEach((slide, index) => {
            console.log(`Slide ${index}:`, window.getComputedStyle(slide));
        });
    };

    // Инициализация Swiper
    const initSwiper = () => {
        const swiperElement = document.querySelector('.teachers-swiper');
        if (!swiperElement) {
            console.error('Swiper элемент .teachers-swiper не найден!');
            return null;
        }

        // Проверяем, есть ли слайды
        const slides = document.querySelectorAll('.swiper-slide');
        if (slides.length === 0) {
            console.error('Слайды не найдены!');
            return null;
        }

        console.log('Инициализация Swiper с', slides.length, 'слайдами');

        // Уничтожаем предыдущий экземпляр Swiper, если он существует
        if (window.teachersSwiper) {
            window.teachersSwiper.destroy(true, true);
            window.teachersSwiper = null;
        }

        // Инициализируем новый Swiper с правильными настройками
        window.teachersSwiper = new Swiper('.teachers-swiper', {
            // Обязательные параметры
            slidesPerView: 'auto', // Автоматическое определение видимых слайдов
            spaceBetween: 20,
            speed: 600,

            // Важно: отключаем вертикальное выравнивание
            direction: 'horizontal',

            // Центрирование активного слайда
            centeredSlides: true,

            // Параметры для лучшего отображения
            freeMode: false,
            watchSlidesProgress: true,
            watchOverflow: true,

            // Автовысота
            autoHeight: false,

            // Настройки для слайдов
            slideToClickedSlide: false,
            loop: false,

            // Брейкпоинты для адаптивности
            breakpoints: {
                320: {
                    spaceBetween: 10,
                    slidesPerView: 1,
                    centeredSlides: false
                },
                480: {
                    spaceBetween: 10,
                    slidesPerView: 1.2,
                    centeredSlides: true
                },
                768: {
                    spaceBetween: 15,
                    slidesPerView: 2,
                    centeredSlides: true
                },
                1024: {
                    spaceBetween: 20,
                    slidesPerView: 3,
                    centeredSlides: true
                },
                1200: {
                    spaceBetween: 25,
                    slidesPerView: 4,
                    centeredSlides: true
                }
            },

            // События для отладки
            on: {
                init: function () {
                    console.log('Swiper инициализирован');
                    console.log('Slides per view:', this.params.slidesPerView);
                    console.log('Visible slides:', this.slides.length);

                    // Принудительное обновление
                    this.update();
                    this.slideTo(0, 0);
                },
                afterInit: function () {
                    debugDOM();
                }
            }
        });

        // Принудительно обновляем размеры
        setTimeout(() => {
            if (window.teachersSwiper) {
                window.teachersSwiper.update();
                window.teachersSwiper.updateSlides();
                window.teachersSwiper.updateSize();
            }
        }, 100);

        return window.teachersSwiper;
    };

    // Обновление контейнера с карточками
    const updateTeachersContainer = (teachers) => {
        const teachersCard = document.querySelector('.teacher-cards');
        if (!teachersCard) {
            console.error('Контейнер .teacher-cards не найден!');
            return;
        }

        // Проверяем структуру HTML
        console.log('HTML структура:');
        console.log('- .teacher-cards:', teachersCard);
        console.log('- Родитель .teacher-cards:', teachersCard.parentElement);
        console.log('- Дети .teacher-cards:', teachersCard.children.length);

        // Очищаем контейнер
        teachersCard.innerHTML = '';

        // Если учителей нет, показываем сообщение
        if (!teachers || teachers.size === 0) {
            teachersCard.innerHTML = `
                <div class="no-teachers-message swiper-slide">
                    <p>Не найдено других учителей с такими же предметами</p>
                </div>
            `;
            return;
        }

        // Добавляем карточки учителей
        teachers.forEach((teacher) => {
            teachersCard.insertAdjacentHTML('beforeend', createTeacherCard(teacher));
        });

        console.log('Добавлено карточек:', teachersCard.children.length);
    };

    try {
        // Получаем данные выбранного учителя
        const teacherResponse = await fetch(`${BASE_URL}/api.php?action=teachers&id=${teacherId}`);
        if (!teacherResponse.ok) throw new Error('Ошибка при загрузке данных учителя');
        const teacherData = await teacherResponse.json();

        const subjects = teacherData.subjects || [];
        console.log('Предметы выбранного учителя:', subjects);

        // Получаем всех учителей
        const allTeachersResponse = await fetch(`${BASE_URL}/api.php?action=teachers`);
        if (!allTeachersResponse.ok) throw new Error('Ошибка при загрузке всех учителей');
        const allTeachers = await allTeachersResponse.json();

        // Фильтруем учителей
        const filteredTeachers = new Set();

        // Исключаем текущего учителя из результатов
        allTeachers.forEach((teacher) => {
            // Пропускаем текущего учителя
            if (teacher.id == teacherId) return;

            // Проверяем, есть ли общие предметы
            const hasCommonSubjects = subjects.some(subject =>
                teacher.subjects && teacher.subjects.includes(subject)
            );

            if (hasCommonSubjects) {
                filteredTeachers.add(teacher);
            }
        });

        console.log('Найдено учителей:', filteredTeachers.size);
        console.log('Учители:', Array.from(filteredTeachers));

        // Обновляем UI
        updateTeachersContainer(filteredTeachers);

        // Ждем, пока DOM обновится
        await new Promise(resolve => setTimeout(resolve, 50));

        // Инициализируем Swiper
        const swiper = initSwiper();

        // Если слайдер создан, принудительно обновляем его
        if (swiper) {
            setTimeout(() => {
                swiper.update();
                swiper.updateSlides();
                swiper.slideTo(0, 0);
            }, 200);
        }

    } catch (error) {
        console.error('Ошибка в teacher_profile_slider:', error);

        // Показываем сообщение об ошибке
        const teachersCard = document.querySelector('.teacher-cards');
        if (teachersCard) {
            teachersCard.innerHTML = `
                <div class="error-message swiper-slide">
                    <p>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</p>
                </div>
            `;
        }
    }
};

// Запускаем функцию после полной загрузки страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', teacher_profile_slider);
} else {
    teacher_profile_slider();
}