(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Typewriter in hero ---------- */
  const typed = $('#typed');
  if (typed && !reduce) {
    const phrases = ['FULL-STACK WEB DEVELOPMENT', 'JAVA OOP & JAVAFX', 'POSTGRESQL & MYSQL', 'LINUX SERVER ADMIN', 'UI/UX PROTOTYPING'];
    let p = 0, c = 0, del = false;
    (function tick() {
      const w = phrases[p];
      typed.textContent = w.slice(0, c);
      if (!del && c === w.length) { del = true; return setTimeout(tick, 1400); }
      if (del && c === 0) { del = false; p = (p + 1) % phrases.length; }
      c += del ? -1 : 1; setTimeout(tick, del ? 28 : 65);
    })();
  }

  /* ---------- Filter counts ---------- */
  [['#skillFilters', '#skillGrid .skill'], ['#projFilters', '#projGrid .proj']].forEach(([f, it]) => {
    const items = $$(it);
    $$('.filter', $(f)).forEach(b => {
      const n = b.dataset.f === 'all' ? items.length : items.filter(x => x.dataset.cat === b.dataset.f).length;
      const s = document.createElement('span'); s.className = 'cnt'; s.textContent = n; b.appendChild(s);
    });
  });

  /* ---------- Project numbers, arrows, modal prev/next ---------- */
  const projs = $$('#projGrid .proj');
  projs.forEach((el, i) => {
    const vis = $('.proj-vis', el); if (!vis) return;
    const n = document.createElement('span'); n.className = 'pnum'; n.textContent = String(i + 1).padStart(2, '0') + '/' + String(projs.length).padStart(2, '0');
    const a = document.createElement('span'); a.className = 'proj-arrow'; a.textContent = '↗'; a.setAttribute('aria-hidden', 'true');
    vis.append(n, a);
    vis.addEventListener('click', () => { const b = $('[data-case]', el); if (b) b.click(); });
    vis.style.cursor = 'pointer';
  });
  const mc = $('#modalContent');
  if (mc) new MutationObserver(() => {
    if ($('.modal-nav', mc)) return;
    const title = $('h2', mc); if (!title) return;
    const idx = projs.findIndex(p => $('h3', p).textContent.trim().toLowerCase() === title.textContent.trim().toLowerCase());
    if (idx < 0) return;
    const go = k => () => { $('#modalClose').click(); setTimeout(() => $('[data-case]', projs[(idx + k + projs.length) % projs.length]).click(), 60); };
    const nav = document.createElement('div'); nav.className = 'modal-nav';
    nav.innerHTML = '<button class="btn btn-sm btn-white" type="button">← PREV</button><span class="mono" style="align-self:center;font-weight:700">' + (idx + 1) + ' / ' + projs.length + '</span><button class="btn btn-sm btn-blue" type="button">NEXT →</button>';
    const [pb, , nb] = nav.children; pb.onclick = go(-1); nb.onclick = go(1);
    mc.appendChild(nav);
  }).observe(mc, { childList: true });

  /* ---------- Scroll-to-top with progress ring ---------- */
  const top = $('#toTop'), ring = $('#ring'); let tk = false;
  function sc() {
    const h = document.documentElement.scrollHeight - innerHeight;
    ring.style.strokeDashoffset = 132 - 132 * (h > 0 ? scrollY / h : 0);
    top.classList.toggle('show', scrollY > 600); tk = false;
  }
  addEventListener('scroll', () => { if (!tk) { tk = true; requestAnimationFrame(sc); } }, { passive: true }); sc();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Footer live clock (Asia/Jakarta) ---------- */
  const clock = $('#clock');
  if (clock) {
    const f = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const t = () => clock.textContent = 'SUMATERA UTARA · ' + f.format(new Date()).replace(/\./g, ':') + ' WIB';
    t(); setInterval(() => { if (!document.hidden) t(); }, 1000);
  }

  /* ---------- Interactive terminal ---------- */
  const out = $('#termOut'), inp = $('#termIn'), body = $('#termBody');
  if (!out) return;
  const hist = []; let hi = 0;
  const line = (t, cls) => { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = t; out.appendChild(d); body.scrollTop = body.scrollHeight; };
  const list = sel => $$(sel).map(e => e.textContent.trim());
  const cmds = {
    help: () => ['Perintah tersedia:', '  whoami      profil singkat', '  about       tentang saya', '  skills      daftar tech stack', '  projects    daftar proyek (open <n> untuk detail)', '  education   perjalanan akademik', '  contact     info kontak', '  theme <blue|yellow|green>', '  sudo hire-me', '  clear'],
    whoami: () => ['Christian Steven Manurung (CHMANRU)', 'Mahasiswa Semester 3, D-IV TRPL — Institut Teknologi Del', 'NIM 41425031 · Kab. Toba / Tebing Tinggi, Sumatera Utara'],
    about: () => ['Berfokus pada Full-Stack Web, RPL berorientasi objek, Administrasi Server Linux, dan Desain UI/UX modern.', 'Terbiasa membangun sistem dari perancangan arsitektur database hingga antarmuka pengguna yang responsif.'],
    skills: () => { const g = {}; $$('#skillGrid .skill').forEach(s => { const c = $('.cat', s).textContent, n = $('h4', s).textContent; (g[c] = g[c] || []).push(n); }); return Object.entries(g).map(([k, v]) => '[' + k + '] ' + v.join(', ')); },
    projects: () => $$('#projGrid .proj h3').map((h, i) => (i + 1) + '. ' + h.textContent).concat(['', "ketik 'open <n>' untuk membuka case study"]),
    education: () => ['2025 — sekarang  Institut Teknologi Del (D-IV TRPL)', '2026           Coding Camp 2026 powered by DBS Foundation 2.0 (Dicoding Full-Stack Web Developer Track)', '2026           Seleksi Google Student Ambassador (GSA) 2026'],
    contact: () => ['email   if425031@del.ac.id', 'wa      082162479889', 'github  github.com/christiansteven'],
    clear: () => { out.innerHTML = ''; return []; }
  };
  function run(raw) {
    const c = raw.trim(); if (!c) return;
    line('chmanru@del:~$ ' + c, 'cmd'); hist.push(c); hi = hist.length;
    const [name, ...args] = c.split(/\s+/); const key = name.toLowerCase();
    if (key === 'sudo' && args[0] === 'hire-me') { line('PERMISSION GRANTED ✔ — mengarahkan ke kontak...', 'ok'); setTimeout(() => $('#contact').scrollIntoView({ behavior: 'smooth' }), 500); return; }
    if (key === 'open') { const n = parseInt(args[0], 10), b = $$('#projGrid [data-case]')[n - 1]; if (b) { line('membuka proyek ' + n + '...', 'ok'); b.click(); } else line('proyek tidak ditemukan. coba: open 1..' + projs.length, 'err'); return; }
    if (key === 'theme') { const b = $$('.nav-right .theme button').find(x => x.title.toLowerCase().includes((args[0] || '').toLowerCase()) && args[0]); if (b) { b.click(); line('tema aksen diganti: ' + b.title, 'ok'); } else line('gunakan: theme blue | yellow | green', 'err'); return; }
    if (cmds[key]) cmds[key]().forEach(l => line(l)); else line('command not found: ' + c + " — ketik 'help'", 'err');
  }
  $('#termForm').addEventListener('submit', e => { e.preventDefault(); run(inp.value); inp.value = ''; });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && hist.length) { hi = Math.max(0, hi - 1); inp.value = hist[hi]; e.preventDefault(); }
    if (e.key === 'ArrowDown' && hist.length) { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ''; e.preventDefault(); }
  });
  $('#termChips').addEventListener('click', e => { const b = e.target.closest('button'); if (b) run(b.dataset.cmd); });
  line("Selamat datang di terminal CHMANRU. Ketik 'help' atau klik tombol di bawah.", 'ok');
})();
