document.addEventListener('DOMContentLoaded', function () {
    const carousels = document.querySelectorAll('[data-carousel]');

    const initCarousel = (root) => {
        const track = root.querySelector('[data-carousel-track]');
        const footer = root.querySelector('[data-carousel-footer]');
        const prevBtn = root.querySelector('[data-carousel-prev]');
        const nextBtn = root.querySelector('[data-carousel-next]');
        const progress = root.querySelector('[data-carousel-progress]');

        if (!track) return;

        const getScrollAmount = () => track.clientWidth * 0.85;

        const update = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;

            if (footer) {
                footer.style.display = (maxScroll <= 2) ? 'none' : '';
            }

            if (progress) {
                if (maxScroll <= 2) {
                    progress.style.width = '0%';
                } else {
                    const ratio = track.scrollLeft / maxScroll;
                    progress.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
                }
            }

            if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
            if (nextBtn) nextBtn.disabled = track.scrollLeft >= (maxScroll - 2);
        };

        const scrollByDelta = (delta) => {
            track.scrollBy({ left: delta, behavior: 'smooth' });
        };

        if (prevBtn) prevBtn.addEventListener('click', () => scrollByDelta(-getScrollAmount()));
        if (nextBtn) nextBtn.addEventListener('click', () => scrollByDelta(getScrollAmount()));

        track.addEventListener('scroll', update);
        window.addEventListener('resize', update);

        // фильтры (если есть)
        const section = root.closest('section');
        const tabsWrap = section ? section.querySelector('[data-filter-tabs]') : null;
        const cards = Array.from(track.querySelectorAll('.product-card'));

        if (tabsWrap) {
            const tabs = Array.from(tabsWrap.querySelectorAll('.catalog-tab'));

            const applyFilter = (filter) => {
                cards.forEach((card) => {
                    const v = card.getAttribute('data-orientation') || 'all';
                    const show = (filter === 'all') || (v === filter);
                    card.style.display = show ? '' : 'none';
                });

                track.scrollLeft = 0;
                requestAnimationFrame(() => update());
            };

            tabs.forEach((btn) => {
                btn.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('is-active'));
                    btn.classList.add('is-active');
                    applyFilter(btn.getAttribute('data-filter') || 'all');
                });
            });

            applyFilter('all');
        }

        update();
    };

    carousels.forEach(initCarousel);
});


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-filter]').forEach((filterBar) => {
    const section = filterBar.closest('section') || document;
    const track = section.querySelector('[data-carousel-track]');
    if (!track) return;

    const buttons = Array.from(filterBar.querySelectorAll('[data-filter-btn]'));
    if (!buttons.length) return;

    const items = Array.from(track.querySelectorAll('[data-filter-item]'));
    if (!items.length) return;

    const applyFilter = (key) => {
        items.forEach((item) => {
        const tag = item.getAttribute('data-filter-item');
        item.style.display = (key === 'all' || tag === key) ? '' : 'none';
        });

        track.scrollLeft = 0;
        track.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
    };

    filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-filter-btn]');
        if (!btn) return;

        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        applyFilter(btn.getAttribute('data-filter-btn'));
    });

    const active = buttons.find(b => b.classList.contains('is-active')) || buttons[0];
    applyFilter(active.getAttribute('data-filter-btn'));
    });
});
