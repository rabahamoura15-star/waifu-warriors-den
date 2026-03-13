import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Coins, Sparkles } from "lucide-react";
import { rollGacha, type GachaCard } from "@/lib/gamification";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { filterNsfwMedia } from "@/lib/nsfw";
import { mangadexTrending } from "@/lib/mangadex";
import { getTrending, getPopular, getTitle, type AniMedia } from "@/lib/anilist";
import summonGateImg from "@/assets/summon-gate.png";

const GACHA_COST = 50;

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

type GachaPool = Record<GachaCard["rarity"], { cover: string; title: string }[]>;

const DEFAULT_PLACEHOLDER_CARDS: { cover: string; title: string }[] = [
  {
    cover: "https://images.unsplash.com/photo-1549961034-6712e01b08f4?auto=format&fit=crop&w=640&q=80",
    title: "Mystic Summoner",
  },
  {
    cover: "https://images.unsplash.com/photo-1531962708070-6468caf38d7b?auto=format&fit=crop&w=640&q=80",
    title: "Arcane Blade",
  },
  {
    cover: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=640&q=80",
    title: "Shadow Guardian",
  },
  {
    cover: "https://images.unsplash.com/photo-1520975918546-1e827e42bc22?auto=format&fit=crop&w=640&q=80",
    title: "Seraphic Warrior",
  },
];

function buildGachaPools(media: AniMedia[]): GachaPool {
  const sorted = [...media].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  const ssr = sorted.slice(0, 3);
  const epic = sorted.slice(3, 12);
  const rare = sorted.slice(12, 32);
  const normal = sorted.slice(32, 60);

  const toCard = (m: AniMedia) => ({ cover: m.coverImage.extraLarge, title: getTitle(m) });

  const ensure = (items: { cover: string; title: string }[], min = 1) => {
    if (items.length >= min) return items;
    return [...items, ...DEFAULT_PLACEHOLDER_CARDS].slice(0, min);
  };

  return {
    SSR: ensure(ssr.map(toCard), 1),
    Epic: ensure(epic.map(toCard), 2),
    Rare: ensure(rare.map(toCard), 4),
    Normal: ensure(normal.map(toCard), 6),
  };
}

export default function GachaPanel() {
  const [pulling, setPulling] = useState(false);
  const [result, setResult] = useState<{ rarity: GachaCard["rarity"]; cover: string; title: string } | null>(null);
  const [coins, setCoins] = useState(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("gachaCoins") : null;
    return saved ? Number(saved) : 340;
  });
  const [pools, setPools] = useState<GachaPool | null>(null);
  const { t } = useI18n();
  const { nsfwFilterEnabled } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("gachaCoins", String(coins));
  }, [coins]);

  useEffect(() => {
    const loadPools = async () => {
      try {
        const [mangas, popularManga, popularAnime] = await Promise.all([
          mangadexTrending(20, nsfwFilterEnabled),
          getPopular("MANGA", 1, 25, nsfwFilterEnabled),
          getPopular("ANIME", 1, 25, nsfwFilterEnabled),
        ]);

        const allMedia = [
          ...filterNsfwMedia(mangas, nsfwFilterEnabled),
          ...filterNsfwMedia(popularManga, nsfwFilterEnabled),
          ...filterNsfwMedia(popularAnime, nsfwFilterEnabled),
        ].filter((m) => m.coverImage?.extraLarge);

        setPools(buildGachaPools(allMedia));
      } catch {
        // Best-effort fallback: trending from AniList
        try {
          const trending = await getTrending("MANGA", 1, 30, nsfwFilterEnabled);
          const filtered = filterNsfwMedia(trending, nsfwFilterEnabled);
          setPools(buildGachaPools(filtered));
        } catch {
          setPools(null);
        }
      }
    };

    loadPools();
  }, [nsfwFilterEnabled]);

  const pull = () => {
    if (coins < GACHA_COST || pulling) return;
    const pool = pools;
    if (!pool) return;

    setPulling(true);
    setResult(null);
    setCoins((c) => c - GACHA_COST);

    setTimeout(() => {
      const rarity = rollGacha();
      const poolForRarity = pool[rarity].length ? pool[rarity] : DEFAULT_PLACEHOLDER_CARDS;
      const card = poolForRarity[Math.floor(Math.random() * poolForRarity.length)];
      setResult({ rarity, cover: card.cover, title: card.title });
      setPulling(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Sparkles size={24} className="text-ssr" />
        {t("summonGate")}
      </h2>
      <p className="text-sm text-muted-foreground">{t("summonDesc")}</p>

      <div className="flex flex-col items-center gap-6">
        {/* Gate image */}
        <div className="relative w-48 h-48 flex items-center justify-center opacity-30">
          <img src={summonGateImg} alt="" className="absolute inset-0 w-full h-full object-contain" />
        </div>

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
                  <p className={`text-center font-display font-bold text-sm ${rarityTextStyles[result.rarity]}`}>
                    {result.rarity === "SSR" ? "✦ SSR ✦" : t(result.rarity.toLowerCase())}
                  </p>
                  <p className="text-center text-xs text-foreground mt-1 line-clamp-2">
                    {result.title}
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
                <span className="text-sm">{pools ? t("pullCard") : "Loading..."}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={pull}
          disabled={pulling || coins < GACHA_COST || !pools}
          className="flex items-center gap-2 px-8 py-3 rounded-xl gradient-purple text-primary-foreground font-display font-bold text-lg hover:scale-105 transition-transform glow-purple disabled:opacity-50 disabled:hover:scale-100"
        >
          <Star size={20} />
          {t("summon")}
          <span className="flex items-center gap-1 text-sm opacity-80">
            (<Coins size={14} />{GACHA_COST})
          </span>
        </button>

        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Coins size={14} className="text-gold" />
          {t("yourBalance")}: <span className="font-bold text-foreground">{coins}</span>
        </p>

        {/* Rates */}
        <div className="glass rounded-xl p-4 w-full max-w-sm space-y-2">
          <h4 className="text-sm font-bold text-foreground">{t("pullRates")}</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="text-muted-foreground">{t("normal")} (Normal)</span><span className="text-foreground text-left">70%</span>
            <span className="text-rare">{t("rare")} (Rare)</span><span className="text-foreground text-left">20%</span>
            <span className="text-epic">{t("epic")} (Epic)</span><span className="text-foreground text-left">9%</span>
            <span className="text-gold font-bold">✦ SSR ✦</span><span className="text-foreground text-left font-bold">1%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
