document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Mobile Dropdown Toggle
    const mobileNavDropdowns = document.querySelectorAll('.mobile-nav-link.has-dropdown');
    mobileNavDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = dropdown.parentElement;
            const menu = parent.querySelector('.mobile-dropdown');
            dropdown.classList.toggle('active');
            menu.classList.toggle('active');
        });
    });

    // Theme Toggle Logic (Multi-button support)
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const body = document.body;

    // Check for saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggles.forEach(btn => {
            btn.innerHTML = '<i class="fas fa-sun"></i>';
        });
    }

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Update all theme buttons
            themeToggles.forEach(b => {
                b.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            });
        });
    });

    // RTL Toggle Logic (Multi-button support)
    const rtlToggles = document.querySelectorAll('.rtl-toggle');
    rtlToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            
            // Optional: update button text if needed
            rtlToggles.forEach(b => {
                b.textContent = newDir === 'rtl' ? 'LTR' : 'RTL';
            });
        });
    });

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Cart State Management
    let cart = JSON.parse(localStorage.getItem('nectar_cart')) || [];
    const cartBadge = document.querySelector('.cart-badge');

    function updateCartBadge() {
        if (cartBadge) {
            const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
            cartBadge.textContent = totalQty;
            cartBadge.style.display = totalQty > 0 ? 'block' : 'none';
        }
    }

    function saveCart() {
        localStorage.setItem('nectar_cart', JSON.stringify(cart));
        updateCartBadge();
    }

    // Initialize Shop Page State
    document.querySelectorAll('.bottle-card').forEach(card => {
        const id = card.dataset.id;
        const addBtn = card.querySelector('.add-to-cart');
        const qtyControls = card.querySelector('.qty-controls');
        const countSpan = card.querySelector('.qty-count');
        const itemInCart = cart.find(item => item.id === id);

        if (itemInCart && addBtn && qtyControls) {
            addBtn.style.display = 'none';
            qtyControls.style.display = 'flex';
            countSpan.textContent = itemInCart.qty;
        }

        if (addBtn && qtyControls) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const product = {
                    id: card.dataset.id,
                    name: card.dataset.name,
                    price: parseFloat(card.dataset.price),
                    img: card.dataset.img,
                    specs: card.dataset.specs,
                    qty: 1
                };
                cart.push(product);
                addBtn.style.display = 'none';
                qtyControls.style.display = 'flex';
                countSpan.textContent = 1;
                saveCart();
                gsap.from(qtyControls, { scale: 0.8, opacity: 0, duration: 0.3 });
            });

            card.querySelector('.plus').addEventListener('click', () => {
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.qty += 1;
                    countSpan.textContent = item.qty;
                    saveCart();
                    gsap.fromTo(countSpan, { scale: 1.2 }, { scale: 1, duration: 0.2 });
                }
            });

            card.querySelector('.minus').addEventListener('click', () => {
                const item = cart.find(i => i.id === id);
                if (item && item.qty > 1) {
                    item.qty -= 1;
                    countSpan.textContent = item.qty;
                    saveCart();
                    gsap.fromTo(countSpan, { scale: 0.8 }, { scale: 1, duration: 0.2 });
                }
            });

            card.querySelector('.qty-remove').addEventListener('click', () => {
                cart = cart.filter(i => i.id !== id);
                qtyControls.style.display = 'none';
                addBtn.style.display = 'block';
                saveCart();
                gsap.from(addBtn, { scale: 0.8, opacity: 0, duration: 0.3 });
            });
        }
    });

    updateCartBadge();

    // FAQ Accordion Toggle
    const faqHeaders = document.querySelectorAll('.faq-header');
    
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
