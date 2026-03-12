import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";

interface ScheduleItem {
  title: string;
  day: string;
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
  { title: "Solo Leveling: Ragnarok", day: "الأحد", time: "12:00", type: "manhwa", targetDate: getNextDate(1, 12) },
  { title: "Omniscient Reader", day: "الاثنين", time: "15:00", type: "manhwa", targetDate: getNextDate(2, 15) },
  { title: "Tower of God", day: "الثلاثاء", time: "10:00", type: "manhwa", targetDate: getNextDate(3, 10) },
  { title: "Jujutsu Kaisen", day: "الأربعاء", time: "00:00", type: "manga", targetDate: getNextDate(4, 0) },
  { title: "One Piece", day: "الخميس", time: "18:00", type: "manga", targetDate: getNextDate(5, 18) },
  { title: "Blue Lock", day: "الجمعة", time: "14:00", type: "anime", targetDate: getNextDate(6, 14) },
];

function Countdown({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("متاح الآن!"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [target]);

  return <span className="font-mono text-accent text-glow-cyan font-bold">{timeLeft}</span>;
}

const typeColors = {
  manhwa: "bg-primary/20 text-primary",
  manga: "bg-destructive/20 text-destructive",
  anime: "bg-accent/20 text-accent",
};

export default function SchedulePanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Flame size={24} className="text-destructive" />
        جدول الإصدارات
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
                <span className="text-xs text-muted-foreground">{item.day} — {item.time}</span>
              </div>
            </div>
            <Countdown target={item.targetDate} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
