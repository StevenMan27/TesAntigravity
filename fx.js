(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const loader = $('#loader');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof gsap === 'undefined' || reduce) { if (loader) loader.style.display = 'none'; return; }
  gsap.registerPlugin(ScrollTrigger);

  /* Split hero title into words */
  const h1 = $('.hero h1'); const words = [];
  if (h1) {
    const nodes = [...h1.childNodes]; h1.textContent = '';
    nodes.forEach(n => {
      if (n.nodeType === 3) {
        n.textContent.split(/\s+/).filter(Boolean).forEach(w => {
          const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = w + '\u00a0'; h1.appendChild(sp); words.push(sp);
        });
      } else {
        const sp = document.createElement('span'); sp.className = 'w'; sp.appendChild(n); h1.appendChild(sp); words.push(sp);
        h1.appendChild(document.createTextNode(' '));
      }
    });
    gsap.set(words, { yPercent: 120, rotate: 6, opacity: 0 });
  }

  /* Preloader */
  function intro() {
    const tl = gsap.timeline();
    tl.to(loader, { yPercent: -100, duration: .7, ease: 'power4.inOut', onComplete: () => loader.style.display = 'none' });
    if (words.length) tl.to(words, { yPercent: 0, rotate: 0, opacity: 1, duration: .7, stagger: .06, ease: 'back.out(1.6)' }, '-=.3');
    tl.from('.status', { x: -60, opacity: 0, duration: .5 }, '-=.5')
      .from('.sticker', { scale: 0, rotate: -40, duration: .6, ease: 'back.out(2.5)' }, '-=.2');
  }
  if (loader) {
    const num = $('#ldNum'), bar = $('#ldBar'), o = { v: 0 };
    gsap.to(o, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { num.textContent = Math.round(o.v); bar.style.width = o.v + '%'; }, onComplete: intro });
  }

  /* Enter animations (play once, no scrub) */
  $$('.sec-head').forEach(h => {
    gsap.fromTo(h, { '--bar': 0 }, { '--bar': 1, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    gsap.from($('h2', h), { x: -80, opacity: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });
  gsap.utils.toArray('.t-item').forEach((el, i) => gsap.from(el, { y: 60, rotate: i % 2 ? 3 : -3, opacity: 0, duration: .7, delay: i * .1, ease: 'back.out(1.4)', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

  /* Cursor */
  const cur = $('#cursor');
  if (cur && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const txt = $('#cursorTxt');
    const cx = gsap.quickTo(cur, 'x', { duration: .2, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .2, ease: 'power3' });
    addEventListener('mousemove', e => { document.documentElement.classList.add('has-cursor'); cur.classList.add('on'); cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => cur.classList.remove('on'));
    document.addEventListener('mouseover', e => {
      const p = !!e.target.closest('.proj'), t = e.target.closest('a, button, input, textarea');
      cur.classList.toggle('big', p); txt.textContent = p ? 'VIEW' : '';
      cur.style.background = t && !p ? 'var(--accent)' : '';
    });
  }
})();
