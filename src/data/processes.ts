import type { BiologyProcess } from "./curriculum/types";

// Interactive, staged processes. Milestone 1 fully specifies the Topic 3 and
// Topic 5 processes; each stage carries a plain-text transcript line so the
// process is fully usable with reduced motion or a screen reader.

export const processes: BiologyProcess[] = [
  {
    id: "proc-diffusion",
    slug: "diffusion",
    title: "Diffusion",
    subtitle: "Net movement down a concentration gradient",
    topicIds: ["movement"],
    objectiveIds: ["prj-obj-3-1"],
    courseTier: "BOTH",
    group: "Cells",
    overview:
      "Diffusion is the net movement of particles from a region of higher concentration to a region of lower concentration, down a concentration gradient. It is passive and needs no energy from respiration.",
    stages: [
      {
        id: "s1",
        title: "Concentration gradient",
        caption: "Particles are crowded on one side of the membrane and sparse on the other.",
        transcript: "At the start, particles are concentrated on the left and there are few on the right.",
        courseTier: "CORE",
      },
      {
        id: "s2",
        title: "Random movement",
        caption: "Particles move randomly in all directions.",
        transcript: "Particles move constantly and randomly because of their kinetic energy.",
        courseTier: "CORE",
      },
      {
        id: "s3",
        title: "Net movement",
        caption: "More particles happen to move from high to low concentration than the other way.",
        transcript: "The overall (net) movement is from the crowded side to the sparse side.",
        courseTier: "CORE",
      },
      {
        id: "s4",
        title: "Equilibrium",
        caption: "Particles are evenly spread; movement continues but there is no net change.",
        transcript: "Once evenly spread, particles still move but there is no net movement.",
        courseTier: "CORE",
      },
    ],
    examNote:
      "Rate of diffusion increases with a steeper concentration gradient, higher temperature, and a larger surface area; it decreases over a longer diffusion distance.",
  },
  {
    id: "proc-osmosis",
    slug: "osmosis",
    title: "Osmosis",
    subtitle: "Water movement across a partially permeable membrane",
    topicIds: ["movement"],
    objectiveIds: ["prj-obj-3-2"],
    courseTier: "BOTH",
    group: "Cells",
    overview:
      "Osmosis is the net movement of water molecules from a dilute solution (high water potential) to a more concentrated solution (low water potential) across a partially permeable membrane.",
    stages: [
      {
        id: "s1",
        title: "Two solutions",
        caption: "A dilute and a concentrated solution are separated by a partially permeable membrane.",
        transcript: "A partially permeable membrane separates dilute water on the left from a sugary solution on the right.",
        courseTier: "CORE",
      },
      {
        id: "s2",
        title: "Only water passes",
        caption: "Water molecules are small enough to cross; solute molecules are not.",
        transcript: "Water molecules pass through the membrane but the larger solute molecules cannot.",
        courseTier: "CORE",
      },
      {
        id: "s3",
        title: "Net water movement",
        caption: "More water moves toward the concentrated side, raising its level.",
        transcript: "Net water movement is toward the concentrated solution, so its volume rises.",
        courseTier: "CORE",
      },
      {
        id: "s4",
        title: "Effect on cells",
        caption: "A plant cell becomes turgid; an animal cell may swell or shrink.",
        transcript: "In a plant cell, water entering makes it turgid; an animal cell has no wall so can burst or shrink.",
        courseTier: "BOTH",
      },
    ],
    examNote:
      "Use 'water potential' for Supplement answers. A plant cell in pure water becomes turgid (not bursting, because of the cell wall); in a concentrated solution it becomes plasmolysed.",
  },
  {
    id: "proc-active-transport",
    slug: "active-transport",
    title: "Active Transport",
    subtitle: "Moving substances against the gradient using energy",
    topicIds: ["movement"],
    objectiveIds: ["prj-obj-3-5"],
    courseTier: "BOTH",
    group: "Cells",
    overview:
      "Active transport is the movement of particles from a lower to a higher concentration (against the gradient) through a cell membrane, using energy from respiration and carrier proteins.",
    stages: [
      {
        id: "s1",
        title: "Against the gradient",
        caption: "Particles must move toward the side where they are already more concentrated.",
        transcript: "Particles need to move to the side that already has more of them — against the gradient.",
        courseTier: "BOTH",
      },
      {
        id: "s2",
        title: "Carrier protein binds",
        caption: "A specific carrier protein in the membrane picks up the particle.",
        transcript: "A carrier protein in the membrane binds the particle to be transported.",
        courseTier: "BOTH",
      },
      {
        id: "s3",
        title: "Energy from respiration",
        caption: "Energy released by respiration changes the carrier's shape to move the particle across.",
        transcript: "Energy from respiration changes the carrier protein's shape, carrying the particle across.",
        courseTier: "BOTH",
      },
      {
        id: "s4",
        title: "Released inside",
        caption: "The particle is released on the other side; the carrier resets.",
        transcript: "The particle is released on the far side and the carrier protein returns to its original shape.",
        courseTier: "BOTH",
      },
    ],
    examNote:
      "Examples include root hair cells absorbing mineral ions and the ileum absorbing glucose. Because it needs energy, active transport stops if respiration is blocked.",
  },
  {
    id: "proc-enzyme-action",
    slug: "enzyme-action",
    title: "Enzyme Action",
    subtitle: "The lock-and-key model in stages",
    topicIds: ["enzymes"],
    objectiveIds: ["prj-obj-5-1", "prj-obj-5-2"],
    courseTier: "BOTH",
    group: "Molecules",
    overview:
      "An enzyme speeds up a reaction by binding its specific substrate in an active site of complementary shape, forming an enzyme–substrate complex, then releasing the products and being reused.",
    stages: [
      {
        id: "s1",
        title: "Enzyme and substrate",
        caption: "The substrate's shape matches the enzyme's active site.",
        transcript: "An enzyme has an active site whose shape is complementary to a specific substrate.",
        courseTier: "CORE",
      },
      {
        id: "s2",
        title: "Enzyme–substrate complex",
        caption: "The substrate fits into the active site.",
        transcript: "The substrate binds in the active site, forming an enzyme–substrate complex.",
        courseTier: "BOTH",
      },
      {
        id: "s3",
        title: "Reaction",
        caption: "The substrate is broken down (or built up) into products.",
        transcript: "The reaction happens — for example the substrate is split into two products.",
        courseTier: "CORE",
      },
      {
        id: "s4",
        title: "Products released",
        caption: "Products leave and the enzyme is unchanged, ready to reuse.",
        transcript: "The products are released and the enzyme is unchanged, ready to catalyse again.",
        courseTier: "CORE",
      },
    ],
    examNote:
      "Enzymes are specific because each active site fits only one substrate. Enzymes are catalysts, so they are not used up and can be reused many times.",
  },
];

export function getProcessById(id: string): BiologyProcess | undefined {
  return processes.find((p) => p.id === id);
}
