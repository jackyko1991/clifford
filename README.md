# Clifford · 幾何代數

A bilingual Clifford algebra site scaffold using Tensorizer's layout with a violet theme and bivector icon.

[Website](https://jackyko1991.github.io/clifford/) · [Tensorizer](https://jackyko1991.github.io/tensorizer/)

## Current scope

- **Concepts:** six Tensorizer-matching tabs with section placeholders.
- **Coding Skills:** five Tensorizer-matching tabs with section placeholders.
- **Extended Reading:** grouped, two-column resource cards with author/publication metadata, primary or free links, related-section links, and a quiet Amazon UK link where applicable.
- **Global footer:** Buy Me a Coffee, Apache-2.0 and GitHub, matching Tensorizer's footer placement and styling.

Lesson development is deferred to the next agent. Existing source components remain available for reuse, while the current lesson content is archived locally and is not rendered by the site.

## Development

Requires Node.js 24 or later.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Use `npm.cmd` in Windows PowerShell when script execution is restricted.

## Files

- `src/structure.json`: mirrored Concept and Coding Skills tabs and section headings.
- `src/reading.json`: resource-card metadata.
- `src/ReadingPage.tsx`: Tensorizer-style reading layout.
- `src/components/SiteFooter.tsx`: global footer.
- `handoff/README.md`: local-only next-agent brief and source-context inventory. The whole `handoff/` directory is gitignored and never included in the site build. Copy it separately if handing over to another machine.

## CI/CD

GitHub Actions tests and builds every push and pull request. Successful main-branch pushes deploy to GitHub Pages. No backend or live coding service is required.

## Attribution

Layout, contents navigation, code component and footer adapted from Tensorizer under Apache-2.0. The violet icon is native SVG. See LICENSE and NOTICE.
