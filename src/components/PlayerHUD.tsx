import { motion } from "framer-motion";
import { Coins, Zap, Flame, Crown } from "lucide-react";
import type { PlayerState } from "@/lib/gamification";
import { getRankColor, getNextRankXP } from "@/lib/gamification";

interface PlayerHUDProps {
  player: PlayerState;
}

export default function PlayerHUD({ player }: PlayerHUDProps) {
  const nextXP = getNextRankXP(player.xp);
  const xpProgress = (player.xp / nextXP) * 100;
  const energyProgress = (player.energy / player.maxEnergy) * 100;

  return (
    <div className="glass rounded-xl p-4 space-y-3">
      {/* Rank & Level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-xl gradient-rank flex items-center justify-center font-display font-bold text-2xl text-primary-foreground ${player.rank === "S" || player.rank === "SS" || player.rank === "SSS" ? "glow-gold" : "glow-purple"}`}>
              {player.rank}
            </div>
            <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-secondary text-secondary-foreground px-1.5 rounded">
              Lv.{player.level}
            </span>
          </div>
          <div>
            <p className={`font-display font-bold text-lg ${getRankColor(player.rank)}`}>
              {player.rank}-Rank Hunter
            </p>
            <p className="text-xs text-muted-foreground">المستوى التالي: {nextXP.toLocaleString()} XP</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Flame size={14} className="text-destructive" />
          <span className="text-sm font-bold text-foreground">{player.streak}</span>
          <span className="text-xs text-muted-foreground">يوم</span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">XP</span>
          <span className="text-xp font-bold">{player.xp.toLocaleString()} / {nextXP.toLocaleString()}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full gradient-purple"
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
          <Coins size={16} className="text-gold" />
          <span className="font-bold text-sm text-foreground">{player.coins}</span>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-energy" />
            <span className="text-xs text-muted-foreground">طاقة</span>
            <span className="text-xs font-bold text-foreground mr-auto">{player.energy}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              animate={{ width: `${energyProgress}%` }}
              className="h-full rounded-full bg-energy"
            />
          </div>
        </div>
      </div>

      {player.vip && (
        <div className="flex items-center gap-2 text-gold text-xs">
          <Crown size={12} />
          <span className="font-bold">VIP عضوية نشطة</span>
        </div>
      )}
    </div>
  );
}
