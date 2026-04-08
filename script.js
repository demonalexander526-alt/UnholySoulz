const SITE_BRAND = 'UnholySoulz';

function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.top-nav .nav-link').forEach(link => {
        link.classList.toggle('active', link.href.includes(currentPage));
    });
}

function createToast(message) {
    const existing = document.querySelector('.toast-message');
    if (existing) {
        existing.textContent = message;
        return;
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast-visible'));

    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

function showSrtAvailabilityConfirm() {
    const cardSources = Array.from(document.querySelectorAll('.video-card')).flatMap(card => {
        const srcs = [];
        const dataSrc = card.dataset.src;
        if (dataSrc) srcs.push(dataSrc);
        const nestedSource = card.querySelector('source')?.getAttribute('src');
        if (nestedSource && nestedSource !== dataSrc) srcs.push(nestedSource);
        return srcs;
    });

    const heroSource = document.querySelector('.hero-video source')?.getAttribute('src');
    const sources = Array.from(new Set([...cardSources, heroSource].filter(Boolean)));
    const message = sources.length > 0
        ? `Current SRT files available in this page:\n\n${sources.map(src => `• ${src}`).join('\n')}\n\nClick OK to confirm.`
        : 'No SRT video files are currently available on this page.';

    if (window.confirm(message)) {
        createToast('SRT availability confirmed.');
    } else {
        createToast('SRT availability dismissed.');
    }
}

function animateValue(element, targetValue) {
    const numeric = Number(targetValue.toString().replace(/[^0-9]/g, ''));
    if (!numeric) {
        element.textContent = targetValue;
        return;
    }

    const increment = Math.max(Math.round(numeric / 50), 1);
    let current = 0;
    const suffix = targetValue.toString().replace(/[0-9]/g, '');

    const interval = setInterval(() => {
        current += increment;
        if (current >= numeric) {
            element.textContent = `${targetValue}`;
            clearInterval(interval);
            return;
        }
        element.textContent = `${current}${suffix}`;
    }, 18);
}

document.addEventListener('DOMContentLoaded', () => {
    document.title = document.title.replace(/Shadow Unit/g, SITE_BRAND);
    setActiveNav();

    const siteLoader = document.getElementById('siteLoader');
    const hideLoader = () => siteLoader?.classList.add('loaded');
    const showLoader = () => {
        siteLoader?.classList.remove('loaded');
    };

    window.addEventListener('load', () => setTimeout(hideLoader, 120));

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (link.target === '_blank' || link.target === '_new') return;
        if (link.host && link.host !== window.location.host) return;

        link.addEventListener('click', event => {
            event.preventDefault();
            showLoader();
            setTimeout(() => window.location.href = link.href, 140);
        });
    });

    const progressBar = document.createElement('div');
    progressBar.className = 'page-progress';
    document.body.appendChild(progressBar);

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollable ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.width = `${Math.min(Math.max(percentage, 0), 100)}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    const hero = document.querySelector('.hero');
    const background = document.querySelector('.page-background');
    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 18;
        const y = (e.clientY / window.innerHeight - 0.5) * 18;
        if (background) background.style.transform = `translate(${x}px, ${y}px)`;
        if (hero) hero.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
    });

    const sectionLinks = Array.from(document.querySelectorAll('.top-nav .nav-link[href^="#"]')).map(link => ({
        link,
        section: document.querySelector(link.hash)
    })).filter(item => item.section);

    const updateNavHighlight = () => {
        const fromTop = window.scrollY + 120;
        sectionLinks.forEach(({ link, section }) => {
            const isActive = section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop;
            link.classList.toggle('active', isActive);
        });
    };
    window.addEventListener('scroll', updateNavHighlight, { passive: true });
    updateNavHighlight();

    if (document.querySelector('.video-grid')) {
        showSrtAvailabilityConfirm();
    }

    const recruitStats = [
        { title: 'Active Recruits', value: '214', note: 'Ready for matches' },
        { title: 'Completed Training', value: '68%', note: 'Elite squad progress' },
        { title: 'Weekly Wins', value: '39', note: 'Top performance streak' }
    ];

    const statsContainer = document.getElementById('recruit-stats');
    if (statsContainer) {
        statsContainer.innerHTML = recruitStats.map(stat => `
            <article class="stat-card">
                <h3>${stat.title}</h3>
                <p>${stat.note}</p>
                <span class="stat-value">0</span>
                <span class="stat-pill">Live update</span>
            </article>
        `).join('');

        const statValueEls = statsContainer.querySelectorAll('.stat-value');
        statValueEls.forEach((el, index) => animateValue(el, recruitStats[index].value));
    }

    const button = document.querySelector('.button');
    if (button) {
        button.addEventListener('click', () => createToast('Opening squad application...'));
    }

    const contactStatus = document.querySelector('.contact-status');
    document.querySelectorAll('.contact-card').forEach(link => {
        link.addEventListener('click', () => {
            const label = link.dataset.name || link.textContent.trim().split('•')[0].trim();
            document.querySelectorAll('.contact-card').forEach(item => {
                item.classList.remove('contact-active');
                item.classList.remove('contact-pulse');
            });
            link.classList.add('contact-active', 'contact-pulse');
            if (contactStatus) {
                contactStatus.textContent = `Selected: ${label} — UnholySoulz Engine ready to connect.`;
                contactStatus.style.color = '#8cf4c0';
            }
            setTimeout(() => link.classList.remove('contact-pulse'), 1400);
            createToast(`UnholySoulz engine integrated — ${label} selected`);
        });
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.feature-card').forEach(item => item.classList.remove('feature-active'));
            card.classList.add('feature-active');
        });
    });

    const mainVideo = document.querySelector('.hero-video');
    const mainVideoSource = mainVideo?.querySelector('source');
    const heroWrapper = document.querySelector('.video-wrapper');
    const setPreviewLoaded = () => heroWrapper?.classList.add('loaded');

    if (mainVideo) {
        mainVideo.addEventListener('canplay', setPreviewLoaded, { once: true });
        mainVideo.addEventListener('error', setPreviewLoaded, { once: true });
    }

    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            const newSrc = card.dataset.src || card.querySelector('source')?.getAttribute('src');
            if (!mainVideo || !mainVideoSource || !newSrc) return;

            if (mainVideoSource.getAttribute('src') !== newSrc) {
                heroWrapper?.classList.remove('loaded');
                mainVideoSource.setAttribute('src', newSrc);
                mainVideo.load();
                mainVideo.addEventListener('canplay', setPreviewLoaded, { once: true });
                mainVideo.play().catch(() => {});
                createToast('Loaded new clip to main player');
            }

            document.querySelectorAll('.video-card').forEach(item => item.classList.remove('video-active'));
            card.classList.add('video-active');
        });
    });

    const liveState = document.getElementById('liveState');
    const livePreview = document.getElementById('livePreview');
    const liveLink = 'https://www.tiktok.com/@dragon_codmobile?is_from_webapp=1&sender_device=pc';
    const proxy = url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const checkLiveStatus = async () => {
        try {
            const response = await fetch(proxy(liveLink));
            const html = await response.text();
            const isLive = /\bLIVE\b/i.test(html) || /"is_live"\s*:\s*true/i.test(html) || /"isLive"\s*:\s*true/i.test(html);
            if (isLive) {
                liveState.textContent = 'Live now';
                liveState.style.background = 'linear-gradient(135deg, #ff4d6d, #ff8b00)';
                livePreview.innerHTML = `<iframe src="${liveLink}" title="TikTok Live Preview" allow="autoplay; fullscreen" loading="lazy"></iframe>`;
            } else {
                liveState.textContent = 'Offline';
                livePreview.innerHTML = `<div class="live-placeholder">No live broadcast is active at the moment.</div>`;
            }
        } catch (error) {
            liveState.textContent = 'Unavailable';
            livePreview.innerHTML = `<div class="live-placeholder">Live preview is unavailable. Open the TikTok profile to check the stream.</div>`;
        }
    };

    if (liveState && livePreview) {
        checkLiveStatus();
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section, .hero').forEach(section => observer.observe(section));
});
