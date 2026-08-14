/** Fold a name for quiz type-in: Turkish letters map to ASCII, punctuation dropped. */
export function normalizeName(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function matchesOne(typed: string, target: string): boolean {
  const a = normalizeName(typed);
  const b = normalizeName(target);
  if (!a || !b) return false;
  if (a === b) return true;
  const tolerance = b.length >= 8 ? 2 : b.length >= 5 ? 1 : 0;
  return levenshtein(a, b) <= tolerance;
}

export function nameMatches(typed: string, targets: string | string[]): boolean {
  const list = Array.isArray(targets) ? targets : [targets];
  return list.some((target) => matchesOne(typed, target));
}
