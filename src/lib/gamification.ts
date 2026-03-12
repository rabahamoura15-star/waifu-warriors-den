export type Rank = "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS";

export interface PlayerState {
  xp: number;
  coins: number;
  energy: number;
  maxEnergy: number;
  rank: Rank;
  level: number;
  streak: number;
  cards: GachaCard[];
  readingList: ReadingEntry[];
  questsCompleted: string[];
  vip: boolean;
}

export interface ReadingEntry {
  mediaId: number;
  title: string;
  coverImage: string;
  currentChapter: number;
  totalChapters: number | null;
  status: "reading" | "completed" | "plan_to_read" | "dropped";
}

export interface GachaCard {
  id: string;
  mediaId: number;
  title: string;
  coverImage: string;
  rarity: "Normal" | "Rare" | "Epic" | "SSR";
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  target: number;
  icon: string;
}

// HELLISH XP curve — exponential growth
const RANK_THRESHOLDS: { rank: Rank; minXP: number }[] = [
  { rank: "SSS", minXP: 500000 },
  { rank: "SS", minXP: 200000 },
  { rank: "S", minXP: 80000 },
  { rank: "A", minXP: 35000 },
  { rank: "B", minXP: 15000 },
  { rank: "C", minXP: 5000 },
  { rank: "D", minXP: 1500 },
  { rank: "E", minXP: 0 },
];

// Level XP requirement = level^2.5 * 100
export function getXPForLevel(level: number): number {
  return Math.floor(Math.pow(level, 2.5) * 100);
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (getXPForLevel(level + 1) <= xp) level++;
  return level;
}

export function getRank(xp: number): Rank {
  for (const t of RANK_THRESHOLDS) {
    if (xp >= t.minXP) return t.rank;
  }
  return "E";
}

export function getNextRankXP(xp: number): number {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp < RANK_THRESHOLDS[i].minXP) return RANK_THRESHOLDS[i].minXP;
  }
  return 500000;
}

export function getRankColor(rank: Rank): string {
  const colors: Record<Rank, string> = {
    E: "text-muted-foreground",
    D: "text-foreground",
    C: "text-energy",
    B: "text-rare",
    A: "text-epic",
    S: "text-ssr",
    SS: "text-gold",
    SSS: "text-primary",
  };
  return colors[rank];
}

export function getDefaultPlayer(): PlayerState {
  return {
    xp: 1250,
    coins: 340,
    energy: 65,
    maxEnergy: 100,
    rank: "D",
    level: 7,
    streak: 3,
    cards: [],
    readingList: [],
    questsCompleted: [],
    vip: false,
  };
}

// Coin rewards are tiny — grinding is required
export function getDailyQuests(): Quest[] {
  return [
    { id: "q1", title: "قم بتسجيل الدخول", description: "سجل دخولك اليومي", xpReward: 25, coinReward: 3, progress: 1, target: 1, icon: "🔑" },
    { id: "q2", title: "اقرأ 5 فصول", description: "اقرأ 5 فصول من أي عمل", xpReward: 50, coinReward: 8, progress: 1, target: 5, icon: "📖" },
    { id: "q3", title: "أضف عمل للقائمة", description: "أضف عملاً جديداً لقائمة القراءة", xpReward: 15, coinReward: 2, progress: 0, target: 1, icon: "📝" },
    { id: "q4", title: "استخدم البحث الذكي", description: "ابحث عن عمل باستخدام الوصف", xpReward: 20, coinReward: 5, progress: 0, target: 1, icon: "🔍" },
    { id: "q5", title: "اسحب بطاقة", description: "قم بسحب بطاقة واحدة من الـ Gacha", xpReward: 10, coinReward: 0, progress: 0, target: 1, icon: "🎴" },
    { id: "q6", title: "تواجد لمدة 30 دقيقة", description: "ابقَ متصلاً لمدة 30 دقيقة", xpReward: 30, coinReward: 5, progress: 0, target: 30, icon: "⏱️" },
    { id: "q7", title: "شارك في غارة", description: "انضم لغارة واحدة على الأقل", xpReward: 40, coinReward: 10, progress: 0, target: 1, icon: "⚔️" },
  ];
}

export function getRarityColor(rarity: GachaCard["rarity"]): string {
  switch (rarity) {
    case "SSR": return "glow-gold border-gold";
    case "Epic": return "glow-purple border-epic";
    case "Rare": return "glow-cyan border-rare";
    default: return "border-muted";
  }
}

// SSR is nearly impossible
export function rollGacha(): GachaCard["rarity"] {
  const r = Math.random();
  if (r < 0.01) return "SSR";     // 1%
  if (r < 0.06) return "Epic";    // 5%
  if (r < 0.20) return "Rare";    // 14%
  return "Normal";                 // 80%
}
