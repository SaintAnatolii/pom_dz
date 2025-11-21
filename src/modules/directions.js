const directions = () => {
    const items = document.querySelectorAll('.class-item')
    let image = document.querySelector('.math_image')
    image = image.querySelector('img')
    let title = document.querySelector('.math_title')
    title = title.querySelector('img')
    const descr = document.querySelector('.math_descr')
    const age = document.querySelector('.math_age')
    const btn = document.querySelector('.more-btn')
    const mathHighlight = document.querySelector('.math-highlight')

    let isAnimating = false

    items.forEach((el) => {
        el.addEventListener('click', () => {
            if (isAnimating) return
            isAnimating = true

            items.forEach(i => i.classList.remove('active'))
            el.classList.add('active')

            mathHighlight.classList.add('rotating')

            setTimeout(() => {
                image.src = `src/img/classes/${el.dataset.image}.svg`
                title.src = `src/img/classes/${el.dataset.logo}.svg`
                mathHighlight.style.backgroundColor = `${el.dataset.color}`
                btn.href = `${el.dataset.url}`
            }, 250)

            setTimeout(() => {
                mathHighlight.classList.remove('rotating')
                isAnimating = false
            }, 500)
        })
    })
}

directions()