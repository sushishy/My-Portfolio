/* 
================================================================================
                        PORTFOLIO APPLICATION BOOTSTRAP
================================================================================
*/

import { ThemeManager } from './theme-manager.js';
import { IntroController } from './intro-controller.js';

class PortfolioApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.introController = new IntroController();
  }

  init() {
    this.themeManager.init();
    this.introController.init();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();
  app.init();
});
