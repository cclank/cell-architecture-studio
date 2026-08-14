import { describe, expect, it } from "vitest";
import { nameMatches, normalizeName } from "./nameMatch";

describe("normalizeName", () => {
  it("folds Turkish characters", () => {
    expect(normalizeName("Hücre")).toBe("hucre");
    expect(normalizeName("çekirdek")).toBe("cekirdek");
    expect(normalizeName("İstanbul")).toBe("istanbul");
  });
});

describe("nameMatches", () => {
  it("accepts Turkish specimen aliases", () => {
    expect(nameMatches("bitki hücresi", ["Bitki hücresi", "plant cell"])).toBe(true);
    expect(nameMatches("lökosit", ["Akyuvar (lökosit)", "white blood cell", "lökosit"])).toBe(true);
    expect(nameMatches("nöron", ["Nöron", "neuron"])).toBe(true);
  });

  it("allows small typos on longer names", () => {
    expect(nameMatches("hayvan hucresi", ["Hayvan hücresi"])).toBe(true);
  });

  it("rejects unrelated answers", () => {
    expect(nameMatches("mitokondri", ["Bitki hücresi", "plant cell"])).toBe(false);
  });
});
