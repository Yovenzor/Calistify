

/* ---------- Phone Status Bar Injection ---------- */
function injectStatusBars() {
  const phones = document.querySelectorAll('.phone-frame');
  phones.forEach((phone) => {
    const screen = phone.querySelector('.phone-screen');
    if (!screen) return;
    if (screen.querySelector('.phone-status-bar')) return;

    const isXS = phone.classList.contains('phone-xs');
    const fontSize = isXS ? '7px' : phone.classList.contains('phone-sm') ? '10px' : '12px';
    const iconSize = isXS ? '7' : phone.classList.contains('phone-sm') ? '10' : '12';

    const statusBar = document.createElement('div');
    statusBar.className = 'phone-status-bar';
    statusBar.innerHTML = `
      <span class="phone-status-time">9:41</span>
      <div class="phone-status-icons">
        <svg viewBox="0 0 24 24" fill="currentColor" width="${iconSize}" height="${iconSize}"><path d="M12 4C7.31 4 3.07 5.9 0 9l2 2c2.62-2.96 6.3-5 10-5s7.38 2.04 10 5l2-2C20.93 5.9 16.69 4 12 4zm0 4c-3.31 0-6.34 1.42-8.5 3.5L5.5 13.5C7.04 12.06 9.42 11 12 11s4.96 1.06 6.5 2.5l2-2C18.34 9.42 15.31 8 12 8zm0 4c-1.66 0-3.22.69-4.5 1.5L9.5 15.5c.76-.55 1.5-1 2.5-1s1.74.45 2.5 1l1.5-1.5C15.22 12.69 13.66 12 12 12zm0 4c-.55 0-1.05.22-1.41.59L12 18l1.41-1.41C13.05 16.22 12.55 16 12 16z"/></svg>
        <svg viewBox="0 0 24 24" fill="currentColor" width="${iconSize}" height="${iconSize}"><path d="M2 22h20V2L2 22z"/></svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${iconSize}" height="${iconSize}"><rect x="2" y="7" width="18" height="10" rx="2"/><rect x="4" y="9" width="14" height="6" rx="1" fill="currentColor"/><line x1="22" y1="11" x2="22" y2="13" stroke-width="2"/></svg>
      </div>
    `;

    const homeIndicator = document.createElement('div');
    homeIndicator.className = 'phone-home-indicator';

    // Wrap existing content
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'phone-screen-content';
    while (screen.firstChild) {
      contentWrapper.appendChild(screen.firstChild);
    }

    screen.appendChild(statusBar);
    screen.appendChild(contentWrapper);
    screen.appendChild(homeIndicator);
  });
}

/* ---------- Navbar Scroll State ---------- */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  const scrolled = window.scrollY > 20;
  navbar.classList.toggle('scrolled', scrolled);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ---------- Mobile Menu ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});



/* ---------- Scroll Reveal ---------- */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ---------- Number Counters ---------- */
const counters = document.querySelectorAll('[data-count]');
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  counters.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const proofSection = document.querySelector('.proof-strip');
if (proofSection) {
  const proofObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          proofObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  proofObserver.observe(proofSection);
}

