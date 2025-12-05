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

// Функция для получения предмета из data-атрибута
const getDataSubject = () => {
    const dataSubjectElement = document.getElementById('data-subject')
    if (dataSubjectElement && dataSubjectElement.dataset.subject) {
        return dataSubjectElement.dataset.subject
    }
    return null
}

// Функция для фильтрации учителей по предмету
const filterTeachersBySubject = (teachers, subject) => {
    if (!subject || subject.trim() === '') {
        console.log('Предмет не указан, показываем всех учителей')
        return teachers
    }

    console.log(`Фильтруем учителей по предмету: "${subject}"`)
    const filteredTeachers = teachers.filter(teacher =>
        teacher.subjects && teacher.subjects.includes(subject)
    )

    console.log(`Найдено ${filteredTeachers.length} учителей по предмету "${subject}"`)
    return filteredTeachers
}

// Функция создания иконок предметов
const createIcons = (subjects) => {
    const languageBadges = document.createElement('div')
    languageBadges.className = 'language-badges'

    // Получаем предмет из data-атрибута при каждом вызове функции
    const dataSubjectElement = document.getElementById('data-subject')
    const dataSubject = dataSubjectElement ? dataSubjectElement.dataset.subject : null

    // Если есть data-subject, показываем только иконку этого предмета
    if (dataSubject && dataSubject.trim() !== '') {
        if (allSubjectsIcons[dataSubject]) {
            const iconPath = getCorrectUrl(`./src/img/classes/${allSubjectsIcons[dataSubject]}`);
            languageBadges.insertAdjacentHTML('beforeend',
                `<img class="language-badge" src="${iconPath}" alt="${dataSubject}">`
            )
        }
    } else {
        // Иначе показываем все предметы учителя
        subjects.forEach((subject) => {
            if (allSubjectsIcons[subject]) {
                const iconPath = getCorrectUrl(`./src/img/classes/${allSubjectsIcons[subject]}`);
                languageBadges.insertAdjacentHTML('beforeend',
                    `<img class="language-badge" src="${iconPath}" alt="${subject}">`
                )
            }
        })
    }

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

// Основная функция загрузки и отображения данных
const loadTeachersData = () => {
    const teachersCard = document.querySelector('.teacher-cards')

    if (!teachersCard) {
        console.error('Элемент .teacher-cards не найден!')
        return
    }

    // Получаем предмет ТОЛЬКО когда функция вызывается
    const dataSubject = getDataSubject()

    getData(BASE_URL + 'api.php?action=teachers')
        .then((teachersData) => {
            teachersCard.textContent = ''

            // Фильтруем учителей по предмету, если указан
            const filteredTeachers = filterTeachersBySubject(teachersData, dataSubject)

            // Предзагружаем фото для обработки ошибок
            preloadTeacherPhotos(filteredTeachers);

            if (filteredTeachers.length === 0) {
                // Если учителей не найдено, показываем сообщение
                const sadImagePath = './src/img/uploads/teacher_not_found.png';
                teachersCard.innerHTML = `
                    <div class="teacher_sad">
                        <img src="${sadImagePath}" alt="грустный учитель" 
                             onerror="console.error('Не удалось загрузить изображение: ${sadImagePath}')">
                        <div class="teacher_sad_text">Набор преподавателей на этот курс завершается, <br>скоро мы представим новых специалистов</div>
                    </div>
                `
            } else {
                // Создаем карточки для отфильтрованных учителей
                filteredTeachers.forEach(teacher => {
                    const card = createTeacherCard(teacher)
                    teachersCard.insertAdjacentHTML('beforeend', card)
                })
            }

            // Переинициализируем Swiper после добавления карточек
            setTimeout(() => {
                initSwiper()
            }, 100)
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error)
            // Показываем сообщение об ошибке
            const sadImagePath = './src/img/uploads/teacher_not_found.png';
            teachersCard.innerHTML = `
                <div class="teacher_sad">
                    <img src="${sadImagePath}" alt="грустный учитель"
                         onerror="console.error('Не удалось загрузить изображение: ${sadImagePath}')">
                    <div class="teacher_sad_text">Временно недоступно. Пожалуйста, попробуйте позже.</div>
                </div>
            `
        })
}

// Функция для показа всех учителей (при клике на кнопку)
window.loadAllTeachers = () => {
    loadTeachersData()
}

// Инициализация Swiper
const initSwiper = () => {
    const swiperElement = document.querySelector('.teachers-swiper')
    if (!swiperElement) {
        console.error('Swiper элемент не найден!')
        return
    }

    // Уничтожаем предыдущий экземпляр Swiper, если он существует
    if (window.teachersSwiper) {
        window.teachersSwiper.destroy(true, true)
    }

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
    })
}

const centerSwiperSlides = () => {
    const wrapper = document.querySelector('.swiper-wrapper');
    const slides = document.querySelectorAll('.swiper-slide');

    if (!wrapper || slides.length === 0) return;

    // Если слайдов меньше 3, центрируем
    if (slides.length < 3) {
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';

        // Принудительная ширина для центрирования
        slides.forEach(slide => {
            slide.style.margin = '0 auto';
        });
    }
};

// Вызывайте эту функцию после initSwiper()
setTimeout(centerSwiperSlides, 200);

// Инициализация при полной загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    loadTeachersData()
})

// Альтернативная инициализация если DOM уже загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTeachersData)
} else {
    loadTeachersData()
}