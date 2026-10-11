// Use only original v36 local logo fallbacks when external loading fails.
(() => {
  document.querySelectorAll('img[data-fallback]').forEach(image => {
    const useFallback = () => {
      const fallback = image.getAttribute('data-fallback');
      if (!fallback) return;
      image.removeEventListener('error', useFallback);
      image.src = fallback;
    };
    image.addEventListener('error', useFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) useFallback();
  });
})();
