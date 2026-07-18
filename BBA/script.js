// =========================
// BBA SHOP UZ
// script.js
// =========================


// Анимация появления блоков

const reveals = document.querySelectorAll(
    '.card, .delivery-card, .step, .review, .info-box, .contact-box'
);

reveals.forEach(el => {
    el.classList.add('reveal');
});

function revealOnScroll() {

    const trigger =
        window.innerHeight * 0.85;

    reveals.forEach(el => {

        const top =
            el.getBoundingClientRect().top;

        if (top < trigger) {
            el.classList.add('active');
        }

    });

}

window.addEventListener(
    'scroll',
    revealOnScroll
);

revealOnScroll();


// =========================
// Hero Parallax
// =========================

const heroImage =
    document.querySelector('.hero-image img');

const floatingCard =
    document.querySelector('.floating-card');

document.addEventListener(
    'mousemove',
    (e) => {

        if (!heroImage) return;

        const x =
            (window.innerWidth / 2 - e.clientX) / 40;

        const y =
            (window.innerHeight / 2 - e.clientY) / 40;

        heroImage.style.transform =
            `translate(${x}px, ${y}px)`;

        if (floatingCard) {

            floatingCard.style.transform =
                `translate(${x * 1.5}px, ${y * 1.5}px)`;

        }

    }
);


// =========================
// Header Shadow
// =========================

const header =
    document.querySelector('header');

window.addEventListener(
    'scroll',
    () => {

        if (window.scrollY > 50) {

            header.style.boxShadow =
                '0 10px 30px rgba(0,0,0,.35)';

        } else {

            header.style.boxShadow =
                'none';

        }

    }
);


// =========================
// Glow Buttons
// =========================

const buttons =
    document.querySelectorAll('.btn');

buttons.forEach(btn => {

    btn.addEventListener(
        'mouseenter',
        () => {

            btn.style.boxShadow =
                '0 0 35px rgba(255,255,255,.18)';

        }
    );

    btn.addEventListener(
        'mouseleave',
        () => {

            btn.style.boxShadow =
                'none';

        }
    );

});


// =========================
// Smooth Scroll
// =========================

document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {

    anchor.addEventListener(
        'click',
        function(e) {

            e.preventDefault();

            const target =
                document.querySelector(
                    this.getAttribute('href')
                );

            if (!target) return;

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }
    );

});


// =========================
// Floating Background
// =========================

const blur1 =
    document.querySelector('.blur-1');

const blur2 =
    document.querySelector('.blur-2');

window.addEventListener(
    'mousemove',
    (e) => {

        const x =
            e.clientX / window.innerWidth;

        const y =
            e.clientY / window.innerHeight;

        if (blur1) {

            blur1.style.transform =
                `translate(${x * 40}px, ${y * 40}px)`;

        }

        if (blur2) {

            blur2.style.transform =
                `translate(${-x * 40}px, ${-y * 40}px)`;

        }

    }
);


// =========================
// Counter Effect
// =========================

function animateNumber(
    element,
    target,
    duration = 1500
) {

    let start = 0;

    const step =
        target / (duration / 16);

    function update() {

        start += step;

        if (start < target) {

            element.textContent =
                Math.floor(start);

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target;

        }

    }

    update();

}


// =========================
// Console Easter Egg
// =========================

console.log(`
██████╗ ██████╗  █████╗
██╔══██╗██╔══██╗██╔══██╗
██████╔╝██████╔╝███████║
██╔══██╗██╔══██╗██╔══██║
██████╔╝██████╔╝██║  ██║
╚═════╝ ╚═════╝ ╚═╝  ╚═╝

BBA SHOP UZ
Telegram: https://t.me/BBA_ShopUz
`);


// =========================
// Page Loaded Animation
// =========================

window.addEventListener(
    'load',
    () => {

        document.body.style.opacity = '0';

        setTimeout(() => {

            document.body.style.transition =
                'opacity .8s ease';

            document.body.style.opacity = '1';

        }, 50);

    }
);