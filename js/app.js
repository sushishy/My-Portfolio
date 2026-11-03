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
    this.navLinks = Array.from(document.querySelectorAll('.antonio-nav-link, .dock-link'));
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
    // Also bind hero buttons (e.g., 'View Selected Work', 'Initiate Contact')
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
        // Sections are positioned sequentially in DOM
        break;
      }
    }

    this.setActive(currentActiveId);
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
class PortfolioApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.scrollSpy = new ScrollSpy();
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
  window.SkeletonManager = SkeletonManager;
  window.PortfolioApp = PortfolioApp;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager, ScrollSpy, SkeletonManager, PortfolioApp };
}
