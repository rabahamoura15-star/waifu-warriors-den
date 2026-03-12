import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Sparkles } from "lucide-react";
import { searchMedia, type AniMedia } from "@/lib/anilist";
import MediaCard from "./MediaCard";

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AniMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"MANGA" | "ANIME">("MANGA");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchMedia(query, type, 1, 20);
      setResults(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Sparkles size={24} className="text-primary" />
          البحث الذكي
        </h2>
        <p className="text-sm text-muted-foreground">
          ابحث بالاسم أو الوصف — مثل "بطل ضعيف يصبح أقوى" أو "عالم سحري مظلم"
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="ابحث عن مانهوا أو أنمي..."
            className="w-full pr-10 pl-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
            dir="rtl"
          />
        </div>
        <div className="flex rounded-xl bg-secondary border border-border overflow-hidden">
          <button
            onClick={() => setType("MANGA")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${type === "MANGA" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            مانجا
          </button>
          <button
            onClick={() => setType("ANIME")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${type === "ANIME" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            أنمي
          </button>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-3 rounded-xl gradient-purple text-primary-foreground font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "بحث"}
        </button>
      </div>

      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {results.map((m, i) => (
            <MediaCard key={m.id} media={m} index={i} />
          ))}
        </motion.div>
      )}

      {results.length === 0 && !loading && query && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد نتائج. جرّب كلمات بحث مختلفة!
        </div>
      )}
    </div>
  );
}
