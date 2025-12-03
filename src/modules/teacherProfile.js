// Функция для склонения слова "год" в зависимости от числа
const getYearsWord = (years) => {
    const lastDigit = years % 10;
    const lastTwoDigits = years % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
        return 'год';
    }

    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
        return 'года';
    }

    return 'лет';
};

// Функция для определения диапазона классов
const getClassRange = (teacherData) => {
    let minClass = 1; // начальные классы по умолчанию
    let maxClass = 11; // старшие классы по умолчанию

    // Если готовит к ОГЭ (9 класс)
    if (teacherData.prep_oge) {
        maxClass = 9;
    }

    // Если готовит к ЕГЭ (11 класс)
    if (teacherData.prep_ege) {
        maxClass = 11;
    }

    // Если готовит и к ОГЭ, и к ЕГЭ
    if (teacherData.prep_oge && teacherData.prep_ege) {
        minClass = 9;
        maxClass = 11;
        return `${minClass}-${maxClass}`;
    }

    // Если готовит только к ОГЭ
    if (teacherData.prep_oge) {
        return `1-${maxClass}`;
    }

    // Если готовит только к ЕГЭ
    if (teacherData.prep_ege) {
        return `10-${maxClass}`;
    }

    // По умолчанию для всех классов
    return `${minClass}-${maxClass}`;
};

// Функция для форматирования описания
const formatTeacherDescription = (teacherData) => {
    // Формируем список предметов
    let subjectsText = '';
    if (teacherData.subjects && teacherData.subjects.length > 0) {
        // Преобразуем список в строку
        subjectsText = teacherData.subjects.join(', ');
    }

    // Получаем диапазон классов
    const classRange = getClassRange(teacherData);

    // Формируем итоговое описание
    return `Индивидуальные и групповые занятия по ${subjectsText} для ${classRange} классов.`;
};



const teacherProfile = () => {

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


    // Функция создания иконок предметов
    const createIcons = (subjects, parent) => {

        subjects.forEach((subject) => {
            if (allSubjectsIcons[subject]) {
                const iconPath = getCorrectUrl(`./src/img/classes/${allSubjectsIcons[subject]}`);
                parent.insertAdjacentHTML('beforeend',
                    `<img src="${iconPath}" alt="${subject}" />`
                )
            }
        })

    }

    const BASE_URL = 'http://saintdevor.temp.swtest.ru';

    const getData = async (url) => {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status} по адресу ${url}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return null;
        }
    };

    // Получаем teacherId из URL
    const teacherId = new URLSearchParams(window.location.search).get('teacherId');

    // Проверяем наличие teacherId
    if (!teacherId) {
        console.error('teacherId не найден в URL параметрах');
        alert('ID преподавателя не указан');
        return;
    }

    console.log('Teacher ID:', teacherId);

    // Получаем элементы DOM
    const photo = document.querySelector('.teacher_header');
    const teacher_fullname = document.querySelector('.teacher_fullname');
    const teacher_description = document.querySelector('.teacher_description');
    const rating = document.querySelector('.yellow_layout');
    const education = document.getElementById('education');
    const description = document.getElementById('description');
    const experience = document.getElementById('experience');
    const iconsRow = document.querySelector('.icons-row');
    const teacher_form = document.getElementById('teacher_form');

    // Загружаем данные
    getData(`${BASE_URL}/api.php?action=teachers&id=${teacherId}`)
        .then((teacherData) => {
            if (!teacherData) {
                console.error('Данные не получены');
                return;
            }

            console.log('Данные преподавателя:', teacherData);

            // Обрабатываем полное имя
            if (teacherData && teacherData.full_name) {
                teacher_fullname.textContent = teacherData.full_name;
                teacher_form.value = teacherData.full_name;
            }

            if (teacherData && teacherData.subjects) {
                createIcons(teacherData.subjects, iconsRow)
            }

            // Форматируем и выводим описание
            const formattedDescription = formatTeacherDescription(teacherData);
            if (teacher_description) {
                teacher_description.textContent = formattedDescription;
            }

            // Также выводим в другой элемент, если нужно
            if (teacherData && teacherData.description) {
                description.textContent = teacherData.description;
            }

            // Обрабатываем образование
            if (teacherData.education && education) {
                education.textContent = teacherData.education;
            }

            // Обрабатываем опыт работы
            if (teacherData.experience && experience) {
                experience.textContent = `${teacherData.experience} ${getYearsWord(teacherData.experience)}`;
            }

            // Обрабатываем фото
            if (teacherData.photo && photo) {
                console.log('Фото URL:', `${BASE_URL}/${teacherData.photo}`);
                // Если это элемент с background-image
                if (photo.style) {
                    photo.style.backgroundImage = `url('${BASE_URL}/${teacherData.photo}')`;

                }
                // Если это img элемент
                else if (photo.tagName === 'IMG') {
                    photo.src = `${BASE_URL}/${teacherData.photo}`;
                    photo.alt = teacherData.full_name || 'Фото преподавателя';
                }
            }

            // Обрабатываем рейтинг
            if (teacherData.rating && rating) {
                rating.style.width = `${teacherData.rating}%`;
            }

        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

// Запускаем функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', teacherProfile);