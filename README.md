# Clifford · 幾何代數

Geometric algebra through diagrams, animation, equations and read-only Python explanations. English and Traditional Chinese.

[Website](https://jackyko1991.github.io/clifford/) · [Tensorizer](https://jackyko1991.github.io/tensorizer/)

## Development

Requires Node.js 24 or later.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Windows PowerShell users with restricted script execution can use `npm.cmd`.

## Learning path

- **Concepts:** foundations; plane rotations, spinors and motors; spacetime, electromagnetism, light, holonomy and CPT.
- **Coding Skills:** bit-mask blades, geometric multiplication, reversion, rotor transforms, null fields, equivariance and performance.
- **Extended Reading:** a reading sequence, historical attribution, research papers and a map of established and speculative ideas.

23 lessons, fourteen diagram types, keyboard-operable sliders and animation controls. Animation starts paused and can be stopped at any time. Code is read-only; no backend, remote execution or API key is required.

Hash URLs work directly on GitHub Pages, for example `?lang=en#/concept/rotations/spinors`. Source references accompany the relevant lessons. Content lives in `src/content.json`; bibliography in `src/sources.ts`.

## Teaching format

Every lesson follows the Tensorizer Tensor Maths pattern: **In plain words → Picture it → Precisely → Tiny example**. Diagrams follow the familiar analogy. A symbol guide introduces each formula after the worked example; code panels follow the explanation. Both English and Traditional Chinese use this order.

## Mathematical conventions

Euclidean examples use Cl(3,0), bit-mask coefficient order `[1,e1,e2,e12,e3,e13,e23,e123]`, positive rotation from e1 toward e2, `R=exp(-e12 theta/2)`, and `v'=R v reverse(R)`. Spacetime examples use signature (+---), c=1 and explicitly stated natural units. Classical plane-wave diagrams do not depict photon trajectories. Spinor phase dials are schematic.

Ordinary spacetime tensors do not represent spinors; tensor products and tensor computation remain central to quantum mechanics. Clifford algebra is associative and does not by itself establish extra dimensions, unification, conservation laws or equivariance of arbitrary learned layers.

## CI/CD

`.github/workflows/site.yml` runs algebra and equation-rendering tests plus a TypeScript/Vite production build on pushes and pull requests. Only pushes to main and manual main-branch runs publish to GitHub Pages; PRs cannot deploy. Enable Pages with GitHub Actions as its build source. The workflow publishes the exact artifact that passed the build job.

## Attribution

The header, tab/card/contents layout and read-only `CodeBlock` component are adapted from Tensorizer under Apache-2.0. The violet bivector icon and lesson illustrations are native SVG. See LICENSE and NOTICE.
