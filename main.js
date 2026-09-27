/* ═══════════════════════════════════════════════════
   MAIN.JS — Wedding Invitation (Storytelling theme)
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    const doorScreen    = document.getElementById('door-screen');
    const doorClickZone = document.getElementById('door-click-zone');
    const particlesEl   = document.getElementById('particles');
    const musicBtn      = document.getElementById('music-btn');
    const musicIcon     = document.getElementById('music-icon');
    const bgMusic       = document.getElementById('bg-music');
    const cdDays        = document.getElementById('cd-days');
    const cdHours       = document.getElementById('cd-hours');
    const cdMins        = document.getElementById('cd-mins');
    const cdSecs        = document.getElementById('cd-secs');
    const calBtn        = document.getElementById('add-to-calendar');

    let doorsOpened = false;
    let musicPlaying = false;

    // Wedding: 11 Nov 2026, 4:00 AM IST
    const WEDDING_DATE = new Date('2026-11-11T04:00:00+05:30');

    // ── Particles (door screen) ──
    function createParticles(count) {
        if (!particlesEl) return;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = (Math.random() * 7) + 's';
            p.style.animationDuration = (5 + Math.random() * 5) + 's';
            const size = (2 + Math.random() * 3) + 'px';
            p.style.width = size;
            p.style.height = size;
            particlesEl.appendChild(p);
        }
    }

    // ── Music ──
    function startMusic() {
        if (!bgMusic) return;
        bgMusic.volume = 0.35;
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicIcon.textContent = '🔊';
            musicBtn.classList.add('playing');
        }).catch(() => { musicPlaying = false; });
    }

    function toggleMusic() {
        if (!bgMusic) return;
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            musicIcon.textContent = '🔇';
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.volume = 0.35;
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicIcon.textContent = '🔊';
                musicBtn.classList.add('playing');
            }).catch(() => {});
        }
    }

    // ── Door Open ──
    function openDoors() {
        if (doorsOpened) return;
        doorsOpened = true;

        if (navigator.vibrate) navigator.vibrate(40);

        startMusic();
        musicBtn.classList.add('visible');
        doorScreen.classList.add('opened');

        setTimeout(() => {
            doorScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
            setupScrollReveals();
        }, 2200);
    }

    // ── Scroll Reveals (IntersectionObserver) ──
    function setupScrollReveals() {
        const elements = document.querySelectorAll('.animate-on-reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay, 10) || 0;
                    setTimeout(() => entry.target.classList.add('revealed'), delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

        elements.forEach((el) => observer.observe(el));
    }

    // ── Countdown ──
    function updateCountdown() {
        const now = new Date();
        const diff = WEDDING_DATE - now;

        if (diff <= 0) {
            cdDays.textContent = '0'; cdHours.textContent = '0';
            cdMins.textContent = '0'; cdSecs.textContent = '0';
            return;
        }

        cdDays.textContent  = String(Math.floor(diff / (1000*60*60*24))).padStart(2, '0');
        cdHours.textContent = String(Math.floor((diff / (1000*60*60)) % 24)).padStart(2, '0');
        cdMins.textContent  = String(Math.floor((diff / (1000*60)) % 60)).padStart(2, '0');
        cdSecs.textContent  = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
    }

    // ── Calendar ──
    function setupCalendarButton() {
        if (!calBtn) return;
        calBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const startUTC = '20261110T223000Z';
            const endUTC   = '20261110T233000Z';
            const title = encodeURIComponent('Dharini & Nandakishore Wedding');
            const details = encodeURIComponent(
                'Wedding ceremony of Selvi Dharini T and Selvan Nandakishore S.V.\n\n' +
                'Muhurtham: 4:00 AM - 5:00 AM IST\n' +
                'Venue: Arulmigu Kunnathur Ayyanar Thirukoil, Uthukuli Taluk, Tiruppur District'
            );
            const location = encodeURIComponent('Arulmigu Kunnathur Ayyanar Thirukoil, Uthukuli Taluk, Tiruppur District');
            window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUTC}/${endUTC}&details=${details}&location=${location}`, '_blank');
        });
    }

    // ── Init ──
    function init() {
        document.body.style.overflow = 'hidden';
        createParticles(20);

        doorClickZone.addEventListener('click', openDoors);
        doorClickZone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDoors(); }
        });

        musicBtn.addEventListener('click', toggleMusic);

        updateCountdown();
        setInterval(updateCountdown, 1000);
        setupCalendarButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
