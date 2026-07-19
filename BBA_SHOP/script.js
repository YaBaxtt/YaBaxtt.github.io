// ==========================================
// BBA SHOP UZ — Интеллектуальный интерфейс
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Безопасное снятие загрузочного экрана (Anti-Flicker)
    setTimeout(() => {
        document.body.classList.remove('is-loading');
    }, 50);

    // 2. Улучшенное плавное вплывание элементов при скролле (Reveal)
    const reveals = document.querySelectorAll(
        '.card, .delivery-card, .step, .review, .info-box, .contact-box'
    );

    reveals.forEach(el => el.classList.add('reveal'));

    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.9;

        reveals.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 3. Кинетический Скролл-Параллакс для главного логотипа и внутренних блюров
    const heroImage = document.querySelector('.hero-image');
    const floatingCard = document.querySelector('.floating-card');
    const ib1 = document.querySelector('.ib-1');
    const ib2 = document.querySelector('.ib-2');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        if (scrolled < 700) {
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
            if (floatingCard) {
                floatingCard.style.transform = `translateY(${-scrolled * 0.08}px)`;
            }
            // Мягкое смещение внутренних неоновых источников света при скролле
            if (ib1) {
                ib1.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
            if (ib2) {
                ib2.style.transform = `translateY(${-scrolled * 0.1}px)`;
            }
        }
    });

    // 4. Тень шапки при скролле
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 15) {
            header.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.6)';
            header.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        } else {
            header.style.boxShadow = 'none';
            header.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        }
    });

    // 5. Премиальный Hover-эффект кнопок (Световое пятно)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            btn.style.setProperty('--x', `${x}px`);
            btn.style.setProperty('--y', `${y}px`);
        });
    });

    // 6. Умный Smooth Scroll
    const headerHeight = header ? header.offsetHeight : 60;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetID = this.getAttribute('href');
            const targetElement = document.querySelector(targetID);

            if (!targetElement) return;

            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // 7. Легкий интерактивный наклон внешних блюров от мыши (для ПК)
    const blur1 = document.querySelector('.blur-1');
    const blur2 = document.querySelector('.blur-2');

    if (window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;

            if (blur1) blur1.style.transform = `translate(${x}px, ${y}px)`;
            if (blur2) blur2.style.transform = `translate(${-x}px, ${-y}px)`;
        });
    }
});