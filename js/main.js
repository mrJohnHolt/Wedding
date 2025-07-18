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
