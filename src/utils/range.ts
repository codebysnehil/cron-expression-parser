// inclusive range, e.g. range(1, 5) → [1, 2, 3, 4, 5]
export function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}
