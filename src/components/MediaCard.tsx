import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AniMedia } from "@/lib/anilist";
import { getTitle } from "@/lib/anilist";

interface MediaCardProps {
  media: AniMedia;
  index: number;
}

export default function MediaCard({ media, index }: MediaCardProps) {
  const title = getTitle(media);
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/media/${media.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-colors cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={media.coverImage.extraLarge}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded glass text-xs font-bold">
          <Star size={10} className="text-ssr" />
          <span className="text-foreground">{media.averageScore ? (media.averageScore / 10).toFixed(1) : "N/A"}</span>
        </div>
      </div>
      <div className="p-2.5 md:p-3 space-y-1">
        <h3 className="text-xs md:text-sm font-bold text-foreground line-clamp-2 leading-tight">{title}</h3>
        <div className="flex items-center gap-1 flex-wrap">
          {media.genres.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
              {g}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
