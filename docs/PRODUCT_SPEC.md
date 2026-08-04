# IGCSE Biology Studio — Product Spec

**IGCSE Biology Studio**
*Explore biology from molecules to ecosystems.*

A complete visual learning platform for **Cambridge IGCSE Biology 0610**
(examinations 2026, 2027, 2028), covering the full Core + Supplement syllabus
across all 21 topics through interactive 3D models, animated processes,
microscope material, practicals, and original exam-style questions.

> All content identifiers in this product are internal project IDs. IGCSE
> Biology Studio is an independent study aid. It uses no Cambridge logos, no
> copyrighted past-paper questions, and implies no endorsement by or affiliation
> with Cambridge Assessment International Education.

---

## 1. Product identity

IGCSE Biology Studio is, at once:

- a **digital biology atlas** — a browsable visual reference for every structure
  and system in the syllabus;
- an **interactive museum** — premium 3D specimens you rotate, cross-section,
  and explore structure by structure;
- a **3D revision tool** — study the same models in a fast, exam-focused way;
- a **microscope lab** — curated microscope views paired with each specimen and
  the magnification skills the syllabus expects;
- a **practical trainer** — variables, method, results, graphs, and error
  analysis for the required practical work;
- an **exam-prep engine** — original, syllabus-mapped questions with mark
  points, command-word practice, and misconception feedback.

The scope is the **whole syllabus, not just cells**. Cells are one topic group
of many; the platform represents molecules, tissues, organs, whole organisms,
populations, and ecosystems with equal weight.

## 2. Target users

- **Primary: students aged 14–16** preparing for IGCSE Biology 0610, working
  independently or alongside class. Content is written in student-friendly
  language, with exam skills and misconceptions surfaced explicitly.
- **Secondary: teachers** who want a projector-ready visual for a topic, a quick
  comparison to display, a practical to walk through, or a question bank to set.

Design for a learner who is revising on their own phone as readily as a class on
a smart-board.

## 3. Course levels & the badge system

IGCSE Biology 0610 is split into **Core** and **Supplement** content, examined
at Core and Extended tiers. The product exposes a single course-level selector:

| Course level | Shows |
| --- | --- |
| **Core** | Core content only |
| **Extended** | Core + Supplement content |
| **All** | Everything, with Supplement clearly flagged |

Every visual, structure, process, practical, comparison, and question carries a
`courseTier` (`CORE` / `SUPPLEMENT` / `BOTH`) so the whole interface filters
consistently from one flag.

Content is labelled with **text badges, never colour alone** (an accessibility
requirement — see §9):

- **CORE**
- **SUPPLEMENT**
- **CORE + SUPPLEMENT**
- **PRACTICAL**

Badges always carry their word; any accent colour behind them is decorative and
never the sole carrier of meaning.

## 4. Navigation modes

Four top-level ways into the same content set, all overlay/panel driven within
the existing single-page shell (no router library):

| Mode | Entry point | What it lists |
| --- | --- | --- |
| **Syllabus** | Browse by the 21 topics → subtopics → objectives | The curriculum spine; every objective links to its visuals, practicals, comparisons, and questions |
| **Visuals** | Browse by `VisualGroup` (Cells, Molecules, Plants, Human biology, Genetics, Ecology, Microorganisms, Biotechnology) | Every 3D model, diagram, graph, and microscope set |
| **Processes** | Browse interactive processes | Diffusion, osmosis, active transport, photosynthesis, respiration, etc., as staged animations |
| **Practicals** | Browse required/exam-style practicals | Variables, method, results, graphs, errors — mapped to Papers 5/6 |

The reusable `SpecimenGridModal` (searchable, section-driven) already backs
Gallery/Library and generalises to power these mode listings.

## 5. Study modes

Across any visual, the learner chooses *how* to work:

- **Learn** — full guided exploration: every structure selectable, all info
  tabs, tutor prompts, notes. Depth first.
- **Revise** — condensed: key structures, exam language, common mistakes, quick
  self-check. Speed first.
- **Exam** — question-led: the visual becomes the stimulus for structured and
  model-select questions, with command words, mark points, and timing.

## 6. Info panel tabs

The right-hand info panel (evolving from the current `RightPanel`) is tabbed and
sourced entirely from the curriculum data (`BiologyVisual` / `VisualStructure`):

