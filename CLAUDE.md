# Claude Development Guidelines for LeadNow Project Report Website

This file contains important constraints, patterns, and guidelines for working on this project with Claude Code.

---

## CRITICAL CONSTRAINTS

### 🚫 Technology Restrictions

**NEVER use or suggest:**
- ❌ Node.js, npm, or any package managers
- ❌ Build tools (Webpack, Vite, Parcel, Rollup, esbuild, etc.)
- ❌ CSS preprocessors (Sass, SCSS, Less, Stylus)
- ❌ JavaScript transpilers (Babel, TypeScript, etc.)
- ❌ Frontend frameworks (React, Vue, Angular, Svelte, etc.)
- ❌ CSS frameworks with build steps (Tailwind CSS, Bootstrap with compilation)
- ❌ Any tool requiring compilation or bundling

**ALWAYS use:**
- ✅ Pure HTML (.html files)
- ✅ Pure CSS (.css files)
- ✅ Pure JavaScript (.js files)
- ✅ CDN-hosted libraries only (Prism.js, Chart.js)

**Rationale:** This website must be openable by double-clicking `index.html` in a file browser. No build step. No `npm install`. No compilation. It must work immediately in any modern browser.

---

## Architecture Rules

### Single-Page Application Pattern

This is a **single HTML file** with multiple sections. DO NOT create separate HTML files for each page.

**Structure:**
```html
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  <nav><!-- Navigation to all sections --></nav>

  <main>
    <section id="home">...</section>
    <section id="requirements">...</section>
    <section id="research">...</section>
    <section id="algorithms">...</section>
    <section id="ui-design">...</section>
    <section id="system-design">...</section>
    <section id="implementation">...</section>
    <section id="evaluation">...</section>
    <section id="conclusion">...</section>
    <section id="appendices">...</section>
  </main>

  <footer>...</footer>
</body>
</html>
```

**Navigation:** Hash-based (`#home`, `#requirements`, etc.) with smooth scrolling

---

## File Organization Rules

### CSS Files

Split CSS into logical modules, loaded in this order:

1. `css/reset.css` - Browser normalization
2. `css/variables.css` - Design tokens (colors, fonts, spacing, breakpoints)
3. `css/layout.css` - Page structure, containers, grids
4. `css/components.css` - Reusable components (buttons, cards, nav, modals)
5. `css/animations.css` - Keyframes and transitions
6. `css/responsive.css` - Media queries

**DO NOT:**
- Create a single monolithic `styles.css` file
- Mix layout and component styles
- Put media queries inline (use `responsive.css`)

### JavaScript Files

Split JS into focused modules, loaded with `defer`:

1. `js/navigation.js` - Smooth scroll, active link tracking
2. `js/modal.js` - Modal/pop-up system
3. `js/animations.js` - Scroll-triggered animations
4. `js/main.js` - Initialize all modules

**DO NOT:**
- Create a single monolithic `script.js` file
- Use ES6 modules with `import/export` (requires build step or module server)
- Use `type="module"` unless absolutely necessary

**Communication between modules:**
```javascript
// Use IIFE pattern or attach to window object
(function() {
  window.MyModule = {
    init: function() { /* ... */ }
  };
})();

// In main.js
window.MyModule.init();
```

---

## Technical Patterns

### Navigation System

**Implementation:** Intersection Observer API

```javascript
// Pattern to follow
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Update active nav link
      document.querySelector('.nav-link.active')?.classList.remove('active');
      document.querySelector(`a[href="#${entry.target.id}"]`)?.classList.add('active');
    }
  });
}, {
  threshold: 0.5,
  rootMargin: '-100px 0px -50% 0px'
});

// Observe all sections
document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
```

**DO NOT:**
- Use scroll event listeners (performance issues)
- Manually calculate scroll position
- Use libraries like Scrollspy

### Modal System

**Implementation:** Data-attribute pattern with single modal instance

```javascript
// Pattern to follow
class ModalSystem {
  constructor() {
    this.modal = this.createModal();
    this.attachEventListeners();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
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
    // Event delegation for all triggers
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-modal')) {
        const contentId = e.target.getAttribute('data-modal');
        this.open(contentId);
      }
    });

    // Close handlers
    this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(contentId) {
    const template = document.getElementById(contentId);
    if (!template) return;

    this.modal.querySelector('.modal-content').innerHTML = template.innerHTML;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
```

**HTML Usage:**
```html
<!-- Trigger -->
<button data-modal="example-modal">Open Modal</button>

<!-- Content (hidden) -->
<template id="example-modal">
  <h2>Modal Title</h2>
  <p>Modal content here...</p>
</template>
```

**DO NOT:**
- Create separate modal HTML for each modal
- Use jQuery or Bootstrap modal
- Create multiple modal instances

### Animation System

**Implementation:** Intersection Observer + data attributes

