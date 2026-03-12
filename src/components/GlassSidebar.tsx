import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Swords, ShoppingBag, BookOpen, Search, Trophy, Star, Settings, ChevronLeft, ChevronRight, Flame } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "الرئيسية" },
  { id: "search", icon: Search, label: "البحث" },
  { id: "tracker", icon: BookOpen, label: "قائمتي" },
  { id: "arena", icon: Swords, label: "الساحة" },
  { id: "gacha", icon: Star, label: "الاستدعاء" },
  { id: "market", icon: ShoppingBag, label: "السوق" },
  { id: "leaderboard", icon: Trophy, label: "المتصدرين" },
  { id: "schedule", icon: Flame, label: "الجدول" },
];

export default function GlassSidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 220 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-screen z-50 glass-strong flex flex-col items-center py-6 gap-2"
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -left-3 top-8 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div className="mb-6 flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center font-display font-bold text-primary-foreground text-lg">
          S
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-display font-bold text-lg text-foreground whitespace-nowrap"
            >
              ShadowRead
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex flex-col gap-1 w-full px-3 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
              activeTab === item.id
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon size={20} className="relative z-10 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all w-full mx-3">
        <Settings size={20} className="shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium whitespace-nowrap"
            >
              الإعدادات
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.aside>
  );
}
