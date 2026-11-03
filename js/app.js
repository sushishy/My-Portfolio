/* 
================================================================================
                        PORTFOLIO APPLICATION BOOTSTRAP
                        Unified Architecture & Robust Navigation
================================================================================
*/

/* 
================================================================================
                        THEME MANAGER CONTROLLER
================================================================================
*/
class ThemeManager {
  constructor(storageKey = 'portfolio-theme') {
    this.storageKey = storageKey;
    this.root = document.documentElement;
    this.toggleButton = null;
    this.iconElement = null;
  }

  init() {
    this.restoreTheme();
    this.bindDOM();
  }

  restoreTheme() {
    const savedTheme = localStorage.getItem(this.storageKey) || 'dark';
    if (savedTheme === 'light') {
      this.root.classList.add('light-theme');
    } else {
      this.root.classList.remove('light-theme');
    }
  }

  bindDOM() {
    this.toggleButton = document.getElementById('theme-toggle-btn');
    this.iconElement = document.getElementById('theme-toggle-icon');
    
    this.updateIcon();

    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    const isLight = this.root.classList.contains('light-theme');
    if (isLight) {
      this.root.classList.remove('light-theme');
      localStorage.setItem(this.storageKey, 'dark');
    } else {
      this.root.classList.add('light-theme');
      localStorage.setItem(this.storageKey, 'light');
    }
    this.updateIcon();
  }

  updateIcon() {
    if (!this.iconElement) return;
    const isLight = this.root.classList.contains('light-theme');
    if (isLight) {
      // In light mode, show the Moon icon (click to switch to dark)
      this.iconElement.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    } else {
      // In dark mode, show the Sun icon (click to switch to light)
      this.iconElement.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
  }
}

/* 
================================================================================
                        ROBUST SCROLL SPY CONTROLLER
================================================================================
*/
class ScrollSpy {
  constructor() {
    this.navLinks = Array.from(document.querySelectorAll('.editorial-nav-link, .dock-link'));
    this.sectionData = [];
    this.isClickScrolling = false;
    this.clickTimer = null;
  }

  init() {
    this.buildSectionMap();
    if (!this.sectionData.length) return;

    this.bindNavClicks();
    this.bindActionButtons();
    this.bindScrollObserver();
    
    // Initial active check on load
    this.onScroll();
  }

  buildSectionMap() {
    this.sectionData = [];
    this.navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const id = href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          this.sectionData.push({ id, element, link });
        }
      }
    });
  }

  setActive(targetId) {
    this.sectionData.forEach((item) => {
      if (item.id === targetId) {
        item.link.classList.add('active');
        item.link.setAttribute('aria-current', 'true');
      } else {
        item.link.classList.remove('active');
        item.link.removeAttribute('aria-current');
      }
    });
  }

  scrollToSection(targetId) {
    const matched = this.sectionData.find((item) => item.id === targetId);
    if (!matched) return;

    // Immediately activate the link visually
    this.setActive(targetId);

    // Suppress scroll listener updates during the smooth scroll animation
    this.isClickScrolling = true;
    clearTimeout(this.clickTimer);

    if (targetId === 'hero') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const elementRect = matched.element.getBoundingClientRect();
      const scrollY = window.pageYOffset || window.scrollY || 0;
      // 36px top breathing offset for comfortable viewing
      const targetY = elementRect.top + scrollY - 36;

      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }

    if (history.pushState) {
      history.pushState(null, '', `#${targetId}`);
    }

    // Release lock once scroll animation concludes
    this.clickTimer = setTimeout(() => {
      this.isClickScrolling = false;
      this.onScroll();
    }, 750);
  }

  bindNavClicks() {
    this.sectionData.forEach((item) => {
      item.link.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToSection(item.id);
      });
    });
  }

  bindActionButtons() {
    const actionLinks = document.querySelectorAll('.hero-actions-row a[href^="#"]');
    actionLinks.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        if (href && href.startsWith('#')) {
          const id = href.slice(1);
          if (document.getElementById(id)) {
            e.preventDefault();
            this.scrollToSection(id);
          }
        }
      });
    });
  }

  bindScrollObserver() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  onScroll() {
    if (this.isClickScrolling || !this.sectionData.length) return;

    const scrollY = window.pageYOffset || window.scrollY || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    // 1. Bottom of the page: activate the last section (Contact)
    if (scrollY + viewportHeight >= documentHeight - 60) {
      const lastItem = this.sectionData[this.sectionData.length - 1];
      if (lastItem) {
        this.setActive(lastItem.id);
        return;
      }
    }

    // 2. Near top of page: activate the first section (Hero / Home)
    if (scrollY < 120) {
      const firstItem = this.sectionData[0];
      if (firstItem) {
        this.setActive(firstItem.id);
        return;
      }
    }

    // 3. Proportional trigger line: 35% down the viewport
    const triggerLine = viewportHeight * 0.35;
    let currentActiveId = this.sectionData[0].id;

    for (let i = 0; i < this.sectionData.length; i++) {
      const rect = this.sectionData[i].element.getBoundingClientRect();
      if (rect.top <= triggerLine) {
        currentActiveId = this.sectionData[i].id;
      } else {
        break;
      }
    }

    this.setActive(currentActiveId);
  }
}

