import { motion } from "framer-motion";
import { Swords, Users, Shield, Skull } from "lucide-react";

const guilds = [
  { name: "ظلال المراقبين", members: 156, power: 98000, icon: "🌑" },
  { name: "فرسان الفجر", members: 132, power: 87000, icon: "🌅" },
  { name: "نقابة التنين", members: 98, power: 72000, icon: "🐉" },
  { name: "أبناء العاصفة", members: 87, power: 65000, icon: "⚡" },
];

const raids = [
  { name: "غارة الملك الشيطاني", difficulty: "SSS", reward: 5000, participants: 24, maxP: 30 },
  { name: "برج الظلام - الطابق 50", difficulty: "S", reward: 2000, participants: 18, maxP: 20 },
  { name: "كهف التنين القديم", difficulty: "A", reward: 800, participants: 8, maxP: 15 },
];

const diffColors: Record<string, string> = {
  SSS: "text-gold glow-gold",
  SS: "text-gold",
  S: "text-ssr",
  A: "text-epic",
};

export default function ArenaPanel() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Swords size={24} className="text-destructive" />
        الساحة
      </h2>

      {/* Raids */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Skull size={18} className="text-destructive" />
          الغارات النشطة
        </h3>
        <div className="space-y-3">
          {raids.map((raid, i) => (
            <motion.div
              key={raid.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl gradient-purple flex items-center justify-center font-display font-bold text-primary-foreground ${diffColors[raid.difficulty] || ""}`}>
                {raid.difficulty}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-foreground">{raid.name}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users size={10} />{raid.participants}/{raid.maxP}
                  </span>
                  <span className="text-gold">🪙 {raid.reward}</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg gradient-purple text-primary-foreground text-sm font-bold hover:scale-105 transition-transform">
                انضم
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guilds */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Shield size={18} className="text-accent" />
          أقوى النقابات
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guilds.map((guild, i) => (
            <motion.div
              key={guild.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <span className="text-3xl">{guild.icon}</span>
              <div>
                <h4 className="font-bold text-sm text-foreground">{guild.name}</h4>
                <p className="text-xs text-muted-foreground">{guild.members} عضو • قوة {guild.power.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
