import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrending, getPopular } from "@/lib/anilist";
import { getDefaultPlayer, getDailyQuests } from "@/lib/gamification";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/lib/i18n";
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

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const player = useMemo(() => getDefaultPlayer(), []);
  const quests = useMemo(() => getDailyQuests(), []);
  const isMobile = useIsMobile();
  const { t, dir } = useI18n();

  const { data: trendingManga, isLoading: loadingTrending } = useQuery({
    queryKey: ["trending-manga"],
    queryFn: () => getTrending("MANGA", 1, 20),
  });

  const { data: popularManga, isLoading: loadingPopular } = useQuery({
    queryKey: ["popular-manga"],
    queryFn: () => getPopular("MANGA", 1, 20),
  });

  const { data: trendingAnime, isLoading: loadingAnime } = useQuery({
    queryKey: ["trending-anime"],
    queryFn: () => getTrending("ANIME", 1, 15),
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

      <main className={`${isMobile ? "px-3 pt-3 pb-32" : "mr-[220px] p-6"} space-y-4 md:space-y-6 max-w-[1400px]`}>
        <div className={`grid grid-cols-1 ${isMobile ? "" : "lg:grid-cols-3"} gap-3 md:gap-4`}>
          <div className={isMobile ? "" : "lg:col-span-2"}>
            <PlayerHUD player={player} />
          </div>
          {!isMobile && <DailyQuests quests={quests} />}
        </div>

        {renderContent()}
      </main>
    </div>
  );
}
