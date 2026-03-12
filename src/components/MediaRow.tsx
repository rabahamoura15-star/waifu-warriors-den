import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AniMedia } from "@/lib/anilist";
import MediaCard from "./MediaCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface MediaRowProps {
  title: string;
  media: AniMedia[];
  loading?: boolean;
}

export default function MediaRow({ title, media, loading }: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const cardWidth = isMobile ? "w-[120px]" : "w-[160px]";
  const skeletonWidth = isMobile ? "w-[120px]" : "w-[160px]";

  return (
    <section className="space-y-2 md:space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-xl font-display font-bold text-foreground">{title}</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll("right")} className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <ChevronRight size={14} />
          </button>
          <button onClick={() => scroll("left")} className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide pb-2">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`shrink-0 ${skeletonWidth} aspect-[3/4] rounded-xl bg-secondary animate-pulse`} />
            ))
          : media.map((m, i) => (
              <div key={m.id} className={`shrink-0 ${cardWidth}`}>
                <MediaCard media={m} index={i} />
              </div>
            ))}
      </div>
    </section>
  );
}
