/**
 * Ethical Explorers — Core Application Engine
 * SPA Router, Matrix Rain, Glitch Effects, Page Renderers
 */

// ================================================================
// CONSTANTS
// ================================================================
const SITE_NAME = 'Ethical Explorers';
const SITE_URL = 'https://ethicalexplorers.github.io';
const CONTACT_EMAIL = 'ethicalexplorers18@gmail.com';

const SOCIAL_LINKS = {
  email: 'mailto:ethicalexplorers18@gmail.com',
  instagram: 'https://www.instagram.com/ethical_explorers_18',
  telegram: 'https://t.me/ethicalexplorers',
  youtube: 'https://youtube.com/@ethicalexplorers18'
};

const ICONS = {
  youtube: `<svg viewBox="0 0 24 24" width="22" height="22" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><polygon fill="#FFFFFF" points="9.545,15.568 15.818,12 9.545,8.432"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" width="22" height="22" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><defs><radialGradient id="ig-gradient-icon" cx="20%" cy="110%" r="140%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-gradient-icon)"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="#ffffff" stroke-width="1.8"/><rect x="5.5" y="5.5" width="13" height="13" rx="3.5" fill="none" stroke="#ffffff" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="#ffffff"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" width="22" height="22" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><defs><linearGradient id="tg-gradient-icon" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stop-color="#2AABEE"/><stop offset="100%" stop-color="#229ED9"/></linearGradient></defs><circle cx="12" cy="12" r="11" fill="url(#tg-gradient-icon)"/><path fill="#ffffff" d="M5.4 11.6l11.4-4.8c.6-.2 1.1.1.9.8l-2 9.4c-.1.7-.6.9-1.2.5l-3.3-2.4-1.6 1.5c-.2.2-.3.3-.7.3l.2-3.4 6.2-5.6c.3-.3-.1-.4-.4-.2L8.2 13.5l-3.3-1c-.7-.2-.7-.7.5-1z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" width="22" height="22" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="2" y="4" width="20" height="16" rx="3" fill="#EA4335"/><path fill="#ffffff" d="M20 6l-8 5.5L4 6v1.5l8 5.5 8-5.5V6z"/><path fill="#ffffff" opacity="0.9" d="M4 6v12h16V6l-8 5.5L4 6z" fill="none" stroke="#ffffff" stroke-width="1.5"/></svg>`,
  gmail: `<svg viewBox="0 0 24 24" width="22" height="22" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path fill="#4285F4" d="M22 6c0-.55-.22-1.05-.59-1.41L12 12.5 2.59 4.59C2.22 4.95 2 5.45 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" opacity="0.1"/><path fill="#EA4335" d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  shield: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  terminal: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
  book: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  play: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  externalLink: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  info: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  copy: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  check: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="#00ff41" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

// ================================================================
// INITIALIZATION
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectFooter();
  setupMobileNav();
  setupCookieConsent();
  initMatrixRain();
  initBackToTop();
  initScrollReveal();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);
});

// ================================================================
// SPA ROUTER
// ================================================================
function handleRoute() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryRoute = urlParams.get('p') || urlParams.get('page');
  const hash = window.location.hash.slice(1);
  const routeString = hash || queryRoute || 'home';

  const parts = routeString.split('/');
  const page = parts[0];
  const param = parts.slice(1).join('/');
  const content = document.getElementById('app-content');

  // Scroll to top on page change
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update active nav
  updateActiveNav(page);

  // Update page class
  content.className = page === 'home' ? 'home-page' : '';

  // Route to page
  switch(page) {
    case 'home': renderHomePage(); break;
    case 'blog':
      if (param) { renderArticlePage(param); }
      else { renderBlogPage(); }
      break;
    case 'labs': renderLabsPage(); break;
    case 'videos': renderVideosPage(); break;
    case 'about': renderAboutPage(); break;
    case 'contact': renderContactPage(); break;
    case 'privacy': renderPrivacyPage(); break;
    case 'terms': renderTermsPage(); break;
    case 'disclaimer': renderDisclaimerPage(); break;
    default: render404Page(); break;
  }

  // Re-init effects after render
  setTimeout(() => {
    initScrollReveal();
    initGlitchText();
  }, 100);
}

function updateActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('data-page') || '';
    if (href === page || (page === 'home' && href === 'home')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ================================================================
// HEADER
// ================================================================
function injectHeader() {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;

  placeholder.outerHTML = `
    <header class="site-header" id="site-header">
      <div class="container">
        <div class="logo-area">
          <a href="#home" title="Ethical Explorers Home">
            <img src="images/logo.png" alt="Ethical Explorers Logo" class="header-logo" width="52" height="52" loading="eager">
            <span class="logo-text">Ethical<span class="accent">Explorers</span></span>
          </a>
        </div>

        <button class="hamburger" id="nav-toggle" aria-label="Toggle Navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav-menu" id="nav-menu" role="navigation">
          <li><a href="#home" class="nav-link active" data-page="home">Home</a></li>
          <li><a href="#blog" class="nav-link" data-page="blog">Blog</a></li>
          <li><a href="#labs" class="nav-link" data-page="labs">Labs</a></li>
          <li><a href="#videos" class="nav-link" data-page="videos">Videos</a></li>
          <li><a href="#about" class="nav-link" data-page="about">About</a></li>
          <li><a href="#contact" class="nav-link" data-page="contact">Contact</a></li>
          <li>
            <a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer" class="subscribe-btn" id="nav-subscribe-btn">
              ${ICONS.youtube} Subscribe
            </a>
          </li>
        </ul>
      </div>
    </header>
  `;

  // Header scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = window.scrollY;
  });
}

// ================================================================
// FOOTER
// ================================================================
function injectFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;

  placeholder.outerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;">
              <img src="images/logo.png" alt="Ethical Explorers" style="width:40px;height:40px;border-radius:50%;border:2px solid var(--neon-purple);box-shadow:0 0 10px rgba(147,51,234,0.4);" />
              <h3 style="margin:0;">Ethical<span>Explorers</span></h3>
            </div>
            <p>A cybersecurity education platform dedicated to demystifying ethical hacking, penetration testing, network defense, and online privacy. Learn security methodologies step-by-step through our articles, practical labs, and video tutorials.</p>
            <div class="footer-status">
              <span class="status-indicator"></span>
              SEC_LEVEL: 1 | STATUS: ONLINE | NODE: ACTIVE
            </div>
            <div class="footer-social">
              <a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube Channel">${ICONS.youtube}</a>
              <a href="${SOCIAL_LINKS.telegram}" target="_blank" rel="noopener noreferrer" aria-label="Telegram" title="Telegram Community">${ICONS.telegram}</a>
              <a href="${SOCIAL_LINKS.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram Profile">${ICONS.instagram}</a>
              <a href="mailto:${CONTACT_EMAIL}" aria-label="Email" title="Direct Email: ${CONTACT_EMAIL}">${ICONS.mail}</a>
            </div>
          </div>

          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul class="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#blog">Blog Articles</a></li>
              <li><a href="#labs">Practical Labs</a></li>
              <li><a href="#videos">Video Tutorials</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Connect</h4>
            <ul class="footer-links">
              <li><a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer">YouTube Channel</a></li>
              <li><a href="${SOCIAL_LINKS.telegram}" target="_blank" rel="noopener noreferrer">Telegram Group</a></li>
              <li><a href="${SOCIAL_LINKS.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="mailto:${CONTACT_EMAIL}">Email Us</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Legal</h4>
            <ul class="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#disclaimer">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} Ethical Explorers. All rights reserved. For educational purposes only.</p>
          <div class="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#disclaimer">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// ================================================================
// MOBILE NAVIGATION
// ================================================================
function setupMobileNav() {
  function closeMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (menu) menu.classList.remove('active');
    if (toggle) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  document.addEventListener('click', (e) => {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    if (e.target.closest('#nav-toggle')) {
      const willOpen = !menu.classList.contains('active');
      menu.classList.toggle('active', willOpen);
      toggle.classList.toggle('active', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    } else if (e.target.closest('.nav-link') || e.target.closest('#nav-subscribe-btn')) {
      closeMobileNav();
    } else if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeMobileNav();
    }
  });
}

// ================================================================
// MATRIX RAIN
// ================================================================
function initMatrixRain() {
  const canvas = document.getElementById('matrix-rain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const isMobile = window.innerWidth <= 768;
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const fontSize = isMobile ? 18 : 14;
  let columns = 0;
  let drops = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  }
  resize();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 200);
  });

  let intervalId;
  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#9333ea';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  const speed = isMobile ? 90 : 50;
  intervalId = setInterval(draw, speed);

  // Pause when tab is not visible to conserve battery & performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(intervalId);
    } else {
      clearInterval(intervalId);
      intervalId = setInterval(draw, speed);
    }
  });
}

// ================================================================
// GLITCH TEXT EFFECT
// ================================================================
function initGlitchText() {
  document.querySelectorAll('.glitch-text').forEach(el => {
    if (!el.getAttribute('data-text')) {
      el.setAttribute('data-text', el.textContent);
    }
  });
}

// ================================================================
// TYPING ANIMATION
// ================================================================
function typeWriter(element, texts, speed = 60, deleteSpeed = 30, pauseTime = 2000) {
  if (!element) return;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => { isDeleting = true; type(); }, pauseTime);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 500);
      return;
    }

    setTimeout(type, isDeleting ? deleteSpeed : speed);
  }

  type();
}

// ================================================================
// COOKIE CONSENT
// ================================================================
function setupCookieConsent() {
  if (localStorage.getItem('cookieConsentGranted') === 'true') return;

  setTimeout(() => {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-inner">
        <div class="cookie-text">
          ${ICONS.info} We use cookies to analyze website traffic and optimize your experience. By clicking "Accept", you consent to our use of cookies.
          <a href="#privacy">Privacy Policy</a>
        </div>
        <div class="cookie-actions">
          <button class="btn btn-secondary" id="cookie-reject" style="padding: 0.5rem 1.2rem; font-size: 0.75rem;">Reject</button>
          <button class="btn btn-primary" id="cookie-accept" style="padding: 0.5rem 1.2rem; font-size: 0.75rem;">Accept</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add('show'), 500);

    document.getElementById('cookie-accept').addEventListener('click', () => {
      localStorage.setItem('cookieConsentGranted', 'true');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 500);
    });

    document.getElementById('cookie-reject').addEventListener('click', () => {
      localStorage.setItem('cookieConsentGranted', 'false');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 500);
    });
  }, 2000);
}

// ================================================================
// BACK TO TOP
// ================================================================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ================================================================
// SCROLL REVEAL
// ================================================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ================================================================
// TOAST NOTIFICATION
// ================================================================
function showToast(message, duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ================================================================
// PAGE RENDERERS
// ================================================================

// --- HOME PAGE ---
function renderHomePage() {
  const content = document.getElementById('app-content');
  content.className = 'home-page';

  content.innerHTML = `
    <!-- Hero Section -->
    <section class="hero" id="hero-section">
      <div class="hero-bg">
        <img src="images/cover.jpg" alt="Ethical Explorers Cybersecurity" width="1200" height="630" loading="eager">
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="status-dot"></span>
          SYSTEM OPERATIONAL
        </div>

        <img src="images/logo.png" alt="Ethical Explorers Logo" class="hero-logo" width="150" height="150" loading="eager">

        <h1 class="glitch-text" data-text="ETHICAL EXPLORERS">ETHICAL EXPLORERS</h1>

        <p class="hero-subtitle">// CYBERSECURITY EDUCATION PLATFORM</p>

        <div class="typing-text" id="hero-typing"></div>

        <p class="hero-tagline">
          Demystifying ethical hacking, penetration testing, network security, and digital privacy through expert tutorials, practical labs, and hands-on video guides.
        </p>

        <div class="hero-actions">
          <a href="#blog" class="btn btn-primary">${ICONS.shield} Explore Articles</a>
          <a href="#labs" class="btn btn-secondary">${ICONS.terminal} Practical Labs</a>
          <a href="#videos" class="btn btn-cyan">${ICONS.play} Watch Videos</a>
        </div>
      </div>
    </section>

    <!-- Terminal Simulation -->
    <div class="container">
      <div class="terminal-box reveal">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot-red"></span>
            <span class="dot-yellow"></span>
            <span class="dot-green"></span>
          </div>
          <div class="terminal-title">bash — ethicalexplorers@op_center</div>
        </div>
        <div class="terminal-content" id="terminal-logs"></div>
      </div>
    </div>

    <!-- Stats -->
    <div class="container section-padding">
      <div class="stats-bar reveal">
        <div class="stat-card">
          <span class="stat-number" id="stat-articles">0</span>
          <span class="stat-label">Articles</span>
        </div>
        <div class="stat-card">
          <span class="stat-number" id="stat-labs">15+</span>
          <span class="stat-label">Practical Labs</span>
        </div>
        <div class="stat-card">
          <span class="stat-number" id="stat-categories">10+</span>
          <span class="stat-label">Categories</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">24/7</span>
          <span class="stat-label">Learning Access</span>
        </div>
      </div>
    </div>

    <!-- Featured Articles Section -->
    <div class="container section-padding">
      <div class="section-header reveal">
        <h2>Latest Intel</h2>
        <p class="section-subtitle">> Decrypted intelligence from the cybersecurity frontline</p>
      </div>
      <div id="featured-posts-grid" class="blog-grid reveal">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">Decrypting database archives...</div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 2.5rem;" class="reveal">
        <a href="#blog" class="btn btn-secondary">View All Articles ${ICONS.externalLink}</a>
      </div>
    </div>
  `;

  // Initialize terminal
  initCyberTerminal();

  // Initialize typing effect
  const typingEl = document.getElementById('hero-typing');
  if (typingEl) {
    typeWriter(typingEl, [
      '> We Explore. We Learn. We Secure.',
      '> Exploiting Limits. Building Knowledge.',
      '> Securing Tomorrow, One Exploit at a Time.',
      '> From Zero to Hacker — The Ethical Way.',
      '> nmap -sV target... Scanning...'
    ]);
  }

  // Load featured posts
  loadFeaturedPosts();

  // Update document title
  document.title = `${SITE_NAME} | Cybersecurity Blog, Ethical Hacking Tutorials & Practical Labs`;
}

function loadFeaturedPosts() {
  fetch('data/posts.json')
    .then(r => r.json())
    .then(posts => {
      const grid = document.getElementById('featured-posts-grid');
      if (!grid) return;

      // Update article count stat
      const statEl = document.getElementById('stat-articles');
      if (statEl) statEl.textContent = posts.length + '+';

      // Show latest 6 posts
      const featured = posts.slice(0, 6);
      grid.innerHTML = featured.map(post => createBlogCard(post)).join('');
    })
    .catch(() => {
      const grid = document.getElementById('featured-posts-grid');
      if (grid) grid.innerHTML = '<div class="empty-state"><h3>No articles found</h3><p>Check back soon for new content.</p></div>';
    });
}

// --- CYBER TERMINAL ---
function initCyberTerminal() {
  const terminal = document.getElementById('terminal-logs');
  if (!terminal) return;

  const logs = [
    { type: 'info', text: '> Initializing Ethical Explorers secure interface...' },
    { type: 'success', text: '> Connection to node ethicalexplorers.github.io [ESTABLISHED]' },
    { type: 'info', text: '> Loading dynamic blog modules...' },
    { type: 'success', text: '> Database sync: OK. Detected latest posts.' },
    { type: 'warn', text: '> DISCLAIMER: Educational usage mode ENABLED.' },
    { type: 'info', text: '> nmap -sV 192.168.1.0/24 -- Scanning network...' },
    { type: 'success', text: '> Vulnerability scan: COMPLETE. 0 threats detected.' },
    { type: 'info', text: '> System diagnostics complete. Readiness: 100%' },
    { type: 'success', text: '> Welcome, Explorer. Access Granted.' }
  ];

  let delay = 0;
  logs.forEach(log => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      let cls = 'cmd-info';
      if (log.type === 'success') cls = 'cmd-success';
      if (log.type === 'warn') cls = 'cmd-warn';
      if (log.type === 'error') cls = 'cmd-error';
      line.innerHTML = `<span class="${cls}">${log.text}</span>`;
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
    }, delay);
    delay += Math.floor(Math.random() * 600) + 300;
  });

  // Periodic logs
  setInterval(() => {
    const msgs = [
      '> Performing firewall integrity check... [OK]',
      '> Updating threat intelligence feeds...',
      '> Monitoring port 443 for TLS anomalies...',
      '> Syncing subscriber stats... [OK]',
      '> Heartbeat: ethicalexplorers.github.io [ALIVE]',
      '> Running IDS/IPS rule validation...',
      '> Check out our latest articles for PoC demos!'
    ];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="cmd-info">${msg}</span>`;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;

    if (terminal.childNodes.length > 25) {
      terminal.removeChild(terminal.firstChild);
    }
  }, 6000);
}

