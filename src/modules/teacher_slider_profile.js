const getData = (url) => {
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(`Ошибка по адресу ${url}`)
        } else {
            return response.json()
        }
    })
}

const BASE_URL = 'http://saintdevor.temp.swtest.ru/';

const allSubjects = [
    'Подготовка к школе', 'Начальная школа', 'Русский язык', 'Литература',
    'История', 'Обществознание', 'Окружающий мир', 'Биология', 'География',
    'Математика', 'Физика', 'Химия', 'Информатика', 'Английский', 'Немецкий',
    'Французский', 'Испанский', 'Шахматы', 'Музыка', 'Программирование', 'Вокал'
];

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
}

// Функция для получения корректного URL
const getCorrectUrl = (path) => {
    if (!path) return './src/img/uploads/default-teacher.jpg';

    // Если путь уже полный URL, возвращаем как есть
    if (path.startsWith('http')) {
        return path;
    }

    // Если путь начинается с site/uploads/, добавляем BASE_URL
    if (path.startsWith('site/uploads/')) {
        return BASE_URL + path;
    }

    // Если путь начинается с uploads/, добавляем BASE_URL
    if (path.startsWith('uploads/')) {
        return BASE_URL + path;
    }

    // Для локальных путей возвращаем как есть (относительные пути)
    return path;
}

// Функция для получения teacherId из URL
const getTeacherIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('teacherId');
}

// Функция создания иконок предметов
const createIcons = (subjects) => {
    const languageBadges = document.createElement('div')
    languageBadges.className = 'language-badges'

    subjects.forEach((subject) => {
        if (allSubjectsIcons[subject]) {
            const iconPath = getCorrectUrl(`./src/img/classes/${allSubjectsIcons[subject]}`);
            languageBadges.insertAdjacentHTML('beforeend',
                `<img class="language-badge" src="${iconPath}" alt="${subject}">`
            )
        }
    })

    return languageBadges.outerHTML
}

// Функция для получения корректного URL фото учителя
const getTeacherPhotoUrl = (photo) => {
    return getCorrectUrl(photo) || './src/img/uploads/default-teacher.jpg';
}

// Функция создания карточки учителя
const createTeacherCard = (teacher) => {
    const { id, full_name, subjects, photo } = teacher

    const subjectsText = subjects.join(', ')
    const photoUrl = getTeacherPhotoUrl(photo)

    const card = `
    <div class="teacher-card swiper-slide" id="teacher-${id}">
        <div class="teacher-photo">
            ${createIcons(subjects)}
            <img src="${photoUrl}" alt="${full_name}" class="teacher-photo_img" 
                 onerror="this.src='./src/img/uploads/default-teacher.jpg'">
        </div>
        <h2 class="teacher-name">${full_name}</h2>
        <p class="teacher-languages">${subjectsText}</p>
        <a href="/teacher_profile.html?teacherId=${id}" class="profile-btn" style="background-color: var(--main_color_page);">В профиль</a>
    </div>
    `
    return card
}

// Функция для предзагрузки фото и обработки ошибок
const preloadTeacherPhotos = (teachers) => {
    teachers.forEach(teacher => {
        const photoUrl = getTeacherPhotoUrl(teacher.photo);
        const img = new Image();
        img.src = photoUrl;
        img.onerror = () => {
            console.warn(`Фото для учителя ${teacher.full_name} не найдено: ${photoUrl}`);
        };
    });
}

// Функция для фильтрации учителей по предметам и исключения текущего учителя
const filterTeachersBySubjects = (allTeachers, currentTeacherId, subjects) => {
    if (!subjects || subjects.length === 0) {
        console.log('Нет предметов для фильтрации');
        return [];
    }

    console.log(`Фильтруем учителей по предметам: ${subjects.join(', ')}`);

    const filteredTeachers = allTeachers.filter(teacher => {
        if (teacher.id == currentTeacherId) {
            return false;
        }

        return teacher.subjects && teacher.subjects.some(subject =>
            subjects.includes(subject)
        );
    });

    console.log(`Найдено ${filteredTeachers.length} учителей по предметам текущего учителя`);
    return filteredTeachers;
}

