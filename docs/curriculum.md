# Clifford Algebra curriculum

The layout follows Tensorizer; the subject structure is specific to Clifford algebra. Preserve the 23 existing lessons and the completed history timeline. Fill a planned section in place when its explanation, diagram and worked example are ready.

## Page roles

| Tensorizer page role | Clifford coverage |
| --- | --- |
| From laws to simulation | Spacetime & fields, plus validation and implementation |
| Learning how to learn | Learn geometrically |
| Mathematics and diagrams | Geometric products, algebra toolkit, rotors and spinors, geometric models |
| Data representation and flow | Represent & multiply, storage & performance |
| Limitations | Scope & open questions |
| History | People & history |
| Coding skills | Transformation code, geometry in code, validation, geometric applications |
| Extended reading | The existing grouped resource catalog, linked to relevant pages |

## Pages and sections

| Page | Existing lessons | Planned sections |
| --- | ---: | ---: |
| Learn geometrically / 用幾何學會學習 | 2 | 2 |
| Geometric products / 幾何積與多重向量 | 3 | 1 |
| The algebra toolkit / 代數工具箱 | 0 | 5 |
| Rotors & spinors / 轉子與旋量 | 2 | 2 |
| Geometric models / 幾何模型 | 1 | 3 |
| Spacetime & fields / 時空與場 | 4 | 0 |
| Calculus & connections / 微積分與聯絡 | 1 | 3 |
| Scope & open questions / 適用範圍與開放問題 | 2 | 2 |
| Clifford history / 克利福德代數史 | 10 | 0 |
| Represent & multiply / 表示與乘法 | 2 | 1 |
| Transformation code / 變換程式 | 1 | 2 |
| Geometry in code / 幾何程式 | 0 | 3 |
| Test the geometry / 檢查幾何是否正確 | 1 | 2 |
| Geometric learning & applications / 幾何學習與應用 | 2 | 2 |
| Storage & performance / 儲存與效能 | 1 | 3 |

## Development rules

- Existing content is looked up by section ID, not by its old group label. Each retained lesson appears once in the curriculum; the people/attribution addendum is intentionally no longer displayed. History milestones are stored separately in `src/history.json` and are also complete sections.
- Planned sections need a concrete learning question and a matching visual plan in both languages. They are visibly marked as planned; do not fill them with generic repeated text.
- Keep examples inspectable through animation, diagrams, formulas and read-only code. No live coding backend.
- Preserve legacy deep links when moving lessons.
- Keep established mathematics, physical interpretations and speculative models distinct. Do not claim that GA replaces tensor products, topology or physical evidence.

## Scope references

The page coverage was checked against these teaching resources; they inform the outline, not new proof claims.

- [Gull, Lasenby and Doran: introductory geometric algebra and spacetime tutorial](https://lambda.gsfc.nasa.gov/product/websites/AMI/mrao.cam.ac.uk/~clifford/introduction/intro/intro.html)
- [BiVector: teaching material on reflections, rotors, PGA, CGA and implementation](https://bivector.net/doc.html)

## History page

The history tab uses Tensorizer’s alternating timeline layout, with three eras, a sticky navigation, original SVG illustrations, side-note controls and per-card source links. Ten milestones cover 1843–2023. The people/attribution addendum has been removed at the user’s request. Portraits and relevant hardware photos take priority over original drawings; see public/history/CREDITS.md for image provenance. Dates identify selected publications or teaching events; the page does not claim a single continuous invention or an institutional suppression story.

Chapter I now shows Hamilton and Grassmann on parallel rails that merge at the 1878 product. The 1870/1876 curvature proposal remains a separately labeled contemporary question. On phones, both origin cards remain visible in a stacked flow beside two compact colored rails; desktop retains parallel columns. Both layouts merge into one continuous violet timeline. Layout was checked in an isolated browser at widths 1440, 390 and 320 px, including overlap and horizontal-overflow measurements.

The user preferred the non-tab phone layout; both origin cards are visible without switching. Desktop at 1440 px continues to show both branches side by side.

Merge connectors use exactly the same amber and teal as their incoming rails, followed by one continuous violet track. Browser measurements at 1440, 390 and 320 px checked the shared junction, incoming seams, outgoing seams and computed colors. Phone rails connect directly to the merge curves.


## Learning page opening

The learning page now has six implemented narrative cards: imaginary-turn, hamilton-bridge, welcome, learning, predict-before-symbols, and explain-and-check. `LearningSections.tsx` renders them with quarter-turn, quaternion-order, and prediction tools; `learningModel.ts` computes the first two tools. It starts with foundations, then the learning method, and links onward through the algebra toolbox to rotations. Existing source lessons remain archived in content.json. Hamilton’s bridge account links to Trinity College Dublin.


## Completed foundations page

`FoundationsSections.tsx` now renders four implemented sections in the order product, orientation, grades, relations. Original lesson records remain in content.json. Interactive tools cover length/angle/order changes with a complete product readout, a two-edge orientation walk, all eight editable multivector coefficients and grade projections, and complex/quaternion/linear-map comparisons. The grade preview uses a responsive 2-by-2 layout on phones. `foundationsModel.ts` computes products using the existing Clifford multiplication kernel and extracts grades without altering the stored coefficients. All examples use Euclidean orthonormal bases.


### Revised entry to multivectors

The grades card now starts with `GeometryRecordBuilder` in `GeometryRecords.tsx`: no direction (scalar), one direction (arrow), two independent directions (area), and three independent directions (volume). The 3D 1/3/3/1 coefficient count comes afterwards, and the existing eight-coefficient editor is retained in a collapsible exercise. The card ends with `DimensionQuestion`, a revealable 1D–6D explorer that explains binomial grade counts, the total 2^n, and selection of basis directions, including the empty scalar selection. It explicitly distinguishes higher-dimensional sums of elements from a single simple element.
