(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const loader = $('#loader');
  const hasGsap = typeof gsap !== 'undefined';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!hasGsap || reduce) { if (loader) loader.style.display = 'none'; return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null, velocity = 0;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', e => { velocity = e.velocity; ScrollTrigger.update(); });
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const t = $(a.getAttribute('href'));
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -84 }); }
    });
    new MutationObserver(() => {
      document.body.classList.contains('lock') ? lenis.stop() : lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- Split hero title into words ---------- */
  const h1 = $('.hero h1');
  const words = [];
  if (h1) {
    const nodes = [...h1.childNodes]; h1.textContent = '';
    nodes.forEach(n => {
      if (n.nodeType === 3) {
        n.textContent.split(/\s+/).filter(Boolean).forEach(w => {
          const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = w + '\u00a0';
          h1.appendChild(sp); words.push(sp);
        });
      } else {
        const sp = document.createElement('span'); sp.className = 'w';
        sp.appendChild(n); h1.appendChild(sp); words.push(sp);
        h1.appendChild(document.createTextNode(' '));
      }
    });
    gsap.set(words, { yPercent: 120, rotate: 6, opacity: 0 });
  }

  /* ---------- Preloader ---------- */
  function intro() {
    const tl = gsap.timeline();
    tl.to(loader, { yPercent: -100, duration: .8, ease: 'power4.inOut', onComplete: () => loader.style.display = 'none' });
    if (words.length) tl.to(words, { yPercent: 0, rotate: 0, opacity: 1, duration: .8, stagger: .07, ease: 'back.out(1.6)' }, '-=.3');
    tl.from('.status', { x: -60, opacity: 0, duration: .5 }, '-=.6')
      .from('.sticker', { scale: 0, rotate: -40, duration: .6, ease: 'back.out(2.5)' }, '-=.2');
  }
  if (loader) {
    const num = $('#ldNum'), bar = $('#ldBar'), o = { v: 0 };
    gsap.to(o, { v: 100, duration: 1.4, ease: 'power2.inOut',
      onUpdate: () => { num.textContent = Math.round(o.v); bar.style.width = o.v + '%'; },
      onComplete: intro });
  }

  /* ---------- Scroll animations ---------- */
  $$('.sec-head').forEach(h => {
    gsap.fromTo(h, { '--bar': 0 }, { '--bar': 1, ease: 'none', scrollTrigger: { trigger: h, start: 'top 90%', end: 'bottom 60%', scrub: true } });
    gsap.from($('h2', h), { x: -80, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });
  gsap.utils.toArray('.t-item').forEach((el, i) => gsap.from(el, { y: 60, rotate: i % 2 ? 3 : -3, opacity: 0, duration: .7, delay: i * .1, ease: 'back.out(1.4)', scrollTrigger: { trigger: el, start: 'top 90%' } }));
  gsap.to('.sticker', { y: -30, rotate: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.os-window', { y: -50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.footer-big, footer h3', { x: 60, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* ---------- Marquee reacts to scroll velocity ---------- */
  const track = $('.marquee-track');
  if (track) {
    let x = 0, dir = -1;
    gsap.ticker.add(() => {
      const half = track.scrollWidth / 2;
      if (Math.abs(velocity) > .3) dir = velocity > 0 ? -1 : 1;
      x += dir * (1.4 + Math.min(Math.abs(velocity), 40) * .6);
      if (x <= -half) x += half; if (x > 0) x -= half;
      track.style.transform = `translateX(${x}px)`;
    });
  }

  /* ---------- Cursor + magnetic ---------- */
  const cur = $('#cursor');
  if (cur && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const txt = $('#cursorTxt');
    const cx = gsap.quickTo(cur, 'x', { duration: .25, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .25, ease: 'power3' });
    addEventListener('mousemove', e => { cur.classList.add('on'); cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-case], .proj, a, button, input, textarea');
      cur.classList.toggle('big', !!e.target.closest('.proj'));
      txt.textContent = e.target.closest('.proj') ? 'VIEW' : '';
      cur.style.background = t && !e.target.closest('.proj') ? 'var(--accent)' : '';
    });
    $$('.logo, .burger').forEach(el => {
      const mx = gsap.quickTo(el, 'x', { duration: .4, ease: 'power3' }), my = gsap.quickTo(el, 'y', { duration: .4, ease: 'power3' });
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * .25); my((e.clientY - r.top - r.height / 2) * .25);
      });
      el.addEventListener('mouseleave', () => { mx(0); my(0); });
    });
  }

})();
