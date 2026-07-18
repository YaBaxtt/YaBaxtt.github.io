// script.js

document.addEventListener('DOMContentLoaded', () => {
    initRealtimeStatus();
    initScrollReveal();
    initHeroParallax();
});

/**
 * Calculates local Tashkent operational hours window (09:00 - 23:00)
 * Handles interactive status tooltips on clicking or tapping the navigation node
 */
function initRealtimeStatus() {
    const statusBadge = document.getElementById('shop-status');
    const statusTooltip = document.getElementById('status-tooltip');
    if (!statusBadge || !statusTooltip) return;

    function checkOperationalStatus() {
        // Compute precise UTC+5 Time Zone metrics
        const currentLocalDate = new Date();
        const absoluteUtcTimestamp = currentLocalDate.getTime() + (currentLocalDate.getTimezoneOffset() * 60000);
        const tashkentTimeNode = new Date(absoluteUtcTimestamp + (3600000 * 5));

        const exactHours = tashkentTimeNode.getHours();
        const exactMinutes = tashkentTimeNode.getMinutes();
        const operationalMinutesSum = (exactHours * 60) + exactMinutes;

        const openingTimeBound = 9 * 60;   // 09:00
        const closingTimeBound = 23 * 60;  // 23:00

        if (operationalMinutesSum >= openingTimeBound && operationalMinutesSum < closingTimeBound) {
            statusBadge.innerHTML = '🟢 Сейчас работаем';
            statusBadge.style.borderColor = 'rgba(9, 61, 42, 0.2)';
            statusBadge.style.color = '#0c8558';
            statusBadge.style.background = 'rgba(52, 211, 153, 0.02)';
            statusTooltip.innerHTML = '✨ Работаем с 09:00 до 23:00';
        } else {
            statusBadge.innerHTML = '🔴 Сейчас закрыто';
            statusBadge.style.borderColor = 'rgba(248, 113, 113, 0.2)';
            statusBadge.style.color = '#642828';
            statusBadge.style.background = 'rgba(248, 113, 113, 0.02)';
            statusTooltip.innerHTML = '💤 Отдыхаем с 23:00 до 09:00';
        }
    }

    // Toggle interactive operational tooltip element
    statusBadge.addEventListener('click', (clickContextEvent) => {
        clickContextEvent.stopPropagation();
        statusTooltip.classList.toggle('visible');
    });

    document.addEventListener('click', () => {
        statusTooltip.classList.remove('visible');
    });

    checkOperationalStatus();
    setInterval(checkOperationalStatus, 30000); // 30s precision loop update
}

/**
 * Initializes viewport observing intersections to seamlessly cascade element display triggers
 */
function initScrollReveal() {
    const targetBlocks = document.querySelectorAll('.scroll-reveal');
    
    const animationObserverConfig = {
        root: null,
        rootMargin: '0px',
        threshold: 0.08
    };

    const runRevealCallback = (observedEntries, currentObserver) => {
        observedEntries.forEach(blockEntry => {
            if (blockEntry.isIntersecting) {
                blockEntry.target.classList.add('revealed');
                currentObserver.unobserve(blockEntry.target);
            }
        });
    };

    const viewObserver = new IntersectionObserver(runRevealCallback, animationObserverConfig);
    
    targetBlocks.forEach(elementNode => {
        viewObserver.observe(elementNode);
    });
}

/**
 * Multi-layered scroll translation handling calculated offsets for subtle parallax effects
 */
function initHeroParallax() {
    const structuralElements = document.querySelectorAll('.parallax-element');
    if (window.innerWidth < 992) return; 

    window.addEventListener('scroll', () => {
        const computedVerticalOffset = window.pageYOffset;

        if (computedVerticalOffset < window.innerHeight) {
            structuralElements.forEach(activeNode => {
                const layerVelocityCoefficient = parseFloat(activeNode.getAttribute('data-speed')) || 1;
                const visualMatrixY = computedVerticalOffset * (layerVelocityCoefficient * 0.06);
                activeNode.style.transform = `translateY(${visualMatrixY}px)`;
            });
        }
    });
}