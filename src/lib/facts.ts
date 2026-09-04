// 習熟度は交換法則で同一視する( 7x8 と 8x7 は同じ事実として進捗を貯める )
export function normalizedFactKey(a: number, b: number): string {
  const [min, max] = a <= b ? [a, b] : [b, a];
  return `${min}x${max}`;
}
