# Clifford Algebra

A bilingual Clifford algebra learning site using Tensorizer's layout with a violet theme and bivector icon.

[Website](https://jackyko1991.github.io/clifford/) · [Tensorizer](https://jackyko1991.github.io/tensorizer/)

## Current scope

- **Concepts:** foundations, rotations and spinors, spacetime and fields.
- **Coding Skills:** algebra implementation and geometric learning, including read-only code examples.
- **Extended Reading:** four existing reading guides plus grouped, two-column resource cards with metadata and source links.
- **Global footer:** Buy Me a Coffee, Apache-2.0 and GitHub.

All 23 existing bilingual lessons, diagrams, equations and code explanations are retained. Future placeholders should describe relevant Clifford material that is still missing; do not replace existing lessons or mirror Tensorizer's subject matter.

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

- `src/structure.json`: Clifford topic tabs and lesson headings.
- `src/content.json` and `src/LessonSections.tsx`: existing lessons and their renderer.
- `src/reading.json`: resource-card metadata.
- `src/ReadingPage.tsx`: Tensorizer-style reading layout.
- `src/components/SiteFooter.tsx`: global footer.
- `handoff/README.md`: local-only next-agent brief and source-context inventory. The whole `handoff/` directory is gitignored and never included in the site build. Copy it separately if handing over to another machine.

## CI/CD

GitHub Actions tests and builds every push and pull request. Successful main-branch pushes deploy to GitHub Pages. No backend or live coding service is required.

## Attribution

Layout, contents navigation, code component and footer adapted from Tensorizer under Apache-2.0. The violet icon is native SVG. See LICENSE and NOTICE.
