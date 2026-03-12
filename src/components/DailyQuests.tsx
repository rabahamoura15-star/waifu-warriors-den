import { motion } from "framer-motion";
import { Check, Coins, Star } from "lucide-react";
import type { Quest } from "@/lib/gamification";

interface DailyQuestsProps {
  quests: Quest[];
}

export default function DailyQuests({ quests }: DailyQuestsProps) {
  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <h3 className="font-display font-bold text-foreground flex items-center gap-2">
        <span className="text-lg">⚔️</span>
        المهمات اليومية
      </h3>
      <div className="space-y-2">
        {quests.map((q, i) => {
          const done = q.progress >= q.target;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                done ? "bg-primary/10 border border-primary/20" : "bg-secondary"
              }`}
            >
              <span className="text-xl">{q.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${done ? "text-primary" : "text-foreground"}`}>{q.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-purple transition-all"
                      style={{ width: `${(q.progress / q.target) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{q.progress}/{q.target}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                {done ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check size={12} className="text-primary-foreground" />
                  </div>
                ) : (
                  <>
                    <span className="flex items-center gap-0.5 text-[10px] text-xp">
                      <Star size={8} />+{q.xpReward}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] text-gold">
                      <Coins size={8} />+{q.coinReward}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
