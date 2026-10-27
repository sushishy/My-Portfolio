/* 
================================================================================
                        PORTFOLIO APPLICATION BOOTSTRAP
================================================================================
*/

import { ThemeManager } from './theme-manager.js';
import { IntroController } from './intro-controller.js';

/* 
================================================================================
                        SCROLL SPY CONTROLLER
================================================================================
*/

class ScrollSpy {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-links a');
  }

  init() {
    if (!this.sections.length || !this.navLinks.length) return;
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.handleScroll();
  }

  handleScroll() {
    const scrollPosition = window.scrollY + 200;

    this.sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        this.navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
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

class PortfolioApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.introController = new IntroController();
    this.scrollSpy = new ScrollSpy();
    this.skeletonManager = new SkeletonManager();
  }

  init() {
    this.themeManager.init();
    this.introController.init();
    this.scrollSpy.init();
    this.skeletonManager.init();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();
  app.init();
});
