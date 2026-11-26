# Cleary

A responsive cleaning-service hero with a scroll-controlled spray-and-wipe animation. Built with plain HTML, CSS and JavaScript, with no runtime dependencies.

![Cleary hero artwork](assets/cleaning-hero.png)

*Opening artwork used by the interactive page.*

## Preview

With Node.js installed, run `npm run dev`, then open `http://localhost:5173`. No package installation is required.

Run `npm run build` to produce a portable static site in `dist/`. `npm run preview` serves that folder. Set the `PORT` environment variable to change the default port. Stop an existing preview before starting another server on the same port.

Run `npm run check` to check the JavaScript syntax.

## Deploy to Vercel

Import this repository into Vercel with the repository root as the Root Directory. The included `vercel.json` sets the framework preset to Other, runs `npm run build`, and publishes `dist/`. These values override the corresponding project settings, so Vercel uses the folder this project actually builds.

The build creates `dist/` during deployment; it does not need to be committed. If a previous deployment failed looking for `public`, deploy the latest commit containing `vercel.json`.

## Experience

- Transparent navigation integrated into the full-screen hero, with a subtle contrast gradient and yellow quote button.
- Scroll through the pinned hero to scrub the spray-and-wipe sequence. Scrolling upward reverses it. The play control runs the same sequence without scrolling manually.
- The closing headline, short description, quote and services buttons, and two frosted information cards appear after the wipe finishes.
- Mobile layout, keyboard-accessible navigation and dialogs, and a static reduced-motion experience.
- Service, about and contact dialogs. The quote form validates and displays an in-page summary; it does not send or persist personal details.

## Assets and fidelity

This independent visual demo recreates a user-provided cleaning-site reference. It does not imply affiliation with the reference's creator or any cleaning business.

The reference is a phone recording of a laptop screen, not the original website source. The motion clip is extracted and perspective-corrected from that recording. The opening image was reconstructed from the reference using AI image generation. The recording limits the resolution of the moving sequence; original footage can replace `assets/cleaning-sequence.mp4` without changing the page structure.

All fonts and media are served locally; the page does not require external services or a CDN. Source recordings, analysis files, temporary tools, and generated builds are excluded from Git.

`assets/inter-latin.woff2` is the Inter typeface, distributed under the SIL Open Font License; see [the font license](assets/inter-LICENSE.txt). The repository does not currently include a project-wide license.

## Project structure

```text
index.html          Hero content, navigation, and dialog templates
styles.css          Responsive layout and visual styling
app.js              Scroll animation and browser-only interactions
assets/             Hero image, cleaning video, font, and favicon
scripts/serve.mjs    Local preview server with video range support
scripts/build.mjs    Static-site packaging
```

The hero stays pinned while scrolling updates the video's playback position. The opening and closing content fade with the same scroll progress, and scrolling upward reverses the sequence. The video uses frequent keyframes for responsive seeking.

## Customize

Edit hero copy in `index.html`, visual styling in `styles.css`, and scroll or dialog behavior in `app.js`. The final quote confirmation is deliberately a preview; connect your own form endpoint before using it to take real enquiries.
