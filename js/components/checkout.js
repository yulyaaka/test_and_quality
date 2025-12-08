// Получаем актуальную корзину из localStorage
const cart = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  renderSummary() {
    const itemsContainer = document.getElementById('checkoutItems');
    const totalElements = document.querySelectorAll('#checkoutTotal, .checkout__summary-total');

    // Если корзина пуста — отправляем обратно в корзину
    if (this.items.length === 0) {
      window.location.href = 'cart.html';
      return;
    }

    // Заполняем список товаров
    itemsContainer.innerHTML = this.items.map(item => `
      <div class="checkout-item">
        <img src="${item.img}" alt="${item.title}" class="checkout-item__img">
        <div class="checkout-item__info">
          <div class="checkout-item__title">${item.title}</div>
          <div class="checkout-item__details">${item.quantity} × ${item.price.toLocaleString()} ₽</div>
        </div>
      </div>
    `).join('');

    // Обновляем все элементы с итоговой суммой
    const total = this.getTotal();
    totalElements.forEach(el => {
      el.textContent = total.toLocaleString() + ' ₽';
    });
  }
};

// Обработка отправки формы → в Telegram
document.getElementById('checkoutForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);

  const order = {
    name: formData.get('name').trim(),
    phone: formData.get('phone').trim(),
    email: formData.get('email')?.trim() || '—',
    delivery: formData.get('delivery'),
    address: formData.get('address').trim(),
    comment: formData.get('comment')?.trim() || '—',
    total: cart.getTotal(),
    items: cart.items
  };

  // Формируем текст заказа
  let message = `*Новый заказ!*\n\n`;
  message += `*Имя:* ${order.name}\n`;
  message += `*Телефон:* ${order.phone}\n`;
  if (order.email !== '—') message += `*E-mail:* ${order.email}\n`;
  message += `\n*Доставка:* `;
  if (order.delivery === 'pickup') message += `Самовывоз — Москва, ул. Глина 7`;
  else if (order.delivery === 'courier') message += `Курьер по Москве и МО — 500 ₽`;
  else message += `Почта России / СДЭК по РФ — от 400 ₽`;
  message += `\n*Адрес:* ${order.address}\n\n`;
  message += `*Товары:*\n`;

  order.items.forEach(item => {
    message += `• ${item.title} — ${item.quantity} шт. × ${item.price.toLocaleString()} ₽\n`;
  });

  message += `\n*Итого: ${order.total.toLocaleString()} ₽*`;
  if (order.comment !== '—') message += `\n\n*Комментарий:* ${order.comment}`;

  const telegramUsername = 'lilac_n';

  const telegramUrl = `https://t.me/${telegramUsername.replace('@', '')}?text=${encodeURIComponent(message)}`;

  window.open(telegramUrl, '_blank');

  // Очищаем корзину и переходим на страницу благодарности
  localStorage.removeItem('cart');
  setTimeout(() => {
    window.location.href = 'thankyou.html';
  }, 600);
});

// Рендерим товары и сумму при загрузке страницы
if (document.getElementById('checkoutItems')) {
  cart.renderSummary();
}