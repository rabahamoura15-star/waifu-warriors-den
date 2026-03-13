import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrending as anilistTrending, getPopular as anilistPopular } from "@/lib/anilist";
import { jikanTrending } from "@/lib/jikan";
import { mangadexTrending } from "@/lib/mangadex";
import { getDefaultPlayer, getDailyQuests } from "@/lib/gamification";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import GlassSidebar from "@/components/GlassSidebar";
import HeroSection from "@/components/HeroSection";
import MediaRow from "@/components/MediaRow";
import PlayerHUD from "@/components/PlayerHUD";
import DailyQuests from "@/components/DailyQuests";
import ShadowCompanion from "@/components/ShadowCompanion";
import OnboardingPopup from "@/components/OnboardingPopup";
import SearchPanel from "@/components/SearchPanel";
import GachaPanel from "@/components/GachaPanel";
import SchedulePanel from "@/components/SchedulePanel";
import LeaderboardPanel from "@/components/LeaderboardPanel";
import ArenaPanel from "@/components/ArenaPanel";
import MarketPanel from "@/components/MarketPanel";
import AuthModal from "@/components/AuthModal";
import { LogIn, LogOut } from "lucide-react";
import { signOut } from "@/lib/firebase";

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [authOpen, setAuthOpen] = useState(false);
  const { user, profile } = useAuth();
  const player = useMemo(() => {
    if (profile) {
      return {
        xp: profile.xp,
        coins: profile.coins,
        energy: profile.energy,
        maxEnergy: profile.maxEnergy,
        rank: profile.rank,
        level: profile.level,
        streak: profile.streak,
        cards: [],
        readingList: [],
        questsCompleted: profile.questsCompleted,
        vip: profile.vip,
      };
    }
    return getDefaultPlayer();
  }, [profile]);
  const quests = useMemo(() => getDailyQuests(), []);
  const isMobile = useIsMobile();
  const { t, dir, lang } = useI18n();

  // Manga data from multiple APIs
  const { data: trendingManga, isLoading: loadingTrending } = useQuery({
    queryKey: ["trending-manga"],
    queryFn: async () => {
      try {
        // Try MangaDex first for manga
        return await mangadexTrending(20);
      } catch {
        try {
          return await anilistTrending("MANGA", 1, 20);
        } catch {
          return await jikanTrending("manga", 20);
        }
      }
    },
  });

  const { data: popularManga, isLoading: loadingPopular } = useQuery({
    queryKey: ["popular-manga"],
    queryFn: async () => {
      try {
        // Try MangaDex for popular manga
        return await mangadexTrending(20); // MangaDex trending is by followed count
      } catch {
        try {
          return await anilistPopular("MANGA", 1, 20);
        } catch {
          return await jikanTrending("manga", 20);
        }
      }
    },
  });

  const { data: trendingAnime, isLoading: loadingAnime } = useQuery({
    queryKey: ["trending-anime"],
    queryFn: async () => {
      try {
        return await getTrending("ANIME", 1, 15);
      } catch {
        return await jikanTrending("anime", 15);
      }
    },
  });

  const heroMedia = useMemo(() => {
    if (!trendingManga?.length) return null;
    return trendingManga[Math.floor(Math.random() * Math.min(5, trendingManga.length))];
  }, [trendingManga]);

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchPanel />;
      case "gacha":
        return <GachaPanel />;
      case "schedule":
        return <SchedulePanel />;
      case "leaderboard":
        return <LeaderboardPanel />;
      case "arena":
        return <ArenaPanel />;
      case "market":
        return <MarketPanel />;
      case "tracker":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">{t("readingList")}</h2>
            <div className="glass rounded-xl p-8 text-center text-muted-foreground">
              <p>{t("noWorksYet")}</p>
              <p className="text-xs mt-2">{t("goHomeToAdd")}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6 md:space-y-8">
            <HeroSection media={heroMedia} />
            <MediaRow title={t("trendingManhwa")} media={trendingManga || []} loading={loadingTrending} />
            <MediaRow title={t("mostPopular")} media={popularManga || []} loading={loadingPopular} />
            <MediaRow title={t("trendingAnime")} media={trendingAnime || []} loading={loadingAnime} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <GlassSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <OnboardingPopup />
      {!isMobile && <ShadowCompanion />}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <main className={`${isMobile ? "px-3 pt-3 pb-32" : "mr-[220px] p-6"} space-y-4 md:space-y-6 max-w-[1400px]`}>
        {/* Auth bar */}
        <div className="flex items-center justify-between">
          <div className={`grid grid-cols-1 ${isMobile ? "" : "lg:grid-cols-3"} gap-3 md:gap-4 flex-1`}>
            <div className={isMobile ? "" : "lg:col-span-2"}>
              <PlayerHUD player={player} />
            </div>
            {!isMobile && <DailyQuests quests={quests} />}
          </div>
        </div>

        {/* Login/Logout button */}
        <div className="flex justify-end">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {profile?.nickname || user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs hover:bg-muted transition-colors"
              >
                <LogOut size={12} />
                {lang === "ar" ? "خروج" : "Logout"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-purple text-primary-foreground text-xs font-bold hover:scale-105 transition-transform"
            >
              <LogIn size={14} />
              {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
            </button>
          )}
        </div>

        {renderContent()}
      </main>
    </div>
  );
}
