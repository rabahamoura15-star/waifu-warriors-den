import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ScheduleItem {
  title: string;
  day: Record<string, string>;
  time: string;
  type: "manhwa" | "manga" | "anime";
  targetDate: Date;
}

const getNextDate = (dayOffset: number, hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const scheduleData: ScheduleItem[] = [
  { title: "Solo Leveling: Ragnarok", day: { ar: "الأحد", en: "Sunday", fr: "Dimanche", pt: "Domingo", hi: "रविवार" }, time: "12:00", type: "manhwa", targetDate: getNextDate(1, 12) },
  { title: "Omniscient Reader", day: { ar: "الاثنين", en: "Monday", fr: "Lundi", pt: "Segunda", hi: "सोमवार" }, time: "15:00", type: "manhwa", targetDate: getNextDate(2, 15) },
  { title: "Tower of God", day: { ar: "الثلاثاء", en: "Tuesday", fr: "Mardi", pt: "Terça", hi: "मंगलवार" }, time: "10:00", type: "manhwa", targetDate: getNextDate(3, 10) },
  { title: "Jujutsu Kaisen", day: { ar: "الأربعاء", en: "Wednesday", fr: "Mercredi", pt: "Quarta", hi: "बुधवार" }, time: "00:00", type: "manga", targetDate: getNextDate(4, 0) },
  { title: "One Piece", day: { ar: "الخميس", en: "Thursday", fr: "Jeudi", pt: "Quinta", hi: "गुरुवार" }, time: "18:00", type: "manga", targetDate: getNextDate(5, 18) },
  { title: "Blue Lock", day: { ar: "الجمعة", en: "Friday", fr: "Vendredi", pt: "Sexta", hi: "शुक्रवार" }, time: "14:00", type: "anime", targetDate: getNextDate(6, 14) },
];

function Countdown({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    const update = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(t("availableNow")); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [target, t]);

  return <span className="font-mono text-accent text-glow-cyan font-bold">{timeLeft}</span>;
}

const typeColors = {
  manhwa: "bg-primary/20 text-primary",
  manga: "bg-destructive/20 text-destructive",
  anime: "bg-accent/20 text-accent",
};

export default function SchedulePanel() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Flame size={24} className="text-destructive" />
        {t("scheduleTitle")}
      </h2>
      <div className="space-y-3">
        {scheduleData.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg gradient-purple flex items-center justify-center">
              <Clock size={20} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded ${typeColors[item.type]}`}>
                  {item.type}
                </span>
                <span className="text-xs text-muted-foreground">{item.day[lang] || item.day.en} — {item.time}</span>
              </div>
            </div>
            <Countdown target={item.targetDate} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
