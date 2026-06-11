/**
 * Ethical Explorers Website Blog Engine
 * Handles fetching, rendering, searching, filtering, and parsing blog posts
 */

// Global state for posts
let allPosts = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchBlogData();
});

// Fetch blog database
async function fetchBlogData() {
  const container = document.getElementById('blog-posts-grid') || document.getElementById('post-detail-content');
  
  try {
    const response = await fetch('data/posts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allPosts = await response.json();
    
    // Sort posts by date descending
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render sidebar (always present if there's a sidebar-placeholder)
    if (document.getElementById('sidebar-placeholder')) {
      renderSidebarWidgets('sidebar-placeholder', allPosts);
    }
    
    // Determine page action
    if (document.getElementById('blog-posts-grid')) {
      // We are on index.html (Listing page)
      initListingPage();
    } else if (document.getElementById('post-detail-content')) {
      // We are on blog.html (Viewer page)
      initViewerPage();
    }
  } catch (error) {
    console.error('Failed to load blog database:', error);
    if (container) {
      container.innerHTML = `
        <div class="blog-loader-msg" style="border-color: var(--accent-pink); color: var(--accent-pink);">
          <div class="loading-spinner" style="border-top-color: var(--accent-pink); animation: none; border-color: rgba(255, 0, 85, 0.1);"></div>
          <h3>[CRITICAL ERROR: DEC-FAIL]</h3>
          <p style="margin-top: 8px;">Failed to fetch the intelligence database. Please check connection protocols or configuration files.</p>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   1. BLOG LISTING PAGE LOGIC (index.html)
   ========================================================================== */
let activeCategory = 'All';
let searchQuery = '';

function initListingPage() {
  renderCategoryFilters();
  renderPostsGrid();
  
  // Set up search handler
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderPostsGrid();
    });
  }
}

// Generate category filters dynamically from posts database
function renderCategoryFilters() {
  const filterContainer = document.getElementById('category-filters');
  if (!filterContainer) return;
  
  // Extract unique categories
  const categories = ['All'];
  allPosts.forEach(post => {
    if (post.category && !categories.includes(post.category)) {
      categories.push(post.category);
    }
  });
  
  // Render buttons
  filterContainer.innerHTML = categories.map(cat => `
    <button class="filter-chip ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');
  
  // Add click handlers
  filterContainer.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active from all
      filterContainer.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      
      // Add active to clicked
      e.target.classList.add('active');
      activeCategory = e.target.dataset.category;
      
      renderPostsGrid();
    });
  });
}

