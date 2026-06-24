// Wedding day countdown — drives the tear-off pads in the hero
const weddingDate = new Date('2026-08-22T12:30:00');
const timeCards = document.querySelectorAll('.time-card');
const timeUnits = document.querySelectorAll('.time-unit');
const bigDaySign = document.getElementById('big-day-sign');

if (timeCards.length) {
    const lastValues = {};

    const tearLeaf = (card, oldText) => {
        const leaf = document.createElement('span');
        leaf.className = 'time-leaf-fly';
        leaf.textContent = oldText;
        card.appendChild(leaf);
        leaf.addEventListener('animationend', () => leaf.remove());
    };

    const setUnit = (unit, value) => {
        const card = document.querySelector(`.time-card[data-unit="${unit}"]`);
        if (!card) return;
        const valueEl = card.querySelector('.time-value');
        const text = String(value);

        if (lastValues[unit] !== undefined && lastValues[unit] !== text) {
            tearLeaf(card, lastValues[unit]);
        }
        lastValues[unit] = text;
        valueEl.textContent = text;
    };

    const tick = () => {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            timeUnits.forEach(unit => unit.style.display = 'none');
            if (bigDaySign) bigDaySign.hidden = false;
            clearInterval(intervalId);
            return;
        }

        const msPerMin = 1000 * 60;
        const msPerHour = msPerMin * 60;
        const msPerDay = msPerHour * 24;

        const days = Math.floor(diff / msPerDay);
        const hours = Math.floor((diff % msPerDay) / msPerHour);
        const mins = Math.floor((diff % msPerHour) / msPerMin);

        setUnit('days', days);
        setUnit('hours', hours);
        setUnit('mins', mins);
    };

    tick();
    const intervalId = setInterval(tick, 5000);
}

// Confetti drifting off the countdown — petals, paper squares, bells and hearts.
// Sparse and small at first, gathering pace and size as the day nears. Kept faint
// so it never competes with the hero photo behind it.
const petalField = document.getElementById('petal-field');

if (petalField) {
    const msPerDay = 1000 * 60 * 60 * 24;

    const spawnParticle = (scale) => {
        const kind = ['petal', 'square', 'bell', 'heart'][Math.floor(Math.random() * 4)];
        const particle = document.createElement(kind === 'bell' || kind === 'heart' ? 'i' : 'span');
        particle.classList.add('confetti-particle');

        if (kind === 'bell') {
            particle.classList.add('icon', 'fa-solid', 'fa-bell');
            particle.style.fontSize = `${(9 * scale).toFixed(1)}px`;
        } else if (kind === 'heart') {
            particle.classList.add('icon', 'fa-solid', 'fa-heart');
            particle.style.fontSize = `${(9 * scale).toFixed(1)}px`;
        } else {
            particle.classList.add(kind);
            const size = `${(6 * scale).toFixed(1)}px`;
            particle.style.width = size;
            particle.style.height = size;
        }

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.setProperty('--drift', `${(Math.random() * 60 - 30).toFixed(0)}px`);
        particle.style.setProperty('--rot', `${(Math.random() * 200 + 60).toFixed(0)}deg`);
        particle.style.setProperty('--peak-opacity', Math.min(0.6, 0.4 + scale * 0.1).toFixed(2));
        particle.style.animationDuration = `${(4 + Math.random() * 3).toFixed(1)}s`;

        petalField.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
    };

    const petalLoop = () => {
        const daysLeft = (weddingDate - new Date()) / msPerDay;
        if (daysLeft <= 0) return;

        let interval;
        let maxBurst;
        let scale;
        if (daysLeft > 180) { interval = 9000; maxBurst = 1; scale = 0.8; }
        else if (daysLeft > 90) { interval = 6000; maxBurst = 1; scale = 0.9; }
        else if (daysLeft > 30) { interval = 4000; maxBurst = 1; scale = 1; }
        else if (daysLeft > 14) { interval = 2600; maxBurst = 2; scale = 1.15; }
        else if (daysLeft > 3) { interval = 1500; maxBurst = 2; scale = 1.3; }
        else { interval = 800; maxBurst = 3; scale = 1.5; }

        const burst = 1 + Math.floor(Math.random() * maxBurst);
        for (let i = 0; i < burst; i++) spawnParticle(scale);

        setTimeout(petalLoop, interval + Math.random() * interval * 0.4);
    };

    petalLoop();
}

// Gifts easter egg — they don't want gifts, so the button dodges the cursor
const giftCard = document.querySelector('a.detail-card[href^="gifts.html"]');
const giftBtn = giftCard ? giftCard.querySelector('.btn-secondary') : null;

if (giftCard && giftBtn) {
    let giftOffset = 0; // 0 = center, -1 = left, 1 = right

    giftBtn.addEventListener('mouseenter', () => {
        if (giftOffset !== 0) {
            giftOffset = 0;
            giftCard.style.transform = 'translateX(0)';
            return;
        }

        const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
        let step;

        if (isDesktop && giftCard.parentElement) {
            const gap = parseFloat(getComputedStyle(giftCard.parentElement).columnGap) || 0;
            step = giftCard.getBoundingClientRect().width + gap;
        } else {
            step = 60;
        }

        giftOffset = Math.random() < 0.5 ? -1 : 1;
        giftCard.style.transform = `translateX(${giftOffset * step}px)`;
    });
}

// Smooth scrolling for navigation links
// Only prevent default for internal section links (href starts with #)
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        // else, let the browser handle external links
    });
});

// Form submission handler using mailto:
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const guests = document.getElementById('guests').value;
    const attendance = document.getElementById('attendance').value;
    const dietary = document.getElementById('dietary').value.trim();
    const message = document.getElementById('message').value.trim();
    const starter = document.getElementById('starter').value;
    const main = document.getElementById('main').value;
    const dessert = document.getElementById('dessert').value;

    // Get readable menu text for each choice
    const starterText = document.querySelector('#starter option:checked').textContent;
    const mainText = document.querySelector('#main option:checked').textContent;
    const dessertText = document.querySelector('#dessert option:checked').textContent;

    const subject = encodeURIComponent('RSVP for Bex & Daniel');
    const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Number of Guests: ${guests}\n` +
        `Attendance: ${attendance}\n` +
        `Starter: ${starterText}\n` +
        `Main: ${mainText}\n` +
        `Dessert: ${dessertText}\n` +
        `Dietary Restrictions: ${dietary}\n` +
        `Message: ${message}`
    );

    window.location.href = `mailto:shuttbrownsayido@gmail.com?subject=${subject}&body=${body}`;
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
