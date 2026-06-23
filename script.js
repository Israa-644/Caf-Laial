/* ═══════════════════════════════════════════
   LAYAAL CAFÉ & LOUNGE — JavaScript
   ═══════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════
// 1. DOM READY
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initThemeToggle();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initMenuFilter();
  initCounterAnimations();
  initContactForm();
  initBackToTop();
  initActiveNavHighlight();
});

// ══════════════════════════════════════
// 2. LOADER
// ══════════════════════════════════════
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Simulate loading time
  const minLoadTime = 1800;
  const start = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minLoadTime - elapsed);
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger initial animations after loader hides
      setTimeout(() => triggerHeroAnimations(), 100);
    }, remaining);
  });

  // Fallback: hide loader after 3 seconds regardless
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      setTimeout(() => triggerHeroAnimations(), 100);
    }
  }, 3000);
}

function triggerHeroAnimations() {
  const heroElements = document.querySelectorAll('.hero .reveal-up');
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 120);
  });
}

// ══════════════════════════════════════
// 3. THEME TOGGLE
// ══════════════════════════════════════
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  if (!btn) return;

  // Load saved theme
  const savedTheme = localStorage.getItem('layaal-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('layaal-theme', next);

    // Brief scale animation
    btn.style.transform = 'scale(0.85) rotate(15deg)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  });
}

// ══════════════════════════════════════
// 4. NAVBAR — Scroll Effect
// ══════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ══════════════════════════════════════
// 5. MOBILE MENU
// ══════════════════════════════════════
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  if (!toggle || !mobileNav) return;

  const close = () => {
    toggle.classList.remove('open');
    mobileNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => link.addEventListener('click', close));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      close();
    }
  });
}

// ══════════════════════════════════════
// 6. SMOOTH SCROLL
// ══════════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ══════════════════════════════════════
// 7. SCROLL REVEAL (IntersectionObserver)
// ══════════════════════════════════════
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  // Skip hero elements (handled by loader)
  const nonHeroReveal = Array.from(revealEls).filter(
    el => !el.closest('.hero')
  );

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all
    nonHeroReveal.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.style.animationDelay || '0') * 1000;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  nonHeroReveal.forEach(el => observer.observe(el));
}

// ══════════════════════════════════════
// 8. MENU FILTER TABS
// ══════════════════════════════════════
function initMenuFilter() {
  const tabs = document.querySelectorAll('.menu-tab');
  const cards = document.querySelectorAll('.menu-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
          card.style.opacity = '';
          card.style.transform = '';
          card.style.transition = '';
        }
      });
    });
  });
}

// ══════════════════════════════════════
// 9. COUNTER ANIMATIONS
// ══════════════════════════════════════
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ══════════════════════════════════════
// 10. CONTACT FORM
// ══════════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('cf-submit');

    // Validate
    const name = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();

    if (!name || !email || !message) {
      shakeElement(btn);
      return;
    }

    // Simulate form submission
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';

    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      btn.disabled = false;
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      setTimeout(() => {
        if (successMsg) successMsg.hidden = true;
      }, 5000);
    }, 1500);
  });
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // trigger reflow
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 400);
}

// Add shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

// ══════════════════════════════════════
// 11. BACK TO TOP
// ══════════════════════════════════════
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = () => btn.classList.toggle('visible', window.scrollY > 400);
  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ══════════════════════════════════════
// 12. ACTIVE NAV HIGHLIGHT
// ══════════════════════════════════════
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${entry.target.id}`);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

// ══════════════════════════════════════
// 13. GALLERY HOVER PARALLAX (Desktop only)
// ══════════════════════════════════════
if (window.matchMedia('(min-width: 1024px)').matches) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.querySelector('.gallery-inner').style.transform =
        `scale(1.04) translate(${x * 10}px, ${y * 10}px)`;
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('.gallery-inner').style.transform = '';
    });
  });
}

// ══════════════════════════════════════
// 14. MENU CARD TILT EFFECT
// ══════════════════════════════════════
if (window.matchMedia('(min-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.menu-card, .why-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ══════════════════════════════════════
// 15. HERO FLOATING PARTICLES (Canvas)
// ══════════════════════════════════════
(function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.5 + 0.2),
      alpha: Math.random() * 0.5 + 0.1
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.0005;

      if (p.y < 0 || p.alpha <= 0) {
        p.x = Math.random() * W;
        p.y = H + 10;
        p.alpha = Math.random() * 0.5 + 0.1;
        p.vy = -(Math.random() * 0.5 + 0.2);
      }
    });
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });
})();
