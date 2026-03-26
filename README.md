# LeadNow AI Project Report Website

An interactive project report website for the LeadNow AI coaching platform developed for Dignitas Kenya.

## Project Overview

**Purpose:** Showcase the complete LeadNow project through an interactive, professional web-based report covering all aspects from requirements to evaluation.

**Technology:** Docusaurus 3.9 (React, MDX, static site generator)

**Sections:**
1. Home / Project Overview
2. Requirements
3. Research
4. UI Design
5. System Design
6. Implementation
7. Testing
8. Evaluation
9. Conclusion
10. Appendices

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) version 20.0 or above

### Running Locally

```bash
cd docusaurus
npm install
npm start

# Visit http://localhost:3000
```

### Building for Production

```bash
cd docusaurus
npm run build

# Static files output to docusaurus/build/
```

### Browser Requirements

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Project Structure

```
Team_15_Website_Report/
├── docusaurus/
│   ├── docs/                        # MDX/Markdown documentation pages
│   │   ├── intro.mdx                # Home/overview page (docs landing)
│   │   ├── requirements/            # Requirements section (6 pages)
│   │   ├── research/                # Research section
│   │   ├── ui-design/               # UI Design section (6 pages)
│   │   ├── system-design/           # System Design section (5 pages)
│   │   ├── implementation/          # Implementation section (13 pages)
│   │   ├── testing/                 # Testing section (5 pages)
│   │   ├── evaluation/              # Evaluation section (5 pages)
│   │   ├── conclusion/              # Conclusion section
│   │   └── appendices/              # Appendices section (4 pages)
│   ├── src/
│   │   ├── pages/index.js           # Landing page (redirects to docs)
│   │   ├── components/              # Reusable React components
│   │   │   ├── HeroSection/         # Hero banner with gradient
│   │   │   ├── MissionBox/          # Mission statement component
│   │   │   ├── AbstractCards/       # Problem/Solution/Impact cards
│   │   │   ├── VideoDemo/           # Video demo placeholder
│   │   │   ├── FeatureCards/        # AI feature cards
│   │   │   └── TeamSection/         # Team member grid
│   │   └── css/custom.css           # Global style overrides
│   ├── static/img/                  # Static assets
│   ├── docusaurus.config.js         # Site configuration
│   ├── sidebars.js                  # Sidebar navigation
│   └── package.json                 # Dependencies
├── CLAUDE.md                        # Development guidelines
└── README.md                        # This file
```

---

## Architecture

### Docusaurus Static Site Generator

The website is built with [Docusaurus 3.9](https://docusaurus.io/), which generates a static site from MDX/Markdown content. Key features:

- **MDX Support:** Write Markdown with embedded React components for rich layouts
- **Automatic Navigation:** Sidebar and navbar configured via `docusaurus.config.js` and `sidebars.js`
- **Built-in Search:** Full-text search across all documentation pages
- **Dark Mode:** Toggle between light and dark themes
- **Responsive:** Mobile-friendly layout out of the box

### Content Pages

Documentation content lives in `docs/` as `.md` or `.mdx` files. Each file uses frontmatter for metadata:

```markdown
---
sidebar_position: 1
title: "Page Title"
---

# Content here
```

### Custom Components

Rich layouts (hero sections, card grids, team profiles) are built as React components in `src/components/` and imported into MDX pages.

### Styling

- **Infima CSS Framework:** Docusaurus's built-in CSS framework, customized via CSS variable overrides in `src/css/custom.css`
- **CSS Modules:** Component-scoped styles using `.module.css` files
- **Design System:** LeadNow teal (#215265) primary, lighter teal (#2a6f7f) secondary, orange (#ea580c) accent

---

## Dependencies

All dependencies are managed via `package.json`:

- **Docusaurus 3.9** — Static site generator
- **React 19** — UI components
- **Prism React Renderer** — Syntax highlighting (built into Docusaurus)
- **clsx** — Conditional CSS class names
- **MDX** — JSX in Markdown

---

## Deployment

The site is configured for deployment at `http://students.cs.ucl.ac.uk/2025/group15/`.

```bash
cd docusaurus
npm run build

# Upload contents of build/ to the web server
```

The `url` and `baseUrl` settings in `docusaurus.config.js` control the deployment path.

---

## Development Guidelines

### Adding New Content

1. **New doc page:** Create a `.md` file in the appropriate `docs/` subdirectory with frontmatter
2. **Rich layouts:** Use `.mdx` extension and import React components
3. **Images:** Add to `static/img/`, reference as `/img/filename.png` in Markdown
4. **New component:** Create in `src/components/ComponentName/index.js`

### Styling

- Override Infima variables in `src/css/custom.css`
- Use CSS Modules for component-scoped styles
- Follow the existing design system colors and spacing

### Testing

- Run `npm run build` to catch broken links and build errors
- Test responsive layout at 320px, 768px, 1024px, 1920px
- Verify keyboard navigation works
- Check browser DevTools console for errors

---

## Accessibility

The website follows WCAG 2.1 AA standards:

- Semantic HTML with proper heading hierarchy
- Keyboard navigation support
- ARIA labels for interactive elements
- Alt text for all images
- Color contrast ratio >4.5:1 for text
- Respects `prefers-reduced-motion` setting

---

## License

This project is for educational purposes as part of the Dignitas Kenya LeadNow project.

---

## Acknowledgments

- **Dignitas Kenya** — Project partner
- **LeadNow Team** — Development and implementation
- **Educators in Kenya** — The ultimate beneficiaries of this project

---

Last Updated: 2026-03-23
