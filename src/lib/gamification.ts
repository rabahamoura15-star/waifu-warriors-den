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

const RANK_THRESHOLDS: { rank: Rank; minXP: number }[] = [
  { rank: "SSS", minXP: 100000 },
  { rank: "SS", minXP: 50000 },
  { rank: "S", minXP: 20000 },
  { rank: "A", minXP: 10000 },
  { rank: "B", minXP: 5000 },
  { rank: "C", minXP: 2000 },
  { rank: "D", minXP: 500 },
  { rank: "E", minXP: 0 },
];

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
  return 100000;
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

export function getDailyQuests(): Quest[] {
  return [
    { id: "q1", title: "قم بتسجيل الدخول", description: "سجل دخولك اليومي", xpReward: 50, coinReward: 10, progress: 1, target: 1, icon: "🔑" },
    { id: "q2", title: "اقرأ 3 فصول", description: "اقرأ 3 فصول من أي عمل", xpReward: 100, coinReward: 25, progress: 1, target: 3, icon: "📖" },
    { id: "q3", title: "أضف عمل للقائمة", description: "أضف عملاً جديداً لقائمة القراءة", xpReward: 30, coinReward: 5, progress: 0, target: 1, icon: "📝" },
    { id: "q4", title: "استخدم البحث الذكي", description: "ابحث عن عمل باستخدام الوصف", xpReward: 50, coinReward: 15, progress: 0, target: 1, icon: "🔍" },
    { id: "q5", title: "اسحب بطاقة", description: "قم بسحب بطاقة واحدة من الـ Gacha", xpReward: 20, coinReward: 0, progress: 0, target: 1, icon: "🎴" },
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

export function rollGacha(): GachaCard["rarity"] {
  const r = Math.random();
  if (r < 0.03) return "SSR";
  if (r < 0.12) return "Epic";
  if (r < 0.35) return "Rare";
  return "Normal";
}