| Tab | Content | Data source |
| --- | --- | --- |
| **Overview** | What the visual is, subtitle, where it occurs, text alternative | `BiologyVisual` |
| **Structure** | The selected structure's `structureDescription`, size/location attributes | `VisualStructure.structureDescription` |
| **Function** | What the structure does and the structure→function link | `VisualStructure.function`, `adaptationExplanation` |
| **Syllabus** | Which objectives this visual serves (student-friendly wording), course tier | `SyllabusObjective` |
| **Exam Skills** | `examLanguage` phrases examiners reward, `commonMistakes` to avoid | `VisualStructure.examLanguage`, `commonMistakes` |
| **Practical Link** | Related practical(s): aim, variables, technique | `PracticalActivity` |
| **Notes** | The learner's own notes, saved locally per visual | `localStorage` (notebook) |

## 7. Design language

The current warm, premium atmosphere is preserved deliberately — warm ivory
background (`#fbf7ee`-family), rounded scientific cards, soft shadows, generous
spacing, calm typography. It should feel like a well-made science instrument,
not a busy textbook.

**Topic-group accents.** Each topic group carries an accent, used for headers,
tiles, and hotspot dots — always as *reinforcement*, never as the only signal:

| Group | Accent | Feeling |
| --- | --- | --- |
| Foundations / cells (Topics 1–5) | **violet** | precise, foundational |
| Plant biology (6, 8) | **botanical green** | living, photosynthetic |
| Human biology (7, 9–15) | **coral** | warm, bodily |
| Genetics & inheritance (16–18) | **deep blue** | structured, molecular |
| Ecology (19–20) | **earth green / amber** | environmental, systemic |
| Biotechnology (21) | **teal** | applied, engineered |

Accents are defined in data (`SyllabusTopic.accentKey` → a product accent map)
so the whole interface recolours from one source. The existing user-selectable
UI accents (`theme.ts`) remain for personal preference and are layered above the
topic accent, which tints the 3D stage.

## 8. Data-driven architecture summary

The product is a **renderer of curriculum data**. The backbone lives in
`src/data/curriculum/types.ts`:

- `SyllabusTopic` (21) → `Subtopic[]`, and link arrays to visuals, processes,
  practicals, comparisons, questions.
- `SyllabusObjective` — student-friendly objective + status + key terms +
  misconceptions + links; each carries a prose `sourceReference` (an internal
  note of which syllabus area it maps to, never verbatim wording).
- `BiologyVisual` — the central unit the studio viewer renders. Generalises the
  legacy `CellItem`; carries `format` (`VisualFormat`), `group`, `structures`,
  camera presets, optional `processId`, microscope images, and an
  optional `specimenId` bridge to a legacy GLB experience so the working viewer
  is reused directly.
- `VisualStructure` — a selectable component with mesh mapping, function,
  adaptation, exam language, and common mistakes.
- `BiologyProcess` — staged interactive processes with per-stage transcripts.
- `PracticalActivity`, `Comparison`, `PracticeQuestion`, `GlossaryTerm`,
  `Misconception`.

Every record carries a `courseTier`; assets carry an `AssetStatus`
(`PLACEHOLDER` / `CONCEPT` / `PRODUCTION`) and an `AssetCredit`. Swapping data
swaps content; the UI does not hard-code biology.

## 9. Accessibility commitments

- **Never colour alone.** All course-tier and status meaning is carried by text
  badges; accents only reinforce.
- **Text alternatives.** Every visual has a `textAlternative`; every process
  stage has a plain-text `transcript` for screen-reader and reduced-motion use.
- **Reduced motion.** A reduced-motion path pauses auto-rotate/float and
  presents process stages as static, captioned frames with their transcripts.
- **Keyboard.** All navigation, structure selection, and study flows are
  keyboard operable (building on `useKeyboardShortcuts`), with visible focus.
- **Readable contrast.** Text and controls meet contrast targets on the ivory
  surface in both light and dark presentations.
- **Plain language.** Objectives and explanations are written for 14–16 year
  olds; jargon is defined in the glossary.

## 10. Responsive commitments

- Grid shell reflows from three columns (sidebar / stage / info rail) to a
  stacked single column on phones; panels become sheets/tabs.
- The 3D canvas caps `dpr` at 2 and loads **mobile LOD** model variants
  (`BiologyVisual.mobileModelUrl`) on small/low-power devices.
- Touch gestures drive rotate/zoom; no interaction depends on hover or keyboard.
- Wide content (comparison tables, graphs, mesh lists) scrolls within its own
  container so the page never scrolls horizontally.

## 11. Scope statement

IGCSE Biology Studio covers the **entire** IGCSE Biology 0610 syllabus — all 21
topics, Core and Supplement — not a cell-biology sub-app. Milestone 1 delivers
Topics 1–5 end-to-end as the vertical slice; `SYLLABUS_COVERAGE.md` tracks every
topic to completion and `MODEL_CATALOGUE.md` sequences the model production that
fills it out.
