import { motion } from "framer-motion";
import { Trophy, Crown, Medal } from "lucide-react";
import { getRankColor, type Rank } from "@/lib/gamification";

const leaderboard = [
  { name: "ShadowMonarch", rank: "SSS" as Rank, xp: 125000, avatar: "👑" },
  { name: "BerserkReader", rank: "SS" as Rank, xp: 88000, avatar: "⚔️" },
  { name: "ManhwaAddict", rank: "SS" as Rank, xp: 72000, avatar: "📖" },
  { name: "AnimeGod", rank: "S" as Rank, xp: 45000, avatar: "🌟" },
  { name: "DarkKnight", rank: "S" as Rank, xp: 38000, avatar: "🗡️" },
  { name: "OtakuLord", rank: "A" as Rank, xp: 15000, avatar: "🎭" },
  { name: "MangaHunter", rank: "A" as Rank, xp: 12000, avatar: "🏹" },
  { name: "WebtoonFan", rank: "B" as Rank, xp: 8500, avatar: "📱" },
];

const posIcons = [
  <Crown size={16} className="text-gold" />,
  <Medal size={16} className="text-foreground" />,
  <Medal size={16} className="text-epic" />,
];

export default function LeaderboardPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Trophy size={24} className="text-gold" />
        لوحة المتصدرين
      </h2>
      <div className="space-y-2">
        {leaderboard.map((user, i) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
              i === 0 ? "glass glow-gold" : i < 3 ? "glass" : "bg-secondary"
            }`}
          >
            <span className="w-8 text-center font-display font-bold text-lg text-muted-foreground">
              {i < 3 ? posIcons[i] : i + 1}
            </span>
            <span className="text-2xl">{user.avatar}</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</p>
            </div>
            <span className={`font-display font-bold text-lg ${getRankColor(user.rank)}`}>
              {user.rank}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