// --- ABOUT PAGE ---
function renderAboutPage() {
  const content = document.getElementById('app-content');
  document.title = `About Us | ${SITE_NAME}`;

  content.innerHTML = `
    <div class="container section-padding page-transition">
      <div class="about-section">
        <div class="about-hero reveal">
          <img src="images/logo.png" alt="Ethical Explorers" class="about-logo" width="120" height="120">
          <h1 class="glitch-text" data-text="ABOUT US" style="font-size: clamp(1.5rem, 4vw, 2.5rem);">ABOUT US</h1>
          <p class="hero-subtitle">// WHO WE ARE & WHAT WE DO</p>
        </div>

        <div class="about-content reveal">
          <p>Welcome to <strong>Ethical Explorers</strong> — your gateway into the world of cybersecurity and ethical hacking. We are a passionate community of security researchers, penetration testers, and cybersecurity enthusiasts dedicated to making the digital world safer through education.</p>

          <h3>🎯 Our Mission</h3>
          <p>Our mission is to democratize cybersecurity knowledge. We believe everyone should have access to high-quality security education, whether you're a complete beginner or an experienced professional looking to sharpen your skills.</p>

          <h3>🛡️ What We Cover</h3>
          <ul>
            <li><strong>Ethical Hacking & Penetration Testing</strong> — Learn to think like a hacker and defend like a professional</li>
            <li><strong>Network Security</strong> — Master firewalls, IDS/IPS, VPNs, and network defense strategies</li>
            <li><strong>Web Application Security</strong> — Discover and fix OWASP Top 10 vulnerabilities</li>
            <li><strong>Digital Privacy & OSINT</strong> — Protect your online identity and master open-source intelligence</li>
            <li><strong>Kali Linux & Security Tools</strong> — Hands-on tutorials with industry-standard tools</li>
            <li><strong>CTF Challenges & Bug Bounty</strong> — Sharpen your skills with real-world challenges</li>
            <li><strong>Malware Analysis</strong> — Understand how malware works and how to defend against it</li>
          </ul>

          <h3>📺 Our Platforms</h3>
          <p>We share our knowledge across multiple platforms to reach as many aspiring security professionals as possible:</p>
          <ul>
            <li><strong>This Website</strong> — In-depth articles, tutorials, and practical labs</li>
            <li><strong>YouTube</strong> — Video walkthroughs, tool demos, and CTF solutions</li>
            <li><strong>Instagram</strong> — Quick tips, infographics, and community updates</li>
            <li><strong>Telegram</strong> — Real-time discussions, resource sharing, and community support</li>
          </ul>

          <h3>⚠️ Responsible Disclosure</h3>
          <p>All content on Ethical Explorers is strictly for <strong>educational purposes</strong>. We advocate for responsible and ethical use of cybersecurity knowledge. Always obtain proper authorization before testing any systems. Unauthorized access to computer systems is illegal and unethical.</p>

          <div style="text-align: center; margin-top: 2.5rem;">
            <a href="#contact" class="btn btn-primary">${ICONS.mail} Get in Touch</a>
            <a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">${ICONS.youtube} Subscribe</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- CONTACT PAGE ---
function renderContactPage() {
  const content = document.getElementById('app-content');
  document.title = `Contact Us | ${SITE_NAME}`;

  content.innerHTML = `
    <div class="container section-padding page-transition">
      <div class="contact-section">
        <div class="section-header reveal">
          <h1 class="glitch-text" data-text="GET IN TOUCH" style="font-size: clamp(1.6rem, 4vw, 2.6rem);">GET IN TOUCH</h1>
          <p class="section-subtitle">> Connect with Ethical Explorers for inquiries, business & community</p>
        </div>

        <!-- Primary Business & Inquiries Card -->
        <div class="email-contact-box reveal">
          <div class="email-header">
            <div class="email-icon-wrapper">
              ${ICONS.mail}
            </div>
            <div>
              <h3>Official Business & General Contact</h3>
              <p>For sponsorship, collaborations, technical questions, or business inquiries:</p>
            </div>
          </div>

          <div class="email-address-bar">
            <a href="mailto:${CONTACT_EMAIL}" class="email-text" id="contact-email-link">
              ${CONTACT_EMAIL}
            </a>
            <div class="email-actions">
              <button class="btn btn-primary btn-copy-email" id="btn-copy-email" title="Copy email address">
                <span id="copy-icon">${ICONS.copy}</span>
                <span id="copy-text">Copy</span>
              </button>
              <a href="mailto:${CONTACT_EMAIL}" class="btn btn-secondary" style="padding: 0.55rem 1.2rem; font-size: 0.8rem;">
                Send Email
              </a>
            </div>
          </div>

          <div class="contact-specs">
            <div class="spec-item">
              <span class="spec-label">STATUS</span>
              <span class="spec-val" style="color: var(--neon-green)">● ONLINE</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">AVG RESPONSE</span>
              <span class="spec-val">Within 24-48 Hours</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">ENCRYPTION</span>
              <span class="spec-val">TLS Verified</span>
            </div>
          </div>
        </div>

        <div class="section-header reveal" style="margin-top: 3.5rem; margin-bottom: 2rem;">
          <h2>Official Social Channels</h2>
          <p class="section-subtitle">> Join our community & follow our cybersecurity tutorials</p>
        </div>

        <div class="social-connect-grid reveal">
          <a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer" class="social-card youtube-card">
            <div class="social-card-icon">${ICONS.youtube}</div>
            <div class="social-info">
              <div class="social-name">YouTube Channel</div>
              <div class="social-handle">@ethicalexplorers18</div>
              <div class="social-desc">Hacking guides, tool tutorials & live labs</div>
            </div>
            <span class="social-arrow">→</span>
          </a>

          <a href="${SOCIAL_LINKS.telegram}" target="_blank" rel="noopener noreferrer" class="social-card telegram-card">
            <div class="social-card-icon">${ICONS.telegram}</div>
            <div class="social-info">
              <div class="social-name">Telegram Community</div>
              <div class="social-handle">@ethicalexplorers</div>
              <div class="social-desc">Daily cybersecurity feeds, alerts & notes</div>
            </div>
            <span class="social-arrow">→</span>
          </a>

          <a href="${SOCIAL_LINKS.instagram}" target="_blank" rel="noopener noreferrer" class="social-card instagram-card">
            <div class="social-card-icon">${ICONS.instagram}</div>
            <div class="social-info">
              <div class="social-name">Instagram Page</div>
              <div class="social-handle">@ethical_explorers_18</div>
              <div class="social-desc">Infographics, tips & community updates</div>
            </div>
            <span class="social-arrow">→</span>
          </a>

          <a href="mailto:${CONTACT_EMAIL}" class="social-card email-card">
            <div class="social-card-icon">${ICONS.mail}</div>
            <div class="social-info">
              <div class="social-name">Direct Email</div>
              <div class="social-handle">${CONTACT_EMAIL}</div>
              <div class="social-desc">Direct line for business, partnerships & press</div>
            </div>
            <span class="social-arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  `;

  // Copy email button event
  const copyBtn = document.getElementById('btn-copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
        const copyIcon = document.getElementById('copy-icon');
        const copyText = document.getElementById('copy-text');
        if (copyIcon) copyIcon.innerHTML = ICONS.check;
        if (copyText) copyText.textContent = 'Copied!';
        showToast('Email copied to clipboard: ' + CONTACT_EMAIL);
        setTimeout(() => {
          if (copyIcon) copyIcon.innerHTML = ICONS.copy;
          if (copyText) copyText.textContent = 'Copy';
        }, 2500);
      }).catch(() => {
        showToast('Email: ' + CONTACT_EMAIL);
      });
    });
  }
}

