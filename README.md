# Riya & Prashant — wedding invitation

A mobile-first React, TypeScript, Vite and Tailwind invitation. Decorative artwork is original CSS and SVG; no couple photographs are included.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Run `npm run build` for a production build and `npm run preview` to preview it.

## Customize

Edit `src/data.ts` for names, family details, invocations, event information, venues, messages and photo paths. The three pre-wedding venues are intentionally `null` until confirmed. Event cards only show a venue when one is provided. Styling and responsive layout live in `src/style.css`.

## Add photographs

Place optimized images in `public/images/` and set `portraits.bride`, `portraits.groom`, and entries in `gallery` in `src/data.ts` to paths such as `/images/riya.jpg`. Portrait-oriented images work best for the arched frames. The site displays neutral placeholders until paths are supplied. Update the alt text in `src/main.tsx` if needed. Once a real sharing image is available, add its public URL as an `og:image` meta tag in `index.html`.

Google Fonts requires a network connection; fallback serif fonts are provided. Directions open Google Maps searches using the supplied addresses; map pins have not been independently verified.
