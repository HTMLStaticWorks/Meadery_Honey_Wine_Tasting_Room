document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('nectar_cart')) || [];
    const cartItemsContainer = document.querySelector('.col-lg-8');
    const summaryCard = document.querySelector('.summary-card');

    function renderCart() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-state fade-up">
                    <i class="fas fa-shopping-basket cart-empty-icon"></i>
                    <h2 class="mb-3">Your cart is empty</h2>
                    <p class="text-muted mb-4">It looks like you haven't added any meads to your collection yet.</p>
                    <a href="bottle-shop.html" class="btn btn-primary px-5 py-3">Start Shopping</a>
                </div>
            `;
            // Hide summary or show empty state summary
            if (summaryCard) summaryCard.style.opacity = '0.5';
            updateSummary();
            return;
        }

        if (summaryCard) summaryCard.style.opacity = '1';

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item d-flex align-items-center flex-wrap gap-3 fade-up" data-id="${item.id}">
                <img src="${item.img}" alt="${item.name}" class="cart-img">
                
                <div class="flex-grow-1 min-width-0">
                    <h5 class="mb-1 fw-bold text-truncate">${item.name}</h5>
                    <p class="text-muted small mb-0"><i class="fas fa-wine-bottle me-1"></i> ${item.specs}</p>
                </div>
                
                <div class="d-flex align-items-center bg-light rounded-pill p-1 px-2">
                    <button class="btn btn-sm minus" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid var(--border); transition: var(--transition);"><i class="fas fa-minus" style="font-size: 0.7rem;"></i></button>
                    <span class="mx-3 fw-bold qty-count" style="min-width: 20px; text-align: center; font-size: 1.1rem;">${item.qty}</span>
                    <button class="btn btn-sm plus" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid var(--border); transition: var(--transition);"><i class="fas fa-plus" style="font-size: 0.7rem;"></i></button>
                </div>
                
                <div class="text-end ms-auto" style="min-width: 130px;">
                    <div class="fw-bold fs-5 color-accent">$${(item.price * item.qty).toFixed(2)}</div>
                    <button class="btn btn-link text-danger d-block p-0 mt-1 remove-btn ms-auto" style="font-size: 0.85rem; text-decoration: none;">
                        <i class="fas fa-trash-alt me-1"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');

        attachCartListeners();
        updateSummary();
    }

    function attachCartListeners() {
        document.querySelectorAll('.cart-item').forEach(itemRow => {
            const id = itemRow.dataset.id;

            itemRow.querySelector('.plus').addEventListener('click', () => updateQty(id, 1));
            itemRow.querySelector('.minus').addEventListener('click', () => updateQty(id, -1));
            itemRow.querySelector('.remove-btn').addEventListener('click', () => removeItem(id));
        });
    }

    function updateQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty < 1) item.qty = 1;
            saveCart();
            renderCart();
            // Animation for the row
            const row = document.querySelector(`.cart-item[data-id="${id}"]`);
            if (row) gsap.fromTo(row.querySelector('.qty-count'), { scale: 1.2 }, { scale: 1, duration: 0.2 });
        }
    }

    function removeItem(id) {
        const row = document.querySelector(`.cart-item[data-id="${id}"]`);
        if (row) {
            gsap.to(row, {
                opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => {
                    cart = cart.filter(i => i.id !== id);
                    saveCart();
                    renderCart();
                }
            });
        } else {
            cart = cart.filter(i => i.id !== id);
            saveCart();
            renderCart();
        }
    }

    function saveCart() {
        localStorage.setItem('nectar_cart', JSON.stringify(cart));
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
            cartBadge.textContent = totalQty;
            cartBadge.style.display = totalQty > 0 ? 'block' : 'none';
        }
    }

    function updateSummary() {
        if (!summaryCard) return;

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const shipping = subtotal > 0 ? 15.00 : 0;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        const subtotalEl = summaryCard.querySelector('.d-flex.justify-content-between span:last-child');
        const shippingEl = summaryCard.querySelectorAll('.d-flex.justify-content-between')[1].querySelector('span:last-child');
        const taxEl = summaryCard.querySelectorAll('.d-flex.justify-content-between')[2].querySelector('span:last-child');
        const totalEl = summaryCard.querySelector('.h4:last-child');
        const checkoutBtn = summaryCard.querySelector('.btn-primary');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

        if (checkoutBtn) {
            if (cart.length === 0) {
                checkoutBtn.classList.add('disabled');
                checkoutBtn.style.pointerEvents = 'none';
                checkoutBtn.style.opacity = '0.8'; // Less faded
                checkoutBtn.style.filter = 'grayscale(1)'; // Use grayscale to show it's disabled instead of high transparency
            } else {
                checkoutBtn.classList.remove('disabled');
                checkoutBtn.style.pointerEvents = 'auto';
                checkoutBtn.style.opacity = '1';
                checkoutBtn.style.filter = 'none';
            }
        }
    }

    renderCart();
});
