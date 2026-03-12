import { motion } from "framer-motion";
import { Play, BookOpen, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AniMedia } from "@/lib/anilist";
import { getTitle, getGoogleSearchUrl } from "@/lib/anilist";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroProps {
  media: AniMedia | null;
}

export default function HeroSection({ media }: HeroProps) {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!media) {
    return (
      <div className={`relative ${isMobile ? "h-[280px]" : "h-[500px]"} rounded-2xl overflow-hidden bg-secondary animate-pulse`} />
    );
  }

  const title = getTitle(media);
  const desc = media.description?.replace(/<[^>]*>/g, "").slice(0, isMobile ? 100 : 200) || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${isMobile ? "h-[320px]" : "h-[500px]"} rounded-2xl overflow-hidden group cursor-pointer`}
      onClick={() => navigate(`/media/${media.id}`)}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={media.bannerImage || media.coverImage.extraLarge}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      </div>

      {/* Content */}
      <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? "p-4" : "p-8"} flex items-end gap-4 md:gap-6`}>
        {!isMobile && (
          <motion.img
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            src={media.coverImage.extraLarge}
            alt={title}
            className="w-40 h-56 object-cover rounded-xl shadow-2xl glow-purple hidden md:block"
          />
        )}
        <div className="flex-1 space-y-2 md:space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] md:text-xs font-bold bg-primary text-primary-foreground">
              <TrendingUp size={10} className="inline mr-1" />
              {t("trending")}
            </span>
            {media.genres.slice(0, isMobile ? 2 : 3).map((g) => (
              <span key={g} className="px-2 py-0.5 rounded text-[10px] md:text-xs bg-secondary text-secondary-foreground">
                {g}
              </span>
            ))}
          </div>
          <h1 className={`${isMobile ? "text-xl" : "text-4xl md:text-5xl"} font-display font-bold text-foreground text-glow-purple leading-tight line-clamp-2`}>
            {title}
          </h1>
          {!isMobile && <p className="text-muted-foreground text-sm max-w-xl line-clamp-2">{desc}</p>}
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={getGoogleSearchUrl(media, 1)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center gap-1.5 ${isMobile ? "px-4 py-2 text-xs" : "px-6 py-2.5 text-sm"} rounded-lg gradient-purple text-primary-foreground font-bold hover:scale-105 transition-transform glow-purple`}
            >
              <BookOpen size={isMobile ? 14 : 16} />
              {t("startReading")}
            </a>
            <div className="flex items-center gap-1 mr-auto">
              <span className="text-ssr font-bold text-base md:text-lg">{media.averageScore ? media.averageScore / 10 : "?"}</span>
              <span className="text-muted-foreground text-[10px] md:text-xs">/10</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
