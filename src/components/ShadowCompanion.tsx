import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tips = [
  "هل تعلم؟ يمكنك كسب عملات إضافية كل يوم!",
  "جرّب البحث بوصف مثل 'بطل يتحول للظلام'",
  "أكمل المهمات اليومية لتصعد بالرتبة!",
  "اسحب بطاقات من الـ Gacha لتفتح ثيمات حصرية!",
  "سجل دخولك 30 يوماً متواصلة للحصول على VIP!",
];

export default function ShadowCompanion() {
  const [message, setMessage] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(tips[Math.floor(Math.random() * tips.length)]);
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 5000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50 cursor-pointer"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      onClick={() => {
        setMessage(tips[Math.floor(Math.random() * tips.length)]);
        setShowMsg(true);
        setTimeout(() => setShowMsg(false), 5000);
      }}
    >
      <AnimatePresence>
        {showMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-full mb-3 left-0 w-56 p-3 rounded-xl glass text-xs text-foreground"
          >
            {message}
            <div className="absolute bottom-0 left-4 w-2 h-2 glass rotate-45 translate-y-1" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative w-14 h-14 rounded-full gradient-purple glow-purple flex items-center justify-center animate-pulse-glow">
        <span className="text-2xl">👤</span>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
          <span className="text-[8px] font-bold text-accent-foreground">!</span>
        </div>
      </div>
    </motion.div>
  );
}
