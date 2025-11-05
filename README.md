# kev.in

Personal blog built with [Astro](https://astro.build), featuring a clean, minimal design with a prominent sidebar.

Live site: [https://kev.in](https://kev.in)

## Overview

This is a modern, fast static site built with Astro 4, migrated from Jekyll. The site features:

- **Fast performance** - Static site generation with Astro
- **Blog with pagination** - Organized blog posts with tag support
- **RSS feed** - Automatic RSS feed generation
- **Sitemap** - SEO-friendly sitemap generation
- **Markdown support** - Write posts in Markdown with syntax highlighting
- **Clean design** - Minimal, readable layout with sidebar navigation

## Tech Stack

- [Astro 4.15](https://astro.build) - Static site generator
- TypeScript - Type-safe development
- GitHub Actions - Automated deployment
- GitHub Pages - Hosting

## Project Structure

```
/
├── public/          # Static assets (images, icons, etc.)
├── src/
│   ├── content/
│   │   └── blog/    # Blog posts in Markdown
│   ├── layouts/     # Astro layouts
│   │   ├── BaseLayout.astro
│   │   └── BlogPost.astro
│   ├── pages/       # Astro pages (routes)
│   │   ├── index.astro
│   │   ├── [year]/  # Dynamic blog post routes
│   │   ├── tags/    # Tag pages
│   │   └── feed.xml.ts
│   ├── styles/      # CSS styles
│   └── utils/       # Utility functions
├── astro.config.mjs # Astro configuration
└── package.json     # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/kevn/kevn.github.io.git
cd kevn.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

### Writing Blog Posts

Blog posts are stored in `src/content/blog/` as Markdown files. Each post should include frontmatter:

```markdown
---
title: "Your Post Title"
date: 2024-01-01
tags: [tag1, tag2]
---

Your post content here...
```

### Styling

Global styles are in `src/styles/`. The site uses a clean, minimal design with a focus on readability.

### Configuration

Edit `astro.config.mjs` to customize:
- Site URL
- Integrations
- Markdown settings
- Build options

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `master` branch via GitHub Actions.

### Manual Deployment

```bash
# Build the site
npm run build

# The output will be in the dist/ directory
```

## Features

### Syntax Highlighting

Code blocks are automatically highlighted using Shiki with the GitHub Light theme.

### RSS Feed

An RSS feed is automatically generated at `/feed.xml`

### Sitemap

A sitemap is automatically generated for SEO at `/sitemap-0.xml`

### Pagination

Blog posts are paginated on the home page for better performance.

### Tags

Posts can be tagged and browsed by tag at `/tags`

## Migration Notes

This site was migrated from Jekyll (Hyde theme) to Astro in 2024. Legacy blog posts may contain HTML that is preserved through the markdown pipeline.

## License

Open sourced under the [MIT license](LICENSE.md).

## Author

Kevin Marshall
- Website: [https://kev.in](https://kev.in)
- GitHub: [@kevn](https://github.com/kevn)
