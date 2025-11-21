// const swiper = new Swiper('.swiper', {
//     direction: 'horizontal',
//     loop: true,
//     breakpoints: {
//         1600: {
//             slidesPerView: 4,
//             spaceBetween: 20
//         },
//         1440: {
//             slidesPerView: 3,
//             spaceBetween: 20
//         },
//         780: {
//             slidesPerView: 3,
//             spaceBetween: 20
//         },
//         370: {
//             slidesPerView: 1,
//             spaceBetween: 5
//         },
//     }
// });


/// Инициализация Swiper с правильными настройками
const teachersSwiper = new Swiper('.teachers-swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 10,
    speed: 600,
    // grabCursor: true,

    breakpoints: {
        // Mobile M
        375: {
            spaceBetween: 0,
        },
        // Mobile L
        425: {
            spaceBetween: 0,
        },
        // Tablet
        768: {
            spaceBetween: 5,
        },
        // Laptop
        1024: {
            spaceBetween: 30,
        },
        // Laptop L
        1440: {
            spaceBetween: 40,
        }
    }
});