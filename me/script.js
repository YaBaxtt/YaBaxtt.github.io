
const audio = new Audio(); 

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            initCanvas(); 
            initReveal();
        }, 600);
    }
});

function initCanvas() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dots = [];

    const setup = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        dots = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2,
            v: Math.random() * 0.4 + 0.1 
        }));
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        dots.forEach(d => {
            d.y -= d.v;
            if (d.y < 0) d.y = canvas.height;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    };

    window.addEventListener('resize', setup);
    setup();
    draw();
}

window.moveSlider = function(index) {
    const track = document.getElementById('music-track');
    const dotsNav = document.querySelectorAll('.m-dot');
    const cards = document.querySelectorAll('.m-card');

    if (!track) return;

    track.style.transform = `translateX(-${index * 320}px)`;

    dotsNav.forEach((d, i) => {
        d.style.width = i === index ? '20px' : '8px';
        d.style.borderRadius = i === index ? '10px' : '50%';
        d.style.background = i === index ? '#a5eb03' : '#334155';
    });

    cards.forEach((c, i) => {
        c.style.borderColor = i === index ? '#d9ed03' : 'rgba(255,255,255,0.05)';
    });
};

window.playMusic = function(src, btn) {
    const icon = btn.querySelector('i');
    
    if (audio.src.includes(src)) {
        if (audio.paused) {
            audio.play();
            icon.className = 'fa-solid fa-pause';
        } else {
            audio.pause();
            icon.className = 'fa-solid fa-play';
        }
    } else {
        document.querySelectorAll('.m-card button i').forEach(i => i.className = 'fa-solid fa-play');
        audio.src = src;
        audio.play();
        icon.className = 'fa-solid fa-pause';
    }
};

function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}