import { motion } from "framer-motion";
import { Play, BookOpen, TrendingUp } from "lucide-react";
import type { AniMedia } from "@/lib/anilist";
import { getTitle, getGoogleSearchUrl } from "@/lib/anilist";

interface HeroProps {
  media: AniMedia | null;
}

export default function HeroSection({ media }: HeroProps) {
  if (!media) {
    return (
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-secondary animate-pulse" />
    );
  }

  const title = getTitle(media);
  const desc = media.description?.replace(/<[^>]*>/g, "").slice(0, 200) || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-[500px] rounded-2xl overflow-hidden group"
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

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/50"
            style={{ left: `${15 + i * 15}%`, bottom: "20%" }}
            animate={{ y: [-20, -80], opacity: [0, 1, 0] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end gap-6">
        <motion.img
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          src={media.coverImage.extraLarge}
          alt={title}
          className="w-40 h-56 object-cover rounded-xl shadow-2xl glow-purple hidden md:block"
        />
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary text-primary-foreground">
              <TrendingUp size={12} className="inline mr-1" />
              رائج
            </span>
            {media.genres.slice(0, 3).map((g) => (
              <span key={g} className="px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">
                {g}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground text-glow-purple leading-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl line-clamp-2">{desc}</p>
          <div className="flex items-center gap-3">
            <a
              href={getGoogleSearchUrl(media, 1)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-purple text-primary-foreground font-bold text-sm hover:scale-105 transition-transform glow-purple"
            >
              <BookOpen size={16} />
              ابدأ القراءة
            </a>
            {media.bannerImage && (
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + " trailer")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass text-foreground font-medium text-sm hover:bg-secondary transition-colors"
              >
                <Play size={16} />
                إعلان
              </a>
            )}
            <div className="flex items-center gap-1 mr-auto">
              <span className="text-ssr font-bold text-lg">{media.averageScore ? media.averageScore / 10 : "?"}</span>
              <span className="text-muted-foreground text-xs">/10</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
