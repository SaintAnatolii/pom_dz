export const getData = (url) => {
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(`Ошибка по адресу ${url}`)
        } else {
            return response.json()
        }
    })
}

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

// Функция создания карточки учителя
const createTeacherCard = (teacher) => {
    const { id, full_name, subjects, photo } = teacher

    const subjectsText = subjects.join(', ')

    const card = `
    <div class="teacher-card swiper-slide" id="teacher-${id}">
        <div class="teacher-photo">
            ${createIcons(subjects)}
            <img src=${photo} alt="${full_name}" class="teacher-photo_img">
        </div>
        <h2 class="teacher-name">${full_name}</h2>
        <p class="teacher-languages">${subjectsText}</p>
        <a href="#" class="profile-btn" style="background-color: var(--main_color_page);">В профиль</a>
    </div>
    `
    return card
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

    getData('/data.json')
        .then((teachersData) => {

            teachersCard.textContent = ''

            // Фильтруем учителей по предмету, если указан
            const filteredTeachers = filterTeachersBySubject(teachersData.teachers, dataSubject)

            if (filteredTeachers.length === 0) {
                // Если учителей не найдено, показываем сообщение
                document.querySelector('.teacher_sad').style.display = 'flex'
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
            teachersCard.innerHTML = `
            <div class="error-message">
                <p>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</p>
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