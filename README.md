# cbwomack.github.io

Chris Womack's research website: Home, Publications, About and the CV.

Built with SvelteKit as plain prerendered pages. GitHub Pages hosts it, and a GitHub Actions workflow
(`.github/workflows/deploy.yml`) builds and publishes it on every push to `main`. Pull requests run
`ci` (check, lint and build) without publishing.

## Work on it locally

Needs Node 22 or newer.

```sh
npm ci            # install exactly what package-lock.json lists
npm run dev       # live preview at http://localhost:5173
npm run check     # type and Svelte checks
npm run lint      # Prettier and ESLint
npm run build     # the static site, written to build/
npm run preview   # serve build/ locally
```

## Where things are

| What                                                 | Where                                                                                                                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Text about Chris (name, role, bio, interests, links) | `src/lib/data/site.ts`                                                                                                                                             |
| Publications                                         | `src/lib/data/publications.ts` (newest first; grouped on the page as "Articles and preprints" and "Theses")                                                        |
| The highlighted papers on Home                       | `src/routes/+page.svelte` (`picks`)                                                                                                                                |
| Header links                                         | `src/lib/data/nav.ts`                                                                                                                                              |
| Colours, type and spacing                            | `src/app.css`                                                                                                                                                      |
| Home page                                            | `src/routes/+page.svelte`                                                                                                                                          |
| Publications, About, 404                             | `src/routes/publications/`, `src/routes/about/`, `src/routes/404/`                                                                                                 |
| The live Disc on Home                                | `static/disc/` (`home.js` mounts it; `disc-embed.js` and `disc-worker.js` draw it; `data/` holds the study data)                                                   |
| Disc still images                                    | `static/disc/disc.png` (no-script fallback), `static/disc/mark.png` (header), `static/og.png` (link previews), `static/favicon.png`, `static/apple-touch-icon.png` |
| Font                                                 | `static/fonts/IBMPlexSans-Var.ttf` (IBM Plex Sans, SIL Open Font License: `static/fonts/OFL.txt`)                                                                  |
| Deploy                                               | `.github/workflows/deploy.yml`                                                                                                                                     |
