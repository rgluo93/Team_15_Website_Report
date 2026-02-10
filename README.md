# LeadNow AI Project Report Website

An interactive project report website for the LeadNow AI coaching platform developed for Dignitas Kenya.

## Project Overview

**Purpose:** Showcase the complete LeadNow project through an interactive, professional web-based report covering all aspects from requirements to evaluation.

**Technology:** Pure HTML/CSS/JavaScript (no build tools, no compilation, no frameworks)

**Pages:**
1. Home
2. Requirements
3. Research
4. Algorithms
5. UI Design
6. System Design
7. Implementation
8. Testing
9. Evaluation
10. Conclusion
11. Appendices

---

## Quick Start

### Running Locally

Simply open `index.html` in any modern web browser:

```bash
# Option 1: Double-click index.html in file explorer

# Option 2: Open from terminal (macOS)
open index.html

# Option 3: Open from terminal (Linux)
xdg-open index.html

# Option 4: Open from terminal (Windows)
start index.html

# Option 5: Run a local server (optional, but recommended for testing)
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000

# Then visit: http://localhost:8000
```

### Browser Requirements

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features:**
- CSS Grid and Flexbox
- Intersection Observer API
- CSS Custom Properties (variables)
- ES6 JavaScript

---

## Project Structure

```
/Users/ronald/Projects/Dignitas/Team_15_Website_Report/
│
├── index.html                    # Main single-page application
│
├── css/
│   ├── reset.css                # Browser normalization
│   ├── variables.css            # Design system (colors, fonts, spacing)
│   ├── layout.css               # Page layouts and grid systems
│   ├── components.css           # Reusable UI components
│   ├── animations.css           # CSS animations and transitions
│   └── responsive.css           # Media queries for all breakpoints
│
├── js/
│   ├── navigation.js            # Smooth scroll and active link tracking
│   ├── modal.js                 # Pop-up/modal system
│   ├── animations.js            # Scroll-triggered animations
│   └── main.js                  # App initialization
│
├── assets/
│   ├── images/
│   │   ├── logos/              # Partner and Dignitas logos
│   │   ├── team/               # Team member photos
│   │   ├── diagrams/           # Architecture diagrams
│   │   └── screenshots/        # UI mockups and screenshots
│   ├── videos/
│   │   └── demo.mp4            # Project demo video
│   └── documents/
│       └── appendices.pdf      # Supplementary materials
│
├── README.md                    # This file
└── CLAUDE.md                    # Development guidelines and constraints
```

---

## Architecture

### Single-Page Application (SPA)

The website is built as a single HTML file with 10 major sections. Navigation between sections uses smooth scrolling with hash-based URLs (e.g., `#requirements`, `#algorithms`).

**Benefits:**
- No page reloads, seamless user experience
- Simpler to maintain than multiple HTML files
- Instant navigation between sections
- Works perfectly without a server

### Navigation System

- **Fixed header:** Always visible at top of page
- **Smooth scrolling:** CSS `scroll-behavior: smooth` with JavaScript fallback
- **Active link tracking:** Intersection Observer API detects visible section and highlights corresponding nav link
- **Mobile menu:** Hamburger menu for small screens

### Modal/Pop-up System

Interactive elements throughout the site use a data-attribute pattern:

```html
<!-- Trigger -->
<button data-modal="algorithm-details">View Algorithm Details</button>

<!-- Content (hidden until triggered) -->
<template id="algorithm-details">
  <h2>Algorithm Details</h2>
  <p>Content here...</p>
</template>
```

**Features:**
- Single modal instance (performance optimized)
- ESC key to close
- Click outside modal to close
- Body scroll locked when modal open
- Keyboard accessible (focus trap)

### Animation System

Scroll-triggered animations using Intersection Observer API (no external libraries):

```html
<div data-animation="fade-in" data-animation-delay="200">
  Content animates when scrolled into view
</div>
```

**Available animations:**
- `fade-in` - Fade in from below
- `fade-in-up` - Fade in moving upward
- `slide-left` - Slide in from left
- `slide-right` - Slide in from right
- `scale-up` - Scale up from smaller size
- `stagger` - Sequential animation for lists

