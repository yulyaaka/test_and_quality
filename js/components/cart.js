const cart = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateCounter();
  },

  add(id, title, price, img) {
    const existing = this.items.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ id, title, price: Number(price), img, quantity: 1 });
    }
    this.save();
  },

  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
    this.render();
  },

  changeQuantity(id, delta) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) this.remove(id);
      else this.save();
      this.render();
    }
  },

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  updateCounter() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-link__count').forEach(el => {
      el.textContent = totalCount;
    });
  },

  render() {
    const container = document.getElementById('cartContent');
    const empty = document.getElementById('cartEmpty');
    const summary = document.getElementById('cartSummary');
    const totalEl = document.getElementById('cartTotal');

    if (!container) return;

    if (this.items.length === 0) {
      empty.style.display = 'block';
      container.innerHTML = '';
      if (summary) summary.style.display = 'none';
      return;
    }

    empty.style.display = 'none';
    if (summary) summary.style.display = 'block';

    container.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.img}" alt="${item.title}" class="cart-item__img">
        <div class="cart-item__title">${item.title}</div>
        <div class="cart-item__price">${item.price.toLocaleString()} ₽</div>
        <div class="cart-item__quantity">
          <button class="cart-item__quantity-btn" data-action="minus">-</button>
          <span class="cart-item__quantity-value">${item.quantity}</span>
          <button class="cart-item__quantity-btn" data-action="plus">+</button>
        </div>
        <div class="cart-item__remove" data-action="remove">×</div>
      </div>
    `).join('');

    if (totalEl) {
      totalEl.textContent = this.getTotal().toLocaleString() + ' ₽';
    }

    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemEl = e.target.closest('.cart-item');
        const id = itemEl.dataset.id;
        const action = e.target.dataset.action;

        if (action === 'plus') this.changeQuantity(id, 1);
        if (action === 'minus') this.changeQuantity(id, -1);
        if (action === 'remove') this.remove(id);
      });
    });
  },

  init() {
    this.updateCounter();

    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('[data-id]');
        if (!card) return;

        const id = card.dataset.id;
        const title = card.querySelector('.product-card__title, .product__title')?.textContent.trim();
        const priceText = card.querySelector('.product-card__price, .product__price')?.textContent.trim();
        const price = Number(priceText.replace(/[^0-9]/g, ''));
        const img = card.querySelector('img')?.src || '';

        if (id && title && price) {
          this.add(id, title, price, img);
          alert('Товар добавлен в корзину');
        }
      });
    });

    if (document.getElementById('cartContent')) {
      this.render();
    }
  }
};

cart.init();