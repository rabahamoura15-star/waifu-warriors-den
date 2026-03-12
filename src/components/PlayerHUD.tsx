import { motion } from "framer-motion";
import { Coins, Zap, Flame, Crown } from "lucide-react";
import type { PlayerState } from "@/lib/gamification";
import { getRankColor, getNextRankXP } from "@/lib/gamification";
import { useI18n } from "@/lib/i18n";

interface PlayerHUDProps {
  player: PlayerState;
}

export default function PlayerHUD({ player }: PlayerHUDProps) {
  const nextXP = getNextRankXP(player.xp);
  const xpProgress = (player.xp / nextXP) * 100;
  const energyProgress = (player.energy / player.maxEnergy) * 100;
  const { t } = useI18n();

  return (
    <div className="glass rounded-xl p-3 md:p-4 space-y-2 md:space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-rank flex items-center justify-center font-display font-bold text-xl md:text-2xl text-primary-foreground ${player.rank === "S" || player.rank === "SS" || player.rank === "SSS" ? "glow-gold" : "glow-purple"}`}>
              {player.rank}
            </div>
            <span className="absolute -bottom-1 -right-1 text-[9px] md:text-[10px] font-bold bg-secondary text-secondary-foreground px-1 md:px-1.5 rounded">
              Lv.{player.level}
            </span>
          </div>
          <div>
            <p className={`font-display font-bold text-sm md:text-lg ${getRankColor(player.rank)}`}>
              {player.rank}-Rank Hunter
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground">{t("nextLevel")}: {nextXP.toLocaleString()} XP</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Flame size={12} className="text-destructive" />
          <span className="text-xs md:text-sm font-bold text-foreground">{player.streak}</span>
          <span className="text-[10px] md:text-xs text-muted-foreground">{t("day")}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] md:text-xs">
          <span className="text-muted-foreground">XP</span>
          <span className="text-xp font-bold">{player.xp.toLocaleString()} / {nextXP.toLocaleString()}</span>
        </div>
        <div className="h-1.5 md:h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full gradient-purple"
          />
        </div>
      </div>

      <div className="flex gap-2 md:gap-3">
        <div className="flex-1 flex items-center gap-1.5 md:gap-2 bg-secondary rounded-lg px-2 md:px-3 py-1.5 md:py-2">
          <Coins size={14} className="text-gold" />
          <span className="font-bold text-xs md:text-sm text-foreground">{player.coins}</span>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1">
            <Zap size={10} className="text-energy" />
            <span className="text-[10px] md:text-xs text-muted-foreground">{t("energy")}</span>
            <span className="text-[10px] md:text-xs font-bold text-foreground mr-auto">{player.energy}%</span>
          </div>
          <div className="h-1 md:h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div animate={{ width: `${energyProgress}%` }} className="h-full rounded-full bg-energy" />
          </div>
        </div>
      </div>

      {player.vip && (
        <div className="flex items-center gap-2 text-gold text-[10px] md:text-xs">
          <Crown size={10} />
          <span className="font-bold">{t("vipActive")}</span>
        </div>
      )}
    </div>
  );
}
