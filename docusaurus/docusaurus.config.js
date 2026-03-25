// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "LeadNow Dignitas",
  tagline: "Improve access to tailored, high-quality professional development for educators",
  favicon: "img/favicon.ico",

  themes: ["@docusaurus/theme-mermaid"],
  markdown: {
    mermaid: true,
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "http://students.cs.ucl.ac.uk",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/2025/group15/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "rgluo93", // GitHub org/user name.
  projectName: "Team_15_Website_Report", // Repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
      type: "text/css",
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/rgluo93/Team_15_Website_Report/tree/main/docusaurus/",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/rgluo93/Team_15_Website_Report/tree/main/docusaurus/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      colorMode: {
        defaultMode: "light",
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: "LeadNow Dignitas",
        logo: {
          alt: "LeadNow Dignitas Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            to: "/docs/requirements/partner-introduction",
            label: "Requirements",
            position: "left",
            activeBaseRegex: `/docs/requirements/`,
          },
          {
            to: "/docs/research/related-projects",
            label: "Research",
            position: "left",
            activeBaseRegex: `/docs/research/`,
          },
          {
            to: "/docs/ui-design/design-principles",
            label: "UI Design",
            position: "left",
            activeBaseRegex: `/docs/ui-design/`,
          },
          {
            to: "/docs/system-design/system-architecture",
            label: "System Design",
            position: "left",
            activeBaseRegex: `/docs/system-design/`,
          },
          {
            to: "/docs/implementation/mobile",
            label: "Implementation",
            position: "left",
            activeBaseRegex: `/docs/implementation/`,
          },
          {
            to: "/docs/testing/testing-strategy",
            label: "Testing",
            position: "left",
            activeBaseRegex: `/docs/testing/`,
          },
          {
            to: "/docs/evaluation/summary-of-achievements",
            label: "Evaluation",
            position: "left",
            activeBaseRegex: `/docs/evaluation/`,
          },
          {
            to: "/docs/conclusion/individual-contribution",
            label: "Conclusion",
            position: "left",
            activeBaseRegex: `/docs/conclusion/`,
          },
          {
            to: "/docs/appendices/user-and-deployment-manual",
            label: "Appendices",
            position: "left",
            activeBaseRegex: `/docs/appendices/`,
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/rgluo93/Team_15_Website_Report",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            title: "Report",
            items: [
              {
                label: "Project Overview",
                to: "/docs/intro",
              },
              {
                label: "Requirements",
                to: "/docs/requirements/partner-introduction",
              },
              {
                label: "Implementation",
                to: "/docs/implementation/mobile",
              },
            ],
          },
          {
            title: "Partners",
            items: [
              {
                label: "Dignitas Kenya",
                href: "https://dignitas.ngo",
              },
              {
                label: "UCL Computer Science",
                href: "https://www.ucl.ac.uk/computer-science/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/rgluo93/Team_15_Website_Report",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} LeadNow Project - Team 15, Dignitas Technologies. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['dart'],
      },
    }),
};

export default config;
