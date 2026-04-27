
// ── GSAP ScrollTrigger Registration ──────
gsap.registerPlugin(ScrollTrigger);

// ── Lenis Smooth Scroll ───────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Lenis + GSAP ticker sync
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ── AOS Init ─────────────────────────────
AOS.init({
  duration: 900,
  easing: 'ease-out-quart',
  once: true,
  offset: 60,
});

// ── GLightbox Init ────────────────────────
window.lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  loop: true,
  autoplayVideos: true,
  openEffect: 'fade',
  closeEffect: 'fade',
  slideEffect: 'fade',
  moreLength: 0,
  skin: 'clean',
  plyr: {
    css: 'https://cdn.plyr.io/3.7.8/plyr.css',
    js: 'https://cdn.plyr.io/3.7.8/plyr.js',
    config: {
      ratio: '16:9',
      youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3 }
    }
  }
});

// ── Mobile Nav Toggle ─────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-links a');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Toggle body scroll
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ── Sticky Nav ────────────────────────────
const nav = document.getElementById('nav');
lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 60);
});

// ── Custom Cursor ─────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.10;
  followerY += (mouseY - followerY) * 0.10;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

// Cursor expand on interactive elements
const interactables = document.querySelectorAll('a, button, .card-thumb');
interactables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(3)';
    cursor.style.opacity = '0.4';
    follower.style.width = '60px';
    follower.style.height = '60px';
    follower.style.borderColor = 'rgba(200,169,126,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.opacity = '1';
    follower.style.width = '36px';
    follower.style.height = '36px';
    follower.style.borderColor = 'rgba(240,237,232,0.4)';
  });
});

// ── Hero Title Letter Split Animation ────
(function heroEntrance() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  gsap.fromTo(title,
    { opacity: 0, y: 50, skewY: 3 },
    {
      opacity: 1, y: 0, skewY: 0,
      duration: 1.4,
      delay: 0.3,
      ease: 'expo.out',
    }
  );
})();

// ── Grid Cards Stagger Reveal ─────────────
(function gridReveal() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  gsap.fromTo(cards,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.07,
      scrollTrigger: {
        trigger: '#videoGrid',
        start: 'top 80%',
      }
    }
  );
})();

// ── Parallax on grid cards ────────────────
(function cardParallax() {
  document.querySelectorAll('.card').forEach((card, i) => {
    const depth = (i % 3 === 1) ? 30 : (i % 3 === 0) ? 15 : 20;
    gsap.to(card.querySelector('.card-thumb img'), {
      yPercent: -depth,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });
})();

// ── About Section Counter Animation ───────
(function counters() {
  const stats = document.querySelectorAll('.stat strong');
  const targets = [60, 5, 12];
  const labels = ['60+', '5yr', '12M+'];

  stats.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() {
        const target = targets[i];
        const label = labels[i];
        let count = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          // Format nicely
          if (label.includes('M')) el.textContent = count + 'M+';
          else if (label.includes('yr')) el.textContent = count + 'yr';
          else el.textContent = count + '+';
          if (count >= target) clearInterval(timer);
        }, 28);
      }
    });
  });
})();

// ── Horizontal scroll hint for grid on mobile ──
(function mobileHint() {
  if (window.innerWidth > 768) return;
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  grid.style.overflowX = 'auto';
  grid.style.scrollSnapType = 'x mandatory';
  document.querySelectorAll('.card').forEach(c => {
    c.style.scrollSnapAlign = 'start';
  });
})();

// ── Contact Form Interaction ──────────────
(function contactForm() {
  const btn = document.getElementById('sendBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg = document.getElementById('fmessage').value.trim();

    if (!name || !email || !msg) {
      gsap.fromTo(btn, { x: 0 }, {
        x: 8, duration: 0.08, repeat: 5, yoyo: true, ease: 'power2.inOut',
        onComplete: () => gsap.set(btn, { x: 0 })
      });
      return;
    }

    const span = btn.querySelector('span');
    const svg = btn.querySelector('svg');
    span.textContent = 'Sent!';
    svg.innerHTML = '<polyline points="20,6 9,17 4,12"/>';
    btn.style.pointerEvents = 'none';

    gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });

    setTimeout(() => {
      span.textContent = 'Send Message';
      svg.innerHTML = '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>';
      btn.style.pointerEvents = '';
      document.getElementById('fname').value = '';
      document.getElementById('femail').value = '';
      document.getElementById('fmessage').value = '';
    }, 3000);
  });
})();