// --- PRIVACY POLICY ---
function renderPrivacyPage() {
  const content = document.getElementById('app-content');
  document.title = `Privacy Policy | ${SITE_NAME}`;

  content.innerHTML = `
    <div class="container section-padding page-transition">
      <div class="legal-page reveal">
        <div class="breadcrumbs">
          <a href="#home">Home</a><span class="separator">/</span><span>Privacy Policy</span>
        </div>
        <h1>Privacy Policy</h1>
        <div class="legal-updated">Last updated: August 31, 2026</div>
        <div class="legal-content">
          <p>At Ethical Explorers ("we," "us," or "our"), accessible from <a href="${SITE_URL}">${SITE_URL}</a>, we are committed to protecting the privacy of our visitors. This Privacy Policy explains how we collect, use, and protect your personal information.</p>

          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li><strong>Usage Data:</strong> We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, pages viewed, and the date/time of your visit.</li>
            <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to track activity and hold certain information. You can manage your cookie preferences through your browser settings.</li>
            <li><strong>Contact Information:</strong> If you contact us via the contact form, we collect the name, email address, and message content you provide.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our website and content</li>
            <li>Analyze website traffic and usage patterns using Google Analytics</li>
            <li>Respond to your inquiries and communications</li>
            <li>Detect and prevent technical issues or security threats</li>
            <li>Comply with applicable laws and regulations</li>
          </ul>

          <h2>3. Google Analytics</h2>
          <p>We use Google Analytics to understand how visitors interact with our website. Google Analytics uses cookies to collect information about your use of the website. This information is transmitted to and stored by Google. For more information, see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</p>

          <h2>4. Third-Party Services</h2>
          <p>Our website may contain links to external sites operated by third parties. We are not responsible for the privacy practices of these sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>

          <h2>5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict the processing of your data</li>
            <li>Data portability</li>
          </ul>

          <h2>7. Children's Privacy</h2>
          <p>Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>

          <h2>8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us through our <a href="#contact">contact page</a> or reach us on our <a href="${SOCIAL_LINKS.telegram}" target="_blank" rel="noopener noreferrer">Telegram channel</a>.</p>
        </div>
      </div>
    </div>
  `;
}

