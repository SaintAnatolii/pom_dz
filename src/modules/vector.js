const vector = () => {
    document.addEventListener('DOMContentLoaded', function () {
        const vectorButtons = document.querySelectorAll('.vector-button');

        vectorButtons.forEach(button => {
            // Сохраняем оригинальные пути к иконкам
            const img = button.querySelector('img');
            const fullSrc = img.src;
            const filename = fullSrc.split('/').pop();
            const inactiveFilename = filename.replace('active_', '');
            const activeFilename = 'active_' + inactiveFilename;
            const basePath = fullSrc.replace(filename, '');

            // Сохраняем пути в data-атрибутах
            button.dataset.inactiveIcon = basePath + inactiveFilename;
            button.dataset.activeIcon = basePath + activeFilename;

            button.addEventListener('click', function () {
                const isActive = this.classList.contains('active');
                const content = this.nextElementSibling;

                // Закрываем все открытые аккордеоны
                closeAllAccordions();

                // Если элемент не был активен - открываем его
                if (!isActive) {
                    // Меняем иконку на активную
                    const img = this.querySelector('img');
                    img.src = this.dataset.activeIcon;

                    // Добавляем классы для анимации
                    this.classList.add('active');
                    content.classList.add('active');
                }
            });
        });

        function closeAllAccordions() {
            vectorButtons.forEach(button => {
                const content = button.nextElementSibling;
                const img = button.querySelector('img');

                // Возвращаем неактивную иконку
                img.src = button.dataset.inactiveIcon;

                // Убираем активные классы
                button.classList.remove('active');
                content.classList.remove('active');
            });
        }
    });
}


vector()