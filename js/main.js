/* Main Application - Initialize all modules */

(function() {
  'use strict';

  // Main application object
  const App = {
    init: function() {
      console.log('LeadNow Report Website - Initializing...');

      // Check if modal and animation systems are loaded
      this.checkDependencies();

      // Add any additional initialization here
      this.setupAccessibility();
      this.setupSmoothScroll();

      console.log('LeadNow Report Website - Ready!');
    },

    checkDependencies: function() {
      if (typeof window.modalSystem !== 'undefined') {
        console.log('✓ Modal system loaded');
      } else {
        console.warn('⚠ Modal system not loaded');
      }

      if (typeof window.animationSystem !== 'undefined') {
        console.log('✓ Animation system loaded');
      } else {
        console.warn('⚠ Animation system not loaded');
      }
    },

    setupAccessibility: function() {
      // Add skip to main content link functionality
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          const mainContent = document.querySelector('main');
          if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
          }
        });
      }

      // Announce page title to screen readers
      const pageTitle = document.querySelector('h1');
      if (pageTitle) {
        pageTitle.setAttribute('tabindex', '-1');
      }
    },

    setupSmoothScroll: function() {
      // Smooth scroll is handled by CSS, but we can add fallback for older browsers
      const links = document.querySelectorAll('a[href^="#"]');

      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href');

          // Skip if it's just "#"
          if (targetId === '#') {
            e.preventDefault();
            return;
          }

          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            // Let CSS smooth scroll handle it, but provide fallback
            if (!('scrollBehavior' in document.documentElement.style)) {
              e.preventDefault();
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        });
      });
    }
  };

  // Initialize app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      App.init();
    });
  } else {
    App.init();
  }

  // Expose App to window for debugging
  window.LeadNowApp = App;

})();
