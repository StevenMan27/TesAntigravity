(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- DATA ---------- */
  const skills = [
    { cat: 'lang', name: 'Java', desc: 'OOP, JavaFX, JUnit 5' },
    { cat: 'lang', name: 'C', desc: 'Bahasa pemrograman C' },
    { cat: 'lang', name: 'C++', desc: 'Bahasa pemrograman C++' },
    { cat: 'lang', name: 'PHP', desc: 'Bahasa pemrograman PHP' },
    { cat: 'lang', name: 'JavaScript', desc: 'ES6+' },
    { cat: 'lang', name: 'Python', desc: 'Bahasa pemrograman Python' },
    { cat: 'lang', name: 'HTML5 / CSS3', desc: 'Markup & styling web' },
    { cat: 'lang', name: 'SQL', desc: 'Query & skema database' },
    { cat: 'web', name: 'Laravel', desc: 'Framework PHP' },
    { cat: 'web', name: 'React', desc: 'Library antarmuka' },
    { cat: 'web', name: 'Vite', desc: 'Build tool frontend' },
    { cat: 'web', name: 'Node.js', desc: 'Runtime JavaScript' },
    { cat: 'db', name: 'PostgreSQL', desc: 'Dikelola dengan pgAdmin4' },
    { cat: 'db', name: 'MySQL', desc: 'Database relasional' },
    { cat: 'db', name: 'Linux Server Admin', desc: 'Ubuntu, openEuler, BIND9/named DNS, ISC DHCP, Samba' },
    { cat: 'db', name: 'Cisco Packet Tracer', desc: 'Simulasi jaringan' },
    { cat: 'db', name: 'Oracle VirtualBox', desc: 'Virtualisasi lingkungan server' },
    { cat: 'tools', name: 'Visual Studio Code', desc: 'Code editor' },
    { cat: 'tools', name: 'Apache NetBeans', desc: 'IDE, JDK 23' },
    { cat: 'tools', name: 'Git & GitHub', desc: 'Version control' },
    { cat: 'tools', name: 'Figma', desc: 'UI/UX design & prototyping' },
    { cat: 'tools', name: 'Laragon / XAMPP', desc: 'Local web server stack' }
  ];
  const catInfo = {
    lang: ['LANGUAGES', '#FFE600'], web: ['FRAMEWORKS & WEB', '#3B82F6'],
    db: ['DATABASE & SERVER', '#4ADE80'], tools: ['TOOLS & DESIGN', '#C084FC']
  };

  const art = {
    web: `<rect x="40" y="30" width="320" height="130" fill="#fff"/><path d="M40 55h320"/><circle cx="58" cy="43" r="4" fill="#FF5E5E"/><circle cx="74" cy="43" r="4" fill="#FFE600"/><rect x="60" y="72" width="90" height="70" fill="#4ADE80"/><path d="M170 78h170M170 98h130M170 118h150M170 138h90"/>`,
    uiux: `<rect x="60" y="20" width="80" height="150" rx="8" fill="#fff"/><rect x="72" y="40" width="56" height="30" fill="#FF5E5E"/><path d="M72 84h56M72 100h40"/><rect x="170" y="45" width="190" height="115" fill="#fff"/><rect x="184" y="60" width="60" height="40" fill="#FFE600"/><rect x="256" y="60" width="90" height="40" fill="#3B82F6"/><path d="M184 118h160M184 134h110"/>`,
    db: `<g fill="#fff"><rect x="30" y="40" width="90" height="50"/><rect x="155" y="20" width="90" height="50"/><rect x="280" y="40" width="90" height="50"/><rect x="155" y="110" width="90" height="50"/></g><path d="M120 62l35-17M245 45l35 17M200 70v40M245 135h40l30-45"/><path d="M30 58h90M155 38h90M280 58h90M155 128h90"/><circle cx="75" cy="75" r="4" fill="#000"/>`,
    infra: `<rect x="40" y="25" width="90" height="40" fill="#fff"/><rect x="40" y="75" width="90" height="40" fill="#fff"/><rect x="40" y="125" width="90" height="40" fill="#fff"/><circle cx="58" cy="45" r="5" fill="#4ADE80"/><circle cx="58" cy="95" r="5" fill="#FFE600"/><circle cx="58" cy="145" r="5" fill="#FF5E5E"/><path d="M130 45h60M130 95h60M130 145h60M190 45v100"/><circle cx="260" cy="95" r="34" fill="#fff"/><path d="M226 95h68M260 61c-20 20-20 48 0 68M260 61c20 20 20 48 0 68"/><path d="M294 95h50" /><rect x="344" y="75" width="30" height="40" fill="#C084FC"/>`,
    shop: `<path d="M110 50l-35 30 25 15 15-10v70h90v-70l15 10 25-15-35-30c-10 15-35 15-45 0z" fill="#fff"/><rect x="250" y="40" width="100" height="50" fill="#FFE600" transform="rotate(-6 300 65)"/><text x="262" y="72" font-family="monospace" font-weight="700" font-size="18" stroke="none" fill="#000" transform="rotate(-6 300 65)">GRADE A</text><rect x="250" y="110" width="100" height="40" fill="#FF5E5E"/><text x="268" y="136" font-family="monospace" font-weight="700" font-size="16" stroke="none" fill="#000">LELANG</text>`
  };

  const projects = [
    {
      id: 'geotoba', cat: 'web', label: 'WEB APP', color: '#4ADE80', art: 'web',
      title: 'GeoToba', link: 'https://geositebaktiraja.my.id', linkText: 'geositebaktiraja.my.id',
      summary: 'Aplikasi web Laravel untuk digitalisasi informasi Geosite Danau Toba: Balige, Meat, Batu Bahisan, dan Liang Sipege.',
      stack: ['Laravel', 'PHP', 'MySQL'],
      problem: 'Informasi Geosite Danau Toba (Balige, Meat, Batu Bahisan, Liang Sipege) perlu didigitalkan agar mudah diakses.',
      arch: 'Aplikasi web berbasis Laravel yang dipublikasikan di geositebaktiraja.my.id.',
      features: ['Informasi geosite: Balige, Meat, Batu Bahisan, Liang Sipege', 'Modul berita', 'Galeri', 'Akomodasi', 'Direktori UMKM lokal'],
      role: 'Developer'
    },
    {
      id: 'generasisehat', cat: 'uiux', label: 'UI/UX & PROTOTYPE', color: '#FF5E5E', art: 'uiux',
      title: 'Generasi Sehat',
      summary: 'Sistem penjadwalan imunisasi ibu dan anak dengan UI Style Guide komprehensif dan prototipe interaktif multi-layar.',
      stack: ['Figma', 'UI Style Guide', 'Prototyping'],
      problem: 'Penjadwalan imunisasi ibu dan anak membutuhkan antarmuka yang jelas dan konsisten.',
      arch: 'Rancangan UI berbasis sistem desain dengan UI Style Guide yang mencakup 12 komponen standar.',
      features: ['UI Style Guide komprehensif (12 komponen standar)', 'Prototipe interaktif multi-layar mobile', 'Prototipe interaktif multi-layar desktop', 'Sistem penjadwalan imunisasi ibu dan anak'],
      role: 'Perancang UI/UX'
    },
    {
      id: 'library', cat: 'db', label: 'DATABASE', color: '#FFE600', art: 'db',
      title: 'Library Relational Database Architecture',
      summary: 'Perancangan dan implementasi skema database relasional 6 tabel di PostgreSQL (file latihan.sql).',
      stack: ['PostgreSQL', 'pgAdmin4', 'SQL'],
      problem: 'Dibutuhkan skema relasional yang menggambarkan berbagai jenis relasi antar entitas perpustakaan.',
      arch: 'Skema 6 tabel di PostgreSQL (latihan.sql) mencakup relasi One-to-One, One-to-Many, dan Many-to-Many.',
      features: ['6 tabel relasional', 'Relasi One-to-One', 'Relasi One-to-Many', 'Relasi Many-to-Many'],
      role: 'Perancang & implementator database'
    },
    {
      id: 'linuxlab', cat: 'infra', label: 'INFRASTRUCTURE', color: '#C084FC', art: 'infra',
      title: 'Enterprise Linux Network & Hosting Lab',
      summary: 'Konfigurasi server Ubuntu & openEuler di VirtualBox: ISC DHCP, BIND9 DNS, Samba, dan deployment Laravel.',
      stack: ['Ubuntu', 'openEuler', 'BIND9', 'ISC DHCP', 'Samba', 'VirtualBox'],
      problem: 'Dibutuhkan lingkungan jaringan dan hosting terintegrasi untuk praktik administrasi server Linux.',
      arch: 'Server Ubuntu dan openEuler pada Oracle VirtualBox yang menjalankan ISC DHCP, BIND9 DNS, Samba, dan aplikasi Laravel.',
      features: ['ISC DHCP', 'BIND9 DNS Server', 'Samba file sharing', 'Deployment aplikasi Laravel'],
      role: 'Administrator server / konfigurator'
    },
    {
      id: 'pilihulang', cat: 'web', label: 'WEB APP // KONSEP', color: '#3B82F6', art: 'shop',
      title: 'PILIHULANG Re-Commerce Platform',
      summary: 'Konsep platform thrifting dan re-commerce berkelanjutan dengan grading kualitas A/B, verifikasi sanitasi, dan lelang cepat.',
      stack: ['Konsep', 'UI/UX', 'Web'],
      problem: 'Konsep platform thrifting dan re-commerce berkelanjutan dengan kepercayaan kualitas barang.',
      arch: 'Antarmuka modern dengan alur grading, verifikasi sanitasi, dan lelang cepat.',
      features: ['Sistem grading kualitas A/B', 'Verifikasi sanitasi', 'Lelang cepat', 'Antarmuka modern'],
      role: 'Perancang konsep'
    }
  ];

  /* ---------- RENDER ---------- */
  $('#skillGrid').innerHTML = skills.map((s, i) => `
    <article class="card skill hoverable reveal" data-cat="${s.cat}" style="border-top:10px solid ${catInfo[s.cat][1]}">
      <span class="cat">${catInfo[s.cat][0]}</span>
      <h4>${s.name}</h4><p>${s.desc}</p>
    </article>`).join('');

  $('#projGrid').innerHTML = projects.map(p => `
    <article class="card proj hoverable reveal" data-cat="${p.cat}">
      <div class="proj-vis" style="background:${p.color}">
        <svg viewBox="0 0 400 190" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${art[p.art]}</svg>
      </div>
      <div class="proj-body">
        <span class="proj-cat" style="background:${p.color}">${p.label}</span>
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <div>${p.stack.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <button class="btn btn-sm" data-case="${p.id}">CASE STUDY (DETAIL)</button>
      </div>
    </article>`).join('');

  /* ---------- FILTERS ---------- */
  function setupFilter(barSel, itemSel) {
    const bar = $(barSel);
    bar.addEventListener('click', e => {
      const b = e.target.closest('.filter'); if (!b) return;
      $$('.filter', bar).forEach(x => x.classList.toggle('on', x === b));
      $$(itemSel).forEach(it => {
        const show = b.dataset.f === 'all' || it.dataset.cat === b.dataset.f;
        it.classList.toggle('hide', !show);
        if (show) { it.classList.add('in'); it.classList.remove('pop'); void it.offsetWidth; it.classList.add('pop'); }
      });
    });
  }
  setupFilter('#skillFilters', '#skillGrid .skill');
  setupFilter('#projFilters', '#projGrid .proj');

  /* ---------- MODAL ---------- */
  const modal = $('#modal'); let lastFocus = null;
  function openModal(id) {
    const p = projects.find(x => x.id === id); if (!p) return;
    lastFocus = document.activeElement;
    $('#modalContent').innerHTML = `
      <span class="tag" style="background:${p.color}">${p.label}</span>
      <h2 id="mTitle">${p.title}</h2>
      ${p.link ? `<p><a class="btn btn-sm btn-blue" href="${p.link}" target="_blank" rel="noopener">${p.linkText} ↗</a></p>` : ''}
      <h4>LATAR BELAKANG MASALAH</h4><p>${p.problem}</p>
      <h4>ARSITEKTUR SISTEM</h4><p>${p.arch}</p>
      <h4>FITUR UTAMA</h4><ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <h4>PERAN SAYA</h4><p>${p.role}</p>
      <h4>STACK</h4><p>${p.stack.map(t => `<span class="tag">${t}</span>`).join('')}</p>`;
    modal.classList.add('open'); document.body.classList.add('lock');
    $('#modalClose').focus();
  }
  function closeModal() {
    modal.classList.remove('open'); document.body.classList.remove('lock');
    if (lastFocus) lastFocus.focus();
  }
  $('#projGrid').addEventListener('click', e => {
    const b = e.target.closest('[data-case]'); if (b) openModal(b.dataset.case);
  });
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  /* ---------- DRAWER ---------- */
  const drawer = $('#drawer'), overlay = $('#overlay'), burger = $('#burger');
  function setDrawer(open) {
    drawer.classList.toggle('open', open); overlay.classList.toggle('show', open);
    burger.setAttribute('aria-expanded', open);
  }
  burger.addEventListener('click', () => setDrawer(true));
  $('#drawerClose').addEventListener('click', () => setDrawer(false));
  overlay.addEventListener('click', () => setDrawer(false));
  $$('.dl, .drawer .btn').forEach(a => a.addEventListener('click', () => setDrawer(false)));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (modal.classList.contains('open')) closeModal(); setDrawer(false); }
  });

  /* ---------- TOAST ---------- */
  const toast = $('#toast'); let tt;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ---------- COPY EMAIL ---------- */
  const EMAIL = 'if425031@del.ac.id';
  $('#copyEmail').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(EMAIL); }
    catch {
      const t = document.createElement('textarea'); t.value = EMAIL; document.body.appendChild(t);
      t.select(); document.execCommand('copy'); t.remove();
    }
    showToast('COPIED TO CLIPBOARD!');
  });

  /* ---------- CV PLACEHOLDER ---------- */
  $('#cvBtn').addEventListener('click', e => { e.preventDefault(); showToast('CV BELUM TERSEDIA'); });

  /* ---------- THEME ACCENT ---------- */
  function setAccent(c) {
    document.documentElement.style.setProperty('--accent', c);
    $$('.theme button').forEach(b => b.classList.toggle('on', b.dataset.accent === c));
    try { localStorage.setItem('accent', c); } catch {}
  }
  $$('.theme button').forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));
  try { const s = localStorage.getItem('accent'); if (s) setAccent(s); } catch {}

  /* ---------- ABSTRACT ---------- */
  $('#abstractBtn').addEventListener('click', e => {
    const open = $('#abstract').classList.toggle('open');
    e.target.setAttribute('aria-expanded', open);
    e.target.textContent = open ? 'HIDE ABSTRACT' : 'READ ABSTRACT';
  });

  /* ---------- FAQ ---------- */
  $$('.faq-item').forEach(item => {
    const q = $('.faq-q', item), a = $('.faq-a', item);
    q.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      $$('.faq-item.open').forEach(o => {
        o.classList.remove('open'); $('.faq-a', o).style.maxHeight = 0;
        $('.pm', o).textContent = '+'; $('.faq-q', o).setAttribute('aria-expanded', false);
      });
      if (open) {
        item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px';
        $('.pm', item).textContent = '−'; q.setAttribute('aria-expanded', true);
      }
    });
  });

  /* ---------- FORM ---------- */
  const form = $('#contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
    const checks = [
      [form.name, name.length >= 2],
      [form.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)],
      [form.message, msg.length >= 10]
    ];
    let ok = true;
    checks.forEach(([el, valid]) => { el.closest('.field').classList.toggle('bad', !valid); if (!valid) ok = false; });
    if (!ok) { showToast('PERIKSA KEMBALI FORM!'); return; }
    const subject = encodeURIComponent('Pesan dari Portfolio: ' + name);
    const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    showToast('MEMBUKA APLIKASI EMAIL...');
    form.reset();
  });
  $$('input, textarea', form).forEach(el => el.addEventListener('input', () => el.closest('.field').classList.remove('bad')));

  /* ---------- SCROLL: PROGRESS + ACTIVE LINK ---------- */
  const prog = $('#progress');
  const links = $$('.nav-links a');
  const secs = links.map(a => $(a.getAttribute('href')));
  function onScroll() {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    let cur = -1, best = -1e9;
    secs.forEach((s, i) => { if (!s) return; const t = s.getBoundingClientRect().top; if (t < innerHeight * 0.4 && t > best) { best = t; cur = i; } });
    links.forEach((a, i) => a.classList.toggle('active', i === cur));
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- SCROLL REVEAL ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));
})();
