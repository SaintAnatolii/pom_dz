const menu = () => {
    const menuToggle = document.getElementById('menuToggle');
    const megaMenu = document.getElementById('megaMenu');
    const burger = document.getElementById('burger');

    // Toggle menu on click
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });

    burger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();

    });



    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    function toggleMenu() {
        const isActive = megaMenu.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        megaMenu.classList.add('active');
        menuToggle.classList.add('active');
        burger.classList.add('active')
    }

    function closeMenu() {
        megaMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        burger.classList.remove('active')
    }

    const activate_icons = (classname) => {
        document.querySelectorAll(classname).forEach(link => {
            const img = link.querySelector('img');
            const fullSrc = img.src;
            const filename = fullSrc.split('/').pop();
            let inactiveFilename = filename.replace('active_', '');
            const activeFilename = 'active_' + inactiveFilename.replace('.svg', '') + '.svg';
            const basePath = fullSrc.replace(filename, ''); // "src/img/classes/"

            link.addEventListener('mouseenter', () => {
                img.src = basePath + activeFilename;
            });

            link.addEventListener('mouseleave', () => {
                img.src = basePath + inactiveFilename;
            });
        });
    }

    activate_icons('.menu-link')
    activate_icons(".search_class")
    activate_icons(".class-item")
}

menu()