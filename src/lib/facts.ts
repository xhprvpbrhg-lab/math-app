export function factKey(a: number, b: number): string {
  return `${a}x${b}`;
}

// 習熟度は交換法則で同一視する( 7x8 と 8x7 は同じ事実として進捗を貯める )
export function normalizedFactKey(a: number, b: number): string {
  const [min, max] = a <= b ? [a, b] : [b, a];
  return `${min}x${max}`;
}

export function allFacts(): Array<[number, number]> {
  const facts: Array<[number, number]> = [];
  for (let a = 1; a <= 9; a++) {
    for (let b = a; b <= 9; b++) {
      facts.push([a, b]);
    }
  }
  return facts;
}

export function parseFactKey(key: string): [number, number] {
  const [a, b] = key.split("x").map(Number);
  return [a, b];
}
