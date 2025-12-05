/* // ! получать данные с сервера
const getData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}`);
    } else {
        return await response.json();
    }
};

// Конфигурация
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
};

// Категории и их предметы
const categories = {
    'Подготовка, начальные классы': ['Подготовка к школе', 'Начальная школа'],
    'Гуманитарные науки': ['Русский язык', 'Литература', 'История', 'Обществознание', 'Окружающий мир'],
    'Точные науки': ['Математика', 'Физика', 'Химия', 'Информатика', 'Биология', 'География'],
    'Языки': ['Английский', 'Немецкий', 'Французский', 'Испанский'],
    'Клубы': ['Шахматы', 'Музыка', 'Программирование', 'Вокал'],
    'ОГЭ': [], // Будет определяться по полю prep_oge
    'ЕГЭ': [], // Будет определяться по полю prep_ege
    'Все репетиторы': [] // Все учителя
};

// Глобальная переменная для хранения данных учителей
let teachersData = [];

// Функция управления модальным окном
const initModal = () => {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal_close');
    const modalForm = document.querySelector('.modal_form');

    if (!modalOverlay || !modalClose) {
        console.error('Элементы модального окна не найдены');
        return;
    }

    // Закрытие модального окна
    const closeModal = () => {
        modalOverlay.classList.remove('modal-open');
        document.body.classList.remove('modal-open');

        // Ждем завершения анимации перед скрытием
        setTimeout(() => {
            modalOverlay.style.display = 'none';
        }, 300);
    };

    // Открытие модального окна
    const openModal = (teacherName, teacherSubjects) => {
        // Сначала показываем элемент
        modalOverlay.style.display = 'flex';

        // Ждем следующего кадра анимации
        setTimeout(() => {
            const teacherInput = modalForm?.querySelector('input[name="teacher"]');
            if (teacherInput) {
                const subjectsText = Array.isArray(teacherSubjects) ? teacherSubjects.join(', ') : teacherSubjects;
                teacherInput.value = `${teacherName} - ${subjectsText}`;
            }
            modalOverlay.classList.add('modal-open');
            document.body.classList.add('modal-open');
        }, 10);
    };

    // Обработчики событий
    modalClose.addEventListener('click', closeModal);

    // Закрытие по клику на подложку
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('modal-open')) {
            closeModal();
        }
    });

    // Обработка отправки формы
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Здесь можно добавить отправку данных на сервер
            console.log('Данные формы:', {
                teacher: modalForm.querySelector('input[name="teacher"]').value,
                firstname: modalForm.querySelector('input[name="firstname"]').value,
                phone: modalForm.querySelector('input[name="phone"]').value,
                email: modalForm.querySelector('input[name="email"]').value
            });
            closeModal();
        });
    }

    return { openModal, closeModal };
};

// Функция создания иконок предметов
const createIcons = (subjects) => {
    const teacher_subjects = document.createElement('ul');
    teacher_subjects.className = 'teacher_subjects';

    subjects.forEach((subject) => {
        if (allSubjectsIcons[subject]) {
            teacher_subjects.insertAdjacentHTML('beforeend',
                `<li><img src="./src/img/classes/${allSubjectsIcons[subject]}" alt="${subject}"></li>`
            );
        }
    });

    return teacher_subjects.outerHTML;
};

const createSubjectsText = (subjects) => {
    const teacher_subjects_list = document.createElement('ul');
    teacher_subjects_list.className = 'teacher_subjects_list';
    teacher_subjects_list.insertAdjacentHTML('beforeend', `<span>Предметы:</span>`);

    subjects.forEach((subject) => {
        if (allSubjectsIcons[subject]) {
            teacher_subjects_list.insertAdjacentHTML('beforeend',
                `<li>- ${subject}</li>`
            );
        }
    });

    return teacher_subjects_list.outerHTML;
};

const createTeacherCard = (teacher) => {
    const { id, full_name, education, experience, subjects, photo } = teacher;

    // Обработка фото (защита от undefined)
    const photoSrc = photo ? `${BASE_URL}${photo}` : './src/img/default-teacher.jpg';

    return `
        <div class="teacher-card">
            <div class="teacher_img">
                ${createIcons(subjects)}
                <div class="teacher_photo">
                    <img src="${photoSrc}" alt="${full_name}" onerror="this.src='./src/img/default-teacher.jpg'">
                </div>
            </div>
            <div class="teacher_info">
                <div class="teacher_name">${full_name}</div>
                <div class="teacher_univercity">Образование: ${education}</div>
                <div class="teacher_exp">Опыт: ${experience} лет</div>
                ${createSubjectsText(subjects)}
                <button class="teacher_submit" data-id="${id}">Записаться</button>
            </div>
        </div>
    `;
};

// Фильтрация учителей по категории
const filterTeachersByCategory = (teachers, category) => {
    if (category === 'Все репетиторы') {
        return teachers;
    }

    if (category === 'ОГЭ') {
        return teachers.filter(teacher => teacher.prep_oge === true);
    }

    if (category === 'ЕГЭ') {
        return teachers.filter(teacher => teacher.prep_ege === true);
    }

    const categorySubjects = categories[category];
    return teachers.filter(teacher =>
        teacher.subjects.some(subject => categorySubjects.includes(subject))
    );
};

// Отображение учителей
const renderTeachers = (teachers) => {
    const teachersContainer = document.querySelector('.teachers-container');

    if (!teachersContainer) {
        console.error('Контейнер учителей не найден');
        return;
    }

    teachersContainer.textContent = '';

    if (teachers.length === 0) {
        teachersContainer.innerHTML = `
            <div class="no-teachers">
                <p>Преподаватели по выбранной категории не найдены</p>
            </div>
        `;
        return;
    }

    teachers.forEach((teacher) => {
        teachersContainer.insertAdjacentHTML('beforeend', createTeacherCard(teacher));
    });
};

// Инициализация табов
const initTabs = (teachers) => {
    const tabs = document.querySelectorAll('.category');
    const teachersContainer = document.querySelector('.teachers-container');

    if (!tabs.length || !teachersContainer) {
        console.error('Табы или контейнер учителей не найдены');
        return;
    }

    const clearAllTabs = () => {
        tabs.forEach((tab) => tab.classList.remove('active'));
    };

    const handleTabClick = (tab) => {
        const category = tab.textContent.trim();
        clearAllTabs();
        tab.classList.add('active');

        const filteredTeachers = filterTeachersByCategory(teachers, category);
        renderTeachers(filteredTeachers);
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => handleTabClick(tab));
    });

    // Показываем всех учителей при загрузке
    const activeTab = document.querySelector('.category.active');
    if (activeTab) {
        const filteredTeachers = filterTeachersByCategory(teachers, activeTab.textContent.trim());
        renderTeachers(filteredTeachers);
    }
};

// Обработчик клика по кнопке "Записаться"
const initBookingHandlers = (modal) => {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('teacher_submit')) {
            const teacherId = e.target.getAttribute('data-id');
            const teacher = teachersData.find(t => t.id == teacherId);

            if (teacher && modal) {
                modal.openModal(teacher.full_name, teacher.subjects);
            } else {
                console.error('Учитель не найден или модальное окно не инициализировано');
            }
        }
    });
};

// Основная функция инициализации
const initTeachersSection = async () => {
    try {
        teachersData = await getData(BASE_URL + 'api.php?action=teachers');
        console.log('Загружены учителя:', teachersData);

        // Инициализируем модальное окно
        const modal = initModal();

        // Инициализируем табы
        initTabs(teachersData);

        // Инициализируем обработчики записи
        initBookingHandlers(modal);

    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        const teachersContainer = document.querySelector('.teachers-container');
        if (teachersContainer) {
            teachersContainer.innerHTML = `
                <div class="error-message">
                    <p>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</p>
                </div>
            `;
        }
    }
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initTeachersSection); */