// --- TERMS & CONDITIONS ---
function renderTermsPage() {
  const content = document.getElementById('app-content');
  document.title = `Terms & Conditions | ${SITE_NAME}`;

  content.innerHTML = `
    <div class="container section-padding page-transition">
      <div class="legal-page reveal">
        <div class="breadcrumbs">
          <a href="#home">Home</a><span class="separator">/</span><span>Terms & Conditions</span>
        </div>
        <h1>Terms & Conditions</h1>
        <div class="legal-updated">Last updated: August 31, 2026</div>
        <div class="legal-content">
          <p>By accessing and using the Ethical Explorers website (<a href="${SITE_URL}">${SITE_URL}</a>), you accept and agree to be bound by these Terms and Conditions.</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By using this website, you acknowledge that you have read, understood, and agree to comply with these terms. If you do not agree, please do not use this website.</p>

          <h2>2. Educational Purpose</h2>
          <p>All content on this website, including articles, tutorials, labs, and videos, is provided strictly for <strong>educational and informational purposes</strong>. The information is intended to help security professionals, students, and enthusiasts learn about cybersecurity in a legal and ethical manner.</p>

          <h2>3. Responsible Use</h2>
          <p>You agree to use the knowledge gained from this website responsibly and ethically. Specifically:</p>
          <ul>
            <li>You will only test systems and networks that you own or have explicit written permission to test</li>
            <li>You will not use any information to engage in unauthorized access, hacking, or any illegal activities</li>
            <li>You will comply with all applicable local, national, and international laws</li>
            <li>You understand that unauthorized access to computer systems is a criminal offense</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, images, and software, is the property of Ethical Explorers or its content creators and is protected by copyright and intellectual property laws.</p>

          <h2>5. Limitation of Liability</h2>
          <p>Ethical Explorers shall not be held responsible for any damages, losses, or legal consequences arising from the misuse of information provided on this website. Users are solely responsible for their actions and the application of the knowledge gained.</p>

          <h2>6. External Links</h2>
          <p>This website may contain links to third-party websites. We do not control or endorse the content, privacy policies, or practices of third-party sites and assume no responsibility for them.</p>

          <h2>7. Content Accuracy</h2>
          <p>While we strive to provide accurate and up-to-date information, we make no warranties or representations about the completeness, accuracy, or reliability of the content. The cybersecurity landscape evolves rapidly, and information may become outdated.</p>

          <h2>8. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the modified terms.</p>

          <h2>9. Governing Law</h2>
          <p>These terms are governed by applicable laws. Any disputes arising from the use of this website will be resolved under the appropriate jurisdiction.</p>

          <h2>10. Contact</h2>
          <p>For questions regarding these Terms & Conditions, please visit our <a href="#contact">contact page</a>.</p>
        </div>
      </div>
    </div>
  `;
}

