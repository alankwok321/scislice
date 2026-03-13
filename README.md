# SciSlice

SciSlice is now organized as a small modular static app.

## Features
- Slice science words into prefix/root/suffix parts
- Compare related scientific terms
- Save favorites locally
- Analyze new words with Gemini
- AI pronunciation / TTS playback
- Dark mode toggle

## Structure
- `index.html` — app shell
- `assets/css/styles.css` — shared styles/animations
- `assets/js/app.js` — app bootstrap
- `assets/js/modules/data.js` — seed data, icons, initial state
- `assets/js/modules/ui.js` — rendering and theme logic
- `assets/js/modules/audio.js` — TTS playback
- `assets/js/modules/analyze.js` — Gemini analysis flow
- `assets/icons/favicon.svg` — favicon

## Deploy
Push to GitHub and deploy on Vercel as a static site.
