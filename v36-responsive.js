/* Keep the existing hamburger and links; synchronize visual and ARIA state. */
(() => {
  const header = document.querySelector('header.top');
  const button = header?.querySelector('.mobile-menu');
  const nav = header?.querySelector('#nav');
  if (!button || !nav) return;

  const close = () => {
    nav.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  };

  button.setAttribute('aria-controls', nav.id);
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a[href]')) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      close();
      button.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) close();
  });
  window.matchMedia('(max-width: 950px)').addEventListener('change', close);
})();
