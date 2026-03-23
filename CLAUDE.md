# Claude Development Guidelines for LeadNow Project Report Website

This file contains important constraints, patterns, and guidelines for working on this project with Claude Code.

---

## CRITICAL CONSTRAINTS

### Technology Stack

**This project uses Docusaurus 3.9 (React-based static site generator).**

**ALWAYS use:**
- Docusaurus 3.9 with the classic preset
- React (JSX) for custom components in `src/components/`
- MDX for documentation pages in `docs/`
- CSS Modules (`.module.css`) for component-scoped styles
- `src/css/custom.css` for global Infima variable overrides and shared styles
- Dependencies from `package.json` (managed via npm)

**DO NOT:**
- Add unnecessary npm dependencies without justification
- Use CSS-in-JS libraries (styled-components, emotion, etc.) — use CSS Modules or custom.css
- Bypass Docusaurus conventions (e.g., don't create raw HTML pages outside `src/pages/`)

**Rationale:** Run `cd docusaurus && npm start` to develop locally. The site builds to static HTML via `npm run build`.

---

## Architecture

### Project Structure

```
docusaurus/
├── docs/                        # MDX/Markdown documentation pages
│   ├── intro.mdx                # Home/overview page (docs landing)
│   ├── requirements/            # Requirements section
│   ├── research/                # Research section
│   ├── ui-design/               # UI Design section
│   ├── system-design/           # System Design section
│   ├── implementation/          # Implementation section
│   ├── testing/                 # Testing section
│   ├── evaluation/              # Evaluation section
│   ├── conclusion/              # Conclusion section
│   └── appendices/              # Appendices section
├── src/
│   ├── pages/index.js           # Landing page (redirects to docs/intro)
│   ├── components/              # Reusable React components
│   │   ├── HeroSection/
│   │   ├── MissionBox/
│   │   ├── AbstractCards/
│   │   ├── VideoDemo/
│   │   ├── FeatureCards/
│   │   └── TeamSection/
│   └── css/custom.css           # Global style overrides (Infima + custom)
├── static/img/                  # Static assets (images, favicon, etc.)
├── docusaurus.config.js         # Site configuration (navbar, footer, metadata)
├── sidebars.js                  # Sidebar navigation configuration
└── package.json                 # Dependencies and scripts
```

### Adding Content

- **New documentation page:** Create a `.md` or `.mdx` file in the appropriate `docs/` subdirectory with frontmatter (`sidebar_position`, `title`)
- **Rich layouts in docs:** Use `.mdx` extension and import React components from `src/components/`
- **New standalone page:** Create in `src/pages/` as a React component (`.js`) or Markdown (`.md`)
- **New reusable component:** Create in `src/components/ComponentName/index.js`

### Navigation

Navigation is configured in `docusaurus.config.js` under `themeConfig.navbar.items`. Each section uses `activeBaseRegex` for active link highlighting. Sidebar navigation for docs is configured in `sidebars.js`.

---

## Styling

### Infima Variables

Override Docusaurus theme colors in `src/css/custom.css` using Infima variables:

```css
:root {
  --ifm-color-primary: #2563eb;
  /* ... full shade palette ... */
}
```

### Custom Design Tokens

For styles not covered by Infima, define custom CSS variables in `custom.css`:
- `--color-secondary` (purple), `--color-accent` (orange)
- Shadow, spacing, and border-radius scales

### Component Styles

- **Global/shared styles:** Add to `src/css/custom.css`
- **Component-scoped styles:** Use CSS Modules (`styles.module.css` co-located with the component)
- **DO NOT** hardcode colors, fonts, or spacing — use CSS variables

### Design System Colors

- Primary: `#2563eb` (blue)
- Secondary: `#7c3aed` (purple)
- Accent: `#ea580c` (orange, Kenya-inspired)
- Text: `#1f2937`, Background: `#ffffff`

---

## Dependencies

Managed via `package.json` in the `docusaurus/` directory.

**Built-in (no extra install needed):**
- Prism.js — syntax highlighting (configured in `docusaurus.config.js` under `prism`)
- MDX support — JSX in Markdown
- React 19

**Install via npm if needed:**
- Chart.js: `npm install chart.js react-chartjs-2`

---

## Accessibility

- Proper heading hierarchy (h1 → h2 → h3, no skipping)
- Alt text for all images
- ARIA labels for interactive elements
- Focus styles for keyboard navigation
- Color contrast ratio ≥ 4.5:1 for text
- Reduced motion support in CSS

---

## Performance

- Use `loading="lazy"` on images below the fold
- Provide `width` and `height` attributes on images
- Compress images to <200KB each
- Only animate `transform` and `opacity` (GPU-accelerated)

---

## Testing

### Before Committing Changes

1. **`npm run build`** — Must complete without errors (catches broken links, missing images)
2. **`npm start`** — Verify pages render correctly in dev server
3. **Browser DevTools Console:** No errors or warnings
4. **Responsive Testing:** Test at 320px, 768px, 1024px, 1920px widths
5. **Keyboard Navigation:** Tab, Shift+Tab, ESC all work
6. **Cross-Browser:** Chrome, Firefox, Safari

---

## When in Doubt

**Ask yourself:** "Does `cd docusaurus && npm start` work, and does the page look correct?"

If the answer is **no**, investigate the build error or rendering issue.

If the answer is **yes**, you're on the right track.

---

Last Updated: 2026-03-23
