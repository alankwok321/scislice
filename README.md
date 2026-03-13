# SciSlice

SciSlice is a lightweight, static science-word explorer that breaks terms into prefixes, roots, and suffixes, compares related concepts, and uses Gemini for on-demand analysis/TTS.

## Features
- Slice science words into morphological parts
- Compare paired terms side-by-side
- Save favorite words locally in the browser
- Analyze new science words with Gemini
- Play AI-generated pronunciation/audio

## Project structure
- `index.html` — app shell and layout
- `assets/css/styles.css` — custom animations/utility styles
- `assets/js/app.js` — app state and interaction logic
- `assets/icons/favicon.svg` — favicon
- `vercel.json` — simple static Vercel config

## Local usage
Just open `index.html`, or serve the directory with any static server.

## Deployment
### GitHub
Push to a GitHub repo, e.g. `alankwok321/scislice`

### Vercel
Import the GitHub repo into Vercel or run:

```bash
vercel --prod
```

## Notes
- API keys are currently stored in `localStorage` in the browser.
- This is a static client-side app; no backend is required.
