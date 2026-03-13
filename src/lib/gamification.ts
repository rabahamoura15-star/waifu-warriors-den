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
  titleEn: string;
  description: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  target: number;
  icon: string;
}

// HELLISH XP curve — exponential growth  
// Level 10 = 31,623 XP | Level 20 = 178,885 XP | Level 50 = 1,767,767 XP
const RANK_THRESHOLDS: { rank: Rank; minXP: number }[] = [
  { rank: "SSS", minXP: 2000000 },
  { rank: "SS", minXP: 800000 },
  { rank: "S", minXP: 300000 },
  { rank: "A", minXP: 100000 },
  { rank: "B", minXP: 30000 },
  { rank: "C", minXP: 8000 },
  { rank: "D", minXP: 2000 },
  { rank: "E", minXP: 0 },
];

// Level XP requirement = level^3 * 50 (even harder than before)
export function getXPForLevel(level: number): number {
  return Math.floor(Math.pow(level, 3) * 50);
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
  return 2000000;
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
    xp: 450,
    coins: 80,
    energy: 65,
    maxEnergy: 100,
    rank: "E",
    level: 2,
    streak: 1,
    cards: [],
    readingList: [],
    questsCompleted: [],
    vip: false,
  };
}

// ENGAGEMENT-BASED quests (no chapter reading since site doesn't host content)
export function getDailyQuests(): Quest[] {
  return [
    { id: "q1", title: "سجّل دخولك اليومي", titleEn: "Daily Login", description: "", xpReward: 10, coinReward: 2, progress: 1, target: 1, icon: "🔑" },
    { id: "q2", title: "ابقَ نشطاً 15 دقيقة", titleEn: "Stay active 15 min", description: "", xpReward: 20, coinReward: 3, progress: 0, target: 15, icon: "⏱️" },
    { id: "q3", title: "حدّث 3 أعمال في مكتبتك", titleEn: "Update 3 library items", description: "", xpReward: 15, coinReward: 3, progress: 0, target: 3, icon: "📝" },
    { id: "q4", title: "اسحب بطاقة من الاستدعاء", titleEn: "Pull a Gacha card", description: "", xpReward: 5, coinReward: 0, progress: 0, target: 1, icon: "🎴" },
    { id: "q5", title: "تحدث مع المرافق الذكي", titleEn: "Chat with Shadow Companion", description: "", xpReward: 10, coinReward: 2, progress: 0, target: 1, icon: "💬" },
    { id: "q6", title: "تصفّح المتجر أو السوق السوداء", titleEn: "Browse Shop or Black Market", description: "", xpReward: 5, coinReward: 1, progress: 0, target: 1, icon: "🛒" },
    { id: "q7", title: "استخدم البحث الذكي", titleEn: "Use Smart Search", description: "", xpReward: 10, coinReward: 2, progress: 0, target: 1, icon: "🔍" },
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

// Gacha probabilities (true rates):
// - SSR: 1%
// - Epic: 9%
// - Rare: 20%
// - Normal: 70%
export function rollGacha(): GachaCard["rarity"] {
  const r = Math.random();
  if (r < 0.01) return "SSR";
  if (r < 0.10) return "Epic";
  if (r < 0.30) return "Rare";
  return "Normal";
}
