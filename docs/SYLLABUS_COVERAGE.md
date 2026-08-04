# Syllabus Coverage Tracker

Coverage of the full **Cambridge IGCSE Biology 0610** syllabus
(examinations 2026–2028) across all 21 topics inside IGCSE Biology Studio.

> **All identifiers below are internal project IDs** (e.g. `t03-s2`). They are
> **not** official Cambridge objective codes. Subtopic breakdowns are the
> project's own restatement of the well-known 0610 topic structure — no
> syllabus wording is copied verbatim, no Cambridge branding is used, and no
> endorsement is implied. The `Tier` column marks whether content is Core (C)
> or Supplement (S).

## Status vocabulary

Each subtopic carries an `ObjectiveStatus` (see `src/data/curriculum/types.ts`):

| Status | Meaning |
| --- | --- |
| `NOT_STARTED` | No content authored yet |
| `DRAFTED` | Objective text + notes written as data; no visual yet |
| `VISUAL_PLANNED` | A visual is specced (catalogue entry, prompts) but not built |
| `VISUAL_AVAILABLE` | A usable visual exists (production or a temporary dev asset) |
| `COMPLETE` | Objective, visual(s), exam material and links all in place |
| `REVIEWED` | Complete and checked for scientific accuracy + exam alignment |

**Tier:** C = Core, S = Supplement (Extended-only).

---

## Topic 1 — Characteristics and classification of living organisms
Group: Foundations / cells · Accent: violet · **Milestone 1**

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t01-s1 | Characteristics of living organisms (MRS GREN) | C | COMPLETE |
| t01-s2 | Concept and use of a classification system | C | VISUAL_AVAILABLE |
| t01-s3 | Binomial naming system | C | DRAFTED |
| t01-s4 | Features of the five kingdoms | C | DRAFTED |
| t01-s5 | Main vertebrate & arthropod groups | C | DRAFTED |
| t01-s6 | Features of viruses | S | DRAFTED |
| t01-s7 | Dichotomous keys | C | VISUAL_AVAILABLE |

## Topic 2 — Organisation of the organism
Group: Foundations / cells · Accent: violet · **Milestone 1**

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t02-s1 | Cell structure — animal cell | C | COMPLETE |
| t02-s2 | Cell structure — plant cell | C | COMPLETE |
| t02-s3 | Bacterial cell structure | C | VISUAL_AVAILABLE |
| t02-s4 | Structure vs function of organelles | S | VISUAL_AVAILABLE |
| t02-s5 | Specialised cells and their adaptations | C | VISUAL_AVAILABLE |
| t02-s6 | Levels of organisation (cell→tissue→organ→system) | C | DRAFTED |
| t02-s7 | Size of specimens & magnification calculations | C | COMPLETE |

## Topic 3 — Movement into and out of cells
Group: Foundations / cells · Accent: violet · **Milestone 1**

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t03-s1 | Diffusion | C | COMPLETE |
| t03-s2 | Factors affecting diffusion | S | VISUAL_AVAILABLE |
| t03-s3 | Osmosis | C | COMPLETE |
| t03-s4 | Water potential & effects on plant/animal cells | S | VISUAL_AVAILABLE |
| t03-s5 | Active transport | C | VISUAL_AVAILABLE |
| t03-s6 | Role of protein carriers in active transport | S | DRAFTED |

