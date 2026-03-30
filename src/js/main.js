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

// ===== DS accordion (smooth height) — CLOSED by default =====
document.addEventListener("DOMContentLoaded", () => {
    const toggles = document.querySelectorAll("[data-ds-toggle]");
    if (!toggles.length) return;

    toggles.forEach((btn) => {
        const panelId = btn.getAttribute("aria-controls");
        const panel = document.getElementById(panelId);
        if (!panel) return;

        // всегда закрыто при заходе
        btn.setAttribute("aria-expanded", "false");
        panel.style.height = "0px";

        btn.addEventListener("click", () => {
            const opened = btn.getAttribute("aria-expanded") === "true";
            const next = !opened;

            btn.setAttribute("aria-expanded", String(next));

            if (next) {
                // OPEN: 0 -> scrollHeight -> auto
                panel.style.height = "0px";
                requestAnimationFrame(() => {
                    panel.style.height = panel.scrollHeight + "px";
                });

                const onEnd = (e) => {
                    if (e.propertyName !== "height") return;
                    panel.style.height = "auto";
                    panel.removeEventListener("transitionend", onEnd);
                };
                panel.addEventListener("transitionend", onEnd);
            } else {
                // CLOSE: auto/current -> px -> 0
                panel.style.height = panel.scrollHeight + "px";
                requestAnimationFrame(() => {
                    panel.style.height = "0px";
                });
            }
        });
    });
});


document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-gallery-thumb]');
    if (!btn) return;

    const gallery = btn.closest('[data-gallery]');
    if (!gallery) return;

    const target = btn.getAttribute('data-target');

    // thumbs active
    gallery.querySelectorAll('[data-gallery-thumb]').forEach(t => t.classList.remove('is-active'));
    btn.classList.add('is-active');

    // frames active
    const frames = gallery.querySelectorAll('[data-gallery-frame]');
    frames.forEach(f => f.classList.remove('is-active'));
    const frame = gallery.querySelector(`[data-gallery-frame="${target}"]`);
    if (frame) {
        frame.classList.add('is-active');

        // на ПК: лёгкий скролл/фокус, чтобы визуально было “переключилось”
        frame.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
});


document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-gallery-thumb]');
    if (!btn) return;

    const gallery = btn.closest('[data-gallery]');
    if (!gallery) return;

    const target = btn.getAttribute('data-target');

    // thumbs active
    gallery.querySelectorAll('[data-gallery-thumb]').forEach(t => t.classList.remove('is-active'));
    btn.classList.add('is-active');

    // big cards active
    gallery.querySelectorAll('[data-gallery-frame]').forEach(f => f.classList.remove('is-active'));
    const frame = gallery.querySelector(`[data-gallery-frame="${target}"]`);
    if (frame) {
        frame.classList.add('is-active');
        // на ПК: лёгкий фокус, чтобы ощущалось “переключение”
        frame.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
});



// ===== Cookie consent (GA4) + page_view =====
(function () {
    const KEY = 'cookie_consent_v1';
    const TS = 'cookie_consent_v1_ts';

    const banner = document.getElementById('cookieBanner');
    if (!banner) return;

    function updateConsent(granted) {
        if (typeof gtag !== 'function') return;

        gtag('consent', 'update', {
            analytics_storage: granted ? 'granted' : 'denied',
            ad_storage: 'denied'
        });
    }

    function sendPageView() {
        if (typeof gtag !== 'function') return;
        gtag('event', 'page_view');
    }

    banner.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cookie]');
        if (!btn) return;

        const val = btn.getAttribute('data-cookie');
        if (val !== 'accept' && val !== 'reject') return;

        try {
            localStorage.setItem(KEY, val);
            localStorage.setItem(TS, String(Date.now()));
        } catch (err) { }

        if (val === 'accept') {
            updateConsent(true);
            sendPageView();
        } else {
            updateConsent(false);
        }

        banner.hidden = true;
    });

    const saved = localStorage.getItem(KEY);

    if (saved === 'accept') {
        updateConsent(true);
        sendPageView();
        banner.hidden = true;
        return;
    }

    if (saved === 'reject') {
        updateConsent(false);
        banner.hidden = true;
        return;
    }

    banner.hidden = false;
})();


