(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = ['#FFE600', '#FF5E5E', '#3B82F6', '#4ADE80', '#C084FC'];
  const hasG = typeof gsap !== 'undefined';

  /* ---------- Floating decoration shapes (CSS-animated, cheap) ---------- */
  if (!reduce) {
    const kinds = ['sq', 'ci', 'tri', 'plus'];
    [['about', 3], ['skills', 3], ['projects', 3], ['research', 3], ['faq', 3], ['contact', 3]].forEach(([id, n], si) => {
      const sec = $('#' + id); if (!sec) return;
      for (let i = 0; i < n; i++) {
        const d = document.createElement('div'); const c = colors[(si + i * 2) % colors.length];
        d.className = 'deco ' + kinds[(si + i) % 4]; d.style.setProperty('--c', c); d.style.background = c;
        d.style.top = (8 + ((i * 37 + si * 13) % 78)) + '%';
        d.style[i % 2 ? 'left' : 'right'] = (1 + (i * 3 + si) % 4) + '%';
        d.style.animationDelay = (-i * 1.7) + 's';
        sec.appendChild(d);
      }
    });
  }

  /* ---------- Spinning badge in hero ---------- */
  const hero = $('.hero');
  if (hero) {
    const w = document.createElement('div'); w.className = 'badge-spin';
    w.innerHTML = `<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="58" fill="#FFE600" stroke="#000" stroke-width="3"/><defs><path id="cp" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0"/></defs><text font-family="JetBrains Mono, monospace" font-weight="700" font-size="11.5" fill="#000"><textPath href="#cp">SCROLL DOWN ★ SCROLL DOWN ★ SCROLL DOWN ★</textPath></text></svg>`;
    const c = document.createElement('div'); c.className = 'badge-core'; c.textContent = '↓';
    hero.append(w, c);
  }

  /* ---------- Text scramble ---------- */
  const glyphs = '01<>/\\#*+=';
  function scramble(el) {
    if (el._sc) return; el._sc = true;
    const txt = el.dataset.orig || (el.dataset.orig = el.textContent); let f = 0; const total = 14;
    (function step() {
      el.textContent = txt.split('').map((ch, i) => ch === ' ' ? ' ' : (i < f / total * txt.length ? ch : glyphs[(Math.random() * glyphs.length) | 0])).join('');
      if (++f <= total) requestAnimationFrame(step); else { el.textContent = txt; el._sc = false; }
    })();
  }
  if (!reduce) {
    $$('.nav-links a, .filter, .logo').forEach(a => a.addEventListener('mouseenter', () => scramble(a)));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { scramble(e.target); io.unobserve(e.target); } }), { threshold: .6 });
    $$('.sec-tag').forEach(t => io.observe(t));
  }

  /* ---------- Footer letters jump ---------- */
  const fh = $('footer h3');
  if (fh && hasG && !reduce) {
    const t = fh.textContent; fh.textContent = ''; fh.classList.add('foot-letters');
    [...t].forEach(ch => { const s = document.createElement('span'); s.textContent = ch; fh.appendChild(s);
      s.addEventListener('mouseenter', () => gsap.fromTo(s, { y: 0, rotate: 0 }, { y: -22, rotate: gsap.utils.random(-14, 14), duration: .18, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: true })); });
  }

  /* ---------- Card tilt ---------- */
  if (hasG && fine && !reduce) {
    $$('.proj, .skill').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        gsap.to(el, { rotationY: px * 10, rotationX: -py * 10, x: -2, y: -2, transformPerspective: 800, duration: .3, overwrite: 'auto' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { rotationX: 0, rotationY: 0, x: 0, y: 0, duration: .5, ease: 'power3.out', overwrite: 'auto' }));
    });
  }

  /* ---------- Hero 3D: toon shading + thick outlines ---------- */
  const canvas = $('#hero3d');
  if (!canvas || typeof THREE === 'undefined' || !hasG) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' }); } catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 100); camera.position.z = 21;
  scene.add(new THREE.AmbientLight(0xffffff, .75));
  const dl = new THREE.DirectionalLight(0xffffff, 1.2); dl.position.set(4, 6, 8); scene.add(dl);

  const ramp = new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;

  const C = n => parseInt(colors[n].slice(1), 16);
  const defs = [
    { g: new THREE.BoxGeometry(1.7, 1.7, 1.7), c: 0, fx: .30, fy: .20, s: 1.15 },
    { g: new THREE.TorusGeometry(.9, .38, 14, 28), c: 1, fx: .43, fy: -.12, s: 1.2 },
    { g: new THREE.IcosahedronGeometry(1, 0), c: 3, fx: .17, fy: -.30, s: 1.0 },
    { g: new THREE.OctahedronGeometry(1.1), c: 2, fx: .05, fy: .36, s: .9 },
    { g: new THREE.ConeGeometry(.9, 1.7, 4), c: 4, fx: .46, fy: .38, s: .8 },
    { g: new THREE.BoxGeometry(2.4, .6, .6), c: 1, fx: -.40, fy: -.38, s: .8 },
    { g: new THREE.TorusKnotGeometry(.6, .22, 70, 10), c: 3, fx: -.14, fy: .40, s: .8 }
  ];
  const small = innerWidth < 720;
  const list = small ? defs.slice(0, 4) : defs;
  const group = new THREE.Group(); scene.add(group);
  const meshes = list.map((d, i) => {
    const m = new THREE.Mesh(d.g, new THREE.MeshToonMaterial({ color: C(d.c), gradientMap: ramp }));
    const o = new THREE.Mesh(d.g, new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }));
    o.scale.setScalar(1.07); m.add(o);
    m.userData = { d, base: d.s * (small ? .7 : 1), spin: .006 + i * .0012, ph: i * 1.3, boost: 0, sc: 0 };
    m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    group.add(m); return m;
  });

  function layout() {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
    const h = 2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.z, w = h * camera.aspect;
    meshes.forEach(m => { m.userData.x0 = m.userData.d.fx * w; m.userData.y0 = m.userData.d.fy * h; m.position.z = -1; });
  }
  layout(); addEventListener('resize', layout);

  const mouse = { x: 0, y: 0, nx: 0, ny: 0 };
  addEventListener('mousemove', e => {
    mouse.x = e.clientX / innerWidth - .5; mouse.y = e.clientY / innerHeight - .5;
    const r = canvas.getBoundingClientRect(); mouse.nx = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.ny = -((e.clientY - r.top) / r.height) * 2 + 1;
  }, { passive: true });
  const ray = new THREE.Raycaster();

  let visible = true;
  new IntersectionObserver(es => visible = es[0].isIntersecting).observe(canvas.parentElement);
  meshes.forEach((m, i) => { m.userData.sc = 0; gsap.to(m.userData, { sc: 1, duration: 1.2, delay: 1.7 + i * .12, ease: 'elastic.out(1,.55)' }); });

  let last = scrollY;
  gsap.ticker.add(t => {
    if (!visible || document.hidden) return;
    const v = Math.min(Math.abs(scrollY - last), 60); last = scrollY;
    ray.setFromCamera({ x: mouse.nx, y: mouse.ny }, camera);
    const hit = fine ? ray.intersectObjects(meshes, false)[0] : null;
    meshes.forEach(m => {
      const u = m.userData, hov = hit && hit.object === m;
      u.boost += ((hov ? .35 : 0) - u.boost) * .08;
      m.rotation.x += u.spin + u.boost + v * .002; m.rotation.y += u.spin * 1.5 + u.boost + v * .003;
      m.position.x = u.x0 + Math.sin(t * .8 + u.ph) * .25;
      m.position.y = u.y0 + Math.sin(t + u.ph) * .45;
      const target = u.base * u.sc * (hov ? 1.3 : 1); m.scale.x += (target - m.scale.x) * .15; m.scale.y = m.scale.z = m.scale.x;
    });
    group.rotation.y += (mouse.x * .5 - group.rotation.y) * .05;
    group.rotation.x += (mouse.y * .35 - group.rotation.x) * .05;
    group.position.y = scrollY * .006;
    renderer.render(scene, camera);
  });
})();
