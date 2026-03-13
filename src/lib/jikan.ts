// Jikan API (MyAnimeList) as fallback for AniList
const JIKAN_URL = "https://api.jikan.moe/v4";

export interface JikanMedia {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: { jpg: { large_image_url: string; image_url: string } };
  synopsis: string | null;
  score: number | null;
  scored_by: number;
  status: string;
  chapters: number | null;
  episodes: number | null;
  genres: { name: string }[];
  type: string;
  popularity: number;
  members: number;
}

async function jikanFetch(path: string): Promise<any> {
  const res = await fetch(`${JIKAN_URL}${path}`);
  if (!res.ok) throw new Error(`Jikan ${res.status}`);
  const data = await res.json();
  return data;
}

// Convert Jikan format to our AniMedia format
function toAniMedia(j: JikanMedia): any {
  return {
    id: j.mal_id + 900000, // offset to avoid ID collision with AniList
    title: {
      romaji: j.title,
      english: j.title_english,
      native: j.title_japanese,
    },
    coverImage: {
      extraLarge: j.images.jpg.large_image_url,
      large: j.images.jpg.image_url,
      color: null,
    },
    bannerImage: null,
    description: j.synopsis,
    genres: j.genres.map((g) => g.name),
    averageScore: j.score ? Math.round(j.score * 10) : null,
    popularity: j.members || j.popularity,
    status: j.status?.toUpperCase().replace(/ /g, "_") || "UNKNOWN",
    chapters: j.chapters,
    episodes: j.episodes,
    format: j.type || "MANGA",
    season: null,
    seasonYear: null,
    meanScore: j.score ? Math.round(j.score * 10) : null,
    trending: 0,
    nextAiringEpisode: null,
  };
}

export async function jikanTrending(type: "manga" | "anime" = "manga", limit = 20) {
  const data = await jikanFetch(`/top/${type}?filter=bypopularity&limit=${limit}`);
  return (data.data as JikanMedia[]).map(toAniMedia);
}

export async function jikanSearch(q: string, type: "manga" | "anime" = "manga", limit = 20) {
  const data = await jikanFetch(`/${type}?q=${encodeURIComponent(q)}&limit=${limit}&sfw=true`);
  return (data.data as JikanMedia[]).map(toAniMedia);
}

export async function jikanGetById(id: number, type: "manga" | "anime" = "manga") {
  const realId = id - 900000;
  const data = await jikanFetch(`/${type}/${realId}/full`);
  const media = toAniMedia(data.data as JikanMedia);
  // Get characters
  try {
    const chars = await jikanFetch(`/${type}/${realId}/characters`);
    media.characters = {
      edges: (chars.data || []).slice(0, 12).map((c: any) => ({
        role: c.role,
        node: {
          id: c.character.mal_id,
          name: { full: c.character.name, native: null },
          image: { large: c.character.images?.jpg?.image_url, medium: c.character.images?.jpg?.image_url },
        },
      })),
    };
  } catch {}
  return media;
}
