document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger if it exists (assuming it will be loaded via CDN)
    if (typeof gsap !== 'undefined') {
        

        // Hero Content Animation
        gsap.from('.hero-content h1', {
            y: 50,
            opacity: 0,
            duration: 1.2,
            delay: 0.8,
            ease: 'power4.out'
        });

        gsap.from('.hero-content p', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 1,
            ease: 'power3.out'
        });

        gsap.from('.hero-content .btn-group', {
            y: 20,
            opacity: 0,
            duration: 1,
            delay: 1.2,
            ease: 'power3.out'
        });

        // Scroll Triggered Animations
        const fadeUpElements = document.querySelectorAll('.fade-up');
        fadeUpElements.forEach(el => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out'
            });
        });

        const scaleInElements = document.querySelectorAll('.scale-in');
        scaleInElements.forEach(el => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: 'expo.out'
            });
        });

        // Bottle Reveal Animation
        const bottleCards = document.querySelectorAll('.bottle-card');
        bottleCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card.querySelector('.bottle-image'), {
                    scale: 1.1,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card.querySelector('.bottle-image'), {
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        });
    }
});