/* ---------- FAQ Accordion ---------- */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    faqItems.forEach((other) => {
      other.classList.remove('open');
      other.querySelector('.faq-answer').style.maxHeight = '0';
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ---------- Progress Chart (SVG) ---------- */
function buildChart() {
  const chartContainer = document.getElementById('mockChart');
  if (!chartContainer) return;

  const data = [40, 55, 48, 70, 65, 82, 78, 95, 88, 100];
  const width = 220;
  const height = 100;
  const maxVal = Math.max(...data);
  const padding = 10;
  const stepX = (width - padding * 2) / (data.length - 1);

  let pathD = '';
  let areaD = `M ${padding} ${height - padding}`;
  data.forEach((val, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (val / maxVal) * (height - padding * 2);
    if (i === 0) {
      pathD += `M ${x} ${y}`;
      areaD += ` L ${x} ${y}`;
    } else {
      const prevX = padding + (i - 1) * stepX;
      const prevY = height - padding - (data[i - 1] / maxVal) * (height - padding * 2);
      const cpX = (prevX + x) / 2;
      pathD += ` C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
      areaD += ` C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
    }
  });
  areaD += ` L ${padding + (data.length - 1) * stepX} ${height - padding} Z`;

  let gridLines = '';
  for (let i = 0; i <= 3; i++) {
    const y = padding + (i * (height - padding * 2)) / 3;
    gridLines += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#1a1a1a" stroke-width="1" stroke-dasharray="3 3"/>`;
  }

  chartContainer.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" width="100%" height="100%">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#B6FF00" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#B6FF00" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${areaD}" fill="url(#chartGrad)"/>
      <path d="${pathD}" fill="none" stroke="#B6FF00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      ${data.map((val, i) => {
        const x = padding + i * stepX;
        const y = height - padding - (val / maxVal) * (height - padding * 2);
        return `<circle cx="${x}" cy="${y}" r="2.5" fill="#B6FF00"/>`;
      }).join('')}
    </svg>
  `;
}

/* ---------- Functional Rest Timer ---------- */
const restTimeEl = document.getElementById('restTime');
const restRingOuter = document.getElementById('restRingOuter');
const restQuickBtns = document.getElementById('restQuickBtns');
const restStartBtn = document.getElementById('restStartBtn');
const restResetBtn = document.getElementById('restResetBtn');
const restMessage = document.getElementById('restMessage');

let restTotalSec = 90;
let restRemainingSec = 90;
let restInterval = null;
let restRunning = false;

const motivationalMessages = [
  "Rest is over. Get back to work.",
  "Time's up. Let's go.",
  "Break's over. Earn the next set.",
  "Back to it. Every rep counts.",
  "Rest done. Time to grind.",
];

function formatRestTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateRestRing() {
  if (!restRingOuter) return;
  const pct = restTotalSec > 0 ? restRemainingSec / restTotalSec : 0;
  const degrees = pct * 360;
  restRingOuter.style.background = `conic-gradient(var(--lime) 0deg, var(--lime) ${degrees}deg, var(--bg-elevated) ${degrees}deg)`;
}

function setRestTime(sec) {
  restTotalSec = sec;
  restRemainingSec = sec;
  restTimeEl.textContent = formatRestTime(sec);
  restMessage.classList.remove('visible');
  restMessage.textContent = '';
  updateRestRing();
}

function startRestTimer() {
  if (restRunning) {
    // Pause
    clearInterval(restInterval);
    restRunning = false;
    restStartBtn.textContent = 'Resume';
    return;
  }

  restRunning = true;
  restStartBtn.textContent = 'Pause';
  restMessage.classList.remove('visible');

  restInterval = setInterval(() => {
    restRemainingSec--;
    restTimeEl.textContent = formatRestTime(restRemainingSec);
    updateRestRing();

    if (restRemainingSec <= 0) {
      clearInterval(restInterval);
      restRunning = false;
      restStartBtn.textContent = 'Start';
      restTimeEl.textContent = '00:00';
      updateRestRing();
      const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      restMessage.textContent = msg;
      restMessage.classList.add('visible');
    }
  }, 1000);
}

function resetRestTimer() {
  clearInterval(restInterval);
  restRunning = false;
  restRemainingSec = restTotalSec;
  restTimeEl.textContent = formatRestTime(restTotalSec);
  restStartBtn.textContent = 'Start';
  restMessage.classList.remove('visible');
  restMessage.textContent = '';
  updateRestRing();
}

if (restQuickBtns && restStartBtn && restResetBtn) {
  restQuickBtns.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      restQuickBtns.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const sec = parseInt(btn.dataset.seconds, 10);
      setRestTime(sec);
      if (restRunning) {
        clearInterval(restInterval);
        restRunning = false;
        restStartBtn.textContent = 'Start';
      }
    });
  });

  restStartBtn.addEventListener('click', startRestTimer);
  restResetBtn.addEventListener('click', resetRestTimer);
}


/* ---------- Smooth Anchor Offset ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Active Nav Link on Scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      current = section.id;
    }
  });

  navLinkEls.forEach((link) => {
    const href = link.getAttribute('href').slice(1);
    link.style.color = href === current ? 'var(--text-primary)' : '';
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });


/* ---------- Init ---------- */
injectStatusBars();
buildChart();
if (restRingOuter) updateRestRing();
