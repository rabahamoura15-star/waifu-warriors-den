import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Swords, ShoppingBag, BookOpen, Search, Trophy, Star, Settings, ChevronLeft, ChevronRight, Flame, Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n, LANGUAGES } from "@/lib/i18n";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, labelKey: "home" },
  { id: "search", icon: Search, labelKey: "search" },
  { id: "tracker", icon: BookOpen, labelKey: "myList" },
  { id: "arena", icon: Swords, labelKey: "arena" },
  { id: "gacha", icon: Star, labelKey: "gacha" },
  { id: "market", icon: ShoppingBag, labelKey: "market" },
  { id: "leaderboard", icon: Trophy, labelKey: "leaderboard" },
  { id: "schedule", icon: Flame, labelKey: "schedule" },
  { id: "settings", icon: Settings, labelKey: "settings" },
];

export default function GlassSidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const isMobile = useIsMobile();
  const { t, lang, setLang } = useI18n();

  // Mobile bottom nav
  if (isMobile) {
    const mobileItems = navItems.slice(0, 5); // Show 5 main items
    return (
      <>
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border safe-area-bottom">
          <div className="flex items-center justify-around py-2 px-1">
            {mobileItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[56px] ${
                  activeTab === item.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
              </button>
            ))}
            <button
              onClick={() => setShowLangPicker(!showLangPicker)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-muted-foreground min-w-[56px]"
            >
              <Globe size={20} />
              <span className="text-[10px] font-medium">{lang.toUpperCase()}</span>
            </button>
          </div>
        </nav>

        {/* More tabs drawer */}
        <div className="fixed bottom-[68px] left-0 right-0 z-40 flex gap-2 px-3 py-2 overflow-x-auto scrollbar-hide">
          {navItems.slice(5).map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground"
              }`}
            >
              <item.icon size={14} />
              {t(item.labelKey)}
            </button>
          ))}
        </div>

        {/* Language picker modal */}
        <AnimatePresence>
          {showLangPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-end justify-center bg-background/60 backdrop-blur-sm"
              onClick={() => setShowLangPicker(false)}
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md glass-strong rounded-t-2xl p-6 space-y-3 mb-0"
              >
                <h3 className="font-display font-bold text-lg text-foreground text-center">{t("language")}</h3>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                    className={`w-full text-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      lang === l.code ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-muted"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop sidebar
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
                  {t(item.labelKey)}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* Language Switcher */}
      <div className="relative w-full px-3 mb-2">
        <button
          onClick={() => setShowLangPicker(!showLangPicker)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all w-full"
        >
          <Globe size={20} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium whitespace-nowrap">
                {LANGUAGES.find(l => l.code === lang)?.label}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <AnimatePresence>
          {showLangPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 right-3 left-3 glass-strong rounded-xl p-2 space-y-1 z-50"
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                  className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    lang === l.code ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => onTabChange("settings")}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full mx-3 ${
          activeTab === "settings"
            ? "bg-primary/20 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        <Settings size={20} className="shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium whitespace-nowrap">
              {t("settings")}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.aside>
  );
}
