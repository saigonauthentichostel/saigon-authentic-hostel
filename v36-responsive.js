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

/* Per-history-entry scroll and return context; no extra history entries. */
(() => {
  const key = 'saigon-v36-navigation';
  const pendingKey = `${key}:pending`;
  const pageURL = value => {
    const url = new URL(value, location.href);
    url.hash = '';
    url.pathname = url.pathname.replace(/\/index(?:\.html)?$/, '/').replace(/\.html$/, '');
    return url.href;
  };
  const read = name => {
    try { return JSON.parse(sessionStorage.getItem(name)); } catch { return null; }
  };
  const write = (name, value) => {
    try { sessionStorage.setItem(name, JSON.stringify(value)); } catch { /* Browser storage may be disabled. */ }
  };
  const remove = name => {
    try { sessionStorage.removeItem(name); } catch { /* Optional persistence. */ }
  };
  const url = pageURL(location.href);
  let entry = history.state?.[key];
  if (!entry || entry.url !== url) {
    entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, url, x: 0, y: 0 };
    const pending = read(pendingKey);
    const type = performance.getEntriesByType('navigation')[0]?.type;
    if (type === 'navigate' && pending?.to === url &&
        Date.now() - pending.time < 15000 && document.referrer &&
        pageURL(document.referrer) === pending.from.url) {
      entry.returnTo = pending.from;
    }
  }
  remove(pendingKey);
  const replace = () => {
    try { history.replaceState({ ...history.state, [key]: entry }, ''); } catch { /* Retain native navigation. */ }
  };
  replace();
  const save = () => {
    entry.x = window.scrollX;
    entry.y = window.scrollY;
    write(`${key}:${entry.id}`, { x: entry.x, y: entry.y });
    replace();
  };
  // Let browser Back/Forward use its native restoration; supplement reload/BFCache.
  history.scrollRestoration = 'auto';
  const restore = () => {
    entry = history.state?.[key] || entry;
    const position = read(`${key}:${entry.id}`) || entry;
    if (location.hash || !Number.isFinite(position.y)) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({ left: position.x || 0, top: position.y, behavior: 'instant' });
    }));
  };
  window.addEventListener('pageshow', restore);
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') save();
  });

  const backLinks = [...document.querySelectorAll('a.crumb')]
    .filter(link => /back to homepage/i.test(link.textContent));
  const fallback = document.querySelector('.hostel-detail') ? 'stay.html' : 'experiences.html';
  backLinks.forEach(link => {
    link.href = entry.returnTo?.url || new URL(fallback, location.href).href;
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') ||
        (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !/^https?:$/.test(destination.protocol)) return;
    save();
    if (backLinks.includes(link)) {
      event.preventDefault();
      remove(pendingKey);
      if (entry.returnTo && history.length > 1) history.back();
      else location.replace(destination.href);
      return;
    }
    const to = pageURL(destination.href);
    if (to !== url) write(pendingKey, { to, from: { id: entry.id, url }, time: Date.now() });
  });
})();
