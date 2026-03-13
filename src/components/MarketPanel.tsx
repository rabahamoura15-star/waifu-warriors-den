import { motion } from "framer-motion";
import { ShoppingBag, Coins, Clock, Lock, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import lootBoxImg from "@/assets/loot-box.png";

const shopItems = [
  { name: { ar: "تعزيز XP مضاعف (24 ساعة)", en: "Double XP Boost (24h)", fr: "Boost XP x2 (24h)", pt: "Boost XP x2 (24h)", hi: "डबल XP बूस्ट (24h)" }, price: 500, icon: "⚡", rarity: "rare" },
  { name: { ar: "صندوق بطاقات عشوائي", en: "Random Card Box", fr: "Boîte de Cartes", pt: "Caixa de Cartas", hi: "रैंडम कार्ड बॉक्स" }, price: 300, icon: "🎁", rarity: "normal" },
  { name: { ar: "إعادة ملء الطاقة", en: "Energy Refill", fr: "Recharge d'Énergie", pt: "Recarga de Energia", hi: "ऊर्जा रिफिल" }, price: 250, icon: "🔋", rarity: "normal" },
  { name: { ar: "تغيير لقب مخصص", en: "Custom Title Change", fr: "Changement de Titre", pt: "Mudança de Título", hi: "कस्टम टाइटल" }, price: 1500, icon: "✏️", rarity: "epic" },
  { name: { ar: "ثيم حصري: ملك الظلال", en: "Exclusive Theme: Shadow King", fr: "Thème: Roi des Ombres", pt: "Tema: Rei das Sombras", hi: "एक्सक्लूसिव थीम" }, price: 5000, icon: "👑", rarity: "ssr" },
  { name: { ar: "درع الحماية (24 ساعة)", en: "Protection Shield (24h)", fr: "Bouclier (24h)", pt: "Escudo (24h)", hi: "सुरक्षा शील्ड (24h)" }, price: 400, icon: "🛡️", rarity: "rare" },
  { name: { ar: "تذكرة استدعاء مجانية", en: "Free Summon Ticket", fr: "Ticket d'Invocation", pt: "Ticket de Invocação", hi: "फ्री समन टिकट" }, price: 800, icon: "🎫", rarity: "epic" },
  { name: { ar: "مضاعف عملات (12 ساعة)", en: "Coin Multiplier (12h)", fr: "Multiplicateur (12h)", pt: "Multiplicador (12h)", hi: "कॉइन मल्टीप्लायर" }, price: 600, icon: "💰", rarity: "rare" },
  { name: { ar: "إعادة تعيين المهمات", en: "Quest Reset", fr: "Réinitialisation des Quêtes", pt: "Reset de Missões", hi: "क्वेस्ट रीसेट" }, price: 350, icon: "🔄", rarity: "normal" },
  { name: { ar: "إطار بروفايل ذهبي", en: "Gold Profile Frame", fr: "Cadre Doré", pt: "Moldura Dourada", hi: "गोल्ड फ्रेम" }, price: 3000, icon: "🖼️", rarity: "ssr" },
  { name: { ar: "تعزيز سرعة القراءة", en: "Reading Speed Boost", fr: "Boost de Lecture", pt: "Boost de Leitura", hi: "रीडिंग बूस्ट" }, price: 200, icon: "📖", rarity: "normal" },
  { name: { ar: "رمز تعبيري حصري", en: "Exclusive Emoji Pack", fr: "Pack Emoji Exclusif", pt: "Pack Emoji Exclusivo", hi: "एक्सक्लूसिव इमोजी" }, price: 1000, icon: "😈", rarity: "epic" },
  { name: { ar: "تذكرة غارة VIP", en: "VIP Raid Ticket", fr: "Ticket Raid VIP", pt: "Ticket Raid VIP", hi: "VIP रेड टिकट" }, price: 2000, icon: "⚔️", rarity: "ssr" },
  { name: { ar: "صندوق الحظ الأسود", en: "Black Luck Box", fr: "Boîte Noire", pt: "Caixa Negra", hi: "ब्लैक लक बॉक्स" }, price: 4000, icon: "🎲", rarity: "ssr" },
  { name: { ar: "جرعة الخبرة المركزة", en: "Concentrated XP Potion", fr: "Potion XP Concentrée", pt: "Poção XP Concentrada", hi: "XP पोशन" }, price: 750, icon: "🧪", rarity: "epic" },
];

const rarityBorders: Record<string, string> = {
  normal: "border-muted",
  rare: "border-rare",
  epic: "border-epic glow-purple",
  ssr: "border-gold glow-gold",
};

export default function MarketPanel() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <ShoppingBag size={24} className="text-accent" />
        {t("market")}
      </h2>

      {/* Main Shop */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-lg text-foreground">{t("mainShop")}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
          {shopItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl p-3 md:p-4 border ${rarityBorders[item.rarity]} hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs md:text-sm text-foreground line-clamp-2">
                    {(item.name as any)[lang] || item.name.en}
                  </h4>
                  <p className="flex items-center gap-1 mt-1.5 text-xs md:text-sm text-gold font-bold">
                    <Coins size={12} />{item.price}
                  </p>
                </div>
              </div>
              <button className="w-full mt-2 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30 transition-colors">
                {t("buy")}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Player Market */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Users size={16} className="text-accent" />
          {t("playerMarket")}
        </h3>
        <div className="glass rounded-xl p-6 text-center border border-dashed border-muted">
          <Users size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">{t("playerMarketDesc")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("comingSoon")}</p>
        </div>
      </section>

      {/* Black Market */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Lock size={16} className="text-muted-foreground" />
          {t("blackMarket")}
        </h3>
        <div className="glass rounded-xl p-6 md:p-8 text-center border border-dashed border-muted flex flex-col items-center">
          <img src={lootBoxImg} alt="" className="w-20 h-20 object-contain mb-3 opacity-50" />
          <p className="text-muted-foreground text-sm">{t("blackMarketClosed")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("stayConnected")}</p>
        </div>
      </section>
    </div>
  );
}