// Filter and render posts grid
function renderPostsGrid() {
  const grid = document.getElementById('blog-posts-grid');
  if (!grid) return;
  
  // Filter posts
  const filtered = allPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery))) ||
      (post.content && post.content.toLowerCase().includes(searchQuery));
      
    return matchesCategory && matchesSearch;
  });
  
  // Render grid
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="blog-loader-msg">
        <h3>[ZERO MATCHES DETECTED]</h3>
        <p style="margin-top: 8px;">No intelligence files match your criteria "${searchQuery || activeCategory}". Try resetting your filters.</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filtered.map(post => `
    <article class="blog-card">
      <div class="blog-card-img-wrapper">
        <img src="${post.image}" alt="${post.title}" onerror="this.src='images/hero-cyber.jpg'">
        <span class="blog-card-category">${post.category}</span>
      </div>
      
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span>${post.date}</span>
          <span>&bull;</span>
          <span>${post.readTime || '5 min read'}</span>
        </div>
        
        <h3 class="blog-card-title">
          <a href="blog.html?id=${post.id}">${post.title}</a>
        </h3>
        
        <p class="blog-card-excerpt">${post.excerpt}</p>
        
        <div class="blog-card-footer">
          <span>By ${post.author || 'Ethical Explorers'}</span>
          <a href="blog.html?id=${post.id}" class="blog-card-more">Read File &rarr;</a>
        </div>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   2. BLOG VIEWER PAGE LOGIC (blog.html)
   ========================================================================== */
function initViewerPage() {
  const container = document.getElementById('post-detail-content');
  if (!container) return;
  
  // Parse Query Parameters
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  
  if (!postId) {
    renderErrorPage(container, 'Intelligence ID Required', 'Please provide a valid file ID to load security files.');
    return;
  }
  
  const post = allPosts.find(p => p.id === postId);
  
  if (!post) {
    renderErrorPage(container, 'Intelligence File Not Found [404]', `The file ID "${postId}" could not be located in our database archives. It may have been archived or removed.`);
    return;
  }
  
  // Update document title for SEO
  document.title = `${post.title} | Ethical Explorers Cybersecurity Blog`;
  
  // Render Blog Post Content
  renderBlogPost(container, post);
}

function renderBlogPost(container, post) {
  // Render HTML Structure
  container.innerHTML = `
    <article class="post-detail">
      <div class="post-header">
        <span class="post-category-tag">${post.category}</span>
        <h1 class="post-title">${post.title}</h1>
        
        <div class="post-meta-strip">
          <div>DATE: ${post.date}</div>
          <div>AUTHOR: ${post.author || 'Ethical Explorers'}</div>
          <div>READ_TIME: ${post.readTime || '5 min read'}</div>
          <div>STATUS: COMPLETED</div>
        </div>
      </div>
      
      <div class="post-hero-image">
        <img src="${post.image}" alt="${post.title}" onerror="this.src='images/hero-cyber.jpg'">
      </div>
      
      <!-- AdSense Inline Ad -->
      <div class="widget adsense-widget" style="min-height: 100px; margin-bottom: 2rem; padding: 1rem;">
        <div class="adsense-mock-placeholder" style="padding: 0.5rem;">
          <div style="font-size: 0.75rem; color: var(--accent-cyan); font-family: var(--font-mono); margin-bottom: 4px;">[GOOGLE ADSENSE AUTO-AD UNIT]</div>
          <div style="font-size: 0.65rem; color: var(--text-muted);">Content-Matched Display Banner (AdSense Policy Compliant)</div>
        </div>
      </div>
      
      <div class="post-body">
        ${parseMarkdown(post.content)}
      </div>
      
      <!-- Important Cybersecurity Disclaimer Callout -->
      <div class="cyber-disclaimer-card">
        <div class="disclaimer-title">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          EDUCATIONAL DISCLAIMER NOTICE
        </div>
        <div class="disclaimer-text">
          All methodologies, scripts, and software tools discussed in the article above are demonstrated exclusively for ethical hacking, penetration testing auditing, and educational cybersecurity research purposes. Running security scans or scripts without formal written permission from target system owners is strictly prohibited by law. Ethical Explorers bears no responsibility for actions taken by users with this data.
        </div>
      </div>
      
      <div class="post-share-section">
        <div class="post-tags">
          ${(post.tags || []).map(tag => `<span class="post-tag-pill">#${tag}</span>`).join('')}
        </div>
        
        <div class="share-buttons">
          <button class="share-btn" id="share-copy" title="Copy Link">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          </button>
          <button class="share-btn" id="share-twitter" title="Share on Twitter">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </button>
          <button class="share-btn" id="share-telegram" title="Share on Telegram">
            <svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.485-.18.6-.54 1.082-.9 1.141-.782.12-1.383-.359-2.141-.839-.778-.492-1.218-.797-1.97-.1.359.359.721 1.139 1.259 1.677.3.3.419.658.3.9-.18.3-.54.419-.9.36-.782-.12-1.623-.539-2.584-1.198-1.503-1.018-2.645-2.096-3.424-3.235-.419-.6-.6-.96-.42-1.14.18-.18.539-.3 1.078-.54 1.078-.479 2.583-.9 4.5-.78.18 0 .419.06.479.18.06.12.06.3-.06.42-.12.18-.419.3-.9.419-.9.24-1.74.479-2.52.719-.48.18-.84.42-.9.66 0 .06 0 .12.06.18.12.18.42.3.9.48 1.198.479 2.157.9 2.876.9.36 0 .66-.06.9-.18.42-.18.72-.54.9-.96.36-1.08.72-2.399 1.02-3.776.12-.42 0-.78-.18-.9-.18-.12-.48-.12-.78-.06-.48.12-1.26.42-2.339.9-.48.24-.96.48-1.439.72-.3.12-.54.18-.72.06-.18-.12-.3-.36-.18-.6.18-.3.72-.6 1.618-1.018 2.039-.959 3.539-1.558 4.498-1.798.54-.12 1.078-.12 1.438.12.36.18.48.54.42.9z"/></svg>
          </button>
        </div>
      </div>
      
      <!-- AdSense Bottom Widget -->
      <div class="widget adsense-widget" style="min-height: 120px; margin-top: 2rem;">
        <div class="adsense-mock-placeholder">
          <div>Google AdSense Link & Display Unit</div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 5px;">Matches user interest (Contextual Targeting)</div>
        </div>
      </div>
    </article>
  `;
  
  // Set up share interactions
  setupShareButtons(post);
}

function setupShareButtons(post) {
  const copyBtn = document.getElementById('share-copy');
  const twitterBtn = document.getElementById('share-twitter');
  const telegramBtn = document.getElementById('share-telegram');
  
  const postUrl = window.location.href;
  const postText = `Check out this cybersecurity post from Ethical Explorers: ${post.title}`;
  
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(postUrl).then(() => {
        const origHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="var(--accent-green)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        copyBtn.style.borderColor = 'var(--accent-green)';
        setTimeout(() => {
          copyBtn.innerHTML = origHtml;
          copyBtn.style.borderColor = '';
        }, 1500);
      }).catch(err => console.error('Failed to copy link', err));
    });
  }
  
  if (twitterBtn) {
    twitterBtn.addEventListener('click', () => {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}&url=${encodeURIComponent(postUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    });
  }
  
  if (telegramBtn) {
    telegramBtn.addEventListener('click', () => {
      const url = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postText)}`;
      window.open(url, '_blank', 'width=600,height=400');
    });
  }
}

