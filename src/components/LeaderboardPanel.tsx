import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Clock, Flame } from "lucide-react";
import { getRankColor, type Rank } from "@/lib/gamification";
import { useI18n } from "@/lib/i18n";

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

const weeklyTimeBoard = [
  { name: "ShadowMonarch", hours: 47.5, avatar: "👑", isChampion: true },
  { name: "NightReader", hours: 42.3, avatar: "🌙" },
  { name: "BerserkReader", hours: 38.1, avatar: "⚔️" },
  { name: "ManhwaAddict", hours: 35.8, avatar: "📖" },
  { name: "DarkKnight", hours: 31.2, avatar: "🗡️" },
  { name: "OtakuLord", hours: 28.7, avatar: "🎭" },
  { name: "AnimeGod", hours: 25.4, avatar: "🌟" },
  { name: "WebtoonFan", hours: 22.1, avatar: "📱" },
  { name: "MangaHunter", hours: 19.6, avatar: "🏹" },
  { name: "ReadingKing", hours: 17.3, avatar: "📚" },
];

const posIcons = [
  <Crown size={16} className="text-gold" />,
  <Medal size={16} className="text-foreground" />,
  <Medal size={16} className="text-epic" />,
];

export default function LeaderboardPanel() {
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      {/* Champion Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-4 md:p-6 glow-gold border border-gold/30 text-center space-y-2"
      >
        <p className="text-xs text-gold font-bold">{t("top1Banner")}</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">👑</span>
          <div>
            <p className="font-display font-bold text-xl md:text-2xl text-gold">ShadowMonarch</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
              <Clock size={10} />
              47.5h {t("day") === "يوم" ? "هذا الأسبوع" : "this week"}
            </p>
          </div>
          <span className="text-4xl">👑</span>
        </div>
        <div className="inline-block px-4 py-1 rounded-full gradient-gold text-xs font-bold text-gold-foreground">
          🏆 {t("day") === "يوم" ? "بانر بطل الأسبوع" : "Champion Banner Active"}
        </div>
      </motion.div>

      {/* Weekly Time Leaderboard */}
      <section className="space-y-3">
        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
          <Clock size={20} className="text-accent" />
          {t("weeklyTimeBoard")}
        </h2>
        <div className="space-y-2">
          {weeklyTimeBoard.map((user, i) => (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl transition-colors ${
                i === 0 ? "glass glow-gold" : i < 3 ? "glass" : "bg-secondary"
              }`}
            >
              <span className="w-7 md:w-8 text-center font-display font-bold text-sm md:text-lg text-muted-foreground">
                {i < 3 ? posIcons[i] : i + 1}
              </span>
              <span className="text-xl md:text-2xl">{user.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs md:text-sm text-foreground truncate">{user.name}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={10} /> {user.hours}h
                </p>
              </div>
              {i === 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full gradient-gold text-gold-foreground font-bold">
                  🏆
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* XP Leaderboard */}
      <section className="space-y-3">
        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
          <Trophy size={20} className="text-gold" />
          {t("leaderboardTitle")}
        </h2>
        <div className="space-y-2">
          {leaderboard.map((user, i) => (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl transition-colors ${
                i === 0 ? "glass glow-gold" : i < 3 ? "glass" : "bg-secondary"
              }`}
            >
              <span className="w-7 md:w-8 text-center font-display font-bold text-sm md:text-lg text-muted-foreground">
                {i < 3 ? posIcons[i] : i + 1}
              </span>
              <span className="text-xl md:text-2xl">{user.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs md:text-sm text-foreground truncate">{user.name}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</p>
              </div>
              <span className={`font-display font-bold text-sm md:text-lg ${getRankColor(user.rank)}`}>
                {user.rank}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
