import type { ArithmeticCategory, ArithmeticProgress } from "../types";

const KEY = "mathapp.arithmeticProgress.v1";

function emptyProgress(): ArithmeticProgress {
  return {
    "add-no-carry": { attempts: 0, correct: 0 },
    "add-carry": { attempts: 0, correct: 0 },
    "sub-no-borrow": { attempts: 0, correct: 0 },
    "sub-borrow": { attempts: 0, correct: 0 },
  };
}

export function loadArithmeticProgress(): ArithmeticProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return emptyProgress();
  }
}

export function recordArithmeticAttempt(category: ArithmeticCategory, correct: boolean): ArithmeticProgress {
  const progress = loadArithmeticProgress();
  const prev = progress[category];
  progress[category] = { attempts: prev.attempts + 1, correct: prev.correct + (correct ? 1 : 0) };
  localStorage.setItem(KEY, JSON.stringify(progress));
  return progress;
}