```javascript
// Pattern to follow
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.getAttribute('data-animation-delay')) || 0;

      setTimeout(() => {
        entry.target.classList.add('animated');
      }, delay);

      // Unobserve after animating (performance optimization)
      if (!entry.target.hasAttribute('data-animation-repeat')) {
        animationObserver.unobserve(entry.target);
      }
    } else if (entry.target.hasAttribute('data-animation-repeat')) {
      // Remove animated class for repeat animations
      entry.target.classList.remove('animated');
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
});

// Auto-discover and observe all animated elements
document.querySelectorAll('[data-animation]').forEach(el => {
  animationObserver.observe(el);
});
```

**HTML Usage:**
```html
<div data-animation="fade-in" data-animation-delay="200">
  Content animates 200ms after scrolling into view
</div>

<div data-animation="slide-left" data-animation-repeat>
  Re-animates every time it enters viewport
</div>
```

**CSS Animation Classes:**
```css
/* Pattern to follow */
[data-animation="fade-in"] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

[data-animation="fade-in"].animated {
  opacity: 1;
  transform: translateY(0);
}
```

**DO NOT:**
- Use AOS library or similar
- Use jQuery animate()
- Create animations with JavaScript (use CSS transitions/keyframes)

---

## CDN Libraries

### Allowed CDN Resources

**Prism.js (Syntax Highlighting):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>

<!-- Language-specific plugins (as needed) -->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-python.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.min.js"></script>
```

**Chart.js (Data Visualization):**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

**DO NOT add:**
- jQuery (use vanilla JavaScript)
- Bootstrap (use custom CSS)
- Font Awesome (use inline SVG icons instead, or a single CDN link if necessary)
- Any library requiring npm installation
- Lodash, Underscore, or utility libraries
- Moment.js (use native Date API)

---

## Styling Guidelines

### Use CSS Variables

**Always define in `css/variables.css`:**
```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-secondary: #7c3aed;
  --color-text: #1f2937;
  --color-background: #ffffff;
  --color-border: #e5e7eb;

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Courier New', Courier, monospace;
  --font-size-base: 16px;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --line-height-base: 1.6;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Breakpoints (for reference in JS) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;

  /* Z-index layers */
  --z-modal: 1000;
  --z-header: 100;
  --z-dropdown: 50;
}
```

**DO NOT:**
- Hardcode colors, fonts, or spacing values
- Use magic numbers without variables

### Mobile-First Responsive Design

**Write base styles for mobile, then enhance for larger screens:**

```css
/* Base mobile styles */
.container {
  padding: var(--spacing-md);
  max-width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xl);
  }

  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xl);
  }
}
```

**DO NOT:**
- Write desktop-first styles and scale down
- Use `max-width` media queries

### Accessibility Requirements

**Always include:**
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Proper heading hierarchy (h1 → h2 → h3, no skipping)
- Alt text for all images
- ARIA labels for interactive elements
- Focus styles for keyboard navigation
- Color contrast ratio ≥ 4.5:1 for text

**Reduced motion support:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Content Guidelines

### Using Existing Content

**Source:** `General Website Content.md` contains basic home page content

**Integration approach:**
1. Copy text content directly into appropriate HTML sections
2. Identify placeholders (marked with `[brackets]`)
3. Add TODO comments for missing content:
   ```html
   <!-- TODO: Add partner logos -->
   <!-- TODO: Replace with actual achievement data -->
   <!-- TODO: Embed 8-minute video demo -->
   ```

### Placeholder Content

When actual content is not available, use clear placeholders:

```html
<div class="placeholder">
  <p class="placeholder-text">📋 Content needed: Team member bio and photo</p>
</div>
```

```css
.placeholder {
  border: 2px dashed var(--color-border);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-radius: 8px;
  text-align: center;
}

.placeholder-text {
  color: #6b7280;
  font-style: italic;
}
```

---

## Performance Rules

### Image Optimization

**Always:**
- Add `loading="lazy"` to images below the fold
- Provide `width` and `height` attributes to prevent layout shift
- Compress images to <200KB each
- Use WebP format with JPEG fallback

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy" width="800" height="600">
</picture>
```

### Animation Performance

**Only animate these CSS properties (GPU-accelerated):**
- `transform`
- `opacity`

**DO NOT animate:**
- `width`, `height`, `top`, `left` (causes reflow)
- `color`, `background-color` (unless absolutely necessary)

**Use `will-change` sparingly:**
```css
.animated-element {
  /* Only add when animation is about to happen */
  will-change: transform, opacity;
}

.animated-element.animated {
  will-change: auto; /* Remove after animation completes */
}
```

### Script Loading

**Always load JavaScript with `defer`:**
```html
<script src="js/navigation.js" defer></script>
<script src="js/modal.js" defer></script>
<script src="js/animations.js" defer></script>
<script src="js/main.js" defer></script>
```

**Why `defer`:**
- Scripts execute after HTML parsing
- Maintains execution order
- Doesn't block page rendering

**DO NOT use `async`** (breaks execution order dependencies)

---

## Testing Requirements

### Before Committing Changes

**Run these checks:**

1. **Browser DevTools Console:** No errors or warnings
2. **Lighthouse Audit:** Performance, Accessibility, Best Practices all >90
3. **Responsive Testing:** Test at 320px, 768px, 1024px, 1920px widths
4. **Keyboard Navigation:** Can navigate entire site with Tab, Shift+Tab, ESC
5. **Cross-Browser:** Test in Chrome, Firefox, Safari (if on macOS)

