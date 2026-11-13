# GauRush — Official Website

The official website for **GauRush**, a Windows desktop application for viewing, editing, animating, and exporting 3D Gaussian splats.

This repository contains the source code, visual assets, and interactive components for the GauRush product website.

## About GauRush

GauRush is a desktop workspace designed for artists and creators working with 3D Gaussian splatting.

The application provides tools to:

- Import and inspect PLY, SPLAT, and KSPLAT files.
- Navigate and explore Gaussian splat captures in 3D.
- Load, play, and inspect animated splat sequences.
- Remove unwanted splats using lasso selection.
- Crop captures using adjustable 3D volumes.
- Transform and organize scene objects.
- Animate crop volumes with keyframes.
- Save projects and export edited frames or sequences.

The website introduces these capabilities through interactive demonstrations and recorded footage of the application.

## Website Features

- **Responsive design** — Optimized layouts for desktop, tablet, and mobile.
- **Interactive hero** — An animated Gaussian splat visualization.
- **Workspace showcase** — Actual GauRush application footage demonstrating its editing tools.
- **Feature navigation** — Switch between viewing, cropping, lasso cleanup, and animation demonstrations.
- **Download section** — Provides access to the Windows installer.
- **Lightweight architecture** — Built using native HTML, CSS, and JavaScript.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure and semantic content |
| CSS3 | Layout, styling, responsive design, and transitions |
| JavaScript | Interactive elements, animations, and video switching |
| Canvas API | Procedural Gaussian splat visualization |
| HTML5 Video | Application demonstration playback |

No frontend framework or build system is required.

## Project Structure

```text
GauRush-Website/
├── index.html          # Main website
├── site.css            # Styles and responsive layouts
├── site.js             # Interactive functionality
├── assets/
│   ├── icon.svg        # Official GauRush logo
│   ├── view.webm        # View and playback demonstration
│   ├── view.jpg
│   ├── crop.webm        # Crop volume demonstration
│   ├── crop.jpg
│   ├── lasso.webm       # Lasso cleanup demonstration
│   ├── lasso.jpg
│   ├── animate.webm     # Animation demonstration
│   └── animate.jpg
└── README.md
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

Replace the URL with the actual repository address.

### Run locally

You can open `index.html` directly in a modern web browser.

For a local development server, run:

```bash
python -m http.server 8000
```

Then visit:

`http://localhost:8000`

No dependency installation or compilation is required.

## Updating the Website

1. Edit `index.html` to update content and page structure.
2. Edit `site.css` to modify the visual design and responsive layouts.
3. Edit `site.js` to modify interactions, animations, or video behavior.
4. Update files inside `assets/` when changing logos, demo footage, or images.
5. Test locally before publishing.
6. Commit and push the changes to GitHub.

### Publishing updates

```bash
git add .
git commit -m "Update GauRush website"
git push origin main
```

Replace `main` with the repository's publishing branch if different.

If GitHub Pages is configured, updates will be published according to the repository's deployment settings.

## Application Downloads

The website provides a download entry point for the GauRush Windows installer.

**Displayed application version:** `0.30.0`  
**Platform:** Windows x64

Before publishing a new application release, verify that the website's version number, installer URL, file size, and SHA-256 checksum match the actual release.

The application installer is not necessarily hosted in this repository.

## Design and Branding

GauRush uses a visual identity inspired by spatial computing, 3D graphics, and creative production tools.

The website is designed to emphasize the application itself, with original interface recordings, purposeful animations, and a minimal presentation.

The official GauRush logo is stored in `assets/icon.svg`.

## Browser Compatibility

The website is intended for modern browsers supporting HTML5 Canvas, CSS Grid, and HTML5 video playback.

Recommended browsers include Chrome, Edge, Firefox, and Safari.

## Maintainer

**T28**

Website and application branding: GauRush.

## License

Copyright © 2026 T28. All rights reserved.

The GauRush website, including its source code, visual assets, branding, and original content, is proprietary. Unauthorized copying, modification, redistribution, or commercial use is prohibited.
