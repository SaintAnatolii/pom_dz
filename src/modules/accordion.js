const accordion = () => {

    // Получаем все элементы аккордеона
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Закрываем все остальные элементы
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.accordion-icon');
                    otherIcon.textContent = '+';
                }
            });

            // Переключаем текущий элемент
            if (isActive) {
                item.classList.remove('active');
                const icon = item.querySelector('.accordion-icon');
                icon.textContent = '+';
            } else {
                item.classList.add('active');
                const icon = item.querySelector('.accordion-icon');
                icon.textContent = '−';
            }
        });
    });
}

accordion()