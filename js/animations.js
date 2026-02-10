/* Animation System - Scroll-triggered animations using Intersection Observer */

(function() {
  'use strict';

  class AnimationSystem {
    constructor() {
      this.observer = null;
      this.init();
    }

    init() {
      // Create Intersection Observer
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
          } else if (entry.target.hasAttribute('data-animation-repeat')) {
            // Remove animated class for repeating animations
            entry.target.classList.remove('animated');
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      });

      // Observe all elements with data-animation attribute
      this.observeElements();

      // Re-observe on dynamic content changes
      this.setupMutationObserver();
    }

    observeElements() {
      const animatedElements = document.querySelectorAll('[data-animation]');
      animatedElements.forEach(element => {
        this.observer.observe(element);
      });
    }

    animateElement(element) {
      // Get animation delay
      const delay = parseInt(element.getAttribute('data-animation-delay')) || 0;

      // Apply animation after delay
      setTimeout(() => {
        element.classList.add('animated');

        // Unobserve element if it's not a repeating animation (performance optimization)
        if (!element.hasAttribute('data-animation-repeat')) {
          this.observer.unobserve(element);
        }
      }, delay);
    }

    setupMutationObserver() {
      // Watch for new elements being added to the DOM
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              // Check if the node itself has animation
              if (node.hasAttribute && node.hasAttribute('data-animation')) {
                this.observer.observe(node);
              }

              // Check children for animations
              const children = node.querySelectorAll && node.querySelectorAll('[data-animation]');
              if (children) {
                children.forEach(child => this.observer.observe(child));
              }
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // Public method to manually trigger animation
    trigger(element) {
      if (element && element.hasAttribute('data-animation')) {
        this.animateElement(element);
      }
    }

    // Public method to reset animation
    reset(element) {
      if (element) {
        element.classList.remove('animated');
      }
    }
  }

  // Initialize animation system when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.animationSystem = new AnimationSystem();
    });
  } else {
    window.animationSystem = new AnimationSystem();
  }

})();
