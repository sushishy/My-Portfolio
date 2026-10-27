/* 
================================================================================
                        THEME MANAGER - OOP CONTROLLER
================================================================================
*/

export class ThemeManager {
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
    this.iconElement.textContent = isLight ? '☾' : '☼';
  }
}
