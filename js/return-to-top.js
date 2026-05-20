/**
 * Scroll listener + smooth scroll for #returnToTop controls present on multiple pages.
 */
(function initReturnToTop() {
  const el = document.getElementById('returnToTop');
  if (!el) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });

  el.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
})();