// ===== Call request modal -> Node API -> Telegram =====
(function () {
    const form = document.getElementById('callForm');
    if (!form) return;

    const msg = document.getElementById('callFormMsg');
    const modalEl = document.getElementById('callModal');
    const successEl = document.getElementById('callSuccess');
    const contentEl = document.getElementById('callContent');

    function setMsg(text, ok) {
        if (!msg) return;

        msg.textContent = text;
        msg.classList.remove('is-ok', 'is-error');

        if (!text) return;

        msg.classList.add(ok ? 'is-ok' : 'is-error');
    }
    function normalizePhone(phone) {
        return String(phone || "").trim().replace(/\s+/g, " ");
    }


    function showSuccess() {
        if (!successEl) return;
        if (contentEl) contentEl.hidden = true;
        if (msg) {
            msg.textContent = "";
            msg.classList.remove('is-ok', 'is-error');
        }
        successEl.hidden = false;
    }

    function resetModal() {
        if (contentEl) contentEl.hidden = false;
        if (successEl) successEl.hidden = true;
        if (msg) {
            msg.textContent = "";
            msg.classList.remove('is-ok', 'is-error');
        }
    }

    // когда модалка закрывается — сбрасываем состояние
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', resetModal);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setMsg('', true);

        const fd = new FormData(form);
        const name = String(fd.get('name') || '').trim();
        const phone = normalizePhone(fd.get('phone'));
        const message = String(fd.get('message') || '').trim();
        const website = String(fd.get('website') || '').trim();

        if (name.length < 2) return setMsg("Вкажіть ім’я (мінімум 2 символи).", false);
        if (phone.length < 6) return setMsg("Вкажіть коректний номер телефону.", false);

        try {
            setMsg("Надсилаємо...", true);

            const res = await fetch("/api/call-request", { // http://localhost:8080
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, message, page: location.href, website })
            });

            if (!res.ok) {
                const t = await res.text().catch(() => "");
                throw new Error(t || `Помилка: ${res.status}`);
            }

            form.reset();
            showSuccess();

            // опционально: закрыть автоматически через 1.4 сек
            setTimeout(() => {
                if (window.bootstrap && modalEl) {
                    const m = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    m.hide();
                }
            }, 7000);

        } catch (err) {
            setMsg(err?.message || "Не вдалося надіслати. Спробуйте ще раз.", false);
        }
    });
})();