### Manual Testing Checklist

**Navigation:**
- [ ] All nav links scroll to correct sections
- [ ] Active link updates based on scroll position
- [ ] Mobile menu opens/closes on hamburger click

**Modals:**
- [ ] All triggers open correct modal content
- [ ] Close button works
- [ ] ESC key closes modal
- [ ] Click outside modal closes it
- [ ] Body scroll locked when modal open

**Animations:**
- [ ] Elements animate when scrolled into view
- [ ] Animations don't cause janky scrolling
- [ ] Reduced motion preference respected

**Responsive:**
- [ ] Layout works on mobile, tablet, desktop
- [ ] Images scale appropriately
- [ ] Text remains readable at all sizes
- [ ] No horizontal scrolling

---

## Common Mistakes to Avoid

### ❌ DON'T: Add build tools

```bash
# NEVER do this
npm init
npm install webpack
npm install sass
```

### ✅ DO: Use vanilla code

```html
<!-- Just write HTML/CSS/JS -->
<link rel="stylesheet" href="css/styles.css">
<script src="js/script.js" defer></script>
```

---

### ❌ DON'T: Use template literals for HTML in JavaScript

```javascript
// Avoid this (hard to maintain, no syntax highlighting)
element.innerHTML = `
  <div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
`;
```

### ✅ DO: Use `<template>` tags in HTML

```html
<!-- Define once in HTML -->
<template id="card-template">
  <div class="card">
    <h2 class="card-title"></h2>
    <p class="card-description"></p>
  </div>
</template>
```

```javascript
// Clone and populate in JavaScript
const template = document.getElementById('card-template');
const clone = template.content.cloneNode(true);
clone.querySelector('.card-title').textContent = title;
clone.querySelector('.card-description').textContent = description;
container.appendChild(clone);
```

---

### ❌ DON'T: Create multiple HTML files

```
index.html
requirements.html  ❌
research.html      ❌
algorithms.html    ❌
```

### ✅ DO: Use single HTML with sections

```html
<!-- All in index.html -->
<section id="requirements">...</section>
<section id="research">...</section>
<section id="algorithms">...</section>
```

---

### ❌ DON'T: Use jQuery

```javascript
$('.button').on('click', function() { ... });
```

### ✅ DO: Use vanilla JavaScript

```javascript
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', () => { ... });
});
```

---

### ❌ DON'T: Hardcode colors

```css
.button {
  background-color: #3b82f6;
  color: #ffffff;
}
```

### ✅ DO: Use CSS variables

```css
.button {
  background-color: var(--color-primary);
  color: var(--color-white);
}
```

---

## Code Review Checklist

Before considering any code complete, verify:

- [ ] No build tools or compilation required
- [ ] Single HTML file for entire site
- [ ] CSS split into logical modules (reset, variables, layout, components, animations, responsive)
- [ ] JavaScript split into focused modules (navigation, modal, animations, main)
- [ ] Only approved CDN libraries used (Prism.js, Chart.js)
- [ ] All images have `loading="lazy"` and `alt` attributes
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA standards
- [ ] Responsive design tested at all breakpoints
- [ ] No console errors in browser DevTools
- [ ] Lighthouse scores: Performance >90, Accessibility >95
- [ ] Works in Chrome, Firefox, Safari, Edge

---

## Questions to Ask Before Making Changes

1. **Does this require a build tool?** → If yes, find another approach
2. **Can this be done with vanilla JavaScript?** → If yes, don't add a library
3. **Is this content in `General Website Content.md`?** → Use existing content first
4. **Should this be in `index.html`?** → Almost always yes (single-page design)
5. **Is this a new section?** → Add as `<section id="...">` in `index.html`
6. **Is this a reusable component?** → Style in `css/components.css`
7. **Is this a layout change?** → Update `css/layout.css`
8. **Is this responsive?** → Media queries in `css/responsive.css`
9. **Does this need animation?** → Use Intersection Observer + CSS transitions
10. **Is this accessible?** → Check keyboard nav, ARIA labels, color contrast

---

## Summary: Core Principles

1. **No Build Tools:** Must work by opening `index.html` directly
2. **Single HTML File:** All sections in one file, hash-based navigation
3. **Modular CSS/JS:** Split into logical files, not monolithic
4. **Vanilla JavaScript:** No jQuery, no frameworks
5. **CDN Only:** Prism.js and Chart.js are the only external dependencies
6. **Mobile-First:** Write base styles for mobile, enhance for desktop
7. **Accessibility First:** Semantic HTML, ARIA labels, keyboard navigation
8. **Performance First:** Lazy loading, GPU-accelerated animations, deferred scripts
9. **Use Existing Patterns:** Follow modal, animation, and navigation patterns defined here
10. **Test Everything:** Browser DevTools, Lighthouse, keyboard navigation, responsive design

---

## When in Doubt

**Ask yourself:** "Can I double-click `index.html` and see this working in a browser with no other steps?"

If the answer is **no**, you're doing it wrong.

If the answer is **yes**, you're on the right track.

---

Last Updated: 2026-02-10