// --- DISCLAIMER ---
function renderDisclaimerPage() {
  const content = document.getElementById('app-content');
  document.title = `Disclaimer | ${SITE_NAME}`;

  content.innerHTML = `
    <div class="container section-padding page-transition">
      <div class="legal-page reveal">
        <div class="breadcrumbs">
          <a href="#home">Home</a><span class="separator">/</span><span>Disclaimer</span>
        </div>
        <h1>Disclaimer</h1>
        <div class="legal-updated">Last updated: August 31, 2026</div>
        <div class="legal-content">
          <h2>⚠️ Educational Purpose Only</h2>
          <p>The information provided on the Ethical Explorers website, YouTube channel, and all associated social media platforms is intended <strong>solely for educational purposes</strong>. The content is designed to help individuals learn about cybersecurity, ethical hacking, penetration testing, and digital security in a legal and responsible manner.</p>

          <h2>No Encouragement of Illegal Activities</h2>
          <p>We do <strong>not</strong> encourage, promote, or condone any form of:</p>
          <ul>
            <li>Unauthorized access to computer systems or networks</li>
            <li>Data theft or privacy violations</li>
            <li>Distribution of malware or malicious software</li>
            <li>Any other illegal or unethical activities</li>
          </ul>

          <h2>User Responsibility</h2>
          <p>By accessing our content, you acknowledge and agree that:</p>
          <ul>
            <li>You are solely responsible for your actions and how you apply the knowledge gained</li>
            <li>You will only practice security testing on systems you own or have explicit authorization to test</li>
            <li>You will comply with all applicable laws in your jurisdiction</li>
            <li>Ethical Explorers is not responsible for any misuse of the information provided</li>
          </ul>

          <h2>No Professional Advice</h2>
          <p>The content on this website does not constitute professional cybersecurity advice. For specific security concerns or professional assessments, consult a qualified cybersecurity professional.</p>

          <h2>Tool Demonstrations</h2>
          <p>When we demonstrate security tools (such as Nmap, Burp Suite, Metasploit, SQLMap, etc.), these demonstrations are conducted in controlled lab environments or with proper authorization. Replicating these tests on systems without authorization is illegal.</p>

          <h2>Accuracy of Information</h2>
          <p>While we endeavor to keep information current and accurate, we make no guarantees about the completeness, reliability, or suitability of the content. Cybersecurity is a rapidly evolving field, and techniques may change over time.</p>

          <h2>Contact</h2>
          <p>If you have questions or concerns about this disclaimer, please reach out through our <a href="#contact">contact page</a>.</p>
        </div>
      </div>
    </div>
  `;
}

