import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Star, BookOpen, ExternalLink, Users } from "lucide-react";
import { getMediaById, getTitle, getGoogleSearchUrl, type AniMedia } from "@/lib/anilist";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MediaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, dir } = useI18n();
  const isMobile = useIsMobile();

  const { data: media, isLoading } = useQuery({
    queryKey: ["media-detail", id],
    queryFn: () => getMediaById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={dir}>
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={dir}>
        <p className="text-muted-foreground">Not found</p>
      </div>
    );
  }

  const title = getTitle(media);
  const desc = media.description?.replace(/<[^>]*>/g, "") || "";
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Banner */}
      <div className="relative h-[300px] md:h-[400px]">
        <img
          src={media.bannerImage || media.coverImage.extraLarge}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 right-auto rtl:right-4 rtl:left-auto z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
        >
          <BackArrow size={20} />
        </button>
      </div>

      <div className={`${isMobile ? "px-4" : "px-8 max-w-5xl mx-auto"} -mt-32 relative z-10 pb-12 space-y-6`}>
        {/* Header */}
        <div className="flex gap-4 md:gap-6">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            src={media.coverImage.extraLarge}
            alt={title}
            className="w-28 md:w-40 h-40 md:h-56 object-cover rounded-xl shadow-2xl glow-purple shrink-0"
          />
          <div className="flex-1 space-y-3 pt-8 md:pt-16">
            <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground text-glow-purple leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {media.averageScore && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg glass text-sm font-bold">
                  <Star size={14} className="text-ssr" />
                  <span className="text-foreground">{(media.averageScore / 10).toFixed(1)}</span>
                </span>
              )}
              <span className="px-2 py-1 rounded-lg bg-secondary text-xs text-secondary-foreground">
                {media.format}
              </span>
              <span className="px-2 py-1 rounded-lg bg-secondary text-xs text-secondary-foreground">
                {media.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {media.genres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full text-[10px] bg-primary/20 text-primary font-medium">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={getGoogleSearchUrl(media, 1)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-purple text-primary-foreground font-bold text-sm hover:scale-105 transition-transform glow-purple"
          >
            <BookOpen size={16} />
            {t("startReading")}
          </a>
          {media.bannerImage && (
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + " trailer")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-foreground font-medium text-sm hover:bg-secondary transition-colors"
            >
              <ExternalLink size={16} />
              {t("trailer")}
            </a>
          )}
        </div>

        {/* Description */}
        <div className="glass rounded-xl p-4 md:p-6 space-y-2">
          <h3 className="font-display font-bold text-foreground">{t("details")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 text-sm">
            {media.chapters && (
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">{t("chapters")}</p>
                <p className="font-bold text-foreground">{media.chapters}</p>
              </div>
            )}
            {media.episodes && (
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">Episodes</p>
                <p className="font-bold text-foreground">{media.episodes}</p>
              </div>
            )}
            {media.averageScore && (
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">{t("score")}</p>
                <p className="font-bold text-ssr">{media.averageScore}%</p>
              </div>
            )}
            <div className="bg-secondary rounded-lg p-3 text-center">
              <p className="text-muted-foreground text-xs">{t("status")}</p>
              <p className="font-bold text-foreground">{media.status}</p>
            </div>
          </div>
        </div>

        {/* Characters */}
        {media.characters?.edges && media.characters.edges.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Users size={18} className="text-accent" />
              {t("characters")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {media.characters.edges.map((edge, i) => (
                <motion.div
                  key={edge.node.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl overflow-hidden"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={edge.node.image?.large || edge.node.image?.medium}
                      alt={edge.node.name?.full}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5 space-y-0.5">
                    <p className="text-xs font-bold text-foreground line-clamp-1">{edge.node.name?.full}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{edge.role?.toLowerCase()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Chapter Links */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-foreground">{t("chapters")}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2">
            {Array.from({ length: Math.min(media.chapters || 30, 50) }, (_, i) => i + 1).map((ch) => (
              <a
                key={ch}
                href={getGoogleSearchUrl(media, ch)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center py-2 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {ch}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
