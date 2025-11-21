document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.step-tab');
    const cards = document.querySelectorAll('.step_card');
    let currentStep = 1;
    let autoPlayInterval;

    // Функция переключения шага
    function switchStep(stepNumber) {
        // Убираем активный класс со всех табов
        tabs.forEach(t => t.classList.remove('active'));
        // Добавляем активный класс текущему табу
        tabs[stepNumber - 1].classList.add('active');

        // Убираем активный класс со всех карточек
        cards.forEach(card => {
            card.classList.remove('active');
        });

        // Находим нужную карточку
        const targetCard = document.getElementById(`step-${stepNumber}`);

        // Добавляем класс анимации
        targetCard.classList.add('dealing');

        // После завершения анимации добавляем активный класс
        setTimeout(() => {
            targetCard.classList.add('active');
            targetCard.classList.remove('dealing');
        }, 600);

        currentStep = stepNumber;
    }

    // Обработчики для табов
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const stepId = parseInt(this.getAttribute('data-step'));
            switchStep(stepId);
            resetAutoPlay();
        });
    });

    // Функция автопереключения
    function autoPlay() {
        let nextStep = currentStep + 1;
        if (nextStep > 4) nextStep = 1;

        switchStep(nextStep);
    }

    // Запуск автопереключения
    function startAutoPlay() {
        autoPlayInterval = setInterval(autoPlay, 4000);
    }

    // Сброс автопереключения
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Запускаем автопереключение при загрузке
    startAutoPlay();

    // Пауза при наведении на карточку
    const stepsContainer = document.querySelector('.steps-container');
    stepsContainer.addEventListener('mouseenter', function () {
        clearInterval(autoPlayInterval);
    });

    stepsContainer.addEventListener('mouseleave', function () {
        startAutoPlay();
    });
});