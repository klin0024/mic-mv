// Interpolate between two SVG paths that share the same command structure
// (same commands, same number count) — enough for our hand-authored morphs.
export const interpolatePath = (t: number, a: string, b: string): string => {
  const num = /-?\d*\.?\d+(?:e-?\d+)?/g;
  const nb = b.match(num)?.map(Number) ?? [];
  let i = 0;
  return a.replace(num, (m) => {
    const v = Number(m) + ((nb[i] ?? Number(m)) - Number(m)) * t;
    i++;
    return v.toFixed(2);
  });
};
