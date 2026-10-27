// Theme Switcher (Voidless Atmosphere Mode)
(function () {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    
    const updateIcon = () => {
        const isLight = document.documentElement.classList.contains('light-theme');
        if (themeIcon) {
            themeIcon.className = isLight ? 'bx bx-sun' : 'bx bx-moon';
        }
    };
    
    updateIcon();
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.contains('light-theme');
            if (isLight) {
                document.documentElement.classList.remove('light-theme');
                localStorage.setItem('portfolio-theme', 'dark');
            } else {
                document.documentElement.classList.add('light-theme');
                localStorage.setItem('portfolio-theme', 'light');
            }
            updateIcon();
        });
    }
});