// 404/Error view generator
function renderErrorPage(container, title, description) {
  container.innerHTML = `
    <div class="blog-loader-msg" style="border-color: var(--accent-pink); padding: 4rem 2rem;">
      <h2 style="color: var(--accent-pink); font-family: var(--font-mono); margin-bottom: 1rem;">${title}</h2>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 2rem;">${description}</p>
      <a href="index.html" class="btn btn-secondary" style="border-color: var(--accent-cyan); color: var(--accent-cyan);">
        &larr; Return to Base Terminal
      </a>
    </div>
  `;
}

/* ==========================================================================
   3. CLIENT-SIDE LIGHTWEIGHT MARKDOWN PARSER
   ========================================================================== */
function parseMarkdown(md) {
  if (!md) return '';
  
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let html = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeLanguage = '';
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // 1. Handle Code Blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        const escapedCode = codeBlockContent.join('\n')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        html.push(`<pre><code class="language-${codeLanguage}">${escapedCode}</code></pre>`);
        inCodeBlock = false;
        codeBlockContent = [];
        codeLanguage = '';
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    
    // 2. Handle lists (unordered)
    const listMatch = line.match(/^(\s*)[\-\*]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${parseInlineMarkdown(listMatch[2])}</li>`);
      continue;
    } else if (inList && line.trim() === '') {
      // Check if next line is a list item, if not, close the list
      let nextIsList = false;
      if (i + 1 < lines.length) {
        nextIsList = lines[i+1].match(/^(\s*)[\-\*]\s+(.*)$/) !== null;
      }
      if (!nextIsList) {
        html.push('</ul>');
        inList = false;
      }
      continue;
    } else if (inList && !listMatch) {
      html.push('</ul>');
      inList = false;
    }
    
    // Skip empty lines
    if (line.trim() === '') {
      continue;
    }
    
    // 3. Headings
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('### ')) {
      html.push(`<h3>${parseInlineMarkdown(trimmedLine.slice(4))}</h3>`);
      continue;
    }
    if (trimmedLine.startsWith('## ')) {
      html.push(`<h2>${parseInlineMarkdown(trimmedLine.slice(3))}</h2>`);
      continue;
    }
    if (trimmedLine.startsWith('# ')) {
      html.push(`<h1>${parseInlineMarkdown(trimmedLine.slice(2))}</h1>`);
      continue;
    }
    
    // 4. Blockquotes
    if (trimmedLine.startsWith('> ')) {
      html.push(`<blockquote>${parseInlineMarkdown(trimmedLine.slice(2))}</blockquote>`);
      continue;
    }
    
    // 5. Standard Paragraphs
    let paragraphContent = parseInlineMarkdown(line);
    html.push(`<p>${paragraphContent}</p>`);
  }
  
  if (inList) {
    html.push('</ul>');
  }
  
  return html.join('\n');
}

function parseInlineMarkdown(text) {
  let temp = text;
  const placeholders = [];
  
  // 1. Extract and replace inline code
  temp = temp.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `%%INLINECODE${placeholders.length}%%`;
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    placeholders.push(`<code>${escapedCode}</code>`);
    return placeholder;
  });
  
  // 2. Extract and replace links and images
  temp = temp.replace(/\!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    const placeholder = `%%INLINEMEDIA${placeholders.length}%%`;
    placeholders.push(`<img src="${url}" alt="${alt}">`);
    return placeholder;
  });
  
  temp = temp.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    const placeholder = `%%INLINELINK${placeholders.length}%%`;
    placeholders.push(`<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
    return placeholder;
  });
  
  // 3. Bold
  temp = temp.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // 4. Italic
  temp = temp.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  temp = temp.replace(/_([^_]+)_/g, '<em>$1</em>');
  
  // 5. Restore placeholders in reverse order
  for (let i = placeholders.length - 1; i >= 0; i--) {
    temp = temp.replace(`%%INLINECODE${i}%%`, placeholders[i]);
    temp = temp.replace(`%%INLINEMEDIA${i}%%`, placeholders[i]);
    temp = temp.replace(`%%INLINELINK${i}%%`, placeholders[i]);
  }
  
  return temp;
}
