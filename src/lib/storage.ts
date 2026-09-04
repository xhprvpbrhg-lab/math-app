import type { AttemptLog, DanProgress, FactProgress, MasteryLevel } from "../types";
import { normalizedFactKey } from "./facts";

const KEYS = {
  progress: "mathapp.progress.v1",
  logs: "mathapp.logs.v1",
  dan: "mathapp.danProgress.v1",
} as const;

const MAX_LOGS = 500;
const PROMOTE_STREAK = 3;
const INSTANT_MS = 4000;

const LEVEL_ORDER: MasteryLevel[] = ["concrete", "outline", "mental", "fluent"];

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadProgress(): Record<string, FactProgress> {
  return readJson(KEYS.progress, {});
}

export function saveProgress(progress: Record<string, FactProgress>): void {
  writeJson(KEYS.progress, progress);
}

export function loadLogs(): AttemptLog[] {
  return readJson(KEYS.logs, []);
}

function appendLog(log: AttemptLog): void {
  const logs = loadLogs();
  logs.push(log);
  if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);
  writeJson(KEYS.logs, logs);
}

export function defaultProgress(key: string): FactProgress {
  return {
    key,
    level: "concrete",
    attempts: 0,
    correctStreak: 0,
    lastPracticed: 0,
    discoveredStrategies: [],
    discoveredSplitSignatures: [],
  };
}

function demote(level: MasteryLevel): MasteryLevel {
  const idx = LEVEL_ORDER.indexOf(level);
  return LEVEL_ORDER[Math.max(0, idx - 1)];
}

function maybePromote(level: MasteryLevel, streak: number, instant: boolean): MasteryLevel {
  if (streak < PROMOTE_STREAK) return level;
  if (level === "concrete") return "outline";
  if (level === "outline") return "mental";
  if (level === "mental" && instant) return "fluent";
  return level;
}

// 1回分の記録を保存し、その事実の習熟度を更新して返す
export function recordAttempt(log: AttemptLog): FactProgress {
  const key = normalizedFactKey(log.factA, log.factB);
  const progress = loadProgress();
  const prev = progress[key] ?? defaultProgress(key);

  const instant = log.correct && log.visualAidLevel === "none" && log.responseTimeMs <= INSTANT_MS;
  const nextStreak = log.correct ? prev.correctStreak + 1 : 0;
  const nextLevel = log.correct ? maybePromote(prev.level, nextStreak, instant) : demote(prev.level);

  const nextStrategies = new Set(prev.discoveredStrategies);
  log.strategyTags.forEach((t) => nextStrategies.add(t));

  const nextSignatures = new Set(prev.discoveredSplitSignatures);
  if (log.splitSignature) nextSignatures.add(log.splitSignature);

  const updated: FactProgress = {
    key,
    level: nextLevel,
    attempts: prev.attempts + 1,
    correctStreak: nextStreak,
    lastPracticed: log.timestamp,
    discoveredStrategies: [...nextStrategies],
    discoveredSplitSignatures: [...nextSignatures],
  };

  progress[key] = updated;
  saveProgress(progress);
  appendLog({ ...log, instantAnswer: instant });
  return updated;
}

// Gallery で「別の見方を見る」を押したときに、解いていない事実でも見た記録を残す
export function addDiscoveredSignature(a: number, b: number, signature: string): FactProgress {
  const key = normalizedFactKey(a, b);
  const progress = loadProgress();
  const prev = progress[key] ?? defaultProgress(key);
  const signatures = new Set(prev.discoveredSplitSignatures);
  signatures.add(signature);
  const updated: FactProgress = { ...prev, discoveredSplitSignatures: [...signatures] };
  progress[key] = updated;
  saveProgress(progress);
  return updated;
}

function defaultDanProgress(): DanProgress {
  return { currentDan: 1, currentStep: 1, completedDans: [] };
}

export function loadDanProgress(): DanProgress {
  return readJson(KEYS.dan, defaultDanProgress());
}

function saveDanProgress(p: DanProgress): void {
  writeJson(KEYS.dan, p);
}

// 段の中の1問(dan × step)に正解して次の問題に進むときに呼ぶ
export function advanceDanStep(): DanProgress {
  const p = loadDanProgress();
  const updated: DanProgress = { ...p, currentStep: Math.min(p.currentStep + 1, 10) };
  saveDanProgress(updated);
  return updated;
}

// 段のレビュー画面を見終えて次の段に進むときに呼ぶ
export function completeDanReview(): DanProgress {
  const p = loadDanProgress();
  const completedDans = p.completedDans.includes(p.currentDan)
    ? p.completedDans
    : [...p.completedDans, p.currentDan];
  const updated: DanProgress = { currentDan: p.currentDan + 1, currentStep: 1, completedDans };
  saveDanProgress(updated);
  return updated;
}
