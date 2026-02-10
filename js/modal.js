/* Modal System - Reusable modal for pop-ups */

(function() {
  'use strict';

  class ModalSystem {
    constructor() {
      this.modal = null;
      this.init();
    }

    init() {
      // Create modal element
      this.modal = this.createModal();

      // Attach event listeners
      this.attachEventListeners();
    }

    createModal() {
      // Check if modal already exists
      const existingModal = document.querySelector('.modal-overlay');
      if (existingModal) {
        return existingModal;
      }

      // Create modal structure
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');

      modal.innerHTML = `
        <div class="modal-container">
          <button class="modal-close" aria-label="Close modal">&times;</button>
          <div class="modal-content"></div>
        </div>
      `;

      document.body.appendChild(modal);
      return modal;
    }

    attachEventListeners() {
      // Event delegation for all modal triggers
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal]');
        if (trigger) {
          e.preventDefault();
          const contentId = trigger.getAttribute('data-modal');
          this.open(contentId);
        }
      });

      // Close button handler
      const closeButton = this.modal.querySelector('.modal-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => this.close());
      }

      // Click outside to close
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });

      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.close();
        }
      });
    }

    open(contentId) {
      // Find template with matching ID
      const template = document.getElementById(contentId);
      if (!template) {
        console.warn(`Modal template with ID "${contentId}" not found`);
        return;
      }

      // Get content from template
      const content = template.innerHTML;

      // Insert content into modal
      const modalContent = this.modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.innerHTML = content;
      }

      // Show modal
      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus trap - focus the close button
      const closeButton = this.modal.querySelector('.modal-close');
      if (closeButton) {
        setTimeout(() => closeButton.focus(), 100);
      }
    }

    close() {
      // Hide modal
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');

      // Restore body scroll
      document.body.style.overflow = '';

      // Clear content after animation
      setTimeout(() => {
        const modalContent = this.modal.querySelector('.modal-content');
        if (modalContent) {
          modalContent.innerHTML = '';
        }
      }, 300);
    }
  }

  // Initialize modal system when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.modalSystem = new ModalSystem();
    });
  } else {
    window.modalSystem = new ModalSystem();
  }

})();
