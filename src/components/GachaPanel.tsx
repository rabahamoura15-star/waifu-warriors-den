import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Coins, Sparkles } from "lucide-react";
import { rollGacha, type GachaCard } from "@/lib/gamification";

const GACHA_COST = 50;

const mockCovers = [
  "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx105398-b673Vt5ZSuz3.jpg",
  "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx127720-ENofqTlHDDKR.jpg",
  "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx120249-iCFKgMN6FPOk.jpg",
  "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx101517-FrMcCMdRWk5A.jpg",
];

const rarityNames: Record<GachaCard["rarity"], string> = {
  Normal: "عادي",
  Rare: "نادر",
  Epic: "أسطوري",
  SSR: "✦ SSR ✦",
};

const rarityStyles: Record<GachaCard["rarity"], string> = {
  Normal: "border-muted",
  Rare: "border-rare glow-cyan",
  Epic: "border-epic glow-purple",
  SSR: "border-gold glow-gold",
};

const rarityTextStyles: Record<GachaCard["rarity"], string> = {
  Normal: "text-muted-foreground",
  Rare: "text-rare text-glow-cyan",
  Epic: "text-epic text-glow-purple",
  SSR: "text-gold",
};

export default function GachaPanel() {
  const [pulling, setPulling] = useState(false);
  const [result, setResult] = useState<{ rarity: GachaCard["rarity"]; cover: string } | null>(null);
  const [coins, setCoins] = useState(340);

  const pull = () => {
    if (coins < GACHA_COST || pulling) return;
    setPulling(true);
    setResult(null);
    setCoins((c) => c - GACHA_COST);

    setTimeout(() => {
      const rarity = rollGacha();
      const cover = mockCovers[Math.floor(Math.random() * mockCovers.length)];
      setResult({ rarity, cover });
      setPulling(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Sparkles size={24} className="text-ssr" />
        بوابة الاستدعاء
      </h2>
      <p className="text-sm text-muted-foreground">
        اسحب بطاقات أعمال بدرجات ندرة مختلفة! اجمع 10 بطاقات SSR لتفتح ثيم حصري.
      </p>

      <div className="flex flex-col items-center gap-6">
        {/* Card display area */}
        <div className="relative w-64 h-80 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {pulling && (
              <motion.div
                key="pulling"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 1080 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="w-48 h-64 rounded-xl gradient-purple glow-purple flex items-center justify-center"
              >
                <Star size={48} className="text-primary-foreground animate-pulse" />
              </motion.div>
            )}
            {!pulling && result && (
              <motion.div
                key="result"
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                className={`w-48 h-64 rounded-xl overflow-hidden border-2 ${rarityStyles[result.rarity]}`}
              >
                <img src={result.cover} className="w-full h-full object-cover" alt="Gacha card" />
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-background to-transparent">
                  <p className={`text-center font-display font-bold text-lg ${rarityTextStyles[result.rarity]}`}>
                    {rarityNames[result.rarity]}
                  </p>
                </div>
              </motion.div>
            )}
            {!pulling && !result && (
              <motion.div
                key="idle"
                className="w-48 h-64 rounded-xl border-2 border-dashed border-muted flex flex-col items-center justify-center gap-2 text-muted-foreground"
              >
                <Star size={32} />
                <span className="text-sm">اسحب بطاقة!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={pull}
          disabled={pulling || coins < GACHA_COST}
          className="flex items-center gap-2 px-8 py-3 rounded-xl gradient-purple text-primary-foreground font-display font-bold text-lg hover:scale-105 transition-transform glow-purple disabled:opacity-50 disabled:hover:scale-100"
        >
          <Star size={20} />
          استدعاء
          <span className="flex items-center gap-1 text-sm opacity-80">
            (<Coins size={14} />{GACHA_COST})
          </span>
        </button>

        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Coins size={14} className="text-gold" />
          رصيدك: <span className="font-bold text-foreground">{coins}</span>
        </p>

        {/* Rates */}
        <div className="glass rounded-xl p-4 w-full max-w-sm space-y-2">
          <h4 className="text-sm font-bold text-foreground">نسب السحب</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="text-muted-foreground">عادي (Normal)</span><span className="text-foreground text-left">65%</span>
            <span className="text-rare">نادر (Rare)</span><span className="text-foreground text-left">23%</span>
            <span className="text-epic">أسطوري (Epic)</span><span className="text-foreground text-left">9%</span>
            <span className="text-gold font-bold">✦ SSR ✦</span><span className="text-foreground text-left font-bold">3%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