// --- 404 PAGE ---
function render404Page() {
  const content = document.getElementById('app-content');
  document.title = `404 — Not Found | ${SITE_NAME}`;

  content.innerHTML = `
    <div class="container section-padding page-transition" style="text-align: center; min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <h1 class="glitch-text" data-text="404" style="font-size: 6rem; margin-bottom: 1rem;">404</h1>
      <p style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--neon-red); margin-bottom: 0.5rem;">> ACCESS DENIED</p>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">The page you're looking for doesn't exist or has been moved.</p>
      <a href="#home" class="btn btn-primary">${ICONS.arrowLeft} Return to Base</a>
    </div>
  `;
}

// ================================================================
// BLOG CARD COMPONENT (used by both app.js and blog.js)
// ================================================================
function createBlogCard(post) {
  const fallbackImg = 'images/cover.jpg';
  return `
    <article class="blog-card ${post.featured ? 'featured' : ''}" onclick="window.location.hash='blog/${post.id}'">
      <div class="blog-card-img">
        <img src="${post.image || fallbackImg}" alt="${post.title}" loading="lazy" onerror="this.src='${fallbackImg}'">
        <span class="card-category-badge">${post.category}</span>
      </div>
      <div class="blog-card-body">
        <h3>${post.title}</h3>
        <p class="excerpt">${post.excerpt}</p>
        <div class="blog-card-tags">
          ${(post.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="blog-card-meta">
          <span class="meta-date">📅 ${post.date}</span>
          <span class="meta-read-time">${post.readTime || '5 min read'}</span>
        </div>
      </div>
    </article>
  `;
}
