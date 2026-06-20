/* ═══════════════════════════════════════════════
   THARUNCREATIONS — PORTFOLIO JS
   ═══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────
   1. LOADER
───────────────────────────────────── */
const loader     = document.getElementById('loader');
const countEl    = document.getElementById('loaderCount');
let count        = 0;
const countTimer = setInterval(() => {
  count += Math.floor(Math.random() * 12) + 4;
  if (count >= 100) {
    count = 100;
    clearInterval(countTimer);
    setTimeout(() => loader.classList.add('done'), 300);
  }
  if (countEl) countEl.textContent = count;
}, 55);


/* ─────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const aura = document.getElementById('cursor-aura');
let mx = 0, my = 0, ax = 0, ay = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (dot) {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }
});

(function animAura() {
  ax += (mx - ax) * 0.1;
  ay += (my - ay) * 0.1;
  if (aura) {
    aura.style.left = ax + 'px';
    aura.style.top  = ay + 'px';
  }
  requestAnimationFrame(animAura);
})();


/* ─────────────────────────────────────
   3. SMOOTH SCROLL (no href="#" dialogs)
───────────────────────────────────── */
function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

// Nav buttons
document.querySelectorAll('.nav-btn[data-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    goTo(btn.dataset.target);
    closeMobileMenu();
  });
});

// Mobile menu buttons
document.querySelectorAll('.mob-btn[data-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    goTo(btn.dataset.target);
    closeMobileMenu();
  });
});


/* ─────────────────────────────────────
   4. NAV — STICKY + ACTIVE
───────────────────────────────────── */
const nav      = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navBtns  = document.querySelectorAll('.nav-btn[data-target]');

window.addEventListener('scroll', () => {
  // Sticky bg
  nav.classList.toggle('sticky', window.scrollY > 50);

  // Active link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === current);
  });
}, { passive: true });


/* ─────────────────────────────────────
   5. MOBILE MENU TOGGLE
───────────────────────────────────── */
const navToggle   = document.getElementById('navToggle');
const mobileMenu  = document.getElementById('mobileMenu');
let menuOpen      = false;

function closeMobileMenu() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});


/* ─────────────────────────────────────
   6. SCROLL REVEAL
───────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObs.observe(el));


/* ─────────────────────────────────────
   7. SKILL BARS
───────────────────────────────────── */
const skillsWrap = document.querySelector('.skills');
if (skillsWrap) {
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(fill => {
          fill.style.width = fill.dataset.w + '%';
        });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  skillObs.observe(skillsWrap);
}


/* ─────────────────────────────────────
   8. COUNTER ANIMATION
───────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start   = 0;
  const step  = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num[data-count]');
let countersStarted = false;

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
      });
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObs.observe(statsEl);


/* ─────────────────────────────────────
   9. TESTIMONIAL SLIDER
───────────────────────────────────── */
const track      = document.getElementById('testiTrack');
const dotsWrap   = document.getElementById('testiDots');
const prevBtn    = document.getElementById('testiPrev');
const nextBtn    = document.getElementById('testiNext');
let testiIndex   = 0;

if (track && dotsWrap) {
  const cards    = track.querySelectorAll('.testi-card');
  const total    = cards.length;

  // Build dots
  cards.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(d);
  });

  function goToSlide(index) {
    testiIndex = (index + total) % total;
    track.style.transform = `translateX(-${testiIndex * 100}%)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === testiIndex);
    });
  }

  prevBtn.addEventListener('click', () => goToSlide(testiIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(testiIndex + 1));

  // Auto-advance every 6s
  let autoSlide = setInterval(() => goToSlide(testiIndex + 1), 6000);
  track.closest('.testi-slider').addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.closest('.testi-slider').addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goToSlide(testiIndex + 1), 6000);
  });

  // Touch swipe
  let touchStart = 0;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goToSlide(delta > 0 ? testiIndex + 1 : testiIndex - 1);
  });
}


/* ─────────────────────────────────────
   10. VIDEO MODAL
───────────────────────────────────── */
const videoModal = document.getElementById('videoModal');

function openModal() {
  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  videoModal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});


/* ─────────────────────────────────────
   11. CONTACT FORM
───────────────────────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('.form-submit span');
    const orig = btn.textContent;
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      form.reset();
      setTimeout(() => { btn.textContent = orig; }, 3000);
    }, 1400);
  });
}


/* ─────────────────────────────────────
   12. PARALLAX — HERO VISUAL
───────────────────────────────────── */
const heroVisual = document.querySelector('.hero-visual');
window.addEventListener('scroll', () => {
  if (!heroVisual) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroVisual.style.transform = `translateY(${y * 0.12}px)`;
  }
}, { passive: true });


/* ─────────────────────────────────────
   13. PROJECT CARD — MAGNETIC HOVER
───────────────────────────────────── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ─────────────────────────────────────
   14. SMOOTH TITLE LOAD AFTER LOADER
───────────────────────────────────── */
// Ensure animations fire after loader exits
setTimeout(() => {
  document.body.classList.add('loaded');
}, 2000);
