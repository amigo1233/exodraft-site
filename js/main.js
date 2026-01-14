// js/main.js

document.addEventListener('DOMContentLoaded', function () {
    console.log('main.js загружен');

    const track = document.getElementById('product-carousel-track');
    const prevButtons = document.querySelectorAll('.product-carousel__nav--prev');
    const nextButtons = document.querySelectorAll('.product-carousel__nav--next');
    const progressBar = document.getElementById('product-carousel-progress');

    if (!track) {
        console.log('product-carousel-track не найден');
        return;
    }

    // Прокрутка на "страницу" — примерно 80% видимой ширины
    const getScrollAmount = () => track.clientWidth * 0.8;

    const scrollByDelta = (delta) => {
        track.scrollBy({
            left: delta,
            behavior: 'smooth'
        });
    };

    // Навешиваем обработчики на все стрелки
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            scrollByDelta(-getScrollAmount());
        });
    });

    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            scrollByDelta(getScrollAmount());
        });
    });

    // Обновление синей полоски прогресса
    const updateProgress = () => {
        if (!progressBar) return;

        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) {
            progressBar.style.width = '0%';
            return;
        }

        const ratio = track.scrollLeft / maxScroll;
        progressBar.style.width = `${ratio * 100}%`;
    };

    track.addEventListener('scroll', updateProgress);

    // Начальное состояние
    updateProgress();
});