## Topic 4 — Biological molecules
Group: Foundations / cells · Accent: violet · **Milestone 1**

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t04-s1 | Carbohydrates, fats and proteins — elements | C | COMPLETE |
| t04-s2 | Large molecules from smaller units | C | VISUAL_AVAILABLE |
| t04-s3 | Food tests (Benedict's, iodine, biuret, ethanol) | C | COMPLETE |
| t04-s4 | Structure of DNA (two strands, bases, pairing) | S | VISUAL_PLANNED |
| t04-s5 | Water as a solvent | C | DRAFTED |

## Topic 5 — Enzymes
Group: Foundations / cells · Accent: violet · **Milestone 1**

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t05-s1 | Enzymes as biological catalysts | C | COMPLETE |
| t05-s2 | Enzyme action & the active site (lock and key) | C | VISUAL_AVAILABLE |
| t05-s3 | Effect of temperature on enzyme activity | C | COMPLETE |
| t05-s4 | Effect of pH on enzyme activity | C | COMPLETE |
| t05-s5 | Enzyme denaturation & specificity explanation | S | VISUAL_AVAILABLE |

---

## Topic 6 — Plant nutrition
Group: Plant biology · Accent: botanical green

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t06-s1 | Photosynthesis — word & balanced equation | C | DRAFTED |
| t06-s2 | Limiting factors of photosynthesis | S | NOT_STARTED |
| t06-s3 | Leaf structure & adaptations | C | DRAFTED |
| t06-s4 | Investigating factors affecting photosynthesis | C | NOT_STARTED |
| t06-s5 | Uses of chlorophyll & mineral needs (N, Mg) | S | NOT_STARTED |

## Topic 7 — Human nutrition
Group: Human biology · Accent: coral

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t07-s1 | A balanced diet & dietary components | C | DRAFTED |
| t07-s2 | Human alimentary canal & organ functions | C | DRAFTED |
| t07-s3 | Mechanical & chemical digestion | C | NOT_STARTED |
| t07-s4 | Digestive enzymes & where they act | S | NOT_STARTED |
| t07-s5 | Absorption & role of the villus | C | NOT_STARTED |
| t07-s6 | Teeth structure & dental health | C | NOT_STARTED |

## Topic 8 — Transport in plants
Group: Plant biology · Accent: botanical green

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t08-s1 | Xylem and phloem — position & function | C | DRAFTED |
| t08-s2 | Water uptake & root hair cells | C | DRAFTED |
| t08-s3 | Transpiration & factors affecting it | C | NOT_STARTED |
| t08-s4 | Translocation of sucrose & amino acids | S | NOT_STARTED |

## Topic 9 — Transport in animals
Group: Human biology · Accent: coral

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t09-s1 | Circulatory system — double circulation | C | DRAFTED |
| t09-s2 | Structure & function of the heart | C | DRAFTED |
| t09-s3 | Blood vessels — arteries, veins, capillaries | C | NOT_STARTED |
| t09-s4 | Blood components & their roles | C | NOT_STARTED |
| t09-s5 | Coronary heart disease & risk factors | S | NOT_STARTED |
| t09-s6 | Lymphatic system & tissue fluid | S | NOT_STARTED |

## Topic 10 — Diseases and immunity
Group: Human biology · Accent: coral

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t10-s1 | Pathogens & transmissible diseases | C | DRAFTED |
| t10-s2 | Body defences (mechanical, chemical, cellular) | C | NOT_STARTED |
| t10-s3 | Phagocytosis & antibody production | S | NOT_STARTED |
| t10-s4 | Active & passive immunity | S | NOT_STARTED |
| t10-s5 | Vaccination & control of disease spread | C | NOT_STARTED |

## Topic 11 — Gas exchange in humans
Group: Human biology · Accent: coral

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t11-s1 | Features of gas exchange surfaces (alveoli) | C | DRAFTED |
| t11-s2 | Structure of the human breathing system | C | NOT_STARTED |
| t11-s3 | Breathing mechanism (ventilation) | C | NOT_STARTED |
| t11-s4 | Effect of exercise on breathing | S | NOT_STARTED |
| t11-s5 | Goblet cells, cilia & protecting the lungs | S | NOT_STARTED |

## Topic 12 — Respiration
Group: Human biology · Accent: coral

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t12-s1 | Uses of energy in living organisms | C | DRAFTED |
| t12-s2 | Aerobic respiration — equation & sites | C | DRAFTED |
| t12-s3 | Anaerobic respiration in muscle & yeast | C | NOT_STARTED |
| t12-s4 | Oxygen debt | S | NOT_STARTED |
| t12-s5 | Investigating respiration (heat/CO₂ release) | C | NOT_STARTED |

## Topic 13 — Excretion in humans
Group: Human biology · Accent: coral

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t13-s1 | Excretion & excretory products | C | DRAFTED |
| t13-s2 | Structure of the urinary system | C | NOT_STARTED |
| t13-s3 | Structure & function of the nephron | S | NOT_STARTED |
| t13-s4 | Ultrafiltration & selective reabsorption | S | NOT_STARTED |
| t13-s5 | Role of the liver in excretion | S | NOT_STARTED |

## Topic 14 — Coordination and response
Group: Human biology · Accent: coral

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t14-s1 | Human nervous system & neurones | C | DRAFTED |
| t14-s2 | Reflex arc & reflex action | C | NOT_STARTED |
| t14-s3 | Synapses & transmission | S | NOT_STARTED |
| t14-s4 | Sense organs — structure of the eye | C | NOT_STARTED |
| t14-s5 | Hormones & endocrine glands | C | NOT_STARTED |
| t14-s6 | Homeostasis — temperature & blood glucose | S | NOT_STARTED |
| t14-s7 | Tropic responses in plants (auxin) | S | NOT_STARTED |

## Topic 15 — Drugs
Group: Human biology · Accent: coral

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t15-s1 | Definition & use of medicinal drugs | C | DRAFTED |
| t15-s2 | Antibiotics & antibiotic resistance | C | NOT_STARTED |
| t15-s3 | Misused drugs — alcohol & effects | C | NOT_STARTED |
| t15-s4 | Tobacco smoke & health effects | C | NOT_STARTED |
| t15-s5 | Heroin & effects of misuse | S | NOT_STARTED |

## Topic 16 — Reproduction
Group: Genetics & inheritance · Accent: deep blue

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t16-s1 | Asexual reproduction | C | DRAFTED |
| t16-s2 | Sexual reproduction & gametes | C | NOT_STARTED |
| t16-s3 | Sexual reproduction in plants (flowers) | C | NOT_STARTED |
| t16-s4 | Pollination, fertilisation & seed formation | C | NOT_STARTED |
| t16-s5 | Human reproductive system | C | NOT_STARTED |
| t16-s6 | Menstrual cycle & hormonal control | S | NOT_STARTED |
| t16-s7 | Sexually transmitted infections (HIV) | C | NOT_STARTED |

## Topic 17 — Inheritance
Group: Genetics & inheritance · Accent: deep blue

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t17-s1 | Chromosomes, genes & DNA | C | DRAFTED |
| t17-s2 | Mitosis & its role | S | NOT_STARTED |
| t17-s3 | Meiosis & production of gametes | S | NOT_STARTED |
| t17-s4 | Monohybrid inheritance & genetic diagrams | C | NOT_STARTED |
| t17-s5 | Dominant/recessive, genotype/phenotype | C | NOT_STARTED |
| t17-s6 | Codominance & sex inheritance | S | NOT_STARTED |

## Topic 18 — Variation and selection
Group: Genetics & inheritance · Accent: deep blue

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t18-s1 | Continuous & discontinuous variation | C | DRAFTED |
| t18-s2 | Causes of variation & mutation | C | NOT_STARTED |
| t18-s3 | Adaptive features | C | NOT_STARTED |
| t18-s4 | Natural selection & evolution | C | NOT_STARTED |
| t18-s5 | Selective breeding (artificial selection) | C | NOT_STARTED |
| t18-s6 | Antibiotic-resistant bacteria as selection | S | NOT_STARTED |

## Topic 19 — Organisms and their environment
Group: Ecology · Accent: earth green / amber

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t19-s1 | Energy flow & the Sun as the source | C | DRAFTED |
| t19-s2 | Food chains & food webs | C | NOT_STARTED |
| t19-s3 | Trophic levels & pyramids | C | NOT_STARTED |
| t19-s4 | Energy loss between trophic levels | S | NOT_STARTED |
| t19-s5 | The carbon cycle | C | NOT_STARTED |
| t19-s6 | The nitrogen cycle | S | NOT_STARTED |
| t19-s7 | Populations & factors affecting growth | C | NOT_STARTED |

## Topic 20 — Human influences on ecosystems
Group: Ecology · Accent: earth green / amber

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t20-s1 | Food supply — modern farming & impacts | C | DRAFTED |
| t20-s2 | Habitat destruction & deforestation | C | NOT_STARTED |
| t20-s3 | Pollution (water, air, plastics) | C | NOT_STARTED |
| t20-s4 | Eutrophication | S | NOT_STARTED |
| t20-s5 | Conservation & sustainable resources | C | NOT_STARTED |
| t20-s6 | Sustaining fish stocks & endangered species | S | NOT_STARTED |

## Topic 21 — Biotechnology and genetic modification
Group: Biotechnology · Accent: teal

| Subtopic id | Subtopic | Tier | Status |
| --- | --- | --- | --- |
| t21-s1 | Why microorganisms are used in biotech | C | DRAFTED |
| t21-s2 | Anaerobic respiration in bread & alcohol | C | NOT_STARTED |
| t21-s3 | Use of enzymes (e.g. in industry/lactase) | S | NOT_STARTED |
| t21-s4 | Industrial fermenters & penicillin production | S | NOT_STARTED |
| t21-s5 | Genetic modification — principles | C | NOT_STARTED |
| t21-s6 | Producing human insulin using bacteria | S | NOT_STARTED |
| t21-s7 | Advantages & concerns of GM crops | S | NOT_STARTED |

---

## Summary counts

Status totals across all 21 topics (subtopic granularity):

| Status | Count |
| --- | --- |
| COMPLETE | 11 |
| VISUAL_AVAILABLE | 11 |
| VISUAL_PLANNED | 1 |
| DRAFTED | 22 |
| NOT_STARTED | 68 |
| REVIEWED | 0 |
| **Total subtopics tracked** | **113** |

Milestone 1 (Topics 1–5) accounts for all COMPLETE / VISUAL_AVAILABLE /
VISUAL_PLANNED entries plus the DRAFTED items inside those topics. Topics 6–21
are DRAFTED at the topic-overview level (a first objective drafted per topic to
prove the data shape) and otherwise NOT_STARTED.

> Counts are the current tracker snapshot and are updated as records land. They
> are maintained by hand here and are intended to be cross-checked against a
> future automated coverage test over the curriculum data.

## Implementation sequence for Topics 6–21

A phased order after the Milestone 1 slice, chosen so each phase reuses the model
and process machinery built by the phase before it and front-loads the topics
with the highest exam weight and the strongest visual payoff.

**Phase 2 — Plant systems (Topics 6, 8).** Photosynthesis and plant transport.
Rationale: builds directly on cells/enzymes/movement from Milestone 1 (leaf
cross-section reuses the cell viewer; transpiration reuses the diffusion/osmosis
process engine). Establishes the botanical-green group and the first
cross-section anatomy models.

**Phase 3 — Human transport & exchange (Topics 7, 9, 11, 12, 13).** Digestion,
circulation, gas exchange, respiration, excretion. Rationale: the densest,
highest-yield block; introduces organ-scale models (heart, villus, alveoli,
nephron) that share a common "cutaway organ" production template, so building
one accelerates the rest. Respiration links back to enzymes and to biotech later.

**Phase 4 — Coordination, immunity & drugs (Topics 10, 14, 15).** Nervous system,
hormones, homeostasis, immunity, drugs. Rationale: process-heavy (reflex arc,
synapse, phagocytosis, feedback loops) — done after the process engine is mature
from Phases 2–3. Reuses the neurone and white-blood-cell models from Milestone 1
as anchors.

**Phase 5 — Genetics (Topics 16, 17, 18).** Reproduction, inheritance, variation
& selection. Rationale: introduces molecular (DNA), cell-division (mitosis/
meiosis) and diagram/graph-led content (genetic diagrams, variation graphs);
naturally follows once the 2D-diagram and graph `VisualFormat`s are solid.

**Phase 6 — Ecology & biotechnology (Topics 19, 20, 21).** Ecosystems, human
impact, biotech & GM. Rationale: capstone topics that synthesise everything
(cycles, energy flow, fermentation, genetic modification of bacteria). Uses the
`ECOSYSTEM` visual format and ties back to microbes, enzymes, and respiration
from earlier phases.

Within every phase, Core subtopics are completed before their Supplement
counterparts so a Core-only learner always has a coherent, gap-free path.
