class TabManager {
    constructor() {
        this.tabs = document.querySelectorAll('.find_tab');
        this.contents = document.querySelectorAll('.find_tab_content');
        this.activeIndex = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.activateTab(0);
    }

    setupEventListeners() {
        // Делегирование событий на контейнере
        document.querySelector('.find_tabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.find_tab');
            if (tab) {
                const index = Array.from(this.tabs).indexOf(tab);
                if (index !== -1) {
                    this.activateTab(index);
                }
            }
        });
    }

    activateTab(index) {
        // Снимаем активное состояние со всех элементов
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.backgroundColor = '';
            tab.setAttribute('aria-pressed', 'false');
        });

        this.contents.forEach(content => content.classList.remove('active'));

        // Устанавливаем активное состояние выбранным элементам
        this.tabs[index].classList.add('active');
        this.tabs[index].style.backgroundColor = this.tabs[index].dataset.color;
        this.tabs[index].setAttribute('aria-pressed', 'true');
        this.contents[index].classList.add('active');

        this.activeIndex = index;
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new TabManager();
});