export const getData = (url) => {
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(`Ошибка по адресу ${url}`)
        } else {
            return response.json()
        }
    })
}

const BASE_URL = 'http://saintdevor.temp.swtest.ru/'; // Оставляем как было

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

    subjects.forEach((subject) => {
        if (allSubjectsIcons[subject]) {
            languageBadges.insertAdjacentHTML('beforeend',
                `<img class="language-badge" src="./src/img/classes/${allSubjectsIcons[subject]}" alt="${subject}">`
            )
        }
    })

    return languageBadges.outerHTML
}

// Функция для получения корректного URL фото
const getTeacherPhotoUrl = (photo) => {
    if (!photo) {
        return './src/img/uploads/default-teacher.jpg';
    }

    // Если фото уже содержит полный URL, используем как есть
    if (photo.startsWith('http')) {
        return photo;
    }

    // Если фото начинается с uploads/, добавляем BASE_URL
    if (photo.startsWith('uploads/')) {
        return BASE_URL + photo;
    }

    // Если фото просто имя файла, добавляем путь к uploads
    return BASE_URL + 'uploads/' + photo;
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
        <a href="#" class="profile-btn" style="background-color: var(--main_color_page);">В профиль</a>
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
                teachersCard.innerHTML = `
                    <div class="teacher_sad">
                        <img src="./src/img/uploads/teacher_not_found.png" alt="грустный учитель">
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
            teachersCard.innerHTML = `
                <div class="teacher_sad">
                    <img src="./src/img/uploads/teacher_not_found.png" alt="грустный учитель">
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