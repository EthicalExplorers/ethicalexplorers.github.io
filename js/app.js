/**
 * Ethical Explorers Website Core App JS
 * Dynamic Template Injector & Global UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Header & Footer
  injectHeader();
  injectFooter();
  
  // 2. Setup Mobile Navigation Drawer
  setupMobileNav();
  
  // 3. Setup Cookie Consent Banner
  setupCookieConsent();

  // 4. Start Simulated Cyber Terminal if on home page
  initCyberTerminal();
});

// SVG Icons Constants
const ICONS = {
  shield: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  youtube: `<svg viewBox="0 0 24 24" width="16" height="16" style="display: inline-block; vertical-align: middle; width: 16px; height: 16px; min-width: 16px; min-height: 16px;"><path fill="#ff0000" style="fill: #ff0000 !important;" d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.03 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.97-.502-5.837z"/><path fill="#ffffff" style="fill: #ffffff !important;" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.485-.18.6-.54 1.082-.9 1.141-.782.12-1.383-.359-2.141-.839-.778-.492-1.218-.797-1.97-.1.359.359.721 1.139 1.259 1.677.3.3.419.658.3.9-.18.3-.54.419-.9.36-.782-.12-1.623-.539-2.584-1.198-1.503-1.018-2.645-2.096-3.424-3.235-.419-.6-.6-.96-.42-1.14.18-.18.539-.3 1.078-.54 1.078-.479 2.583-.9 4.5-.78.18 0 .419.06.479.18.06.12.06.3-.06.42-.12.18-.419.3-.9.419-.9.24-1.74.479-2.52.719-.48.18-.84.42-.9.66 0 .06 0 .12.06.18.12.18.42.3.9.48 1.198.479 2.157.9 2.876.9.36 0 .66-.06.9-.18.42-.18.72-.54.9-.96.36-1.08.72-2.399 1.02-3.776.12-.42 0-.78-.18-.9-.18-.12-.48-.12-.78-.06-.48.12-1.26.42-2.339.9-.48.24-.96.48-1.439.72-.3.12-.54.18-.72.06-.18-.12-.3-.36-.18-.6.18-.3.72-.6 1.618-1.018 2.039-.959 3.539-1.558 4.498-1.798.54-.12 1.078-.12 1.438.12.36.18.48.54.42.9z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  search: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  share: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  warning: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  info: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
};

// Social Media Links mapping
const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/ethical_explorers_18?igsh=MTduc2hld21hMHFuOQ==',
  telegram: 'https://t.me/ethicalexplorers',
  youtube: 'https://youtube.com/@ethicalexplorers18?si=FzF1VJSZ7v196ceF'
};

// 1. Inject Header Dynamic Template
function injectHeader() {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;
  
  const currentPath = window.location.pathname;
  const isHome = currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '';
  const isBlog = currentPath.endsWith('blog.html');
  const isAbout = currentPath.endsWith('about.html');
  const isContact = currentPath.endsWith('contact.html');
  
  placeholder.outerHTML = `
    <header class="site-header">
      <div class="container">
        <div class="logo-area">
          <a href="index.html">
            <img src="images/logo-avatar.png" alt="Ethical Explorers Logo" class="header-logo">
            <span>Ethical<span class="accent">Explorers</span></span>
          </a>
        </div>
        
        <button class="hamburger" id="nav-toggle" aria-label="Toggle Navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <ul class="nav-menu" id="nav-menu">
          <li><a href="index.html" class="nav-link ${isHome ? 'active' : ''}">Home</a></li>
          <li><a href="index.html#blogs" class="nav-link ${isBlog ? 'active' : ''}">Blogs</a></li>
          <li><a href="about.html" class="nav-link ${isAbout ? 'active' : ''}">About Us</a></li>
          <li><a href="contact.html" class="nav-link ${isContact ? 'active' : ''}">Contact</a></li>
          <li>
            <a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer" class="subscribe-btn">
              ${ICONS.youtube}
              Subscribe
            </a>
          </li>
        </ul>
      </div>
    </header>
  `;
}

// 2. Inject Footer Dynamic Template
function injectFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;
  
  placeholder.outerHTML = `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <h3>Ethical<span>Explorers</span></h3>
            <p>A specialized cybersecurity educational platform dedicating to demystifying white-hat hacking, penetration testing, network defense, and online privacy. Learn security methodologies step-by-step.</p>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
              SEC_LEVEL: 1 | STATUS: ONLINE
            </div>
          </div>
          
          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="index.html#blogs">Cyber Articles</a></li>
              <li><a href="about.html">About The Channel</a></li>
              <li><a href="contact.html">Get in Touch</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Connect With Us</h4>
            <ul class="footer-links">
              <li><a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer">YouTube Channel</a></li>
              <li><a href="${SOCIAL_LINKS.instagram}" target="_blank" rel="noopener noreferrer">Instagram Profile</a></li>
              <li><a href="${SOCIAL_LINKS.telegram}" target="_blank" rel="noopener noreferrer">Telegram Channel</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Compliance</h4>
            <ul class="footer-links">
              <li><a href="privacy.html">Privacy Policy</a></li>
              <li><a href="terms.html">Terms & Conditions</a></li>
              <li><a href="disclaimer.html">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} Ethical Explorers. All rights reserved. Designed for educational cybersecurity learning.</p>
          <div class="footer-compliance-links">
            <a href="privacy.html">Privacy</a>
            <span>|</span>
            <a href="terms.html">Terms</a>
            <span>|</span>
            <a href="disclaimer.html">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// 3. Mobile Navigation Hamburger Handler
function setupMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  
  if (!toggleBtn || !menu) return;
  
  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    
    // Animate hamburger lines
    const spans = toggleBtn.querySelectorAll('span');
    if (menu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('active');
      const spans = toggleBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

// 4. GDPR & AdSense-Compliant Cookie Consent Popup
function setupCookieConsent() {
  // Check if consent already granted
  if (localStorage.getItem('cookieConsentGranted') === 'true') {
    return;
  }
  
  // Create cookie consent element dynamically
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-title">
      ${ICONS.info}
      Cookie Consent Declaration
    </div>
    <div class="cookie-text">
      We use cookies to personalize content, social media integrations, and to analyze website traffic. We also share information about your use of our site with our social media and advertising partners (such as Google AdSense), who may combine it with other information that you've provided to them. By clicking "Accept All", you agree to our cookie policies. Read our <a href="privacy.html">Privacy Policy</a> to learn more.
    </div>
    <div class="cookie-actions">
      <button class="btn btn-secondary cookie-btn" id="cookie-reject">Reject</button>
      <button class="btn btn-primary cookie-btn" id="cookie-accept">Accept All</button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Show banner with delay
  setTimeout(() => {
    banner.classList.add('show');
  }, 1500);
  
  // Accept button handler
  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookieConsentGranted', 'true');
    banner.classList.remove('show');
    // Initialize AdSense here if dynamically loading
    triggerAdSenseLoading();
  });
  
  // Reject button handler
  document.getElementById('cookie-reject').addEventListener('click', () => {
    localStorage.setItem('cookieConsentGranted', 'false');
    banner.classList.remove('show');
  });
}

function triggerAdSenseLoading() {
  console.log('AdSense initialized after user consent.');
  // You would dynamically append Google AdSense script here if needed:
  // (adsbygoogle = window.adsbygoogle || []).push({});
}

// 5. Simulated Cybersecurity Terminal on Homepage
function initCyberTerminal() {
  const terminal = document.getElementById('terminal-logs');
  if (!terminal) return;
  
  const logs = [
    { type: 'info', text: 'Initializing Ethical Explorers secure interface...' },
    { type: 'success', text: 'Connection to node ethicalexplorers.github.io established.' },
    { type: 'info', text: 'Loading dynamic blog modules...' },
    { type: 'success', text: 'Database sync: OK. Detected latest posts.' },
    { type: 'warn', text: 'Disclaimer Active: Educational usage mode enabled.' },
    { type: 'info', text: 'Scanning network protocols for unauthorized access...' },
    { type: 'success', text: 'IP/Port status: Securing endpoints...' },
    { type: 'info', text: 'System diagnostics complete. Readiness 100%.' }
  ];
  
  let delay = 0;
  logs.forEach((log) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      
      let prefix = '[i] ';
      let colorClass = '';
      
      if (log.type === 'success') {
        prefix = '[+] ';
        colorClass = 'style="color: var(--accent-green)"';
      } else if (log.type === 'warn') {
        prefix = '[!] ';
        colorClass = 'style="color: var(--accent-pink)"';
      } else {
        prefix = '[-] ';
        colorClass = 'style="color: var(--accent-cyan)"';
      }
      
      line.innerHTML = `<span ${colorClass}>${prefix}${log.text}</span>`;
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
    }, delay);
    delay += Math.floor(Math.random() * 800) + 400;
  });
  
  // Keep adding periodic mock status lines
  setInterval(() => {
    const periodicLogs = [
      'Performing periodic firewall integrity tests... [OK]',
      'Updating cybersecurity threat feeds...',
      'Syncing subscriber statistics with YouTube API... [OK]',
      'Listening for incoming cyber-educational requests...',
      'Warning: Unauthorized intrusions will be logged and analyzed.',
      'Check out our recent articles for active proof-of-concepts.'
    ];
    
    const randomLog = periodicLogs[Math.floor(Math.random() * periodicLogs.length)];
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span style="color: var(--text-secondary)">[*] ${randomLog}</span>`;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    
    // Prune logs if too long
    if (terminal.childNodes.length > 30) {
      terminal.removeChild(terminal.firstChild);
    }
  }, 7000);
}

// Global utility for sidebar components loading
function renderSidebarWidgets(placeholderId, recentPosts = []) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;
  
  // Format recent posts HTML
  let recentPostsHTML = '';
  if (recentPosts.length === 0) {
    recentPostsHTML = '<div class="recent-post-date" style="padding: 10px 0;">No articles available</div>';
  } else {
    // Show top 3 recent posts
    const displayPosts = recentPosts.slice(0, 3);
    displayPosts.forEach(post => {
      recentPostsHTML += `
        <div class="recent-post-item">
          <div class="recent-post-thumb">
            <img src="${post.image}" alt="${post.title}" onerror="this.src='images/hero-cyber.jpg'">
          </div>
          <div class="recent-post-info">
            <a href="blog.html?id=${post.id}" class="recent-post-link">${post.title}</a>
            <span class="recent-post-date">${post.date}</span>
          </div>
        </div>
      `;
    });
  }
  
  placeholder.outerHTML = `
    <aside>
      <!-- YouTube Channel Details -->
      <div class="widget channel-widget">
        <img src="images/logo-avatar.png" alt="Ethical Explorers Avatar" class="avatar" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=ethicalexplorers'">
        <div class="channel-name">Ethical Explorers</div>
        <div class="channel-subs">Cybersecurity & Ethical Hacking</div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
          Welcome to the digital operations base of Ethical Explorers. We share tutorials on networking, kali linux, security testing, and privacy tools.
        </p>
        <a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-primary" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 0.6rem;">
          ${ICONS.youtube} Subscribe on YouTube
        </a>
      </div>
      
      <!-- AdSense Top Widget -->
      <div class="widget adsense-widget">
        <div class="adsense-mock-placeholder">
          <!-- Google AdSense Native Integration Block -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="3" width="20" height="18" rx="2" stroke-linejoin="round"/>
            <line x1="2" y1="9" x2="22" y2="9" />
            <line x1="8" y1="9" x2="8" y2="21" />
            <circle cx="15" cy="15" r="2" />
          </svg>
          <div>Google AdSense Unit Placeholder</div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 5px;">Responsive Ad Unit (Auto-sizing)</div>
        </div>
      </div>
      
      <!-- Social Media Links -->
      <div class="widget">
        <h3 class="widget-title">Social Operations</h3>
        <div class="social-links">
          <a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer" class="social-link-item youtube">
            ${ICONS.youtube}
            <span>YouTube Channel</span>
          </a>
          <a href="${SOCIAL_LINKS.telegram}" target="_blank" rel="noopener noreferrer" class="social-link-item telegram">
            ${ICONS.telegram}
            <span>Telegram Channel</span>
          </a>
          <a href="${SOCIAL_LINKS.instagram}" target="_blank" rel="noopener noreferrer" class="social-link-item instagram">
            ${ICONS.instagram}
            <span>Instagram Page</span>
          </a>
        </div>
      </div>
      
      <!-- Recent Posts Widget -->
      <div class="widget">
        <h3 class="widget-title">Recent Intelligence</h3>
        <div class="recent-post-list">
          ${recentPostsHTML}
        </div>
      </div>
      
      <!-- Disclaimer Notification -->
      <div class="widget" style="border-color: rgba(255, 0, 85, 0.15); background: rgba(255, 0, 85, 0.01);">
        <h3 class="widget-title" style="color: var(--accent-pink);">Operational Notice</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.75rem;">
          All tutorials, methodologies, and tool demonstrations featured here are provided strictly for educational and authorized penetration testing audits.
        </p>
        <a href="disclaimer.html" style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--accent-pink); text-decoration: underline;">
          Read Cyber Disclaimer
        </a>
      </div>
    </aside>
  `;
}
