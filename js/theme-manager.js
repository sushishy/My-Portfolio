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
    if (isLight) {
      // In light mode, show the Moon icon (click to switch to dark)
      this.iconElement.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    } else {
      // In dark mode, show the Sun icon (click to switch to light)
      this.iconElement.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
  }
}
