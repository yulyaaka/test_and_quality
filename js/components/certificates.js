// certificates.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('Скрипт сертификатов загружен'); // Для отладки
  
  const modal = document.getElementById('certificateModal');
  if (!modal) {
    console.error('Модальное окно не найдено');
    return;
  }
  
  const modalOverlay = modal.querySelector('.modal__overlay');
  const modalClose = modal.querySelector('.modal__close');
  const certificateForm = document.getElementById('certificateForm');
  const customAmountInput = document.getElementById('customAmount');
  const customCertificateBtn = document.getElementById('customCertificateBtn');
  
  // Проверяем, что все необходимые элементы найдены
  if (!modalOverlay || !modalClose || !certificateForm || !customAmountInput || !customCertificateBtn) {
    console.error('Не все необходимые элементы найдены');
    return;
  }
  
  console.log('Все элементы найдены, инициализация...');
  
  // Данные сертификатов
  const certificates = {
    basic: {
      title: 'Базовый мастер-класс',
      price: 4500
    },
    pro: {
      title: 'Продвинутый мастер-класс',
      price: 7900
    },
    couple: {
      title: 'Мастер-класс для двоих',
      price: 9500
    },
    custom: {
      title: 'Сертификат на сумму',
      price: 5000
    }
  };
  
  // Функция для открытия модального окна
  function openModal(type, customAmount = null) {
    console.log('Открытие модального окна для типа:', type);
    
    const certificate = certificates[type];
    
    if (type === 'custom' && customAmount !== null) {
      const amount = parseInt(customAmount);
      if (amount < 2000) {
        alert('Минимальная сумма сертификата — 2 000 ₽');
        customAmountInput.focus();
        return;
      }
      certificate.price = amount;
      certificate.title = `Сертификат на ${amount.toLocaleString()} ₽`;
    }
    
    // Заполняем форму данными
    document.getElementById('certificateType').value = type;
    document.getElementById('certificateAmount').value = certificate.price;
    document.getElementById('modalCertificateTitle').textContent = certificate.title;
    document.getElementById('modalCertificatePrice').textContent = certificate.price.toLocaleString() + ' ₽';
    
    // Рассчитываем итоговую стоимость
    const deliveryType = document.getElementById('deliveryType').value;
    const total = calculateTotal(certificate.price, deliveryType);
    document.getElementById('modalCertificateTotal').textContent = total;
    
    // Открываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Фокусируемся на первом поле формы
    setTimeout(() => {
      document.getElementById('recipientName').focus();
    }, 100);
  }
  
  // Расчет итоговой стоимости
  function calculateTotal(basePrice, deliveryType) {
    let total = basePrice;
    if (deliveryType === 'delivery') {
      total += 500;
    }
    return total.toLocaleString() + ' ₽';
  }
  
  // Закрытие модального окна
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // Сбрасываем форму
    certificateForm.reset();
  }
  
  // Обработчики для кнопок сертификатов
  document.querySelectorAll('.certificate-card__btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const type = this.dataset.certificate;
      console.log('Нажата кнопка сертификата:', type);
      
      if (type === 'custom') {
        // Для кастомного сертификата открываем форму выбора суммы
        const amount = parseInt(customAmountInput.value);
        openModal(type, amount);
      } else {
        openModal(type);
      }
    });
  });
  
  // Кнопка оформления кастомного сертификата
  customCertificateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Нажата кнопка оформления кастомного сертификата');
    
    const amount = parseInt(customAmountInput.value);
    if (amount < 2000) {
      alert('Минимальная сумма сертификата — 2 000 ₽');
      customAmountInput.focus();
      return;
    }
    
    openModal('custom', amount);
  });
  
  // Изменение типа доставки
  const deliveryTypeSelect = document.getElementById('deliveryType');
  if (deliveryTypeSelect) {
    deliveryTypeSelect.addEventListener('change', function() {
      const basePrice = parseInt(document.getElementById('certificateAmount').value);
      const deliveryType = this.value;
      const total = calculateTotal(basePrice, deliveryType);
      document.getElementById('modalCertificateTotal').textContent = total;
    });
  }
  
  // Закрытие модального окна
  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  
  // Закрытие по Esc
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
  
  // Валидация кастомной суммы
  customAmountInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (isNaN(value)) {
      this.value = 2000;
    } else if (value < 2000) {
      this.value = 2000;
    } else if (value > 50000) {
      this.value = 50000;
    }
  });
  
  // Отправка формы
  certificateForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Проверяем заполнение обязательных полей
    const requiredFields = ['recipientName', 'senderName', 'senderEmail', 'senderPhone'];
    let isValid = true;
    let firstInvalidField = null;
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    if (!isValid) {
      alert('Пожалуйста, заполните все обязательные поля');
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }
    
    // Валидация email
    const emailField = document.getElementById('senderEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      alert('Пожалуйста, введите корректный email адрес');
      emailField.focus();
      emailField.classList.add('error');
      return;
    }
    
    // Валидация телефона (простая проверка на минимальную длину)
    const phoneField = document.getElementById('senderPhone');
    if (phoneField.value.replace(/\D/g, '').length < 10) {
      alert('Пожалуйста, введите корректный номер телефона');
      phoneField.focus();
      phoneField.classList.add('error');
      return;
    }
    
    // Здесь будет интеграция с платежной системой
    // Пока просто покажем сообщение и имитируем отправку
    
    // Собираем данные формы
    const formData = {
      certificateType: document.getElementById('certificateType').value,
      certificateAmount: document.getElementById('certificateAmount').value,
      recipientName: document.getElementById('recipientName').value,
      senderName: document.getElementById('senderName').value,
      senderEmail: document.getElementById('senderEmail').value,
      senderPhone: document.getElementById('senderPhone').value,
      certificateMessage: document.getElementById('certificateMessage').value,
      deliveryType: document.getElementById('deliveryType').value,
      total: document.getElementById('modalCertificateTotal').textContent
    };
    
    console.log('Данные формы:', formData);
    
    // Показываем сообщение об успехе
    alert(`Сертификат успешно оформлен!\n\nНа ${formData.total}\nДля: ${formData.recipientName}\nМы отправим сертификат на email: ${formData.senderEmail}`);
    
    // Закрываем модальное окно
    closeModal();
  });
  
  // Убираем класс error при фокусе на поле
  certificateForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('focus', function() {
      this.classList.remove('error');
    });
  });
  
  console.log('Инициализация завершена');
});

// Добавляем стили для ошибок
const style = document.createElement('style');
style.textContent = `
  .error {
    border-color: #ff6b6b !important;
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1) !important;
  }
  
  input.error:focus, textarea.error:focus {
    border-color: #ff6b6b !important;
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2) !important;
  }
`;
document.head.appendChild(style);