/* 
================================================================================
            CINEMATIC MOTION & SCROLL REVEAL ENGINE
            Powered by GSAP & ScrollTrigger with Anime.js v4 Fallback
================================================================================
*/
class MotionController {
  constructor() {
    this.hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    this.hasAnime = typeof window.anime !== 'undefined';
  }

  init() {
    this.initScrollProgress();
    this.initSpotlightHover();
    this.initPortraitTilt();

    if (this.hasGSAP) {
      this.initGSAPMotions();
    } else {
      this.initObserverMotions();
    }
  }

  initScrollProgress() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || window.scrollY || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
    }, { passive: true });
  }

  initPortraitTilt() {
    const stage = document.querySelector('.hero-portrait-stage');
    const card = document.querySelector('.hero-portrait-card');
    if (!stage || !card) return;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    stage.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  initSpotlightHover() {
    const cards = document.querySelectorAll('.work-timeline-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  initGSAPMotions() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Entrance Sequence
    const nameSpans = document.querySelectorAll('.hero-name-stacked span');
    const bio = document.querySelector('.hero-editorial-bio');
    const actions = document.querySelector('.hero-actions-row');
    const portrait = document.querySelector('.hero-portrait-card');
    const caption = document.querySelector('.hero-portrait-caption');

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (nameSpans.length) {
      heroTl.from(nameSpans, {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1.0,
        clearProps: 'transform,opacity'
      });
    }

    if (bio) {
      heroTl.from(bio, {
        y: 24,
        opacity: 0,
        duration: 0.85,
        clearProps: 'transform,opacity'
      }, '-=0.65');
    }

    if (actions && actions.children.length) {
      heroTl.from(actions.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.75,
        clearProps: 'transform,opacity'
      }, '-=0.55');
    }

    if (portrait) {
      heroTl.from(portrait, {
        scale: 0.95,
        y: 35,
        opacity: 0,
        duration: 1.1,
        clearProps: 'opacity'
      }, '-=0.8');
    }

    if (caption) {
      heroTl.from(caption, {
        opacity: 0,
        duration: 0.8,
        clearProps: 'opacity'
      }, '-=0.5');
    }

    // 2. Section Headers (Active on both scroll down & scroll up!)
    gsap.utils.toArray('.section-label-header').forEach((header) => {
      gsap.fromTo(header,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // 3. Editorial Split Grids (About & Systems Lab)
    gsap.utils.toArray('.editorial-split-grid').forEach((grid) => {
      const photo = grid.querySelector('.editorial-photo-box');
      const textFlow = grid.querySelector('.editorial-text-flow');

      if (photo) {
        gsap.fromTo(photo,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 82%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      if (textFlow) {
        gsap.fromTo(textFlow,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 82%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });

    // 4. Pull Quote Section
    const pullQuote = document.querySelector('.pull-quote-section');
    if (pullQuote) {
      const statement = pullQuote.querySelector('.pull-quote-statement');
      const sub = pullQuote.querySelector('.pull-quote-sub');
      if (statement) {
        gsap.fromTo(statement,
          { opacity: 0, scale: 0.96, y: 28 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pullQuote,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
      if (sub) {
        gsap.fromTo(sub,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: pullQuote,
              start: 'top 78%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }

    // 5. Skills Capability Cards (Cascading Wave Stagger)
    const skillsList = document.querySelector('.skills-capabilities-list');
    if (skillsList) {
      const items = skillsList.querySelectorAll('.skills-atelier-item');
      gsap.fromTo(items,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: skillsList,
            start: 'top 84%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // 6. Work Project Cards (The 3 Dashboards)
    gsap.utils.toArray('.work-timeline-card').forEach((card) => {
      const info = card.querySelector('.work-card-info');
      const telemetry = card.querySelector('.work-card-telemetry');

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 84%',
          toggleActions: 'play none none reverse'
        }
      });

      cardTl.fromTo(card,
        { opacity: 0, y: 45 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      );

      if (info && info.children.length) {
        cardTl.fromTo(info.children,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' },
          '-=0.65'
        );
      }

      if (telemetry) {
        cardTl.fromTo(telemetry,
          { opacity: 0, scale: 0.97, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.55'
        );
      }
    });

    // 7. Education Cards
    const eduGrid = document.querySelector('.education-grid');
    if (eduGrid) {
      gsap.fromTo(eduGrid.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: eduGrid,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // 8. Contact Section Tiles
    const contactGrid = document.querySelector('.contact-tiles-grid');
    if (contactGrid) {
      gsap.fromTo(contactGrid.children,
        { opacity: 0, y: 28, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.12,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contactGrid,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  initObserverMotions() {
    const elementsToReveal = document.querySelectorAll(
      '.section-label-header, .editorial-split-grid, .pull-quote-section, .skills-atelier-item, .work-timeline-card, .education-card, .contact-editorial-tile'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          entry.target.style.transition = 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(32px) scale(0.98)';
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    elementsToReveal.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px) scale(0.98)';
      observer.observe(el);
    });
  }
}

/* 
================================================================================
                        SKELETON LOADER MANAGER
================================================================================
*/
class SkeletonManager {
  constructor() {
    this.toggleButton = document.getElementById('toggle-skeleton-btn');
    this.skeletonCards = document.querySelectorAll('.skeleton-dashboard-card');
  }

  init() {
    if (!this.toggleButton || !this.skeletonCards.length) return;
    this.toggleButton.addEventListener('click', () => this.toggleSkeletons());
  }

  toggleSkeletons() {
    this.skeletonCards.forEach((card) => {
      const skeletons = card.querySelectorAll('.skeleton');
      skeletons.forEach((el) => el.classList.toggle('hidden'));
    });
  }
}

/* 
================================================================================
                        MAIN APPLICATION
================================================================================
*/
/* 
================================================================================
          VOIDLESS INJECTOR — SMART APP LAUNCH LOADER CONTROLLER
          Smooth requestAnimationFrame single-sweep with percentage & status cycling
================================================================================
*/
class LaunchLoader {
  constructor(options = {}) {
    this.totalMs = options.totalMs || 2400;
    this.fadeoutMs = options.fadeoutMs || 650;
    this.overlay = document.getElementById('app-launch-loader');
    this.fill = document.getElementById('launch-progress-fill');
    this.pctEl = document.getElementById('launch-percent-text');
    this.statusEl = document.getElementById('launch-status-text');

    this.msgs = [
      'Initializing portfolio core...',
      'Mounting architectural layout...',
      'Loading business intelligence telemetry...',
      'Synchronizing relational schema engines...',
      'Calibrating interactive motion vectors...',
      'Systems ready.'
    ];

    this.onComplete = options.onComplete || null;
    this.isDismissed = false;
  }

  init() {
    if (!this.overlay || !this.fill || !this.pctEl || !this.statusEl) {
      if (this.onComplete) this.onComplete();
      return;
    }

    // Allow user to tap/click overlay to enter instantly
    this.overlay.addEventListener('click', () => this.dismissLoader());

    this.run();
  }

  run() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this.fill) {
          this.fill.style.transition = `width ${this.totalMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          this.fill.style.width = '100%';
        }
      });
    });

    const msgCount = this.msgs.length;
    const startTime = performance.now();
    let lastMsgIdx = -1;

    const tick = (now) => {
      if (this.isDismissed) return;

      const elapsed = now - startTime;
      const rawPct = Math.min(elapsed / this.totalMs, 1);
      const intPct = Math.round(rawPct * 100);

      if (this.pctEl) {
        this.pctEl.textContent = `${intPct}%`;
      }

      const msgIdx = Math.min(Math.floor(rawPct * msgCount), msgCount - 1);
      if (msgIdx !== lastMsgIdx) {
        lastMsgIdx = msgIdx;
        if (this.statusEl) {
          this.statusEl.style.opacity = '0';
          setTimeout(() => {
            if (this.statusEl && !this.isDismissed) {
              this.statusEl.textContent = this.msgs[msgIdx];
              this.statusEl.style.transition = 'opacity 0.2s ease';
              this.statusEl.style.opacity = '1';
            }
          }, 90);
        }
      }

      if (rawPct < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => this.dismissLoader(), 300);
      }
    };

    requestAnimationFrame(tick);
  }

  dismissLoader() {
    if (this.isDismissed) return;
    this.isDismissed = true;

    if (!this.overlay) {
      if (this.onComplete) this.onComplete();
      return;
    }

    this.overlay.classList.add('fade-out');

    if (this.onComplete) {
      this.onComplete();
    }

    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
    }, this.fadeoutMs);
  }
}

class PortfolioApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.scrollSpy = new ScrollSpy();
    this.motionController = new MotionController();
    this.skeletonManager = new SkeletonManager();
  }

  init() {
    try {
      this.themeManager.init();
    } catch (e) {
      console.warn('ThemeManager init error:', e);
    }

    try {
      this.scrollSpy.init();
    } catch (e) {
      console.warn('ScrollSpy init error:', e);
    }

    const loader = new LaunchLoader({
      totalMs: 2400,
      onComplete: () => {
        try {
          this.motionController.init();
        } catch (e) {
          console.warn('MotionController init error:', e);
        }
      }
    });

    loader.init();

    try {
      this.skeletonManager.init();
    } catch (e) {
      console.warn('SkeletonManager init error:', e);
    }
  }
}

function startApplication() {
  const app = new PortfolioApp();
  app.init();
  window.__portfolioApp = app;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApplication);
} else {
  startApplication();
}

// Export for module consumers if imported as ES module
if (typeof window !== 'undefined') {
  window.ThemeManager = ThemeManager;
  window.ScrollSpy = ScrollSpy;
  window.MotionController = MotionController;
  window.SkeletonManager = SkeletonManager;
  window.PortfolioApp = PortfolioApp;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager, ScrollSpy, MotionController, SkeletonManager, PortfolioApp };
}
