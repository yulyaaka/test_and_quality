const mainImg = document.getElementById('mainImg');
const thumbs = document.querySelectorAll('.product__thumb');

if (mainImg && thumbs.length) {
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImg.src = thumb.dataset.src;
      document.querySelector('.product__thumb--active')?.classList.remove('product__thumb--active');
      thumb.classList.add('product__thumb--active');
    });
  });
}