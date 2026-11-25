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
    const kinds = ['sq', 'ci', 'plus'];
    [['about', 2], ['skills', 2], ['projects', 2], ['research', 2], ['faq', 2], ['contact', 2]].forEach(([id, n], si) => {
      const sec = $('#' + id); if (!sec) return;
      for (let i = 0; i < n; i++) {
        const d = document.createElement('div'); const c = colors[(si + i * 2) % colors.length];
        d.className = 'deco ' + kinds[(si + i) % 3]; d.style.setProperty('--c', c); d.style.background = c;
        d.style.top = (8 + ((i * 37 + si * 13) % 78)) + '%';
        d.style[i % 2 ? 'left' : 'right'] = (1 + (i * 3 + si) % 4) + '%';
        d.style.animationDelay = (-i * 1.7) + 's';
        sec.appendChild(d);
      }
    });
    const dio = new IntersectionObserver(es => es.forEach(e => e.target.querySelectorAll('.deco').forEach(d => d.classList.toggle('run', e.isIntersecting))));
    $$('section').forEach(sec => { if (sec.querySelector('.deco')) dio.observe(sec); });
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

  /* ---------- 3D: interactive Rubik's cube inside the OS window ---------- */
  const holder = $('.os-art');
  if (!holder || typeof THREE === 'undefined') return;
  const cv = document.createElement('canvas'); cv.id = 'cube3d'; cv.setAttribute('aria-label', 'Kubus 3D interaktif, klik untuk memutar');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); } catch { return; }
  holder.appendChild(cv); holder.classList.add('has3d');
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100); camera.position.set(0, 1.6, 17); camera.lookAt(0, -.2, 0);

  const faceCols = [0xFF5E5E, 0xC084FC, 0xFFE600, 0x4ADE80, 0x3B82F6, 0xFFFFFF]; // +x -x +y -y +z -z
  const mats = faceCols.map(c => new THREE.MeshBasicMaterial({ color: c }));
  const black = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const coreG = new THREE.BoxGeometry(1, 1, 1), stG = new THREE.PlaneGeometry(.8, .8);
  const dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const cube = new THREE.Group(); scene.add(cube);
  const cubelets = [], cores = [];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    const g = new THREE.Group(); g.position.set(x, y, z);
    const core = new THREE.Mesh(coreG, black); g.add(core); cores.push(core);
    dirs.forEach((d, k) => {
      if (d[0] * x + d[1] * y + d[2] * z !== 1) return;
      const st = new THREE.Mesh(stG, mats[k]); st.position.set(d[0] * .501, d[1] * .501, d[2] * .501);
      st.rotation.set(d[1] ? -d[1] * Math.PI / 2 : 0, d[0] ? d[0] * Math.PI / 2 : (d[2] < 0 ? Math.PI : 0), 0); g.add(st);
    });
    cube.add(g); cubelets.push(g);
  }
  cube.scale.setScalar(1.55);

  // hard shadow disc
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(3, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -3.9; shadow.scale.set(.8, .8, .3); scene.add(shadow);

  // orbiting voxels
  const orb = [];
  const hullM = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }), vg = new THREE.BoxGeometry(.7, .7, .7);
  [0xFFE600, 0xFF5E5E, 0x3B82F6, 0x4ADE80, 0xC084FC, 0xFFFFFF].forEach((c, i) => {
    const m = new THREE.Mesh(vg, new THREE.MeshBasicMaterial({ color: c })); const h = new THREE.Mesh(vg, hullM); h.scale.setScalar(1.18); m.add(h);
    m.userData = { a: i / 6 * Math.PI * 2, r: 5.4 + (i % 2) * .7, sp: .5 + i * .08, y: (i % 3 - 1) * 1.6 }; scene.add(m); orb.push(m);
  });

  function size() { const r = holder.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); }
  size(); new ResizeObserver(size).observe(holder);

  /* twist a random layer */
  let busy = false;
  function twist() {
    if (busy) return; busy = true;
    const axis = ['x', 'y', 'z'][(Math.random() * 3) | 0], layer = ((Math.random() * 3) | 0) - 1, dir = Math.random() < .5 ? 1 : -1;
    const pivot = new THREE.Group(); cube.add(pivot);
    cubelets.filter(c => Math.round(c.position[axis]) === layer).forEach(c => pivot.attach(c));
    const end = () => { [...pivot.children].forEach(c => { cube.attach(c); c.position.set(Math.round(c.position.x), Math.round(c.position.y), Math.round(c.position.z)); }); cube.remove(pivot); busy = false; };
    if (hasG) gsap.to(pivot.rotation, { [axis]: dir * Math.PI / 2, duration: .55, ease: 'power3.inOut', onComplete: end }); else { pivot.rotation[axis] = dir * Math.PI / 2; end(); }
  }

  const mouse = { x: 0, y: 0, nx: 9, ny: 9, over: false };
  cv.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.nx = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.ny = -((e.clientY - r.top) / r.height) * 2 + 1; mouse.over = true; });
  cv.addEventListener('mouseleave', () => { mouse.over = false; mouse.nx = mouse.ny = 9; });
  addEventListener('mousemove', e => { mouse.x = e.clientX / innerWidth - .5; mouse.y = e.clientY / innerHeight - .5; }, { passive: true });
  cv.addEventListener('click', () => { twist(); setTimeout(twist, 650); if (hasG) gsap.fromTo(cube.scale, { x: 1.3, y: 1.8, z: 1.3 }, { x: 1.55, y: 1.55, z: 1.55, duration: .6, ease: 'elastic.out(1,.4)' }); });
  const ray = new THREE.Raycaster();

  let on = true, running = false, spin = 0, clock = 0;
  new IntersectionObserver(es => { on = es[0].isIntersecting; if (on && !running) loop(); }).observe(holder);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && on && !running) loop(); });
  setInterval(() => { if (on && !document.hidden && !mouse.over) twist(); }, 2600);
  if (hasG) gsap.from(cube.scale, { x: 0, y: 0, z: 0, duration: 1.2, delay: 1.5, ease: 'elastic.out(1,.55)' });

  function loop() {
    if (!on || document.hidden) { running = false; return; }
    running = true; clock += .016;
    ray.setFromCamera({ x: mouse.nx, y: mouse.ny }, camera);
    const hov = mouse.over && ray.intersectObjects(cores, false).length > 0;
    cv.style.cursor = hov ? 'pointer' : 'grab';
    spin += (hov ? .03 : .008);
    cube.rotation.y = spin + mouse.x * .8; cube.rotation.x = .45 + mouse.y * .5;
    cube.position.y = Math.sin(clock * 2) * .25;
    const s = 1 - (Math.sin(clock * 2) * .5 + .5) * .06; shadow.scale.x = .8 * s; shadow.scale.y = .8 * s;
    orb.forEach(m => { const u = m.userData; u.a += u.sp * .016; m.position.set(Math.cos(u.a) * u.r, u.y + Math.sin(clock * 2 + u.a) * .4, Math.sin(u.a) * u.r * .5); m.rotation.x += .02; m.rotation.y += .03; });
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
})();
