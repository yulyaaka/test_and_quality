document.querySelectorAll('.about__slider').forEach(slider => {
  const slidesContainer = slider.querySelector('.about__slides');
  const slides = slider.querySelectorAll('.about__slide');
  const prevBtn = slider.querySelector('.about__prev');
  const nextBtn = slider.querySelector('.about__next');
  const dots = slider.querySelectorAll('.about__dot');

  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(n) {
    // Скрываем все слайды и точки
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // Вычисляем индекс с учётом границ
    currentSlide = (n + totalSlides) % totalSlides;

    // Показываем текущий
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  // Кнопки
  prevBtn?.addEventListener('click', () => showSlide(currentSlide - 1));
  nextBtn?.addEventListener('click', () => showSlide(currentSlide + 1));

  // Точки
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  // Автопрокрутка (по желанию — можно убрать, если не нужно)
  let autoPlay = setInterval(() => showSlide(currentSlide + 1), 5000);

  // Остановка автопрокрутки при наведении (улучшает UX)
  slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
  slider.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => showSlide(currentSlide + 1), 5000);
  });

  // Инициализация — показываем первый слайд (на случай, если active не стоит)
  showSlide(0);
});