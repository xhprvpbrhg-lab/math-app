import type { AttemptLog, FactProgress, MasteryLevel, TodaySet } from "../types";
import { allFacts, normalizedFactKey } from "./facts";

const KEYS = {
  progress: "mathapp.progress.v1",
  logs: "mathapp.logs.v1",
  today: "mathapp.today.v1",
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

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

// その日の5問を決める。既に決めていればそれを使い、無ければ習熟度の低い事実を優先して選ぶ
export function ensureTodaySet(): TodaySet {
  const date = todayDateString();
  const existing = readJson<TodaySet | null>(KEYS.today, null);
  if (existing && existing.date === date) return existing;

  const progress = loadProgress();
  const levelRank: Record<MasteryLevel, number> = { concrete: 0, outline: 1, mental: 2, fluent: 3 };

  const scored = allFacts().map(([a, b]) => {
    const key = normalizedFactKey(a, b);
    const p = progress[key];
    return {
      display: `${a}x${b}`,
      rank: p ? levelRank[p.level] : -1,
      attempts: p ? p.attempts : 0,
      lastPracticed: p ? p.lastPracticed : 0,
    };
  });

  scored.sort((x, y) => x.rank - y.rank || x.attempts - y.attempts || x.lastPracticed - y.lastPracticed);

  const todaySet: TodaySet = { date, factKeys: scored.slice(0, 5).map((s) => s.display) };
  writeJson(KEYS.today, todaySet);
  return todaySet;
}