### Responsive Design

Mobile-first approach with three main breakpoints:

- **Mobile:** 320px - 767px (base styles)
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

All layouts adapt using CSS Grid and Flexbox.

---

## External Dependencies (CDN)

The site uses only two external libraries loaded via CDN:

### 1. Prism.js (Syntax Highlighting)
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
```
**Purpose:** Syntax highlighting for code snippets in the Algorithms and Implementation sections
**Size:** ~10KB
**Why:** Essential for readable code examples, minimal overhead

### 2. Chart.js (Data Visualization)
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```
**Purpose:** Bar charts, line graphs, and pie charts in the Evaluation section
**Size:** 64KB
**Why:** Professional data visualization without manual SVG creation

---

## Performance Optimizations

1. **Lazy Loading:** Images use `loading="lazy"` attribute to defer offscreen images
2. **Video Loading:** Video poster image shown initially, full video loads on user interaction
3. **Image Optimization:** All images compressed, WebP format with JPEG fallback, <200KB each
4. **CSS/JS Loading:** Critical CSS inline, non-critical CSS and JS deferred
5. **Animation Performance:** Only animate `transform` and `opacity` (GPU-accelerated properties)
6. **Single Modal Instance:** Reusable modal reduces DOM elements

**Target Performance:**
- Lighthouse Performance Score: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3.0s
- Total page size: <2MB (without video)

---

## Accessibility

The website follows WCAG 2.1 AA standards:

- ✓ Semantic HTML with proper heading hierarchy
- ✓ Keyboard navigation support (tab, shift+tab, ESC)
- ✓ ARIA labels for all interactive elements
- ✓ Alt text for all images
- ✓ Color contrast ratio >4.5:1 for text
- ✓ Focus indicators visible on all interactive elements
- ✓ Respects `prefers-reduced-motion` setting
- ✓ Screen reader compatible

**Testing Tools:**
- Lighthouse (Chrome DevTools)
- WAVE (WebAIM)
- axe DevTools
- Keyboard navigation testing
- Screen reader testing (VoiceOver, NVDA)

---

## Content Sections

### 1. Home
- Hero banner with project title
- Mission statement
- Problem statement and solution abstract
- 8-minute video demo
- Key features overview
- Project timeline
- Team member profiles

### 2. Requirements
- Functional requirements
- Non-functional requirements
- Requirement categorization and filtering

### 3. Research
- Literature review
- Competitive analysis
- Research methodology

### 4. Algorithms
- RAG (Retrieval-Augmented Generation) architecture
- AI model details
- Prompt engineering strategies
- Code examples with syntax highlighting

### 5. UI Design
- Wireframes and mockups
- Design system documentation
- Color palette
- Typography guidelines

### 6. System Design
- High-level architecture
- Detailed system design
- Database schema
- API design
- Deployment architecture

### 7. Implementation
- Technology stack
- Code highlights
- Development process
- Challenges and solutions

### 8. Testing
- Testing strategy
- Test results and metrics
- Unit tests
- User acceptance testing

### 9. Evaluation
- MoSCoW checklist
- Known bugs
- Individual contribution tables
- Critical evaluation
- Future work

### 10. Conclusion
- Project summary
- Key achievements
- Lessons learned
- Future work and roadmap

### 11. Appendices
- Supplementary materials
- Detailed references
- Additional documentation

---

## Development Guidelines

### Adding New Content

1. **Text Content:** Edit `index.html` directly in the appropriate section
2. **Images:** Add to `assets/images/` subdirectory, reference in HTML with relative path
3. **Videos:** Add to `assets/videos/`, embed in HTML with `<video>` tag
4. **Modals:** Create `<template>` tag with unique ID, add trigger button with `data-modal="template-id"`

### Adding New Animations

```html
<!-- Add data-animation attribute to any element -->
<div data-animation="fade-in" data-animation-delay="300">
  This will animate 300ms after scrolling into view
</div>
```

### Styling Guidelines

