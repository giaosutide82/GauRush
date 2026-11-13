# GauRush Website — Promo Video Hero

This website uses the original GauRush logo and preserves all four application demonstration videos.

## Hero

- Background video: `assets/promo.mp4` (the supplied original file, with no re-encoding).
- Poster: `assets/promo-poster.jpg` (extracted from promo video).
- Centered title, subtitle and existing CTA buttons.
- Full-bleed video uses `autoplay muted loop playsinline` without video controls or playhead.
- Video fills the viewport width; `object-fit: cover` may crop its edges on smaller screens.
- No torus particle canvas remains.

## Workspace

The existing View, Crop, Lasso and Animate MP4 demonstrations and poster images remain intact.

## Local preview

Serve the folder with `python -m http.server 8000` and open http://localhost:8000.

## Deployment

Copy the complete folder contents into your site's publishing directory and confirm the installer URL is correct. Large video files may be better hosted on a CDN.


## Scroll motion update

The website now uses progressive scroll-in reveals for content, subtle scroll-linked float on the workspace footage and selected visual elements, and gentle parallax on the promo video. Motion is disabled when the visitor enables **Reduce Motion** in their OS settings. No animation framework is required. Native scrolling, demo tabs and video playback are unchanged.

## Web video optimization

This release is optimized to stay below a **25 MB total ZIP package**.
- `assets/promo.mp4`: H.264, 1280×720, 24 fps, no audio, fast-start MP4. Autoplays muted in the hero.
- `assets/view.mp4`, `crop.mp4`, `lasso.mp4`, `animate.mp4`: H.264, 1600×900, original 24 fps, no audio, fast-start MP4.
- All existing SVG and JPEG assets, design files, tab-switching, and scroll effects are retained.
- Hosting providers may impose different limits; this 25 MB limit refers to the complete ZIP file, not compressed network transfer size.
