import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrending, getPopular } from "@/lib/anilist";
import { getDefaultPlayer, getDailyQuests } from "@/lib/gamification";
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

  // Random hero from trending
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
            <h2 className="text-2xl font-display font-bold text-foreground">📚 قائمة القراءة</h2>
            <div className="glass rounded-xl p-8 text-center text-muted-foreground">
              <p>لم تضف أي أعمال بعد!</p>
              <p className="text-xs mt-2">اذهب للرئيسية واضغط على أي عمل لإضافته لقائمتك.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <HeroSection media={heroMedia} />
            <MediaRow title="🔥 الأكثر رواجاً — مانهوا ومانجا" media={trendingManga || []} loading={loadingTrending} />
            <MediaRow title="⭐ الأكثر شعبية" media={popularManga || []} loading={loadingPopular} />
            <MediaRow title="🎬 أنمي رائج" media={trendingAnime || []} loading={loadingAnime} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <GlassSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <OnboardingPopup />
      <ShadowCompanion />

      <main className="mr-[220px] p-6 space-y-6 max-w-[1400px]">
        {/* Top bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <PlayerHUD player={player} />
          </div>
          <DailyQuests quests={quests} />
        </div>

        {renderContent()}
      </main>
    </div>
  );
}
