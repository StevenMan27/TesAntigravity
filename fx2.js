(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if (typeof gsap === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  const colors = ['#FFE600', '#FF5E5E', '#3B82F6', '#4ADE80', '#C084FC'];

  /* Big outline section numbers */
  ['about', 'skills', 'projects', 'research', 'faq', 'contact'].forEach((id, i) => {
    const sec = $('#' + id); if (!sec) return;
    const n = document.createElement('div'); n.className = 'sec-num'; n.textContent = '0' + (i + 1);
    sec.prepend(n);
  });

  /* Manifesto: words fill in on scroll */
  const mt = $('#manifestoText');
  if (mt) {
    const words = mt.textContent.trim().split(/\s+/);
    const key = ['sistem', 'database', 'antarmuka', 'responsif.'];
    mt.textContent = '';
    const spans = words.map(w => {
      const s = document.createElement('span'); s.className = 'mw' + (key.includes(w.toLowerCase()) ? ' hi' : ''); s.textContent = w;
      mt.appendChild(s); mt.appendChild(document.createTextNode(' ')); return s;
    });
    ScrollTrigger.create({
      trigger: mt, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: self => spans.forEach((s, i) => s.classList.toggle('on', self.progress * 1.05 > i / spans.length))
    });
  }

  /* Count-up stats */
  $$('.stat b').forEach(b => {
    const m = b.textContent.match(/^(\d+)(\+?)$/); if (!m) return;
    const o = { v: 0 };
    ScrollTrigger.create({ trigger: b, start: 'top 95%', once: true, onEnter: () =>
      gsap.to(o, { v: +m[1], duration: 1.6, delay: 2.2, ease: 'power2.out', onUpdate: () => b.textContent = Math.round(o.v) + m[2] }) });
    b.textContent = '0' + m[2];
  });

  /* Page wipe on anchor navigation */
  const bars = $$('#wipe i');
  let busy = false;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#' || busy) return;
    busy = true;
    gsap.timeline({ onComplete: () => busy = false })
      .set(bars, { transformOrigin: 'bottom' })
      .to(bars, { scaleY: 1, duration: .35, stagger: .06, ease: 'power3.in' })
      .set(bars, { transformOrigin: 'top' })
      .to(bars, { scaleY: 0, duration: .45, stagger: .06, ease: 'power3.out' }, '+=.15');
  });

  /* Click burst of squares */
  document.addEventListener('click', e => {
    for (let i = 0; i < 10; i++) {
      const d = document.createElement('div'); d.className = 'burst';
      d.style.left = e.clientX - 7 + 'px'; d.style.top = e.clientY - 7 + 'px';
      d.style.background = colors[i % colors.length]; document.body.appendChild(d);
      const ang = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 70;
      gsap.to(d, { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, rotate: Math.random() * 360, opacity: 0, scale: .3, duration: .7, ease: 'power3.out', onComplete: () => d.remove() });
    }
  });

  /* Skill cards pop in staggered in batches */
  ScrollTrigger.batch('.skill, .proj', {
    start: 'top 92%', once: true,
    onEnter: els => gsap.fromTo(els, { y: 70, rotate: () => gsap.utils.random(-4, 4), opacity: 0 }, { y: 0, rotate: 0, opacity: 1, stagger: .08, duration: .7, ease: 'back.out(1.5)', overwrite: true })
  });
  ScrollTrigger.refresh();
})();