// Функция для получения данных текущего учителя
const getCurrentTeacherData = (teacherId) => {
    if (!teacherId) {
        console.error('ID учителя не указан');
        return Promise.resolve(null);
    }

    return getData(`${BASE_URL}api.php?action=teachers&id=${teacherId}`)
        .then(teacherData => {
            if (teacherData && teacherData.id) {
                console.log('Данные текущего учителя загружены:', teacherData.full_name);
                return teacherData;
            } else {
                console.error('Данные учителя не получены или некорректны');
                return null;
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки данных учителя:', error);
            return null;
        });
}

// Основная функция загрузки и отображения данных
const loadTeachersData = () => {
    const teachersCard = document.querySelector('.teacher-cards')

    if (!teachersCard) {
        console.error('Элемент .teacher-cards не найден!')
        return
    }

    const teacherId = getTeacherIdFromUrl();

    if (!teacherId) {
        console.error('ID учителя не найден в URL');
        teachersCard.innerHTML = `
            <div class="teacher_sad">
                <div class="teacher_sad_text">Не удалось загрузить данные учителя. Проверьте ссылку.</div>
            </div>
        `;
        return;
    }

    teachersCard.innerHTML = `
        <div class="teacher-loader">
            <div class="loader"></div>
            <div class="loader-text">Загрузка учителей...</div>
        </div>
    `;

    getCurrentTeacherData(teacherId)
        .then(currentTeacher => {
            if (!currentTeacher || !currentTeacher.subjects || currentTeacher.subjects.length === 0) {
                console.warn('У текущего учителя нет предметов или данные некорректны');

                const sadImagePath = './src/img/uploads/teacher_not_found.png';
                teachersCard.innerHTML = `
                    <div class="teacher_sad">
                        <img src="${sadImagePath}" alt="грустный учитель" 
                             onerror="console.error('Не удалось загрузить изображение: ${sadImagePath}')">
                        <div class="teacher_sad_text">Нет данных о предметах текущего учителя</div>
                    </div>
                `;
                return;
            }

            return getData(BASE_URL + 'api.php?action=teachers')
                .then(allTeachers => {
                    const filteredTeachers = filterTeachersBySubjects(
                        allTeachers,
                        teacherId,
                        currentTeacher.subjects
                    );

                    console.log(`Создаем ${filteredTeachers.length} карточек учителей`);

                    teachersCard.textContent = '';

                    if (filteredTeachers.length === 0) {
                        const sadImagePath = './src/img/uploads/teacher_not_found.png';
                        teachersCard.innerHTML = `
                            <div class="teacher_sad">
                                <img src="${sadImagePath}" alt="грустный учитель" 
                                     onerror="console.error('Не удалось загрузить изображение: ${sadImagePath}')">
                                <div class="teacher_sad_text">Нет других учителей по предметам: ${currentTeacher.subjects.join(', ')}</div>
                            </div>
                        `;
                    } else {
                        preloadTeacherPhotos(filteredTeachers);

                        // Создаем карточки
                        filteredTeachers.forEach((teacher, index) => {
                            console.log(`Создаем карточку ${index + 1} для: ${teacher.full_name}`);
                            const card = createTeacherCard(teacher);
                            teachersCard.insertAdjacentHTML('beforeend', card);
                        });

                        // Проверяем, сколько карточек создано
                        setTimeout(() => {
                            const createdCards = document.querySelectorAll('.teacher-card');
                            console.log(`Создано карточек в DOM: ${createdCards.length}`);
                            console.log(`Карточки:`, Array.from(createdCards).map(card => card.querySelector('.teacher-name')?.textContent));

                            initSwiper();
                        }, 100);
                    }
                });
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            const sadImagePath = './src/img/uploads/teacher_not_found.png';
            teachersCard.innerHTML = `
                <div class="teacher_sad">
                    <img src="${sadImagePath}" alt="грустный учитель"
                         onerror="console.error('Не удалось загрузить изображение: ${sadImagePath}')">
                    <div class="teacher_sad_text">Временно недоступно. Пожалуйста, попробуйте позже.</div>
                </div>
            `;
        });
}

// Функция для показа всех учителей
window.loadAllTeachers = () => {
    loadTeachersData()
}

// Инициализация Swiper
const initSwiper = () => {
    console.log('Инициализация Swiper...');

    const swiperElement = document.querySelector('.teachers-swiper')
    if (!swiperElement) {
        console.error('Swiper элемент не найден!')
        return
    }

    // Проверяем сколько есть слайдов
    const slides = document.querySelectorAll('.teacher-card.swiper-slide');
    console.log(`Найдено слайдов для Swiper: ${slides.length}`);

    if (slides.length === 0) {
        console.warn('Нет слайдов для инициализации Swiper');
        return;
    }

    // Уничтожаем предыдущий экземпляр Swiper, если он существует
    if (window.teachersSwiper) {
        console.log('Уничтожаем предыдущий Swiper');
        window.teachersSwiper.destroy(true, true);
    }

    // Проверяем структуру DOM
    const swiperWrapper = swiperElement.querySelector('.swiper-wrapper');
    if (!swiperWrapper) {
        console.error('Не найден .swiper-wrapper внутри .teachers-swiper');
        return;
    }

    console.log('Создаем новый Swiper экземпляр');

    window.teachersSwiper = new Swiper('.teachers-swiper', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 10,
        speed: 600,

        breakpoints: {
            375: { spaceBetween: 0 },
            425: { spaceBetween: 0 },
            768: { spaceBetween: 5 },
            1024: { spaceBetween: 30 },
            1440: { spaceBetween: 40 }
        }
    });

    console.log('Swiper успешно инициализирован');
    console.log(`Активных слайдов: ${window.teachersSwiper.slides.length}`);
}

// Добавляем CSS для loader
const addLoaderStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .teacher-loader {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            width: 100%;
        }
        
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4d25eb;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
            margin-bottom: 20px;
        }
        
        .loader-text {
            color: #4d25eb;
            font-size: 18px;
            font-weight: 500;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Проверяем структуру DOM
const checkDOMStructure = () => {
    console.log('Проверка DOM структуры:');

    // Проверяем основные элементы
    const swiperContainer = document.querySelector('.teachers-swiper');
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const teacherCards = document.querySelector('.teacher-cards');

    console.log('.teachers-swiper:', swiperContainer);
    console.log('.swiper-wrapper:', swiperWrapper);
    console.log('.teacher-cards:', teacherCards);

    // Если .teacher-cards и .swiper-wrapper - это один и тот же элемент
    if (teacherCards && swiperWrapper && teacherCards === swiperWrapper) {
        console.log('.teacher-cards и .swiper-wrapper - это один элемент, все OK');
    }
    // Если это разные элементы, возможно нужно переместить содержимое
    else if (teacherCards && swiperWrapper) {
        console.log('Разные элементы, проверяем содержимое...');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация слайдера');
    addLoaderStyles();
    checkDOMStructure();
    loadTeachersData();
})

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addLoaderStyles();
        checkDOMStructure();
        loadTeachersData();
    })
} else {
    console.log('DOM уже загружен, инициализация слайдера');
    addLoaderStyles();
    checkDOMStructure();
    loadTeachersData();
}