document.addEventListener('DOMContentLoaded', () => {
    const mobileMq = window.matchMedia('(max-width: 991.98px)');
    const header = document.querySelector('.site-header');
    const headerToggle = document.querySelector('[data-mobile-header-toggle]');
    const headerPanel = document.getElementById('mainNavbar');
    const submenuToggles = document.querySelectorAll('.exo-mobile-toggle');

    if (!header || !headerToggle || !headerPanel) return;

    function getSubmenu(btn) {
        const id = btn.getAttribute('data-mobile-menu-target');
        return id ? document.getElementById(id) : null;
    }

    function animateCloseSubmenu(btn, panel) {
        if (!panel) return;
        btn.setAttribute('aria-expanded', 'false');

        panel.style.height = panel.scrollHeight + 'px';

        requestAnimationFrame(() => {
            panel.classList.remove('is-open');
            panel.style.height = '0px';
        });
    }

    function closeAllSubmenus(exceptBtn = null) {
        submenuToggles.forEach((btn) => {
            if (btn === exceptBtn) return;
            const panel = getSubmenu(btn);
            if (!panel) return;

            if (btn.getAttribute('aria-expanded') === 'true') {
                animateCloseSubmenu(btn, panel);
            } else {
                btn.setAttribute('aria-expanded', 'false');
                panel.classList.remove('is-open');
                panel.style.height = '0px';
            }
        });
    }

    function openHeader() {
        header.classList.add('is-menu-open');
        headerToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open-mobile');
    }

    function closeHeader() {
        header.classList.remove('is-menu-open');
        headerToggle.setAttribute('aria-expanded', 'false');
        closeAllSubmenus();
        document.body.classList.remove('menu-open-mobile');
    }

    submenuToggles.forEach((btn) => {
        const panel = getSubmenu(btn);
        if (panel) panel.style.height = '0px';

        btn.addEventListener('click', () => {
            if (!mobileMq.matches) return;
            if (!header.classList.contains('is-menu-open')) return;

            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            if (isOpen) {
                animateCloseSubmenu(btn, panel);
                return;
            }

            closeAllSubmenus(btn);

            btn.setAttribute('aria-expanded', 'true');

            if (panel) {
                panel.classList.add('is-open');
                panel.style.height = '0px';

                requestAnimationFrame(() => {
                    panel.style.height = panel.scrollHeight + 'px';
                });

                const onEnd = (e) => {
                    if (e.propertyName !== 'height') return;
                    if (btn.getAttribute('aria-expanded') === 'true') {
                        panel.style.height = 'auto';
                    }
                    panel.removeEventListener('transitionend', onEnd);
                };

                panel.addEventListener('transitionend', onEnd);
            }
        });
    });

    headerToggle.addEventListener('click', () => {
        if (!mobileMq.matches) return;

        if (header.classList.contains('is-menu-open')) {
            closeHeader();
        } else {
            openHeader();
        }
    });

    headerPanel.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link || !mobileMq.matches) return;
        closeHeader();
    });

    function resetMobileState() {
        if (!mobileMq.matches) {
            header.classList.remove('is-menu-open');
            headerToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open-mobile');

            submenuToggles.forEach((btn) => {
                const panel = getSubmenu(btn);
                btn.setAttribute('aria-expanded', 'false');
                if (panel) {
                    panel.classList.remove('is-open');
                    panel.style.height = '';
                }
            });
        }
    }

    resetMobileState();

    if (mobileMq.addEventListener) {
        mobileMq.addEventListener('change', resetMobileState);
    } else if (mobileMq.addListener) {
        mobileMq.addListener(resetMobileState);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const videoCards = document.querySelectorAll('.js-hr-video');

    videoCards.forEach((card) => {
        const video = card.querySelector('video');
        const playBtn = card.querySelector('.hr-video-card__play');

        if (!video || !playBtn) return;

        video.removeAttribute('controls');

        playBtn.addEventListener('click', async () => {
            try {
                video.setAttribute('controls', 'controls');
                await video.play();
                card.classList.add('is-playing');
            } catch (err) {
                console.error('Video play failed:', err);
            }
        });

        video.addEventListener('pause', () => {
            if (video.currentTime > 0 && !video.ended) return;
            card.classList.remove('is-playing');
            video.removeAttribute('controls');
        });

        video.addEventListener('ended', () => {
            card.classList.remove('is-playing');
            video.removeAttribute('controls');
            video.currentTime = 0;
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const desktopMq = window.matchMedia('(min-width: 992px)');
    const alwaysSolid = header.classList.contains('header--solid');

    function updateHeaderState() {
        if (alwaysSolid) {
            header.classList.remove('header--transparent', 'header--hovered');
            header.classList.add('header--solid');
            return;
        }

        const isTop = window.scrollY <= 10;
        const isHovered = header.matches(':hover');

        header.classList.toggle('header--hovered', isHovered && desktopMq.matches);
        header.classList.toggle('header--solid', !isTop || (isHovered && desktopMq.matches));
        header.classList.toggle('header--transparent', isTop && !(isHovered && desktopMq.matches));
    }

    updateHeaderState();

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('resize', updateHeaderState);

    header.addEventListener('mouseenter', updateHeaderState);
    header.addEventListener('mouseleave', updateHeaderState);
});