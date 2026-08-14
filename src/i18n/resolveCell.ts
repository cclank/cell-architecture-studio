import type { TFunction } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  cells,
  getCellById,
  type CellItem,
  type CellStructure,
  type MicroscopeKind,
  type OrganelleItem,
} from "../data/cells";

type OrganelleCopy = {
  name?: string;
  subtitle?: string;
  aliases?: string[];
  attributes?: Array<{ label?: string; value?: string }>;
  note?: string;
  fact?: string;
};

type CellCopy = {
  name?: string;
  type?: string;
  aliases?: string[];
  clinicalContext?: string;
  occurrence?: { title?: string; body?: string };
  organelles?: Record<string, OrganelleCopy>;
};

function asCopy(value: unknown): CellCopy {
  return value && typeof value === "object" ? (value as CellCopy) : {};
}

export function resolveCell(cell: CellStructure, t: TFunction): CellItem {
  const copy = asCopy(t(`catalog.${cell.id}`, { ns: "cells", returnObjects: true }));
  const organelles: OrganelleItem[] = cell.organelles.map((org) => {
    const o = copy.organelles?.[org.id] ?? {};
    return {
      id: org.id,
      color: org.color,
      name: o.name ?? org.id,
      subtitle: o.subtitle ?? "",
      attributes: (o.attributes ?? []).map((attr) => ({
        label: attr.label ?? "",
        value: attr.value ?? "",
      })),
      note: o.note ?? "",
      fact: o.fact ?? "",
    };
  });

  return {
    ...cell,
    name: copy.name ?? cell.id,
    type: copy.type ?? "",
    aliases: copy.aliases ?? [],
    clinicalContext: copy.clinicalContext ?? "",
    occurrence: {
      title: copy.occurrence?.title ?? "",
      body: copy.occurrence?.body ?? "",
      motif: cell.occurrenceMotif,
    },
    microscope: cell.microscope.map((item) => ({
      ...item,
      label: t(`microscope.${item.kind as MicroscopeKind}`, { ns: "cells" }),
    })),
    organelles,
  };
}

export function resolveCellById(id: string, t: TFunction): CellItem {
  return resolveCell(getCellById(id), t);
}

export function useResolvedCells(): CellItem[] {
  const { t, i18n } = useTranslation("cells");
  return useMemo(() => cells.map((cell) => resolveCell(cell, t)), [t, i18n.language]);
}

export function useResolvedCell(id: string): CellItem {
  const resolved = useResolvedCells();
  return resolved.find((cell) => cell.id === id) ?? resolved[0];
}
