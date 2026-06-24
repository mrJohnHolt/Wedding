// Wedding day countdown — drives the tear-off pads in the hero
const weddingDate = new Date('2026-08-22T00:00:00');
const timeCards = document.querySelectorAll('.time-card');

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
            setUnit('days', '❤');
            setUnit('hours', '❤');
            setUnit('mins', '❤');
            setUnit('secs', '❤');
            clearInterval(intervalId);
            return;
        }

        const msPerSec = 1000;
        const msPerMin = msPerSec * 60;
        const msPerHour = msPerMin * 60;
        const msPerDay = msPerHour * 24;

        const days = Math.floor(diff / msPerDay);
        const hours = Math.floor((diff % msPerDay) / msPerHour);
        const mins = Math.floor((diff % msPerHour) / msPerMin);
        const secs = Math.floor((diff % msPerMin) / msPerSec);

        setUnit('days', days);
        setUnit('hours', hours);
        setUnit('mins', mins);
        setUnit('secs', secs);
    };

    tick();
    const intervalId = setInterval(tick, 1000);
}

// Petal confetti drifting off the countdown — sparse at first, gathering pace as the day nears
const petalField = document.getElementById('petal-field');

if (petalField) {
    const msPerDay = 1000 * 60 * 60 * 24;

    const spawnPetal = () => {
        const petal = document.createElement('span');
        petal.className = 'petal';
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.setProperty('--drift', `${(Math.random() * 60 - 30).toFixed(0)}px`);
        petal.style.setProperty('--rot', `${(Math.random() * 200 + 60).toFixed(0)}deg`);
        petal.style.animationDuration = `${(4 + Math.random() * 3).toFixed(1)}s`;
        petalField.appendChild(petal);
        petal.addEventListener('animationend', () => petal.remove());
    };

    const petalLoop = () => {
        const daysLeft = (weddingDate - new Date()) / msPerDay;
        if (daysLeft <= 0) return;

        let interval;
        let maxBurst;
        if (daysLeft > 180) { interval = 9000; maxBurst = 1; }
        else if (daysLeft > 90) { interval = 6000; maxBurst = 1; }
        else if (daysLeft > 30) { interval = 4000; maxBurst = 1; }
        else if (daysLeft > 14) { interval = 2600; maxBurst = 2; }
        else if (daysLeft > 3) { interval = 1500; maxBurst = 2; }
        else { interval = 800; maxBurst = 3; }

        const burst = 1 + Math.floor(Math.random() * maxBurst);
        for (let i = 0; i < burst; i++) spawnPetal();

        setTimeout(petalLoop, interval + Math.random() * interval * 0.4);
    };

    petalLoop();
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
