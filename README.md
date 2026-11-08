# Clifford Algebra

A bilingual Clifford algebra learning site using Tensorizer's layout with a violet theme and bivector icon.

[Website](https://jackyko1991.github.io/clifford/) · [Tensorizer](https://jackyko1991.github.io/tensorizer/)

## Current scope

- **Concepts (9 pages):** learn geometrically; geometric products; algebra toolkit; rotors and spinors; geometric models; spacetime and fields; calculus and connections; scope and open questions; people and history.
- **Coding Skills (6 pages):** represent and multiply; transformation code; geometry in code; validation; geometric learning and applications; storage and performance.
- **Extended Reading:** 14 grouped, two-column resource cards with metadata and source links. The four existing reading guides now live in their relevant learning, history, application and limitations pages.
- **Global footer:** Buy Me a Coffee, Apache-2.0 and GitHub.

All 23 existing bilingual lessons, diagrams, equations and code explanations are retained and placed once. The 31 remaining missing sections have explicit learning questions and visual plans, marked as planned lessons. The history page now adds 10 sourced, illustrated milestones in a three-part timeline, with sticky navigation and expandable notes. Existing lesson bookmarks continue to resolve after moves. No live coding service is included.

See [the curriculum map](docs/curriculum.md) for the learning sequence and the relationship to Tensorizer's page roles.

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

- `src/structure.json`: curriculum order, topic introductions and planned lesson briefs.
- `src/curriculum.ts`: typed curriculum and existing lesson lookup.
- `src/content.json` and `src/LessonSections.tsx`: existing lessons and their renderer.
- `src/history.json`, `src/HistoryPage.tsx`: sourced history timeline; original SVG illustrations in `src/components/HistoryDrawing.tsx`.
- `src/reading.json`: resource-card metadata.
- `src/ReadingPage.tsx`: Tensorizer-style reading layout.
- `src/components/SiteFooter.tsx`: global footer.
- `handoff/README.md`: local-only next-agent brief and source-context inventory. The whole `handoff/` directory is gitignored and never included in the site build. Copy it separately if handing over to another machine.

## CI/CD

GitHub Actions tests and builds every push and pull request. Successful main-branch pushes deploy to GitHub Pages. No backend or live coding service is required.

## Attribution

Layout, contents navigation, code component and footer adapted from Tensorizer under Apache-2.0. The violet icon is native SVG. See LICENSE and NOTICE.
