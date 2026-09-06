// 2桁の数を「十の位の値(10の倍数)」と「一の位の値(0-9)」に分ける
// 例: 38 -> [30, 8]
export function digits2(n: number): [number, number] {
  const ones = n % 10;
  return [n - ones, ones];
}

export interface AddPlan {
  a: number;
  b: number;
  aTensValue: number;
  aOnes: number;
  bTensValue: number;
  bOnes: number;
  onesSum: number; // 一の位どうしの和。10以上ならくり上がりが起きる
  tensSumValue: number; // くり上がり前の十の位どうしの和
  carries: boolean;
  onesFinal: number;
  tensFinalValue: number; // くり上がり後の十の位の値
  total: number;
}

export function planAddition(a: number, b: number): AddPlan {
  const [aTensValue, aOnes] = digits2(a);
  const [bTensValue, bOnes] = digits2(b);
  const onesSum = aOnes + bOnes;
  const carries = onesSum >= 10;
  const onesFinal = onesSum % 10;
  const tensSumValue = aTensValue + bTensValue;
  const tensFinalValue = tensSumValue + (carries ? 10 : 0);
  return { a, b, aTensValue, aOnes, bTensValue, bOnes, onesSum, tensSumValue, carries, onesFinal, tensFinalValue, total: a + b };
}

export interface SubPlan {
  a: number;
  b: number;
  aTensValue: number;
  aOnes: number;
  bTensValue: number;
  bOnes: number;
  needsRegroup: boolean; // 一の位だけでは引けない(くり下がりが必要)
  regroupedTensValue: number; // 組みかえ後の十の位の値(不要なら元のまま)
  regroupedOnes: number; // 組みかえ後の一の位の値(不要なら元のまま)
  onesResult: number;
  tensResultValue: number;
  total: number;
}

export function planSubtraction(a: number, b: number): SubPlan {
  const [aTensValue, aOnes] = digits2(a);
  const [bTensValue, bOnes] = digits2(b);
  const needsRegroup = aOnes < bOnes;
  const regroupedTensValue = needsRegroup ? aTensValue - 10 : aTensValue;
  const regroupedOnes = needsRegroup ? aOnes + 10 : aOnes;
  const onesResult = regroupedOnes - bOnes;
  const tensResultValue = regroupedTensValue - bTensValue;
  return {
    a,
    b,
    aTensValue,
    aOnes,
    bTensValue,
    bOnes,
    needsRegroup,
    regroupedTensValue,
    regroupedOnes,
    onesResult,
    tensResultValue,
    total: a - b,
  };
}

// 2桁+2桁で、和も2桁におさまる組を作る(3桁への繰り上がりはPhase2)
export function randomAddPair(): [number, number] {
  const a = 10 + Math.floor(Math.random() * 80); // 10-89
  const maxB = Math.min(89, 99 - a);
  const b = 10 + Math.floor(Math.random() * (maxB - 10 + 1));
  return [a, b];
}

// 2桁-2桁で、引く数が引かれる数を超えない組を作る
export function randomSubPair(): [number, number] {
  const a = 11 + Math.floor(Math.random() * 89); // 11-99
  const b = 10 + Math.floor(Math.random() * (a - 10 + 1)); // 10..a
  return [a, b];
}