- **Use CSS variables:** Defined in `css/variables.css` for colors, fonts, spacing
- **Component-based:** New components go in `css/components.css`
- **Responsive-first:** Write mobile styles in main CSS, overrides in `css/responsive.css`
- **Animation classes:** Add new animations in `css/animations.css`

### JavaScript Guidelines

- **Vanilla JS only:** No jQuery, no frameworks
- **Module pattern:** Each JS file exports functions/classes via IIFE or object
- **Event delegation:** Use for dynamically created elements
- **Performance:** Use `requestAnimationFrame` for animations, `debounce` for scroll events

---

## Testing Checklist

### Functionality
- [ ] All navigation links work and scroll to correct sections
- [ ] Active nav link updates based on scroll position
- [ ] Mobile menu opens and closes
- [ ] All modal triggers open correct content
- [ ] Modals close with close button, ESC key, and outside click
- [ ] Video plays when clicked
- [ ] Charts render correctly
- [ ] Syntax highlighting displays on code blocks

### Animations
- [ ] Elements animate when scrolled into view
- [ ] Animation delays work correctly
- [ ] Animations are smooth (60fps)
- [ ] Respects prefers-reduced-motion setting

### Responsive Design
- [ ] Layout works at 320px width (iPhone SE)
- [ ] Layout works at 768px width (iPad)
- [ ] Layout works at 1024px+ width (Desktop)
- [ ] Images scale appropriately
- [ ] Text remains readable at all sizes
- [ ] Mobile menu works on small screens

### Accessibility
- [ ] Can navigate entire site with keyboard
- [ ] Focus indicators visible
- [ ] Screen reader announces content correctly
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA
- [ ] Headings in logical order (h1 → h2 → h3)

### Performance
- [ ] Lighthouse Performance score >90
- [ ] Images lazy load
- [ ] Page loads in <3 seconds on 3G
- [ ] No console errors or warnings

### Cross-Browser
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## Deployment

### GitHub Pages

1. Create GitHub repository
2. Push code to `main` branch
3. Go to Settings → Pages
4. Select `main` branch as source
5. Site will be live at `https://username.github.io/repo-name/`

### Netlify

1. Drag and drop project folder to Netlify dashboard
2. Or connect GitHub repository for automatic deployment
3. Site live in seconds with automatic HTTPS

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Simple File Hosting

Since there are no build steps, you can also:
- Upload to university web server via FTP
- Host on AWS S3 as static website
- Share via any web hosting provider

---

## Troubleshooting

### Animations not working
- **Check browser support:** Intersection Observer requires modern browser
- **Check console:** Look for JavaScript errors
- **Check element visibility:** Elements must scroll into viewport to trigger

### Modal not opening
- **Check data-modal attribute:** Must match template ID exactly
- **Check template exists:** Template element with matching ID must be in HTML
- **Check JavaScript loading:** Ensure `modal.js` is loaded with `defer` attribute

### Navigation not highlighting active section
- **Check section IDs:** Each section must have `id` attribute matching nav links
- **Check Intersection Observer:** Console should show no errors
- **Check viewport overlap:** Sections must be large enough to trigger observer

### Responsive design not working
- **Check viewport meta tag:** Must be in `<head>`: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Check media queries:** Ensure `responsive.css` is loaded
- **Clear browser cache:** Old styles may be cached

---

## Contributing

This is a project report website, so contributions are typically not needed. However, if you're working on this project:

1. Maintain the HTML/CSS/JavaScript-only constraint (no build tools)
2. Follow the existing code structure and naming conventions
3. Test all changes across multiple browsers and devices
4. Update this README if you add new features or change the structure
5. Run accessibility and performance audits before finalizing changes

---

## License

This project is for educational purposes as part of the Dignitas Kenya LeadNow project.

---

## Contact

For questions about this website or the LeadNow project, please refer to the Team section on the website.

---

## Acknowledgments

- **Dignitas Kenya** - Project partner
- **LeadNow Team** - Development and implementation
- **Educators in Kenya** - The ultimate beneficiaries of this project

---

Last Updated: 2026-02-10
