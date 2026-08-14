import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { STORAGE_KEYS } from "../lib/storageKeys";
import enCommon from "./locales/en/common.json";
import enCells from "./locales/en/cells.json";
import enQuiz from "./locales/en/quiz.json";
import enAchievements from "./locales/en/achievements.json";
import trCommon from "./locales/tr/common.json";
import trCells from "./locales/tr/cells.json";
import trQuiz from "./locales/tr/quiz.json";
import trAchievements from "./locales/tr/achievements.json";

export const SUPPORTED_LANGS = ["tr", "en"] as const;
export type AppLang = (typeof SUPPORTED_LANGS)[number];

function readSavedLang(): AppLang {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.lang);
    if (saved === "tr" || saved === "en") return saved;
  } catch {
    /* ignore */
  }
  return "tr";
}

function applyDocumentLang(lng: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lng;
  document.title = i18n.t("brand.title", { ns: "common" });
}

export function persistLang(lng: AppLang) {
  try {
    localStorage.setItem(STORAGE_KEYS.lang, lng);
  } catch {
    /* ignore */
  }
}

void i18n.use(initReactI18next).init({
  lng: readSavedLang(),
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "cells", "quiz", "achievements"],
  interpolation: { escapeValue: false },
  resources: {
    en: {
      common: enCommon,
      cells: enCells,
      quiz: enQuiz,
      achievements: enAchievements,
    },
    tr: {
      common: trCommon,
      cells: trCells,
      quiz: trQuiz,
      achievements: trAchievements,
    },
  },
});

applyDocumentLang(i18n.language);
i18n.on("languageChanged", (lng) => {
  persistLang(lng === "en" ? "en" : "tr");
  applyDocumentLang(lng);
});

export default i18n;
