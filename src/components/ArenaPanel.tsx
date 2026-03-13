import { motion } from "framer-motion";
import { Swords, Users, Shield, Skull } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const guilds = [
  { name: { ar: "ظلال المراقبين", en: "Shadow Watchers" }, members: 156, power: 98000 },
  { name: { ar: "فرسان الفجر", en: "Dawn Knights" }, members: 132, power: 87000 },
  { name: { ar: "نقابة التنين", en: "Dragon Guild" }, members: 98, power: 72000 },
  { name: { ar: "أبناء العاصفة", en: "Storm Children" }, members: 87, power: 65000 },
];

const raids = [
  { name: { ar: "غارة الملك الشيطاني", en: "Demon King Raid" }, difficulty: "SSS", reward: 5000, participants: 24, maxP: 30 },
  { name: { ar: "برج الظلام - الطابق 50", en: "Dark Tower - Floor 50" }, difficulty: "S", reward: 2000, participants: 18, maxP: 20 },
  { name: { ar: "كهف التنين القديم", en: "Ancient Dragon Cave" }, difficulty: "A", reward: 800, participants: 8, maxP: 15 },
];

const diffColors: Record<string, string> = {
  SSS: "text-gold glow-gold",
  SS: "text-gold",
  S: "text-ssr",
  A: "text-epic",
};

export default function ArenaPanel() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Swords size={24} className="text-destructive" />
        {t("theArena")}
      </h2>

      {/* Raids */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Skull size={18} className="text-destructive" />
          {t("activeRaids")}
        </h3>
        <div className="space-y-3">
          {raids.map((raid, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl gradient-purple flex items-center justify-center font-display font-bold text-primary-foreground ${diffColors[raid.difficulty] || ""}`}>
                {raid.difficulty}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-foreground">{isAr ? raid.name.ar : raid.name.en}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users size={10} />{raid.participants}/{raid.maxP}
                  </span>
                  <span className="text-gold flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-gold inline-block" /> {raid.reward}
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg gradient-purple text-primary-foreground text-sm font-bold hover:scale-105 transition-transform">
                {t("join")}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guilds */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Shield size={18} className="text-accent" />
          {t("strongestGuilds")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guilds.map((guild, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center font-display font-bold text-primary-foreground text-sm">
                G{i + 1}
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{isAr ? guild.name.ar : guild.name.en}</h4>
                <p className="text-xs text-muted-foreground">
                  {guild.members} {t("member")} • {t("power")} {guild.power.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
