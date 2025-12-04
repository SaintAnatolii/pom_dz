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

    // Функция создания карточки учителя (адаптированная под ваши стили)
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

    // Инициализация Swiper - УПРОЩЕННАЯ версия, как в teacher_slider.js
    const initSwiper = () => {
        const swiperElement = document.querySelector('.teachers-swiper');
        if (!swiperElement) {
            console.error('Swiper элемент не найден!');
            return;
        }

        // Уничтожаем предыдущий экземпляр Swiper, если он существует
        if (window.teachersSwiper) {
            window.teachersSwiper.destroy(true, true);
        }

        // Используем ТЕ ЖЕ настройки, что и в teacher_slider.js
        window.teachersSwiper = new Swiper('.teachers-swiper', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 10,
            speed: 600,

            // Адаптивные настройки
            breakpoints: {
                375: {
                    spaceBetween: 0,
                    slidesPerView: 1,
                    centeredSlides: false
                },
                425: {
                    spaceBetween: 0,
                    slidesPerView: 1,
                    centeredSlides: false
                },
                768: {
                    spaceBetween: 5,
                    slidesPerView: 2,
                    centeredSlides: true
                },
                1024: {
                    spaceBetween: 30,
                    slidesPerView: 3,
                    centeredSlides: true
                },
                1440: {
                    spaceBetween: 40,
                    slidesPerView: 4,
                    centeredSlides: true
                }
            }
        });

        // Принудительно обновляем Swiper после инициализации
        setTimeout(() => {
            if (window.teachersSwiper) {
                window.teachersSwiper.update();
                window.teachersSwiper.updateSlides();
            }
        }, 100);
    };

    // Обновление контейнера с карточками
    const updateTeachersContainer = (teachers) => {
        const teachersCard = document.querySelector('.teacher-cards');
        if (!teachersCard) {
            console.error('Контейнер .teacher-cards не найден!');
            return;
        }

        // Очищаем контейнер
        teachersCard.innerHTML = '';

        // Если учителей нет, показываем сообщение
        if (!teachers || teachers.size === 0) {
            teachersCard.innerHTML = `
                <div class="teacher_sad">
                    <img src="./src/img/uploads/teacher_not_found.png" alt="грустный учитель" 
                         onerror="console.error('Не удалось загрузить изображение')">
                    <div class="teacher_sad_text">Не найдено других учителей с такими же предметами</div>
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

        // Обновляем UI
        updateTeachersContainer(filteredTeachers);

        // Инициализируем Swiper после добавления карточек
        setTimeout(() => {
            initSwiper();

            // Дополнительная центровка для малого количества слайдов
            if (filteredTeachers.size <= 1) {
                const wrapper = document.querySelector('.swiper-wrapper');
                if (wrapper) {
                    wrapper.style.display = 'flex';
                    wrapper.style.justifyContent = 'center';
                    wrapper.style.alignItems = 'center';
                }
            }
        }, 150);

    } catch (error) {
        console.error('Ошибка в teacher_profile_slider:', error);

        // Показываем сообщение об ошибке
        const teachersCard = document.querySelector('.teacher-cards');
        if (teachersCard) {
            teachersCard.innerHTML = `
                <div class="teacher_sad">
                    <img src="./src/img/uploads/teacher_not_found.png" alt="грустный учитель"
                         onerror="console.error('Не удалось загрузить изображение')">
                    <div class="teacher_sad_text">Временно недоступно. Пожалуйста, попробуйте позже.</div>
                </div>
            `;
        }
    }
};

// Запускаем функцию при полной загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', teacher_profile_slider);
} else {
    teacher_profile_slider();
}