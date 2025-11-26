// Данные отзывов
const reviewsList = [
    {
        name: "Наталья Иванова",
        text: "Помогатор - это единственное, что меня выручало в подготовке сына к ЕГЭ по математике. Преподаватель объяснял сложные темы простым языком, и сын сдал экзамен на 92 балла! ",
        subject: "Математика",
        photo: "./src/img/help/teacher1.png",
        city: "г. Москва",
        color: "#d4f4dd"
    },
    {
        name: "Александр Петров",
        text: "Дочь занималась английским с репетитором из Помогатора полгода. Результат превзошел все ожидания - с нуля вышла на уровень B1. Учительница всегда находила подход, занятия проходили в игровой форме.",
        subject: "Английский язык",
        photo: "./src/img/help/teacher2.png",
        city: "г. Москва",
        color: "#fff9e6"
    },
    {
        name: "Мария Сидорова",
        text: "Спасибо за подготовку к школе! Ребенок с радостью ходил на занятия, а теперь уверенно чувствует себя в первом классе. Особенно хочу отметить развитие логического мышления и речи.",
        subject: "Подготовка к школе",
        photo: "./src/img/help/teacher3.png",
        city: "г. Москва",
        color: "#ffe6f0"
    },
    {
        name: "Дмитрий Козлов",
        text: "Занимались физикой для подготовки к ОГЭ. Преподаватель смог заинтересовать сына, который до этого не любил предмет. Результат - твердая четверка на экзамене! Рекомендую всем родителям.",
        subject: "Физика",
        photo: "./src/img/help/teacher1.png",
        city: "г. Москва",
        color: "#e6f7ff"
    },
    {
        name: "Ольга Николаева",
        text: "Огромная благодарность репетитору по русскому языку! Дочь улучшила оценки с тройки до пятерки за два месяца. Занятия проходили интересно, с использованием современных методик.",
        subject: "Русский язык",
        photo: "./src/img/help/teacher2.png",
        city: "г. Москва",
        color: "#f0e6ff"
    },
    {
        name: "Сергей Васильев",
        text: "Сын занимался программированием в клубе Помогатора. Теперь сам пишет простые игры! Преподаватель смог объяснить сложные концепции доступным языком для 10-летнего ребенка.",
        subject: "Программирование",
        photo: "./src/img/help/teacher3.png",
        city: "г. Москва",
        color: "#fff0e6"
    },
    {
        name: "Екатерина Морозова",
        text: "Занимались химией для поступления в медицинский. Преподаватель - настоящий профессионал! Объяснял сложные темы на примерах из жизни. Поступили в желаемый ВУЗ!",
        subject: "Химия",
        photo: "./src/img/help/teacher1.png",
        city: "г. Москва",
        color: "#e6ffe6"
    },
    {
        name: "Иван Кузнецов",
        text: "Дочь занималась вокалом. За полгода заметно улучшились голосовые данные, появилась уверенность в себе. Преподаватель нашла подход к стеснительному ребенку.",
        subject: "Вокал",
        photo: "./src/img/help/teacher2.png",
        city: "г. Москва",
        color: "#fff5e6"
    },
    {
        name: "Анна Павлова",
        text: "Спасибо за помощь с домашними заданиями! Ребенок стал самостоятельнее, улучшилась успеваемость по всем предметам. Особенно помогли с математикой и русским.",
        subject: "Начальная школа",
        photo: "./src/img/help/teacher3.png",
        city: "г. Москва",
        color: "#e6f0ff"
    },
    {
        name: "Михаил Орлов",
        text: "Занимались историей для углубленного изучения. Преподаватель смог заинтересовать предметом, теперь сын участвует в олимпиадах. Спасибо за качественную подготовку!",
        subject: "История",
        photo: "./src/img/help/teacher1.png",
        city: "г. Москва",
        color: "#ffe6e6"
    }
];

// Единая функция инициализации
function initReviewsSection() {
    // 1. Рендерим карточки
    renderReviews();

    // 2. Инициализируем Swiper после рендера
    initReviewsSwiper();
}

// Функция для рендеринга карточек отзывов
function renderReviews() {
    const reviewsContainer = document.getElementById('reviews-container');

    if (!reviewsContainer) {
        console.error('Контейнер для отзывов не найден');
        return;
    }

    reviewsContainer.innerHTML = reviewsList.map((review, index) => `
        <article class="review-card swiper-slide">
            <div class="review-card-inner" style="background-color: ${review.color}">
                <img class="review-photo" src="${review.photo}" alt="Фото ${review.name}" loading="lazy">
                <div class="review-info">
                    <h4 class="review-author">${review.name}</h4>
                    <p class="review-text">${review.text}</p>
                    <p class="review-subject">Предмет: ${review.subject}</p>
                    <p class="review-location">${review.city}</p>
                </div>
            </div>
        </article>
    `).join('');
}

// Функция для инициализации Swiper
function initReviewsSwiper() {
    // Ждем немного чтобы DOM обновился после рендера
    setTimeout(() => {
        const reviewsSwiper = new Swiper('.reviews-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: true,
            speed: 600,
            grabCursor: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    centeredSlides: true
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 25,
                    centeredSlides: true
                },
                1024: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: true
                }
            }
        });

        // Автопрокрутка
        reviewsSwiper.autoplay = {
            delay: 5000,
            disableOnInteraction: false,
        };
        if (reviewsSwiper.autoplay && typeof reviewsSwiper.autoplay.start === 'function') {
            reviewsSwiper.autoplay.start();
        }

        console.log('Swiper инициализирован с', reviewsList.length, 'отзывами');
    }, 100);
}

// Добавляем CSS для нового элемента .review-subject
const style = document.createElement('style');
style.textContent = `
    .review-subject {
        color: rgba(32, 32, 32, 0.8);
        font-size: 14px;
        font-weight: 500;
        line-height: 1.2;
        margin-bottom: 10px;
        font-style: italic;
    }
    
    /* Адаптивность для нового элемента */
    @media screen and (max-width: 1720px) {
        .review-subject {
            font-size: 13px;
        }
    }
    
    @media screen and (max-width: 1439px) {
        .review-subject {
            font-size: 12px;
            margin-bottom: 8px;
        }
    }
    
    @media screen and (max-width: 1199px) {
        .review-subject {
            font-size: 11px;
            margin-bottom: 6px;
        }
    }
    
    @media screen and (max-width: 767px) {
        .review-subject {
            font-size: 10px;
            margin-bottom: 5px;
        }
    }
    
    @media screen and (max-width: 424px) {
        .review-subject {
            font-size: 9px;
            margin-bottom: 4px;
        }
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    initReviewsSection();
});

// Экспортируем функции для возможного использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { reviewsList, initReviewsSection, renderReviews };
}