// ! получать данные с сервера
const getData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}`);
    } else {
        return await response.json();
    }
};

// Конфигурация
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
};

// Категории и их предметы
const categories = {
    'Подготовка, начальные классы': ['Подготовка к школе', 'Начальная школа'],
    'Гуманитарные науки': ['Русский язык', 'Литература', 'История', 'Обществознание', 'Окружающий мир'],
    'Точные науки': ['Математика', 'Физика', 'Химия', 'Информатика', 'Биология', 'География'],
    'Языки': ['Английский', 'Немецкий', 'Французский', 'Испанский'],
    'Клубы': ['Шахматы', 'Музыка', 'Программирование', 'Вокал'],
    'ОГЭ': [], // Будет определяться по полю prep_oge
    'ЕГЭ': [], // Будет определяться по полю prep_ege
    'Все репетиторы': [] // Все учителя
};

// Глобальная переменная для хранения данных учителей
let teachersData = [];

// Функция управления модальным окном
const initModal = () => {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal_close');
    const modalForm = document.querySelector('.modal_form');

    if (!modalOverlay || !modalClose) {
        console.error('Элементы модального окна не найдены');
        return;
    }

    // Закрытие модального окна
    const closeModal = () => {
        modalOverlay.classList.remove('modal-open');
        document.body.classList.remove('modal-open');

        // Ждем завершения анимации перед скрытием
        setTimeout(() => {
            modalOverlay.style.display = 'none';
        }, 300);
    };

    // Открытие модального окна
    const openModal = (teacherName, teacherSubjects) => {
        // Сначала показываем элемент
        modalOverlay.style.display = 'flex';

        // Ждем следующего кадра анимации
        setTimeout(() => {
            const teacherInput = modalForm?.querySelector('input[name="teacher"]');
            if (teacherInput) {
                const subjectsText = Array.isArray(teacherSubjects) ? teacherSubjects.join(', ') : teacherSubjects;
                teacherInput.value = `${teacherName} - ${subjectsText}`;
            }
            modalOverlay.classList.add('modal-open');
            document.body.classList.add('modal-open');
        }, 10);
    };

    // Обработчики событий
    modalClose.addEventListener('click', closeModal);

    // Закрытие по клику на подложку
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('modal-open')) {
            closeModal();
        }
    });

    // Обработка отправки формы
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Здесь можно добавить отправку данных на сервер
            console.log('Данные формы:', {
                teacher: modalForm.querySelector('input[name="teacher"]').value,
                firstname: modalForm.querySelector('input[name="firstname"]').value,
                phone: modalForm.querySelector('input[name="phone"]').value,
                email: modalForm.querySelector('input[name="email"]').value
            });
            closeModal();
        });
    }

    return { openModal, closeModal };
};

// Функция создания иконок предметов
const createIcons = (subjects) => {
    const teacher_subjects = document.createElement('ul');
    teacher_subjects.className = 'teacher_subjects';

    subjects.forEach((subject) => {
        if (allSubjectsIcons[subject]) {
            teacher_subjects.insertAdjacentHTML('beforeend',
                `<li><img src="./src/img/classes/${allSubjectsIcons[subject]}" alt="${subject}"></li>`
            );
        }
    });

    return teacher_subjects.outerHTML;
};

const createSubjectsText = (subjects) => {
    const teacher_subjects_list = document.createElement('ul');
    teacher_subjects_list.className = 'teacher_subjects_list';
    teacher_subjects_list.insertAdjacentHTML('beforeend', `<span>Предметы:</span>`);

    subjects.forEach((subject) => {
        if (allSubjectsIcons[subject]) {
            teacher_subjects_list.insertAdjacentHTML('beforeend',
                `<li>- ${subject}</li>`
            );
        }
    });

    return teacher_subjects_list.outerHTML;
};

// НОВАЯ КАРТОЧКА С ОБНОВЛЕННОЙ СТРУКТУРОЙ
const createTeacherCard = (teacher) => {
    const { id, full_name, education, experience, subjects, photo } = teacher;

    // Обработка фото (защита от undefined)
    const photoSrc = photo ? `${BASE_URL}${photo}` : './src/img/default-teacher.jpg';

    return `
        <div class="teacher-card">
            <div class="teacher_img">
                <div class="teacher_photo">
                    <img src="${photoSrc}" alt="${full_name}" onerror="this.src='./src/img/default-teacher.jpg'">
                </div>
                ${createIcons(subjects)}
            </div>
            <div class="teacher_info">
                <div class="teacher_content">
                    <a href="/teacher_profile.html?teacherId=${id}" style="text-decoration: none; color: black;">
                        <div class="teacher_name">${full_name}</div>
                    </a>
                    <div class="teacher_univercity">Образование: ${education}</div>
                    <div class="teacher_exp">Опыт: ${experience} лет</div>
                    ${createSubjectsText(subjects)}
                </div>
                <button class="teacher_submit" data-id="${id}">Записаться</button>
            </div>
        </div>
    `;
};

// Фильтрация учителей по категории
const filterTeachersByCategory = (teachers, category) => {
    if (category === 'Все репетиторы') {
        return teachers;
    }

    if (category === 'ОГЭ') {
        return teachers.filter(teacher => teacher.prep_oge === true);
    }

    if (category === 'ЕГЭ') {
        return teachers.filter(teacher => teacher.prep_ege === true);
    }

    const categorySubjects = categories[category];
    return teachers.filter(teacher =>
        teacher.subjects.some(subject => categorySubjects.includes(subject))
    );
};

// Отображение учителей
const renderTeachers = (teachers) => {
    const teachersContainer = document.querySelector('.teachers-container');

    if (!teachersContainer) {
        console.error('Контейнер учителей не найден');
        return;
    }

    teachersContainer.textContent = '';

    if (teachers.length === 0) {
        teachersContainer.innerHTML = `
            <div class="no-teachers">
                <p>Преподаватели по выбранной категории не найдены</p>
            </div>
        `;
        return;
    }

    teachers.forEach((teacher) => {
        teachersContainer.insertAdjacentHTML('beforeend', createTeacherCard(teacher));
    });
};

// Инициализация табов
const initTabs = (teachers) => {
    const tabs = document.querySelectorAll('.category');
    const teachersContainer = document.querySelector('.teachers-container');

    if (!tabs.length || !teachersContainer) {
        console.error('Табы или контейнер учителей не найдены');
        return;
    }

    const clearAllTabs = () => {
        tabs.forEach((tab) => tab.classList.remove('active'));
    };

    const handleTabClick = (tab) => {
        const category = tab.textContent.trim();
        clearAllTabs();
        tab.classList.add('active');

        const filteredTeachers = filterTeachersByCategory(teachers, category);
        renderTeachers(filteredTeachers);
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => handleTabClick(tab));
    });

    // Показываем всех учителей при загрузке
    const activeTab = document.querySelector('.category.active');
    if (activeTab) {
        const filteredTeachers = filterTeachersByCategory(teachers, activeTab.textContent.trim());
        renderTeachers(filteredTeachers);
    }
};

// Обработчик клика по кнопке "Записаться"
const initBookingHandlers = (modal) => {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('teacher_submit')) {
            const teacherId = e.target.getAttribute('data-id');
            const teacher = teachersData.find(t => t.id == teacherId);

            if (teacher && modal) {
                modal.openModal(teacher.full_name, teacher.subjects);
            } else {
                console.error('Учитель не найден или модальное окно не инициализировано');
            }
        }
    });
};

// Основная функция инициализации
const initTeachersSection = async () => {
    try {
        teachersData = await getData(BASE_URL + 'api.php?action=teachers');
        console.log('Загружены учителя:', teachersData);

        // Инициализируем модальное окно
        const modal = initModal();

        // Инициализируем табы
        initTabs(teachersData);

        // Инициализируем обработчики записи
        initBookingHandlers(modal);

    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        const teachersContainer = document.querySelector('.teachers-container');
        if (teachersContainer) {
            teachersContainer.innerHTML = `
                <div class="error-message">
                    <p>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</p>
                </div>
            `;
        }
    }
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initTeachersSection);