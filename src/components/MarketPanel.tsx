import { motion } from "framer-motion";
import { ShoppingBag, Coins, Clock, Lock } from "lucide-react";

const shopItems = [
  { name: "تعزيز XP مضاعف (24 ساعة)", price: 200, icon: "⚡", rarity: "rare" },
  { name: "صندوق بطاقات عشوائي", price: 150, icon: "🎁", rarity: "normal" },
  { name: "إعادة ملء الطاقة", price: 100, icon: "🔋", rarity: "normal" },
  { name: "تغيير لقب مخصص", price: 500, icon: "✏️", rarity: "epic" },
  { name: "ثيم حصري: ملك الظلال", price: 2000, icon: "👑", rarity: "ssr" },
];

const rarityBorders: Record<string, string> = {
  normal: "border-muted",
  rare: "border-rare",
  epic: "border-epic glow-purple",
  ssr: "border-gold glow-gold",
};

export default function MarketPanel() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <ShoppingBag size={24} className="text-accent" />
        السوق
      </h2>

      {/* Main Shop */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-lg text-foreground">المتجر الرئيسي</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shopItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-xl p-4 border ${rarityBorders[item.rarity]} hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                  <p className="flex items-center gap-1 mt-2 text-sm text-gold font-bold">
                    <Coins size={14} />{item.price}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Black Market */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Lock size={16} className="text-muted-foreground" />
          السوق السوداء
          <span className="text-xs text-muted-foreground">(تظهر في أوقات سرية)</span>
        </h3>
        <div className="glass rounded-xl p-8 text-center border border-dashed border-muted">
          <Clock size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">السوق السوداء مغلقة حالياً</p>
          <p className="text-xs text-muted-foreground mt-1">تُفتح في أوقات عشوائية — ابقَ متصلاً!</p>
        </div>
      </section>
    </div>
  );
}