// ── Scroll Progress Line ──────────────────
(function progressLine() {
  const line = document.createElement('div');
  line.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: linear-gradient(90deg, #c8a97e, #e8d4b0);
    transform-origin: left;
    z-index: 9999; pointer-events: none;
    transform: scaleX(0); transition: none;
  `;
  document.body.appendChild(line);

  lenis.on('scroll', ({ progress }) => {
    line.style.transform = `scaleX(${progress})`;
  });
})();

// ── Lazy load images ──────────────────────
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        io.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImages.forEach(img => io.observe(img));
}

// ── Smooth anchor scroll via Lenis ────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) lenis.scrollTo(target, { duration: 1.6, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  });
});

// ── Section labels slide-in ───────────────
gsap.utils.toArray('.section-label').forEach(label => {
  gsap.fromTo(label,
    { width: 0, opacity: 0 },
    {
      width: 'auto', opacity: 1,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: label,
        start: 'top 88%',
        once: true,
      }
    }
  );
});


(function initInstagramFeed() {
  const videoGrid = document.getElementById('videoGrid');
  const instaGrid = document.getElementById('instagramGrid');

  if (!videoGrid && !instaGrid) return;

  // Instagram Basic Display API Endpoint
  const ACCESS_TOKEN = 'IGAAaG5UFyUBlBZAGFkMnd3S29VbnhDamJXZADJFUFlPTWFPS0FJWVRzdmY5VF9DSUkxeFRmMFNvYmdNenJWYkZAOQVplc3pmREJpZAnRuMjVGbDhLRnBIaDNjMXUwWGZAaR3ZARejlTdFhVQTlFbkM3M1RvQUt3N1k4bXJDZAldlc1NLYwZDZD';
  const API_URL = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${ACCESS_TOKEN}`;

  async function fetchFeed() {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const data = result.data || [];

      if (data.length === 0) {
        throw new Error('No media found');
      }

      // Populate both grids
      renderFeed(data); // The bottom small feed
      renderVideoGrid(data); // The main showcase grid
    } catch (error) {
      console.error('Instagram API Error:', error);
      // Fallback to high-quality mock data if token is invalid or fails
      const mockData = [
        { id: 1, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 2, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 3, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 4, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 5, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1551972251-12070d63502a?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 6, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 7, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 8, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 9, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1496337589254-7e19d01ced44?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 10, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 11, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', permalink: '#' },
        { id: 12, media_type: 'VIDEO', media_url: 'https://images.unsplash.com/photo-1459749411177-042180ce6742?q=80&w=600&auto=format&fit=crop', permalink: '#' },
      ];
      renderFeed(mockData);
      renderVideoGrid(mockData);
    }
  }

  function renderVideoGrid(items) {
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;

    videoGrid.innerHTML = '';
    // Filter for videos or use all if no videos found
    const videos = items.filter(item => item.media_type === 'VIDEO' || item.media_type === 'CAROUSEL_ALBUM').slice(0, 12);
    const displayItems = videos.length > 0 ? videos : items.slice(0, 12);

    displayItems.forEach((item, index) => {
      const card = document.createElement('div');
      // Sophisticated Bento layout pattern for 12 items
      let layoutClass = '';
      if (index === 0 || index === 10) layoutClass = 'card--large';
      else if (index === 1 || index === 5) layoutClass = 'card--tall';
      else if (index === 3 || index === 7 || index === 11) layoutClass = 'card--wide';

      card.className = `card ${layoutClass}`;
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', (index % 4) * 100);

      const mediaUrl = item.media_type === 'VIDEO' ? (item.thumbnail_url || item.media_url) : item.media_url;
      const videoUrl = item.media_url; // This is the .mp4 or image file
      const caption = item.caption ? item.caption.substring(0, 80) : 'Visual Story';
      const title = item.caption ? item.caption.split('\n')[0].substring(0, 30) : 'Untitled Story';
      const num = (index + 1).toString().padStart(2, '0');

      card.innerHTML = `
        <a href="${videoUrl}" class="glightbox" data-gallery="portfolio" data-title="${title}" data-description="${caption}">
          <div class="card-thumb">
            <img src="${mediaUrl}" alt="${title}" loading="lazy" />
            <div class="card-overlay">
              <div class="play-btn">
                <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
              </div>
            </div>
          </div>
        </a>
        <div class="card-meta">
          <span class="card-num">${num}</span>
          <span class="card-tag">${item.media_type.replace('_', ' ')}</span>
        </div>
      `;
      videoGrid.appendChild(card);
    });

    // Re-initialize GLightbox to catch new dynamic items
    if (window.GLightbox) {
      window.lightbox.reload();
    }

    // Refresh AOS for new elements
    if (window.AOS) AOS.refresh();
  }

  function renderFeed(items) {
    if (!instaGrid) return;
    instaGrid.innerHTML = ''; // Clear placeholders
    items.slice(0, 6).forEach((item, index) => {
      const el = document.createElement('a');
      el.href = item.permalink || '#';
      el.target = '_blank';
      el.className = 'insta-item';
      el.setAttribute('data-aos', 'fade-up');
      el.setAttribute('data-aos-delay', index * 100);

      const mediaUrl = item.media_type === 'VIDEO' ? (item.thumbnail_url || item.media_url) : item.media_url;
      const caption = item.caption ? item.caption.substring(0, 100) : 'Instagram post';

      el.innerHTML = `
        <img src="${mediaUrl}" alt="${caption}" title="${caption}" loading="lazy" />
        <div class="insta-overlay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
      `;
      instaGrid.appendChild(el);
    });

    // Refresh AOS for new elements
    if (window.AOS) AOS.refresh();
  }

  fetchFeed();
})();

// ── Preloader Controller ──────────────────
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Wait a bit extra for Instagram data to settle
  setTimeout(() => {
    preloader.classList.add('preloader-hidden');
    setTimeout(() => preloader.style.display = 'none', 1200);
  }, 1000);
});

// ── Magnetic Elements ─────────────────────
(function magneticButtons() {
  const magnets = document.querySelectorAll('.btn-send, .insta-btn, .scroll-indicator, .nav-logo');

  magnets.forEach(el => {
    el.addEventListener('mousemove', e => {
      const pos = el.getBoundingClientRect();
      const x = e.clientX - pos.left - pos.width / 2;
      const y = e.clientY - pos.top - pos.height / 2;

      gsap.to(el, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.5,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
})();

// ── Console Easter Egg ────────────────────
console.log('%c⬛ ANANT GARG — Visual Stories', 'font-family: serif; font-size: 20px; font-style: italic; color: #c8a97e;');
console.log('%cHello curious visitor 👁', 'font-size: 12px; color: #6b6b6b; letter-spacing: 2px;');
