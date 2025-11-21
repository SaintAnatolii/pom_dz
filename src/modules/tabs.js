const tabs = () => {
    const tabs = document.querySelectorAll('.search_tab')
    const content = document.querySelectorAll('.search_tab_content')
    const search_contents = document.querySelector('.search_contents')
    const search_class_image = document.querySelector('.search_class_image')
    const search_class_image_2 = document.querySelector('.search_class_image_content')

    const tab_colors = {
        0: "#ffdb87",
        1: "#dff3c9",
        2: "#d5dcff",
        3: "#ffbec6",
        4: "#ffecbf",
        5: "#f5c7c7",
        6: "#f4dfd8",
        7: "#ffd5ea",
        8: "#ecdeff",
    }
    const tab_image = {
        0: "primary_school.png",
        1: "humanities.png",
        2: "exact_sciences.png",
        3: "languages.png",
        4: "average_school.png",
        5: "oge.png",
        6: "ege.png",
        7: "creation.png",
        8: "music.png",
    }

    // Функция для последовательной анимации элементов
    function animateItemsSequentially(container, delay = 100) {
        const items = container.querySelectorAll('.search_class');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity 0.3s ease ${index * delay}ms, transform 0.3s ease ${index * delay}ms`;

            // Запускаем анимацию после небольшой задержки
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        });
    }

    // Функция для сброса анимации элементов
    function resetItemsAnimation(container) {
        const items = container.querySelectorAll('.search_class');
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'none';
        });
    }

    function initialize() {
        // Show first tab content and image on load
        content.forEach((b, i) => {
            if (i === 0) {
                b.classList.add('active');
                b.style.opacity = 1;
                // Анимируем элементы первой вкладки
                setTimeout(() => {
                    animateItemsSequentially(b);
                }, 300);
            } else {
                b.classList.remove('active');
                b.style.opacity = 0;
                resetItemsAnimation(b);
            }
        });
        search_class_image.src = `src/img/search/${tab_image[0]}`;
        search_class_image.classList.add('visible');
        search_class_image.style.opacity = 1;

        search_class_image_2.src = `src/img/search/${tab_image[0]}`;
        if (window.innerWidth <= 768) {
            search_class_image_2.classList.add('visible');
            search_class_image_2.style.opacity = 1;
            search_contents.style.backgroundColor = tab_colors[0];
        }

        // Set first tab active
        tabs.forEach((b, i) => {
            if (i === 0) {
                b.classList.add('active');
                b.style.backgroundColor = tab_colors[0];
            } else {
                b.classList.remove('active');
                b.style.backgroundColor = '';
            }
        });
    }

    tabs.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Сбрасываем анимацию для всех контентов
            content.forEach(b => {
                resetItemsAnimation(b);
            });

            // Fade out current content
            content.forEach(b => {
                b.classList.remove('active');
                b.style.opacity = 0;
                b.style.transform = 'scale(0.95)';
                b.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });

            // Slide out current images
            search_class_image.style.animationName = 'slideOutRight';
            search_class_image.style.animationDuration = '0.3s';
            search_class_image.style.animationFillMode = 'forwards';

            search_class_image_2.style.animationName = 'slideOutRight';
            search_class_image_2.style.animationDuration = '0.3s';
            search_class_image_2.style.animationFillMode = 'forwards';

            // Remove active class from all buttons
            tabs.forEach((b) => {
                b.classList.remove('active');
                b.style.backgroundColor = '';
            });

            // After slide out animation ends, change image src and fade in new content and image
            search_class_image.addEventListener('animationend', function handler() {
                search_class_image.removeEventListener('animationend', handler);
                search_class_image.src = `src/img/search/${tab_image[index]}`;
                search_class_image_2.src = `src/img/search/${tab_image[index]}`;

                content[index].style.animationName = 'zoomInLeft';
                content[index].style.animationDuration = '0.3s';
                content[index].style.animationFillMode = 'forwards';
                content[index].classList.add('active');

                search_class_image.style.animationName = 'slideInRight';
                search_class_image.style.animationDuration = '0.3s';
                search_class_image.style.animationFillMode = 'forwards';

                search_class_image_2.style.animationName = 'slideInRight';
                search_class_image_2.style.animationDuration = '0.3s';
                search_class_image_2.style.animationFillMode = 'forwards';

                // Show new content with zoom in left animation
                content[index].classList.add('active');
                content[index].style.opacity = 1;
                content[index].style.transform = 'scale(1)';
                content[index].style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                // Add active class to clicked button
                btn.classList.add('active');
                btn.style.backgroundColor = tab_colors[index];

                // Запускаем последовательную анимацию для элементов новой вкладки
                setTimeout(() => {
                    animateItemsSequentially(content[index]);
                }, 300);

            });
        });
    });

    initialize();
}

tabs()